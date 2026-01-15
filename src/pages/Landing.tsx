import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import {
  BookOpen,
  FileText,
  MessageCircle,
  Users,
  Gamepad2,
  Shield,
  Zap,
  ArrowRight,
  Star,
  CheckCircle,
  Mail,
  Phone,
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Notes Sharing",
      description: "Upload and share handwritten or digital notes with your peers. Learn together, grow together.",
    },
    {
      icon: FileText,
      title: "Assignment Hub",
      description: "Share assignments and projects. Get help from classmates and submit quality work.",
    },
    {
      icon: MessageCircle,
      title: "Real-Time Chat",
      description: "Connect instantly with fellow students. Private chats and group discussions await.",
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Create or join subject-wise discussion groups. Solve doubts together collaboratively.",
    },
    {
      icon: Gamepad2,
      title: "Community Games",
      description: "Take a break with fun mini-games. Compete on leaderboards and unwind with friends.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected. Safe environment for academic collaboration.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "5K+", label: "Notes Shared" },
    { value: "500+", label: "Study Groups" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl floating-animation" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl floating-animation delay-200" />
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-info/10 rounded-full blur-3xl floating-animation delay-400" />
        </div>

        <div className="container mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-slide-up">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Join the Student Community</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up delay-100">
              Connect. Learn.{" "}
              <span className="gradient-text">Grow.</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up delay-200">
              InteractZ is your all-in-one student community platform. Share notes, collaborate on assignments, and connect with peers in a secure, cloud-based environment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
              <Link to="/signup">
                <Button variant="hero" size="xl" className="group">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="heroOutline" size="xl">
                  Log In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-slide-up delay-400">
              {stats.map((stat, index) => (
                <div key={index} className="glass-card p-4">
                  <p className="text-3xl font-display font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From sharing notes to real-time collaboration, InteractZ has all the tools you need for academic success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass-card-hover p-6 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Built by Students,{" "}
                <span className="gradient-text">For Students</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                InteractZ was created with a simple mission: to help students connect, collaborate, and succeed together. We understand the challenges of academic life and built a platform that makes it easier.
              </p>
              <ul className="space-y-4">
                {[
                  "Cloud-based for access anywhere, anytime",
                  "Real-time collaboration and messaging",
                  "Secure and private by design",
                  "Community-driven learning experience",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="glass-card p-8">
                <div className="aspect-square rounded-xl bg-gradient-hero opacity-20" />
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-20 h-20 mx-auto text-primary mb-4" />
                    <p className="text-2xl font-display font-bold">InteractZ</p>
                    <p className="text-muted-foreground">Your Learning Community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Get In <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Have questions? We're here to help you get started.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="mailto:krishna29cse076@sathyabama.ac.in"
              className="glass-card-hover p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">Email Us</p>
                <p className="text-sm text-muted-foreground">krishna29cse076@sathyabama.ac.in</p>
              </div>
            </a>
            <a
              href="tel:+919301617648"
              className="glass-card-hover p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                <Phone className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="font-semibold">Call Us</p>
                <p className="text-sm text-muted-foreground">+91 93016 17648</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">InteractZ</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 InteractZ. Connect. Learn. Grow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
