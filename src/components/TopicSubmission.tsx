import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TopicSubmission = () => {
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) setSubmitted(true);
  };

  return (
    <section id="suggest" className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">
        Suggest a Topic
      </p>
      <p className="text-sm text-muted-foreground mb-5 max-w-lg">
        Have a question you think deserves two sides? Send it through and it may feature in a future episode.
      </p>

      <div className="rounded-lg border bg-card p-6 max-w-md">
        {submitted ? (
          <p className="text-sm text-primary font-medium">
            Thanks — we've received your suggestion.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="topic" className="text-xs font-medium text-card-foreground block mb-1">
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
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="suggest-name" className="text-xs font-medium text-card-foreground block mb-1">
                  Name <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="suggest-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label htmlFor="suggest-email" className="text-xs font-medium text-card-foreground block mb-1">
                  Email <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="suggest-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
            <Button type="submit" size="sm">
              Submit
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default TopicSubmission;
