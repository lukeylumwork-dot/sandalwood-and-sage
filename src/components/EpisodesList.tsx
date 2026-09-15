import { useState, useEffect, useMemo, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Search } from "lucide-react";
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

/** How many episodes the homepage shows before sending readers to the archive. */
export const HOMEPAGE_EPISODE_LIMIT = 10;

interface EpisodesListProps {
  /** Cap the rendered list; omit to show the full archive. */
  limit?: number;
  /** Search box and category pills. Off on the homepage, where the list is capped. */
  showFilters?: boolean;
  eyebrow?: string;
  heading?: string;
}

const EpisodeCard = memo(({ ep, index }: { ep: Episode; index: number }) => (
  <Link
    to={`/episode/${toEpisodeSlug(ep.title)}`}
    className="group grid grid-cols-[auto_1fr] items-baseline gap-4 border-t border-border py-5 pl-1 pr-1 text-left transition-[padding] hover:pl-3 sm:grid-cols-[auto_1fr_auto] sm:gap-6"
  >
    <span className="min-w-[22px] text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
      {String(index).padStart(2, "0")}
    </span>
    <div className="min-w-0">
      <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary block mb-1.5">{ep.category}</span>
      <h3 className="font-display font-normal text-[1.3rem] sm:text-[1.5rem] text-card-foreground leading-[1.14] tracking-[-0.015em] group-hover:text-primary transition-colors text-pretty">
        {ep.title}
      </h3>
      {ep.premise && (
        <p className="font-serif mt-2 text-sm text-muted-foreground leading-[1.6] max-w-[60ch] line-clamp-2">{ep.premise}</p>
      )}
    </div>
    {ep.duration && (
      <p className="col-span-2 mt-1 flex shrink-0 items-center gap-1 text-[13px] text-muted-foreground sm:col-span-1 sm:mt-0 sm:justify-self-end">
        <Clock size={12} /> {ep.duration}
      </p>
    )}
  </Link>
));

EpisodeCard.displayName = "EpisodeCard";

const EpisodesList = ({
  limit,
  showFilters = true,
  eyebrow = "Episodes",
  heading = "All episodes",
}: EpisodesListProps = {}) => {
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

  const visible = limit ? filtered.slice(0, limit) : filtered;
  const hasMore = limit !== undefined && filtered.length > limit;

  return (
    <section id="episodes" className="mx-auto max-w-4xl px-4 py-7 sm:px-5 sm:py-10">
      <p className="text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.22em] text-section-label mb-2">
        {eyebrow}
      </p>
      <h2 className="text-[1.5rem] sm:text-3xl text-foreground mb-4 sm:mb-6 leading-tight">{heading}</h2>

      {showFilters && (
        <>
      <div className="relative mb-3">
        <Search size={16} className="absolute left-[15px] top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search episodes…"
          className="w-full h-[50px] rounded-md border border-border bg-card pl-[42px] pr-4 text-[0.9rem] sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-colors font-sans"
        />
      </div>

      <div className="-mx-4 sm:mx-0 px-4 sm:px-0 flex gap-1.5 sm:gap-2 mb-5 sm:mb-7 overflow-x-auto scrollbar-hide sm:flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`shrink-0 rounded-full border px-3 sm:px-4 py-1.5 text-[12px] sm:text-[13px] font-medium transition-colors ${
              activeFilter === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
        </>
      )}

      <div>
        {visible.map((ep, i) => (
          <EpisodeCard key={ep.id} ep={ep} index={i + 1} />
        ))}
        <div className="border-t border-border" />
        {filtered.length === 0 && (
          <p className="font-serif text-sm text-muted-foreground py-8 text-center">No episodes found.</p>
        )}
      </div>

      {hasMore && (
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Link
            to="/episodes"
            className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View all {filtered.length} episodes
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default EpisodesList;
