import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Edit,
  BookOpen,
  FileText,
  Heart,
  Star,
  Settings,
  Camera,
} from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const stats = [
    { label: "Notes Shared", value: 24, icon: BookOpen },
    { label: "Assignments", value: 18, icon: FileText },
    { label: "Likes Received", value: 342, icon: Heart },
    { label: "Rating", value: "4.8", icon: Star },
  ];

  const tabs = ["posts", "notes", "assignments", "saved"];

  const posts = [
    {
      id: 1,
      content: "Just completed the Data Structures project! 🎉 It was challenging but worth it.",
      likes: 45,
      comments: 12,
      time: "2 days ago",
    },
    {
      id: 2,
      content: "Uploaded new notes for Linear Algebra Chapter 5. Check them out!",
      likes: 67,
      comments: 23,
      time: "1 week ago",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-3xl">JD</span>
            </div>
            <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-display font-bold">John Doe</h1>
                <p className="text-muted-foreground">Computer Science Student</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="hero" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

            <p className="text-foreground/80 mb-4">
              Passionate about algorithms and data structures. Always looking to learn and help others! 🚀
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                john@student.edu
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Computer Science Dept.
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined Jan 2025
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-3 rounded-lg bg-muted/30">
                <Icon className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-2xl font-display font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card mb-6">
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "posts" &&
          posts.map((post) => (
            <div key={post.id} className="glass-card p-5 animate-slide-up">
              <p className="text-foreground/90 mb-4">{post.content}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likes}
                  </span>
                  <span>{post.comments} comments</span>
                </div>
                <span>{post.time}</span>
              </div>
            </div>
          ))}

        {activeTab !== "posts" && (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">No {activeTab} yet</h3>
            <p className="text-muted-foreground">
              Your {activeTab} will appear here when you create them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
