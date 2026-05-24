import { useState } from "react";
import { Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const rssUrl = "/feed.xml";

const platforms = [
  { label: "Spotify", href: "https://open.spotify.com/show/033ei3X7wU9mMlqFKDQUWs?si=8c163ebf934b487c", coming: false },
  { label: "Apple Podcasts", href: "https://podcasts.apple.com/gb/podcast/sandalwood-sage-what-were-arguing-about-this-week/id1896168647", coming: false },
  { label: "YouTube", href: "https://www.youtube.com/@SandalwoodAndSage", coming: false },
];

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("email_subscriptions")
        .insert({ email: trimmed });
      if (error) {
        if (error.code === "23505") {
          toast.info("You're already subscribed!");
          setSubmitted(true);
        } else {
          throw error;
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      toast.error("Could not subscribe. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="subscribe" className="mx-auto max-w-4xl px-4 py-7 sm:px-5 sm:py-10">
      <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-section-label mb-2">
        Subscribe
      </p>
      <h2 className="text-2xl sm:text-3xl text-foreground mb-2 leading-tight">
        Never miss an episode
      </h2>
      <p className="text-sm sm:text-[0.95rem] text-muted-foreground mb-6 sm:mb-8 max-w-lg leading-relaxed">
        Follow Sandalwood & Sage on your favourite platform, or join the mailing list to get new episodes delivered to your inbox.
      </p>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        {/* Platforms */}
        <div>
          <p className="text-[10px] font-semibold text-section-label mb-3 uppercase tracking-[0.16em]">Platforms</p>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <Button
                key={p.label}
                variant="outline"
                size="sm"
                asChild={!p.coming}
                disabled={p.coming}
                className={p.coming ? "opacity-60 cursor-default" : ""}
              >
                {p.coming ? (
                  <span className="flex items-center gap-1.5">
                    {p.label}
                    <span className="text-[10px] text-muted-foreground font-normal ml-1">Soon</span>
                  </span>
                ) : (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                    {p.label}
                  </a>
                )}
              </Button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <a
              href={rssUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Rss size={11} />
              RSS Feed
            </a>
            <span className="text-[10px] text-muted-foreground/60">· for podcast apps &amp; RSS readers</span>
          </div>
        </div>

        {/* Mailing list */}
        <div className="rounded-xl border bg-card p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Join the mailing list
          </h3>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            New episodes, straight to your inbox. No spam.
          </p>
          {submitted ? (
            <p className="text-sm text-primary font-medium">Thanks — you're on the list.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm"
                disabled={saving}
              />
              <Button type="submit" size="sm" className="sm:shrink-0" disabled={saving}>
                {saving ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </div>

    </section>
  );
};

export default Subscribe;
