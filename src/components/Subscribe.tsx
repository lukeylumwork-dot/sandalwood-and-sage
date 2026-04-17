import { useState } from "react";
import { Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const rssUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/rss-feed`;

const platforms = [
  { label: "Spotify", href: "#", coming: true },
  { label: "Apple Podcasts", href: "#", coming: true },
  { label: "YouTube", href: "#", coming: true },
  { label: "RSS Feed", href: rssUrl, icon: Rss, coming: false },
];

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section id="subscribe" className="mx-auto max-w-4xl px-5 py-8 sm:py-10">
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
                    {"icon" in p && p.icon && <p.icon size={14} />}
                    {p.label}
                  </a>
                )}
              </Button>
            ))}
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
              />
              <Button type="submit" size="sm" className="sm:shrink-0">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
