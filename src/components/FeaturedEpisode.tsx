import { useState, useEffect } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import SidesSplit from "@/components/SidesSplit";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FeaturedEpisodeData = {
  title: string;
  category: string;
  duration: string;
  summary: string;
  question: string;
  forArgument: string;
  againstArgument: string;
  video_url?: string;
  audio_url?: string;
  cover_image_url?: string;
  side_a_label?: string;
  side_b_label?: string;
  side_a_summary?: string;
  side_b_summary?: string;
};

const FeaturedEpisode = () => {
  const [episode, setEpisode] = useState<FeaturedEpisodeData | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("generated_debates")
      .select("title, category, summary, question, for_argument, against_argument, video_url, audio_url, cover_image_url, side_a_label, side_b_label, side_a_summary, side_b_summary, is_featured")
      .eq("is_featured", true)
      .limit(1)
      .then(async ({ data: pinned }) => {
        let row = pinned && pinned.length > 0 ? pinned[0] : null;

        if (!row) {
          const { data: latest } = await supabase
            .from("generated_debates")
            .select("title, category, summary, question, for_argument, against_argument, video_url, audio_url, cover_image_url, side_a_label, side_b_label, side_a_summary, side_b_summary, is_featured")
            .order("created_at", { ascending: false })
            .limit(1);
          row = latest && latest.length > 0 ? latest[0] : null;
        }

        if (row) {
          const d = row as any;
          setEpisode({
            title: d.title,
            category: d.category,
            duration: "",
            summary: d.summary,
            question: d.question,
            forArgument: d.for_argument,
            againstArgument: d.against_argument,
            video_url: d.video_url || undefined,
            audio_url: d.audio_url || undefined,
            cover_image_url: d.cover_image_url || undefined,
            side_a_label: d.side_a_label || undefined,
            side_b_label: d.side_b_label || undefined,
            side_a_summary: d.side_a_summary || undefined,
            side_b_summary: d.side_b_summary || undefined,
          });
        }
      });
  }, []);

  if (!episode) return null;

  return (
    <section id="featured" className="mx-auto max-w-4xl px-4 pt-1 pb-7 sm:px-5 sm:pt-3 sm:pb-10">
      <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.22em] text-section-label mb-2.5 sm:mb-3">
        Latest Episode
      </p>

      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border bg-card overflow-hidden text-left transition-all hover:border-primary/40 hover:shadow-sm cursor-pointer"
      >
        {episode.cover_image_url && (
          <div className="aspect-[16/9] sm:aspect-[3/1] w-full overflow-hidden">
            <img
              src={episode.cover_image_url}
              alt={episode.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-4 sm:p-7 md:p-9">
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold text-primary mb-1.5 sm:mb-2 uppercase tracking-[0.18em]">
            {episode.category}
          </span>
          <h2 className="text-[1.15rem] sm:text-2xl md:text-3xl lg:text-[2.25rem] text-card-foreground leading-[1.18] text-balance">
            {episode.title}
          </h2>
          <p className="mt-2 sm:mt-4 text-[0.85rem] sm:text-base text-muted-foreground leading-[1.6] sm:leading-relaxed max-w-2xl text-pretty line-clamp-3 sm:line-clamp-none">
            {episode.summary}
          </p>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:w-full max-w-xl dark bg-background border-border max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-xl">
          <article>
            <DialogHeader className="px-4 sm:px-7 pt-5 sm:pt-7 pb-4 sm:pb-5 border-b border-border/70 space-y-1.5 sm:space-y-2 text-left">
              <span className="text-[10px] font-semibold text-primary block uppercase tracking-[0.22em]">
                {episode.category}
              </span>
              <DialogTitle
                className="font-serif text-[1.25rem] sm:text-[1.75rem] leading-[1.2] sm:leading-[1.15] text-foreground text-balance font-normal tracking-tight pr-6"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {episode.title}
              </DialogTitle>
            </DialogHeader>

            <div className="px-4 sm:px-7 py-5 sm:py-6 space-y-6 sm:space-y-7">
              {episode.video_url && (
                <div className="-mx-4 sm:mx-0 sm:rounded-lg overflow-hidden sm:border sm:border-border/70">
                  <VideoPlayer url={episode.video_url} title={episode.title} />
                </div>
              )}

              {episode.side_a_label && episode.side_b_label && (
                <SidesSplit
                  sideALabel={episode.side_a_label}
                  sideBLabel={episode.side_b_label}
                  sideASummary={episode.side_a_summary}
                  sideBSummary={episode.side_b_summary}
                />
              )}

              {episode.audio_url && (
                <AudioPlayer label={episode.title} src={episode.audio_url} />
              )}

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
            </div>
          </article>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedEpisode;
