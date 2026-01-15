import { Button } from "@/components/ui/button";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Moon,
  Sun,
  ChevronRight,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    messages: true,
    posts: true,
    assignments: true,
    groups: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showOnline: true,
    allowMessages: true,
  });

  const settingsSections = [
    {
      title: "Account",
      icon: User,
      items: [
        { label: "Edit Profile", description: "Update your name, bio, and photo" },
        { label: "Change Email", description: "Update your email address" },
        { label: "Change Password", description: "Update your password" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Messages", description: "Get notified about new messages", toggle: true, key: "messages" },
        { label: "Posts", description: "Notifications for likes and comments", toggle: true, key: "posts" },
        { label: "Assignments", description: "Due date reminders", toggle: true, key: "assignments" },
        { label: "Groups", description: "Group activity notifications", toggle: true, key: "groups" },
      ],
    },
    {
      title: "Privacy",
      icon: Shield,
      items: [
        { label: "Profile Visibility", description: "Let others see your profile", toggle: true, key: "profileVisible" },
        { label: "Show Online Status", description: "Show when you're active", toggle: true, key: "showOnline" },
        { label: "Allow Messages", description: "Let anyone send you messages", toggle: true, key: "allowMessages" },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <div key={sectionIndex} className="glass-card overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
                <Icon className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold">{section.title}</h2>
              </div>
              <div className="divide-y divide-border">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {item.toggle ? (
                      <button
                        onClick={() => {
                          if (section.title === "Notifications") {
                            setNotifications((prev) => ({
                              ...prev,
                              [item.key as keyof typeof notifications]: !prev[item.key as keyof typeof notifications],
                            }));
                          } else if (section.title === "Privacy") {
                            setPrivacy((prev) => ({
                              ...prev,
                              [item.key as keyof typeof privacy]: !prev[item.key as keyof typeof privacy],
                            }));
                          }
                        }}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          (section.title === "Notifications"
                            ? notifications[item.key as keyof typeof notifications]
                            : privacy[item.key as keyof typeof privacy])
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            (section.title === "Notifications"
                              ? notifications[item.key as keyof typeof notifications]
                              : privacy[item.key as keyof typeof privacy])
                              ? "translate-x-7"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Appearance */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold">Appearance</h2>
          </div>
          <div className="p-4">
            <p className="font-medium mb-2">Theme</p>
            <p className="text-sm text-muted-foreground mb-4">Select your preferred theme</p>
            <div className="flex gap-3">
              <button className="flex-1 p-4 rounded-lg border-2 border-primary bg-card flex items-center justify-center gap-2">
                <Sun className="w-5 h-5" />
                <span className="font-medium">Light</span>
              </button>
              <button className="flex-1 p-4 rounded-lg border border-border bg-card flex items-center justify-center gap-2 hover:border-muted-foreground transition-colors">
                <Moon className="w-5 h-5" />
                <span className="font-medium">Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card overflow-hidden border-destructive/20">
          <div className="flex items-center gap-3 p-4 border-b border-destructive/20 bg-destructive/5">
            <Lock className="w-5 h-5 text-destructive" />
            <h2 className="font-display font-semibold text-destructive">Danger Zone</h2>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
