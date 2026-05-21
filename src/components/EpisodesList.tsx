import { useState, useEffect, useMemo, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { findEpisodeFromSearchParams, toEpisodeSlug } from "@/lib/episode-links";

export interface Episode {
  id: string;
  title: string;
  category: string;
  duration: string;
  premise: string;
  question: string;
  summary: string;
  forArgument: string;
  againstArgument: string;
  keyPoints: string[];
  video_url?: string;
  audio_url?: string;
  cover_image_url?: string;
  side_a_label?: string;
  side_b_label?: string;
  side_a_summary?: string;
  side_b_summary?: string;
}

const categories = ["All", "Current Affairs", "Society", "Politics", "Sport"];

const EpisodeCard = memo(({ ep }: { ep: Episode }) => (
  <Link
    to={`/episode/${toEpisodeSlug(ep.title)}`}
    className="group flex flex-col gap-2 rounded-xl border bg-card p-3.5 sm:p-5 text-left transition-all hover:border-primary/40 hover:shadow-sm sm:flex-row sm:items-start sm:justify-between active:scale-[0.995]"
  >
    <div className="min-w-0 flex-1">
      <h3 className="text-[1.05rem] sm:text-[1.1rem] font-semibold text-card-foreground leading-[1.25] group-hover:text-primary transition-colors text-pretty mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {ep.title}
      </h3>
      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-primary block mb-1.5">{ep.category}</span>
      <p className="text-[0.8rem] text-muted-foreground leading-[1.5] line-clamp-2">{ep.premise}</p>
    </div>
    {ep.duration && (
      <p className="mt-1 flex shrink-0 items-center gap-1 text-xs text-muted-foreground sm:mt-0 sm:ml-4">
        <Clock size={12} /> {ep.duration}
      </p>
    )}
  </Link>
));

EpisodeCard.displayName = "EpisodeCard";

const EpisodesList = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dbEpisodes, setDbEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    supabase
      .from("generated_debates")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        const mapped: Episode[] = data.map((d) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          duration: "",
          premise: d.summary?.slice(0, 120) + (d.summary?.length > 120 ? "…" : "") || "",
          question: d.question,
          summary: d.summary,
          forArgument: d.for_argument,
          againstArgument: d.against_argument,
          keyPoints: Array.isArray(d.key_points) ? d.key_points : [],
          video_url: d.video_url || undefined,
          audio_url: d.audio_url || undefined,
          cover_image_url: d.cover_image_url || undefined,
          side_a_label: d.side_a_label || undefined,
          side_b_label: d.side_b_label || undefined,
          side_a_summary: d.side_a_summary || undefined,
          side_b_summary: d.side_b_summary || undefined,
        }));
        setDbEpisodes(mapped);
      });
  }, []);

  // Redirect legacy ?episode=<id> and ?episodeSlug=<slug> deep links to episode pages
  useEffect(() => {
    if (!dbEpisodes.length) return;
    const match = findEpisodeFromSearchParams(dbEpisodes, window.location.search);
    if (match) {
      navigate(`/episode/${toEpisodeSlug(match.title)}`, { replace: true });
    }
  }, [dbEpisodes, navigate]);

  const filtered = useMemo(() => {
    let result = activeFilter === "All"
      ? dbEpisodes
      : dbEpisodes.filter((ep) => ep.category === activeFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (ep) =>
          ep.title.toLowerCase().includes(q) ||
          ep.premise.toLowerCase().includes(q) ||
          ep.question.toLowerCase().includes(q) ||
          ep.summary.toLowerCase().includes(q)
      );
    }

    return result;
  }, [dbEpisodes, activeFilter, searchQuery]);

  return (
    <section id="episodes" className="mx-auto max-w-4xl px-4 py-7 sm:px-5 sm:py-10">
      <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.22em] text-section-label mb-2">
        Episodes
      </p>
      <h2 className="text-[1.5rem] sm:text-3xl text-foreground mb-4 sm:mb-6 leading-tight">All episodes</h2>

      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search episodes…"
          className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2.5 text-[0.9rem] sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
      </div>

      <div className="-mx-4 sm:mx-0 px-4 sm:px-0 flex gap-1.5 sm:gap-2 mb-5 sm:mb-7 overflow-x-auto scrollbar-hide sm:flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`shrink-0 rounded-full border px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-medium transition-colors ${
              activeFilter === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-2 sm:gap-2.5">
        {filtered.map((ep) => (
          <EpisodeCard key={ep.id} ep={ep} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">No episodes found.</p>
        )}
      </div>
    </section>
  );
};

export default EpisodesList;
