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
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Profile {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const Feed = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
    if (user) {
      fetchUserLikes();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Fetch profiles for all post authors
      if (postsData && postsData.length > 0) {
        const userIds = [...new Set(postsData.map(p => p.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url")
          .in("user_id", userIds);

        if (profilesError) throw profilesError;

        const profileMap = new Map<string, Profile>();
        profilesData?.forEach(p => profileMap.set(p.user_id, p));
        setProfiles(profileMap);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setLikedPosts(new Set(data?.map((like) => like.post_id) || []));
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    setPosting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content: newPost.trim(),
      });

      if (error) throw error;

      toast.success("Post created!");
      setNewPost("");
      fetchPosts();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }

    const isLiked = likedPosts.has(postId);

    try {
      if (isLiked) {
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        const { error } = await supabase.from("post_likes").insert({
          post_id: postId,
          user_id: user.id,
        });

        if (error) throw error;
        setLikedPosts((prev) => new Set(prev).add(postId));
      }

      // Refresh posts to get updated counts
      fetchPosts();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const getUserInitials = (name: string | null, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || "U";
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

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

  const currentUserInitials = getUserInitials(
    user?.user_metadata?.full_name,
    user?.email
  );

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
                <span className="text-primary-foreground font-semibold text-sm">
                  {currentUserInitials}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share something with your community..."
                  className="w-full resize-none bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground min-h-[80px]"
                  disabled={posting}
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
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={handleCreatePost}
                    disabled={!newPost.trim() || posting}
                  >
                    {posting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                Be the first to share something with the community!
              </p>
            </div>
          ) : (
            posts.map((post) => {
              const isLiked = likedPosts.has(post.id);
              const profile = profiles.get(post.user_id);
              const authorName = profile?.full_name || "Anonymous";
              const authorInitials = getUserInitials(profile?.full_name || null);

              return (
                <div key={post.id} className="glass-card p-5 animate-slide-up">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-semibold text-sm">
                        {authorInitials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-semibold">{authorName}</span>
                          <span className="text-muted-foreground text-sm ml-2">
                            {getTimeAgo(post.created_at)}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-foreground/90 mb-4 whitespace-pre-wrap">{post.content}</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${
                            isLiked ? "text-accent" : "text-muted-foreground hover:text-accent"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                          {post.likes_count}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments_count}
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
              );
            })
          )}
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
                <div
                  key={index}
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors"
                >
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
                <div
                  key={index}
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors"
                >
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
