import { Button } from "@/components/ui/button";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Circle,
  Plus,
  MessageSquare,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { validateMessage, getCharCountDisplay, VALIDATION_LIMITS } from "@/lib/validation";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { format, isToday, isYesterday } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const Messages = () => {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    selectedConversationId,
    setSelectedConversationId,
    loading,
    sendingMessage,
    sendMessage,
    getConversationDisplayName,
    getConversationAvatar,
  } = useMessages();

  const [messageInput, setMessageInput] = useState("");
  const [messageError, setMessageError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleMessageChange = (value: string) => {
    setMessageInput(value);
    if (value.trim()) {
      const validation = validateMessage(value);
      setMessageError(validation.error || null);
    } else {
      setMessageError(null);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || messageError) return;
    
    const success = await sendMessage(messageInput);
    if (success) {
      setMessageInput("");
      setMessageError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format message time
  const formatMessageTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  // Format conversation time
  const formatConversationTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isToday(date)) return format(date, "h:mm a");
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const name = getConversationDisplayName(conv).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  // Get selected conversation
  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Messages</h1>
            <p className="text-muted-foreground">Chat with your peers</p>
          </div>
        </div>
        <div className="glass-card h-[calc(100%-4rem)] flex overflow-hidden">
          <div className="w-80 border-r border-border/50 p-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Messages</h1>
          <p className="text-muted-foreground">Chat with your peers</p>
        </div>
      </div>

      <div className="glass-card h-[calc(100%-4rem)] flex overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 border-r border-border/50 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageSquare className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">
                  {searchQuery
                    ? "No conversations found"
                    : "No conversations yet"}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Start a conversation from a user's profile
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                    selectedConversationId === conversation.id
                      ? "bg-primary/10"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-primary">
                      <span className="text-primary-foreground font-semibold">
                        {getConversationAvatar(conversation)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium truncate">
                        {getConversationDisplayName(conversation)}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatConversationTime(
                          conversation.lastMessage?.created_at ||
                            conversation.created_at
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-medium flex items-center justify-center flex-shrink-0">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold">
                        {getConversationAvatar(selectedConversation)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {getConversationDisplayName(selectedConversation)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.participants.length} participants
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-muted-foreground text-sm">
                      Send a message to start the conversation
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                            isMe
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted rounded-bl-sm"
                          }`}
                        >
                          {!isMe && selectedConversation.participants.length > 2 && (
                            <p className="text-xs font-medium mb-1 opacity-70">
                              {msg.sender?.full_name || msg.sender?.username || "Unknown"}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isMe
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatMessageTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => handleMessageChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className={`w-full h-11 px-4 rounded-full bg-muted/50 border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm ${
                          messageError ? "border-destructive" : "border-border/50"
                        }`}
                        maxLength={VALIDATION_LIMITS.messages.content.max + 50}
                        disabled={sendingMessage}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                      >
                        <Smile className="w-5 h-5" />
                      </Button>
                    </div>
                    <Button
                      variant="hero"
                      size="icon"
                      className="rounded-full flex-shrink-0"
                      disabled={!messageInput.trim() || !!messageError || sendingMessage}
                      onClick={handleSendMessage}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center px-12">
                    {messageError && (
                      <span className="text-xs text-destructive">{messageError}</span>
                    )}
                    {messageInput.length > 0 && (
                      <span
                        className={`text-xs ml-auto ${
                          getCharCountDisplay(
                            messageInput.length,
                            VALIDATION_LIMITS.messages.content.max
                          ).isOverLimit
                            ? "text-destructive"
                            : getCharCountDisplay(
                                messageInput.length,
                                VALIDATION_LIMITS.messages.content.max
                              ).isNearLimit
                            ? "text-warning"
                            : "text-muted-foreground"
                        }`}
                      >
                        {
                          getCharCountDisplay(
                            messageInput.length,
                            VALIDATION_LIMITS.messages.content.max
                          ).text
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Choose a conversation from the sidebar or start a new one from a
                user's profile
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
