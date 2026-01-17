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
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateProfile, getCharCountDisplay, VALIDATION_LIMITS } from "@/lib/validation";

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  academic_info: unknown;
  is_private: boolean;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    bio: "",
    username: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setEditForm({
          full_name: data.full_name || "",
          bio: data.bio || "",
          username: data.username || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    const newForm = { ...editForm, [field]: value };
    setEditForm(newForm);
    
    const validation = validateProfile(newForm);
    if (!validation.valid && validation.errors) {
      setFormErrors(validation.errors);
    } else {
      setFormErrors({});
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const validation = validateProfile(editForm);
    if (!validation.valid) {
      setFormErrors(validation.errors || {});
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name || null,
          bio: editForm.bio || null,
          username: editForm.username || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setFormErrors({});
      fetchProfile();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to update profile");
    }
  };

  const stats = [
    { label: "Notes Shared", value: 0, icon: BookOpen },
    { label: "Assignments", value: 0, icon: FileText },
    { label: "Likes Received", value: 0, icon: Heart },
    { label: "Rating", value: "N/A", icon: Star },
  ];

  const tabs = ["posts", "notes", "assignments", "saved"];

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || "U";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-3xl">{getUserInitials()}</span>
            </div>
            <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => handleFormChange("full_name", e.target.value)}
                      className={`text-2xl font-display font-bold bg-muted/50 border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 ${formErrors.full_name ? 'border-destructive' : 'border-border'}`}
                      placeholder="Your name"
                      maxLength={VALIDATION_LIMITS.profiles.fullName.max + 10}
                    />
                    {formErrors.full_name && (
                      <p className="text-xs text-destructive mt-1">{formErrors.full_name}</p>
                    )}
                    <span className="text-xs text-muted-foreground ml-2">
                      {getCharCountDisplay(editForm.full_name.length, VALIDATION_LIMITS.profiles.fullName.max).text}
                    </span>
                  </div>
                ) : (
                  <h1 className="text-2xl font-display font-bold">
                    {profile?.full_name || user?.email?.split("@")[0] || "User"}
                  </h1>
                )}
                {isEditing ? (
                  <div className="mt-1">
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => handleFormChange("username", e.target.value)}
                      className={`text-muted-foreground bg-muted/50 border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 ${formErrors.username ? 'border-destructive' : 'border-border'}`}
                      placeholder="username (letters, numbers, underscores)"
                      maxLength={VALIDATION_LIMITS.profiles.username.max + 5}
                    />
                    {formErrors.username && (
                      <p className="text-xs text-destructive mt-1">{formErrors.username}</p>
                    )}
                    <span className="text-xs text-muted-foreground ml-2">
                      {VALIDATION_LIMITS.profiles.username.min}-{VALIDATION_LIMITS.profiles.username.max} chars
                    </span>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {profile?.username ? `@${profile.username}` : "Student"}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button variant="hero" size="sm" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = "/dashboard/settings"}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="hero" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="mb-4">
                <textarea
                  value={editForm.bio}
                  onChange={(e) => handleFormChange("bio", e.target.value)}
                  className={`w-full text-foreground/80 bg-muted/50 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] ${formErrors.bio ? 'border-destructive' : 'border-border'}`}
                  placeholder="Tell us about yourself..."
                  maxLength={VALIDATION_LIMITS.profiles.bio.max + 50}
                />
                <div className="flex justify-between items-center mt-1">
                  {formErrors.bio && (
                    <p className="text-xs text-destructive">{formErrors.bio}</p>
                  )}
                  <span className={`text-xs ml-auto ${
                    getCharCountDisplay(editForm.bio.length, VALIDATION_LIMITS.profiles.bio.max).isOverLimit
                      ? 'text-destructive'
                      : getCharCountDisplay(editForm.bio.length, VALIDATION_LIMITS.profiles.bio.max).isNearLimit
                        ? 'text-warning'
                        : 'text-muted-foreground'
                  }`}>
                    {getCharCountDisplay(editForm.bio.length, VALIDATION_LIMITS.profiles.bio.max).text}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-foreground/80 mb-4">
                {profile?.bio || "No bio yet. Click 'Edit Profile' to add one!"}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Student
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {profile?.created_at ? formatDate(profile.created_at) : "Recently"}
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
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-lg mb-2">No {activeTab} yet</h3>
          <p className="text-muted-foreground">
            Your {activeTab} will appear here when you create them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
