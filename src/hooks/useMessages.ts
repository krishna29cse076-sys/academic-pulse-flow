import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Message = Tables<"messages">;
type Conversation = Tables<"conversations">;
type Profile = Tables<"profiles">;

// Public profile type that excludes sensitive academic_info
type PublicProfile = Omit<Profile, 'academic_info'>;

interface ConversationWithDetails extends Conversation {
  participants: {
    user_id: string;
    profile: PublicProfile | null;
  }[];
  lastMessage: Message | null;
  unreadCount: number;
}

interface MessageWithSender extends Message {
  sender: PublicProfile | null;
}

export function useMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch all conversations for the current user
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      // Get conversations the user is part of
      const { data: participantData, error: participantError } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id);

      if (participantError) throw participantError;

      if (!participantData || participantData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationIds = participantData.map((p) => p.conversation_id);

      // Fetch conversations with details
      const conversationsWithDetails: ConversationWithDetails[] = [];

      for (const convId of conversationIds) {
        // Get conversation
        const { data: convData } = await supabase
          .from("conversations")
          .select("*")
          .eq("id", convId)
          .single();

        if (!convData) continue;

        // Get participants
        const { data: participants } = await supabase
          .from("conversation_participants")
          .select("user_id")
          .eq("conversation_id", convId);

        // Get profiles for participants
        const participantsWithProfiles = await Promise.all(
          (participants || []).map(async (p) => {
            // Use profiles_public view to avoid exposing sensitive academic_info
            const { data: profile } = await supabase
              .from("profiles_public" as any)
              .select("*")
              .eq("user_id", p.user_id)
              .single();
            return { user_id: p.user_id, profile: (profile as unknown) as PublicProfile | null };
          })
        );

        // Get last message
        const { data: lastMessageData } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", convId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        // Get unread count
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", convId)
          .eq("is_read", false)
          .neq("sender_id", user.id);

        conversationsWithDetails.push({
          ...convData,
          participants: participantsWithProfiles,
          lastMessage: lastMessageData,
          unreadCount: unreadCount || 0,
        });
      }

      // Sort by last message time
      conversationsWithDetails.sort((a, b) => {
        const aTime = a.lastMessage?.created_at || a.created_at;
        const bTime = b.lastMessage?.created_at || b.created_at;
        return new Date(bTime || 0).getTime() - new Date(aTime || 0).getTime();
      });

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async () => {
    if (!selectedConversationId || !user) return;

    try {
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch sender profiles
      const messagesWithSenders = await Promise.all(
        (messagesData || []).map(async (msg) => {
          // Use profiles_public view to avoid exposing sensitive academic_info
          const { data: profile } = await supabase
            .from("profiles_public" as any)
            .select("*")
            .eq("user_id", msg.sender_id)
            .single();
          return { ...msg, sender: (profile as unknown) as PublicProfile | null };
        })
      );

      setMessages(messagesWithSenders);

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", selectedConversationId)
        .neq("sender_id", user.id);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [selectedConversationId, user]);

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedConversationId || !user || !content.trim()) return false;

      setSendingMessage(true);
      try {
        const { error } = await supabase.from("messages").insert({
          conversation_id: selectedConversationId,
          sender_id: user.id,
          content: content.trim(),
        });

        if (error) throw error;

        // Update conversation updated_at (handled by trigger if exists, otherwise manual)
        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", selectedConversationId);

        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
        return false;
      } finally {
        setSendingMessage(false);
      }
    },
    [selectedConversationId, user, toast]
  );

  // Create a new conversation with another user
  const createConversation = useCallback(
    async (otherUserId: string) => {
      if (!user) return null;

      try {
        // Check if conversation already exists between these users
        const { data: existingParticipations } = await supabase
          .from("conversation_participants")
          .select("conversation_id")
          .eq("user_id", user.id);

        if (existingParticipations) {
          for (const p of existingParticipations) {
            const { data: otherParticipant } = await supabase
              .from("conversation_participants")
              .select("user_id")
              .eq("conversation_id", p.conversation_id)
              .eq("user_id", otherUserId)
              .single();

            if (otherParticipant) {
              // Conversation already exists
              setSelectedConversationId(p.conversation_id);
              return p.conversation_id;
            }
          }
        }

        // Create new conversation
        const { data: newConversation, error: convError } = await supabase
          .from("conversations")
          .insert({})
          .select()
          .single();

        if (convError) throw convError;

        // Add participants
        const { error: participantError } = await supabase
          .from("conversation_participants")
          .insert([
            { conversation_id: newConversation.id, user_id: user.id },
            { conversation_id: newConversation.id, user_id: otherUserId },
          ]);

        if (participantError) throw participantError;

        await fetchConversations();
        setSelectedConversationId(newConversation.id);
        return newConversation.id;
      } catch (error) {
        console.error("Error creating conversation:", error);
        toast({
          title: "Error",
          description: "Failed to create conversation",
          variant: "destructive",
        });
        return null;
      }
    },
    [user, toast, fetchConversations]
  );

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage = payload.new as Message;

          // If message is for current conversation, add it
          if (newMessage.conversation_id === selectedConversationId) {
            // Use profiles_public view to avoid exposing sensitive academic_info
            const { data: profile } = await supabase
              .from("profiles_public" as any)
              .select("*")
              .eq("user_id", newMessage.sender_id)
              .single();

            setMessages((prev) => [...prev, { ...newMessage, sender: (profile as unknown) as PublicProfile | null }]);

            // Mark as read if not from current user
            if (newMessage.sender_id !== user.id) {
              await supabase
                .from("messages")
                .update({ is_read: true })
                .eq("id", newMessage.id);
            }
          }

          // Refresh conversations to update last message
          fetchConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          if (updatedMessage.conversation_id === selectedConversationId) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id
                  ? { ...msg, ...updatedMessage }
                  : msg
              )
            );
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const deletedMessage = payload.old as { id: string };
          setMessages((prev) => prev.filter((msg) => msg.id !== deletedMessage.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversationId, fetchConversations]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedConversationId, fetchMessages]);

  // Get display name for a conversation
  const getConversationDisplayName = useCallback(
    (conversation: ConversationWithDetails) => {
      const otherParticipants = conversation.participants.filter(
        (p) => p.user_id !== user?.id
      );
      if (otherParticipants.length === 0) return "Unknown";
      if (otherParticipants.length === 1) {
        const profile = otherParticipants[0].profile;
        return profile?.full_name || profile?.username || "Unknown User";
      }
      return otherParticipants
        .map((p) => p.profile?.full_name || p.profile?.username || "Unknown")
        .join(", ");
    },
    [user]
  );

  // Get avatar initials for a conversation
  const getConversationAvatar = useCallback(
    (conversation: ConversationWithDetails) => {
      const otherParticipants = conversation.participants.filter(
        (p) => p.user_id !== user?.id
      );
      if (otherParticipants.length === 0) return "??";
      const profile = otherParticipants[0].profile;
      const name = profile?.full_name || profile?.username || "??";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    },
    [user]
  );

  return {
    conversations,
    messages,
    selectedConversationId,
    setSelectedConversationId,
    loading,
    sendingMessage,
    sendMessage,
    createConversation,
    getConversationDisplayName,
    getConversationAvatar,
    refreshConversations: fetchConversations,
  };
}
