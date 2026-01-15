import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Search,
  MessageCircle,
  Crown,
  Lock,
  Globe,
} from "lucide-react";
import { useState } from "react";

const Groups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const groups = [
    {
      id: 1,
      name: "CS101 Study Group",
      description: "Data Structures & Algorithms study group for CS101 students",
      members: 45,
      posts: 234,
      isPrivate: false,
      isMember: true,
      subject: "Computer Science",
    },
    {
      id: 2,
      name: "Physics Lab Partners",
      description: "Collaborate on physics lab experiments and reports",
      members: 23,
      posts: 89,
      isPrivate: true,
      isMember: true,
      subject: "Physics",
    },
    {
      id: 3,
      name: "Math Tutoring Hub",
      description: "Get help with math problems from peers and tutors",
      members: 67,
      posts: 456,
      isPrivate: false,
      isMember: false,
      subject: "Mathematics",
    },
    {
      id: 4,
      name: "Chemistry Research",
      description: "Discussion group for organic chemistry research projects",
      members: 34,
      posts: 123,
      isPrivate: true,
      isMember: false,
      subject: "Chemistry",
    },
    {
      id: 5,
      name: "Database Developers",
      description: "Learn and discuss database design and SQL",
      members: 56,
      posts: 178,
      isPrivate: false,
      isMember: true,
      subject: "Computer Science",
    },
    {
      id: 6,
      name: "Calculus Crew",
      description: "Study group for Calculus I, II, and III",
      members: 89,
      posts: 345,
      isPrivate: false,
      isMember: false,
      subject: "Mathematics",
    },
  ];

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "joined" ? group.isMember : !group.isMember);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Study Groups</h1>
          <p className="text-muted-foreground">Join groups and collaborate with peers</p>
        </div>
        <Button variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            {["all", "joined", "discover"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === status
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {status === "discover" ? "Discover" : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group, index) => (
          <div
            key={group.id}
            className="glass-card-hover p-5 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-2">
                {group.isPrivate ? (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Globe className="w-4 h-4 text-muted-foreground" />
                )}
                {group.isMember && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-success/10 text-success rounded-full">
                    Joined
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md mb-2">
                {group.subject}
              </span>
              <h3 className="font-display font-semibold text-lg mb-1">{group.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {group.members} members
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {group.posts} posts
              </span>
            </div>

            {/* Actions */}
            <Button
              variant={group.isMember ? "outline" : "hero"}
              className="w-full"
            >
              {group.isMember ? "Open Group" : "Join Group"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
