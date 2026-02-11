import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const platforms = [
  { label: "Spotify", href: "#" },
  { label: "Apple Podcasts", href: "#" },
  { label: "YouTube", href: "#" },
];

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section id="subscribe" className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">
        Subscribe
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        {platforms.map((p) => (
          <Button key={p.label} variant="outline" size="sm" asChild>
            <a href={p.href}>{p.label}</a>
          </Button>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6 max-w-md">
        <h3 className="text-sm font-semibold text-card-foreground mb-1">
          Join the mailing list
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Get new episodes delivered to your inbox.
        </p>
        {submitted ? (
          <p className="text-sm text-primary font-medium">Thanks — you're on the list.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-sm"
            />
            <Button type="submit" size="sm">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Subscribe;
