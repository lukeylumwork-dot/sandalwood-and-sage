import { useState, useEffect, useMemo } from "react";
import { Clock, Share2, Link, Twitter, Video, Search } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import SidesSplit from "@/components/SidesSplit";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Episode {
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
  _isFromDb?: boolean;
}

const episodes: Episode[] = [];

const categories = ["All", "Tech", "Work", "Society", "Money", "Sport", "Politics"];

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getShareUrl(ep: Episode): string {
  return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/share-episode?episode=${toSlug(ep.title)}`;
}

const EpisodesList = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [dbEpisodes, setDbEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    supabase
      .from("generated_debates")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        const mapped: Episode[] = data.map((d: any) => ({
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
          _isFromDb: true,
        }));
        setDbEpisodes(mapped);
      });
  }, []);

  const allEpisodes = [...dbEpisodes, ...episodes];

  const filtered = useMemo(() => {
    let result = activeFilter === "All"
      ? allEpisodes
      : allEpisodes.filter((ep) => ep.category === activeFilter);

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
  }, [allEpisodes, activeFilter, searchQuery]);

  return (
    <section id="episodes" className="mx-auto max-w-4xl px-5 py-8 sm:py-10">
      <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-section-label mb-2">
        Episodes
      </p>
      <h2 className="text-2xl sm:text-3xl text-foreground mb-5 sm:mb-6 leading-tight">All episodes</h2>

      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search episodes…"
          className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-7">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`rounded-full border px-3 sm:px-4 py-1.5 text-xs font-medium transition-colors ${
              activeFilter === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-2.5">
        {filtered.map((ep, i) => (
          <button
            key={i}
            onClick={() => setSelectedEpisode(ep)}
            className="group flex flex-col gap-2 rounded-xl border bg-card p-4 sm:p-5 text-left transition-all hover:border-primary/40 hover:shadow-sm sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{ep.category}</span>
                {ep.video_url && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                    <Video size={10} /> Video
                  </span>
                )}
                {ep._isFromDb && (
                  <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    New
                  </span>
                )}
              </div>
              <h3 className="text-[0.95rem] sm:text-base font-semibold text-card-foreground leading-snug group-hover:text-primary transition-colors text-pretty" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {ep.title}
              </h3>
              <p className="text-xs sm:text-[0.8rem] text-muted-foreground mt-1 leading-relaxed line-clamp-2">{ep.premise}</p>
            </div>
            {ep.duration && (
              <p className="mt-1 flex shrink-0 items-center gap-1 text-xs text-muted-foreground sm:mt-0 sm:ml-4">
                <Clock size={12} /> {ep.duration}
              </p>
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">No episodes found.</p>
        )}
      </div>

      <Dialog open={!!selectedEpisode} onOpenChange={() => setSelectedEpisode(null)}>
        <DialogContent className="max-w-lg dark bg-background border-border max-h-[90vh] overflow-y-auto p-5 sm:p-6">
          {selectedEpisode && (
            <>
              <DialogHeader className="space-y-1.5">
                <span className="text-[11px] font-semibold text-primary block uppercase tracking-[0.14em]">
                  {selectedEpisode.category}
                </span>
                <DialogTitle className="text-xl sm:text-2xl leading-[1.2] text-foreground text-balance">
                  {selectedEpisode.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 mt-4">
                {selectedEpisode.video_url && (
                  <VideoPlayer
                    url={selectedEpisode.video_url}
                    title={selectedEpisode.title}
                  />
                )}

                {selectedEpisode.side_a_label && selectedEpisode.side_b_label && (
                  <SidesSplit
                    sideALabel={selectedEpisode.side_a_label}
                    sideBLabel={selectedEpisode.side_b_label}
                    sideASummary={selectedEpisode.side_a_summary}
                    sideBSummary={selectedEpisode.side_b_summary}
                  />
                )}

                {selectedEpisode.audio_url && (
                  <AudioPlayer
                    label={selectedEpisode.title}
                    src={selectedEpisode.audio_url}
                  />
                )}

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-section-label uppercase tracking-[0.16em]">
                    The question
                  </p>
                  <p className="text-sm sm:text-[0.95rem] text-foreground leading-relaxed">
                    {selectedEpisode.question}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-section-label uppercase tracking-[0.16em]">
                    Summary
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedEpisode.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-section-label uppercase tracking-[0.16em]">
                    Key points
                  </p>
                  <ul className="space-y-1.5">
                    {selectedEpisode.keyPoints.map((point, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground mr-1">Share</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      navigator.clipboard.writeText(getShareUrl(selectedEpisode));
                      toast.success("Link copied to clipboard!");
                    }}
                    aria-label="Copy share link"
                  >
                    <Link size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedEpisode.title + " — Sandalwood & Sage")}&url=${encodeURIComponent(getShareUrl(selectedEpisode))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Twitter"
                    >
                      <Twitter size={14} />
                    </a>
                  </Button>
                  {typeof navigator !== "undefined" && "share" in navigator && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        navigator.share({
                          title: selectedEpisode.title,
                          text: selectedEpisode.premise,
                          url: getShareUrl(selectedEpisode),
                        }).catch(() => {});
                      }}
                      aria-label="Share via system"
                    >
                      <Share2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EpisodesList;
