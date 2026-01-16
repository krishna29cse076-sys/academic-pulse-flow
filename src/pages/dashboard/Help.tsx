import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Book,
  Users,
  Shield,
} from "lucide-react";
import { useState } from "react";

const Help = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I upload notes?",
      answer: "Navigate to the Notes section from the sidebar, then click the 'Upload Notes' button. You can upload PDF, DOC, or PPT files. Add a title, select the subject, and click submit.",
    },
    {
      question: "Can I make my profile private?",
      answer: "Yes! Go to Settings > Privacy and toggle off 'Profile Visibility'. This will hide your profile from other students, but you can still participate in groups and discussions.",
    },
    {
      question: "How do I join a study group?",
      answer: "Visit the Groups section to browse available study groups. Click 'Join Group' on any group that interests you. Some groups may require approval from the group admin.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices to protect your information.",
    },
    {
      question: "How do I report inappropriate content?",
      answer: "Click the three dots (⋮) on any post, note, or message and select 'Report'. Choose the reason for reporting and submit. Our moderation team will review it promptly.",
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can delete your account from Settings > Danger Zone. Please note that this action is irreversible and all your data will be permanently removed.",
    },
  ];

  const quickLinks = [
    { icon: Book, title: "User Guide", description: "Learn how to use InteractZ" },
    { icon: Users, title: "Community Guidelines", description: "Our community standards" },
    { icon: Shield, title: "Privacy Policy", description: "How we handle your data" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Zap className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Need help? We're here for you. Browse FAQs or contact our support team.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <div key={index} className="glass-card-hover p-5 text-center cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{link.title}</h3>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </div>
          );
        })}
      </div>

      {/* FAQs */}
      <div className="glass-card mb-10">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-lg">Frequently Asked Questions</h2>
          </div>
        </div>
        <div className="divide-y divide-border">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-muted-foreground animate-slide-up">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="glass-card p-6">
        <h2 className="font-display font-semibold text-lg mb-4">Still need help?</h2>
        <p className="text-muted-foreground mb-6">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="mailto:krishna29cse076@satiengg.in"
            className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium">Email Support</p>
              <p className="text-sm text-muted-foreground">krishna29cse076@satiengg.in</p>
            </div>
          </a>
          <a
            href="tel:+919301617648"
            className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent hover:bg-accent/5 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Phone className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="font-medium">Phone Support</p>
              <p className="text-sm text-muted-foreground">+91 93016 17648</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;
