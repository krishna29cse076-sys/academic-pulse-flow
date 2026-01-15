import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image,
  Send,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";
import { useState } from "react";

const Feed = () => {
  const [newPost, setNewPost] = useState("");

  const posts = [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "SC",
      time: "2 hours ago",
      content: "Just finished my Data Structures assignment! 🎉 The binary tree implementation was tricky but finally got it working. Happy to help anyone who's stuck!",
      likes: 24,
      comments: 8,
      isLiked: true,
    },
    {
      id: 2,
      author: "Alex Kumar",
      avatar: "AK",
      time: "4 hours ago",
      content: "📚 Uploaded my notes for Linear Algebra Chapter 5 - Eigenvalues and Eigenvectors. Check them out in the Notes section! #StudyTogether",
      likes: 42,
      comments: 12,
      isLiked: false,
    },
    {
      id: 3,
      author: "Maya Patel",
      avatar: "MP",
      time: "5 hours ago",
      content: "Looking for study partners for the upcoming Physics exam! Anyone interested in forming a study group? We could meet in the library or online. 📖",
      likes: 18,
      comments: 15,
      isLiked: false,
    },
  ];

  const trendingTopics = [
    { name: "Finals Week", posts: 234 },
    { name: "Study Group", posts: 156 },
    { name: "Data Structures", posts: 89 },
    { name: "Project Help", posts: 67 },
  ];

  const activeGroups = [
    { name: "CS101 Study Group", members: 45 },
    { name: "Physics Lab Partners", members: 23 },
    { name: "Math Tutoring", members: 67 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Feed</h1>
          <p className="text-muted-foreground">See what's happening in your community</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <div className="glass-card p-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-semibold text-sm">JD</span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share something with your community..."
                  className="w-full resize-none bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground min-h-[80px]"
                />
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Image className="w-4 h-4 mr-2" />
                      Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <FileText className="w-4 h-4 mr-2" />
                      Document
                    </Button>
                  </div>
                  <Button variant="hero" size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <div key={post.id} className="glass-card p-5 animate-slide-up">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-semibold text-sm">{post.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-semibold">{post.author}</span>
                      <span className="text-muted-foreground text-sm ml-2">{post.time}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-foreground/90 mb-4">{post.content}</p>
                  <div className="flex items-center gap-4">
                    <button className={`flex items-center gap-1.5 text-sm transition-colors ${post.isLiked ? 'text-accent' : 'text-muted-foreground hover:text-accent'}`}>
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold">Trending Topics</h3>
            </div>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors">
                  <span className="font-medium">#{topic.name}</span>
                  <span className="text-sm text-muted-foreground">{topic.posts} posts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Groups */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold">Active Groups</h3>
            </div>
            <div className="space-y-3">
              {activeGroups.map((group, index) => (
                <div key={index} className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors">
                  <span className="font-medium">{group.name}</span>
                  <span className="text-sm text-muted-foreground">{group.members} members</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Groups
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
