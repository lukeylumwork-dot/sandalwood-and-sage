import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TopicSubmission = () => {
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    if (topic.trim().length > 500) {
      toast.error("Topic must be 500 characters or less.");
      return;
    }
    if (name.trim().length > 100) {
      toast.error("Name must be 100 characters or less.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("submitted_topics").insert({
        topic: topic.trim(),
        name: name.trim() || null,
        email: email.trim() || null,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Topic submitted!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit topic. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="suggest" className="mx-auto max-w-4xl px-5 py-8 sm:py-10">
      <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-section-label mb-2">
        Suggest a Topic
      </p>
      <p className="text-sm sm:text-[0.95rem] text-muted-foreground mb-5 sm:mb-6 max-w-lg leading-relaxed">
        Have a question you think deserves two sides? Send it through and it may feature in a future episode.
      </p>

      <div className="rounded-xl border bg-card p-5 sm:p-6 max-w-md">
        {submitted ? (
          <p className="text-sm text-primary font-medium">
            Thanks — we've received your suggestion.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="topic" className="text-xs font-medium text-card-foreground block mb-1.5">
                Debate question <span className="text-primary">*</span>
              </label>
              <Textarea
                id="topic"
                placeholder="e.g. Should cities ban private car ownership?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                rows={3}
                className="text-sm"
                disabled={saving}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="suggest-name" className="text-xs font-medium text-card-foreground block mb-1.5">
                  Name <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="suggest-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-sm"
                  disabled={saving}
                />
              </div>
              <div>
                <label htmlFor="suggest-email" className="text-xs font-medium text-card-foreground block mb-1.5">
                  Email <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="suggest-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                  disabled={saving}
                />
              </div>
            </div>
            <Button type="submit" size="sm" disabled={saving || !topic.trim()}>
              {saving ? "Submitting…" : "Submit"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default TopicSubmission;
