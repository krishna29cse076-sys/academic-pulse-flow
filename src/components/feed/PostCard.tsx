import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCharCountDisplay, VALIDATION_LIMITS } from "@/lib/validation";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface Profile {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface PostCardProps {
  post: {
    id: string;
    user_id: string;
    content: string;
    image_url: string | null;
    likes_count: number;
    comments_count: number;
    created_at: string;
  };
  profile: Profile | undefined;
  isLiked: boolean;
  onLike: (postId: string) => void;
  onPostUpdate: () => void;
  getUserInitials: (name: string | null, email?: string) => string;
  getTimeAgo: (dateString: string) => string;
}

const PostCard = ({
  post,
  profile,
  isLiked,
  onLike,
  onPostUpdate,
  getUserInitials,
  getTimeAgo,
}: PostCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentProfiles, setCommentProfiles] = useState<Map<string, Profile>>(new Map());
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const authorName = profile?.full_name || "Anonymous";
  const authorInitials = getUserInitials(profile?.full_name || null);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from("post_comments")
        .select("*")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);

      // Fetch profiles for comment authors
      if (commentsData && commentsData.length > 0) {
        const userIds = [...new Set(commentsData.map((c) => c.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url")
          .in("user_id", userIds);

        if (profilesError) throw profilesError;

        const profileMap = new Map<string, Profile>();
        profilesData?.forEach((p) => profileMap.set(p.user_id, p));
        setCommentProfiles(profileMap);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, post.id]);

  const handleCommentChange = (value: string) => {
    setNewComment(value);
    if (value.trim()) {
      if (value.length > VALIDATION_LIMITS.postComments.content.max) {
        setCommentError(`Comment must be ${VALIDATION_LIMITS.postComments.content.max} characters or less`);
      } else {
        setCommentError(null);
      }
    } else {
      setCommentError(null);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }

    const trimmedComment = newComment.trim();
    if (!trimmedComment) {
      setCommentError("Comment cannot be empty");
      return;
    }

    if (trimmedComment.length > VALIDATION_LIMITS.postComments.content.max) {
      setCommentError(`Comment must be ${VALIDATION_LIMITS.postComments.content.max} characters or less`);
      return;
    }

    setSubmittingComment(true);
    try {
      const { error } = await supabase.from("post_comments").insert({
        post_id: post.id,
        user_id: user.id,
        content: trimmedComment,
      });

      if (error) throw error;

      toast.success("Comment added!");
      setNewComment("");
      setCommentError(null);
      fetchComments();
      onPostUpdate();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("post_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast.success("Comment deleted");
      fetchComments();
      onPostUpdate();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete comment");
    }
  };

  const currentUserInitials = getUserInitials(
    user?.user_metadata?.full_name,
    user?.email
  );

  const charCount = getCharCountDisplay(newComment.length, VALIDATION_LIMITS.postComments.content.max);

  return (
    <div className="glass-card p-5 animate-slide-up">
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
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isLiked ? "text-accent" : "text-muted-foreground hover:text-accent"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              {post.likes_count}
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                showComments ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <MessageCircle className={`w-4 h-4 ${showComments ? "fill-current" : ""}`} />
              {post.comments_count}
              {showComments ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-border/50">
              {/* Add Comment */}
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-semibold text-xs">
                    {currentUserInitials}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => handleCommentChange(e.target.value)}
                        placeholder="Write a comment..."
                        className={`w-full h-9 px-3 rounded-lg bg-muted/50 border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm ${
                          commentError ? "border-destructive" : "border-border/50"
                        }`}
                        maxLength={VALIDATION_LIMITS.postComments.content.max + 50}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitComment();
                          }
                        }}
                      />
                    </div>
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || submittingComment || !!commentError}
                      className="h-9"
                    >
                      {submittingComment ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    {commentError && (
                      <span className="text-xs text-destructive">{commentError}</span>
                    )}
                    {newComment.length > 0 && (
                      <span
                        className={`text-xs ml-auto ${
                          charCount.isOverLimit
                            ? "text-destructive"
                            : charCount.isNearLimit
                            ? "text-warning"
                            : "text-muted-foreground"
                        }`}
                      >
                        {charCount.text}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments List */}
              {loadingComments ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => {
                    const commentProfile = commentProfiles.get(comment.user_id);
                    const commentAuthorName = commentProfile?.full_name || "Anonymous";
                    const commentAuthorInitials = getUserInitials(commentProfile?.full_name || null);
                    const isOwnComment = user?.id === comment.user_id;

                    return (
                      <div key={comment.id} className="flex gap-3 group">
                        <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-foreground font-semibold text-xs">
                            {commentAuthorInitials}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-muted/50 rounded-lg px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-sm">{commentAuthorName}</span>
                              <span className="text-xs text-muted-foreground">
                                {getTimeAgo(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/90 mt-1 break-words">
                              {comment.content}
                            </p>
                          </div>
                          {isOwnComment && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-muted-foreground hover:text-destructive transition-colors mt-1 opacity-0 group-hover:opacity-100"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
