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
    <section id="suggest" className="mx-auto max-w-4xl px-4 py-10 sm:px-5 sm:py-14">
      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-section-label mb-3">
        Suggest a Topic
      </p>
      <p className="text-[1rem] sm:text-[1.125rem] text-muted-foreground mb-6 sm:mb-8 max-w-xl leading-[1.65]">
        Have a question you think deserves two sides? Send it through and it may feature in a future episode.
      </p>

      <div className="rounded-xl border bg-card p-5 sm:p-7 max-w-md">
        {submitted ? (
          <p className="text-[1rem] text-primary font-medium">
            Thanks — we've received your suggestion.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="topic" className="text-[0.875rem] font-medium text-card-foreground block mb-2">
                Debate question <span className="text-primary">*</span>
              </label>
              <Textarea
                id="topic"
                placeholder="e.g. Should cities ban private car ownership?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                rows={3}
                className="text-[1rem]"
                disabled={saving}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="suggest-name" className="text-[0.875rem] font-medium text-card-foreground block mb-2">
                  Name <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="suggest-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-[1rem]"
                  disabled={saving}
                />
              </div>
              <div>
                <label htmlFor="suggest-email" className="text-[0.875rem] font-medium text-card-foreground block mb-2">
                  Email <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="suggest-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-[1rem]"
                  disabled={saving}
                />
              </div>
            </div>
            <Button type="submit" disabled={saving || !topic.trim()}>
              {saving ? "Submitting…" : "Submit"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default TopicSubmission;
