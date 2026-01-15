import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Calendar,
  Users,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

const Assignments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const assignments = [
    {
      id: 1,
      title: "Data Structures Project - Binary Search Tree",
      subject: "Computer Science",
      author: "Dr. Smith",
      dueDate: "Dec 15, 2025",
      status: "pending",
      submissions: 23,
      comments: 12,
      description: "Implement a complete BST with all operations including insert, delete, and traversal.",
    },
    {
      id: 2,
      title: "Physics Lab Report - Wave Motion",
      subject: "Physics",
      author: "Prof. Johnson",
      dueDate: "Dec 12, 2025",
      status: "submitted",
      submissions: 45,
      comments: 8,
      description: "Document your findings from the wave motion experiment conducted in lab.",
    },
    {
      id: 3,
      title: "Linear Algebra Problem Set 5",
      subject: "Mathematics",
      author: "Dr. Chen",
      dueDate: "Dec 10, 2025",
      status: "overdue",
      submissions: 67,
      comments: 34,
      description: "Solve problems related to eigenvalues and eigenvectors.",
    },
    {
      id: 4,
      title: "Database Design Project",
      subject: "Computer Science",
      author: "Prof. Williams",
      dueDate: "Dec 20, 2025",
      status: "pending",
      submissions: 12,
      comments: 5,
      description: "Design and implement a relational database for a library management system.",
    },
    {
      id: 5,
      title: "Chemistry Research Paper",
      subject: "Chemistry",
      author: "Dr. Patel",
      dueDate: "Dec 18, 2025",
      status: "submitted",
      submissions: 34,
      comments: 15,
      description: "Write a research paper on organic reaction mechanisms.",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      submitted: "bg-success/10 text-success",
      overdue: "bg-destructive/10 text-destructive",
      pending: "bg-warning/10 text-warning",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || assignment.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Assignments</h1>
          <p className="text-muted-foreground">Manage and submit your assignments</p>
        </div>
        <Button variant="hero">
          <Upload className="w-4 h-4 mr-2" />
          Upload Assignment
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "submitted", "overdue"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === status
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment, index) => (
          <div
            key={assignment.id}
            className="glass-card-hover p-5 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-lg">{assignment.title}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusBadge(assignment.status)}`}>
                    {getStatusIcon(assignment.status)}
                    {assignment.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{assignment.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs font-medium">
                    {assignment.subject}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {assignment.dueDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {assignment.submissions} submissions
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {assignment.comments} comments
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  View
                </Button>
                {assignment.status !== "submitted" && (
                  <Button variant="hero" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
