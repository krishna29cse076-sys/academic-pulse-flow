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
} from "lucide-react";
import { useState } from "react";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: 0,
      name: "Sarah Chen",
      avatar: "SC",
      lastMessage: "Thanks for the notes! They were really helpful 📚",
      time: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: 1,
      name: "CS101 Study Group",
      avatar: "CS",
      lastMessage: "Alex: Has anyone started the project?",
      time: "15m ago",
      unread: 5,
      online: false,
      isGroup: true,
    },
    {
      id: 2,
      name: "Alex Kumar",
      avatar: "AK",
      lastMessage: "Let's meet at the library tomorrow",
      time: "1h ago",
      unread: 0,
      online: true,
    },
    {
      id: 3,
      name: "Maya Patel",
      avatar: "MP",
      lastMessage: "The physics assignment is due Friday!",
      time: "3h ago",
      unread: 0,
      online: false,
    },
    {
      id: 4,
      name: "Physics Lab Partners",
      avatar: "PL",
      lastMessage: "Maya: Don't forget the lab report",
      time: "5h ago",
      unread: 0,
      online: false,
      isGroup: true,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Chen",
      content: "Hey! Did you get the notes from yesterday's lecture?",
      time: "10:30 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      content: "Yes! I just uploaded them to the Notes section. Check it out!",
      time: "10:32 AM",
      isMe: true,
    },
    {
      id: 3,
      sender: "Sarah Chen",
      content: "That's awesome! 🎉",
      time: "10:33 AM",
      isMe: false,
    },
    {
      id: 4,
      sender: "Sarah Chen",
      content: "Thanks for the notes! They were really helpful 📚",
      time: "10:35 AM",
      isMe: false,
    },
  ];

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
                placeholder="Search conversations..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                  selectedChat === conversation.id
                    ? "bg-primary/10"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${conversation.isGroup ? 'bg-gradient-accent' : 'bg-gradient-primary'}`}>
                    <span className="text-primary-foreground font-semibold">{conversation.avatar}</span>
                  </div>
                  {conversation.online && !conversation.isGroup && (
                    <Circle className="absolute bottom-0 right-0 w-3.5 h-3.5 text-success fill-success" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-medium truncate">{conversation.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-medium flex items-center justify-center flex-shrink-0">
                    {conversation.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">
                    {conversations[selectedChat]?.avatar}
                  </span>
                </div>
                {conversations[selectedChat]?.online && (
                  <Circle className="absolute bottom-0 right-0 w-3 h-3 text-success fill-success" />
                )}
              </div>
              <div>
                <p className="font-semibold">{conversations[selectedChat]?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {conversations[selectedChat]?.online ? "Online" : "Offline"}
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
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                    msg.isMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Paperclip className="w-5 h-5" />
              </Button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full h-11 px-4 rounded-full bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2">
                  <Smile className="w-5 h-5" />
                </Button>
              </div>
              <Button variant="hero" size="icon" className="rounded-full flex-shrink-0">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
