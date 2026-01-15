import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Upload,
  Download,
  Heart,
  MessageCircle,
  Search,
  Filter,
  Star,
  Eye,
} from "lucide-react";
import { useState } from "react";

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const subjects = ["All", "Mathematics", "Physics", "Computer Science", "Chemistry", "English"];

  const notes = [
    {
      id: 1,
      title: "Linear Algebra - Complete Notes",
      subject: "Mathematics",
      author: "Sarah Chen",
      avatar: "SC",
      likes: 156,
      views: 1240,
      comments: 23,
      rating: 4.8,
      uploadedAt: "2 days ago",
      pages: 45,
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      subject: "Computer Science",
      author: "Alex Kumar",
      avatar: "AK",
      likes: 234,
      views: 2100,
      comments: 45,
      rating: 4.9,
      uploadedAt: "3 days ago",
      pages: 78,
    },
    {
      id: 3,
      title: "Quantum Mechanics Fundamentals",
      subject: "Physics",
      author: "Maya Patel",
      avatar: "MP",
      likes: 89,
      views: 890,
      comments: 12,
      rating: 4.7,
      uploadedAt: "5 days ago",
      pages: 34,
    },
    {
      id: 4,
      title: "Organic Chemistry Reactions",
      subject: "Chemistry",
      author: "Raj Sharma",
      avatar: "RS",
      likes: 67,
      views: 567,
      comments: 8,
      rating: 4.5,
      uploadedAt: "1 week ago",
      pages: 52,
    },
    {
      id: 5,
      title: "Database Management Systems",
      subject: "Computer Science",
      author: "Priya Singh",
      avatar: "PS",
      likes: 112,
      views: 1450,
      comments: 19,
      rating: 4.6,
      uploadedAt: "1 week ago",
      pages: 63,
    },
    {
      id: 6,
      title: "Calculus III - Vector Analysis",
      subject: "Mathematics",
      author: "John Smith",
      avatar: "JS",
      likes: 98,
      views: 980,
      comments: 15,
      rating: 4.8,
      uploadedAt: "2 weeks ago",
      pages: 41,
    },
  ];

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || note.subject.toLowerCase() === selectedSubject.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Notes</h1>
          <p className="text-muted-foreground">Share and discover study materials</p>
        </div>
        <Button variant="hero">
          <Upload className="w-4 h-4 mr-2" />
          Upload Notes
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject.toLowerCase())}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSubject === subject.toLowerCase()
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note, index) => (
          <div
            key={note.id}
            className="glass-card-hover p-5 group animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">{note.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{note.author}</p>
                  <p className="text-xs text-muted-foreground">{note.uploadedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-warning">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{note.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md mb-2">
                {note.subject}
              </span>
              <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {note.title}
              </h3>
              <p className="text-sm text-muted-foreground">{note.pages} pages</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {note.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {note.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {note.comments}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <BookOpen className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button variant="default" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
