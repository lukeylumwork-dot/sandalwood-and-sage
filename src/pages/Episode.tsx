import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Link as LinkIcon, Twitter, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import SidesSplit from "@/components/SidesSplit";
import { toEpisodeSlug, getEpisodeShareUrl } from "@/lib/episode-links";
import type { Episode } from "@/components/EpisodesList";

const EpisodePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("generated_debates")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) { setLoading(false); return; }
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
        const found = mapped.find((ep) => toEpisodeSlug(ep.title) === slug) || null;
        setEpisode(found);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-5">
          <p className="text-muted-foreground text-sm">Loading…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-5">
          <p className="text-muted-foreground text-sm mb-4">Episode not found.</p>
          <a href="/#episodes" className="text-sm text-primary hover:underline">
            ← All episodes
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  const shareUrl = getEpisodeShareUrl(episode);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-5 sm:py-8">
        <a
          href="/#episodes"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          All episodes
        </a>

        <article>
          <header className="mb-6 sm:mb-8">
            <span className="text-[10px] font-semibold text-primary block uppercase tracking-[0.22em] mb-2">
              {episode.category}
            </span>
            <h1
              className="text-[1.5rem] sm:text-[2.25rem] leading-[1.15] text-foreground text-balance font-normal tracking-tight"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {episode.title}
            </h1>
          </header>

          {episode.video_url && (
            <div className="-mx-4 sm:mx-0 sm:rounded-lg overflow-hidden sm:border sm:border-border/70 mb-6 sm:mb-7">
              <VideoPlayer url={episode.video_url} title={episode.title} />
            </div>
          )}

          {episode.side_a_label && episode.side_b_label && (
            <div className="mb-6 sm:mb-7">
              <SidesSplit
                sideALabel={episode.side_a_label}
                sideBLabel={episode.side_b_label}
                sideASummary={episode.side_a_summary}
                sideBSummary={episode.side_b_summary}
              />
            </div>
          )}

          {episode.audio_url && (
            <div className="mb-6 sm:mb-7">
              <AudioPlayer label={episode.title} src={episode.audio_url} />
            </div>
          )}

          <div className="space-y-6 sm:space-y-7">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-section-label uppercase tracking-[0.22em]">
                The question
              </p>
              <p className="text-[0.9rem] sm:text-base text-foreground leading-[1.6] sm:leading-[1.65] text-pretty">
                {episode.question}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-section-label uppercase tracking-[0.22em]">
                Summary
              </p>
              <p className="text-[0.875rem] sm:text-[0.95rem] text-muted-foreground leading-[1.65] sm:leading-[1.7] text-pretty">
                {episode.summary}
              </p>
            </div>

            {episode.keyPoints.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-[10px] font-semibold text-section-label uppercase tracking-[0.22em]">
                  Key points
                </p>
                <ul className="space-y-2">
                  {episode.keyPoints.map((point, idx) => (
                    <li key={idx} className="text-[0.875rem] sm:text-[0.95rem] text-muted-foreground leading-[1.6] sm:leading-[1.65] flex gap-2.5">
                      <span className="mt-[0.55rem] h-1 w-1 rounded-full bg-primary shrink-0" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-8 pt-4 border-t border-border/70">
            <span className="text-[10px] font-semibold text-section-label uppercase tracking-[0.22em] mr-1">Share</span>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 sm:h-8 sm:w-8"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied to clipboard!");
              }}
              aria-label="Copy share link"
            >
              <LinkIcon size={14} />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 sm:h-8 sm:w-8" asChild>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(episode.title + " — Sandalwood & Sage")}&url=${encodeURIComponent(shareUrl)}`}
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
                className="h-9 w-9 sm:h-8 sm:w-8"
                onClick={() => {
                  navigator.share({
                    title: episode.title,
                    text: episode.premise,
                    url: shareUrl,
                  }).catch(() => {});
                }}
                aria-label="Share via system"
              >
                <Share2 size={14} />
              </Button>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default EpisodePage;
