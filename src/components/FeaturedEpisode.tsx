import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import SidesSplit from "@/components/SidesSplit";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const fallback = {
  title: "Should Governments Regulate AI Development?",
  category: "Technology",
  duration: "14 min",
  summary:
    "One side argues that unchecked artificial intelligence poses systemic risks demanding immediate oversight. The other contends that premature regulation could stifle innovation and concentrate advantage among less cautious states.",
  question:
    "Is state-level regulation of AI necessary to prevent harm, or does it risk doing more damage than it prevents?",
  forArgument:
    "Governments must regulate AI development now. Unchecked artificial intelligence poses existential risks, from autonomous weapons to mass surveillance and algorithmic discrimination.",
  againstArgument:
    "Government regulation of AI at this stage would be premature and counterproductive. Innovation moves faster than legislation, and rigid rules will lock in today's understanding of a rapidly evolving technology.",
  video_url: undefined as string | undefined,
  audio_url: undefined as string | undefined,
  cover_image_url: undefined as string | undefined,
  side_a_label: "For Regulation",
  side_b_label: "Against Regulation",
  side_a_summary:
    "Unchecked AI development poses systemic risks that only coordinated government oversight can address before the technology outpaces democratic control.",
  side_b_summary:
    "Premature regulation entrenches incumbents, stifles innovation, and cannot keep pace with a technology that moves faster than any legislature.",
};

const FeaturedEpisode = () => {
  const [episode, setEpisode] = useState(fallback);
  const [showPlayer, setShowPlayer] = useState(false);

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

  return (
    <section id="featured" className="mx-auto max-w-4xl px-5 pt-8 pb-20">
      <p className="text-xs font-medium uppercase tracking-widest text-section-label mb-6">
        Latest Episode
      </p>

      <div className="rounded-xl border bg-card overflow-hidden">
        {/* Cover image banner */}
        {episode.cover_image_url && (
          <div className="aspect-[3/1] w-full overflow-hidden">
            <img
              src={episode.cover_image_url}
              alt={episode.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="p-8 md:p-10">
          <span className="inline-block text-xs font-medium text-primary mb-2 uppercase tracking-wide">
            {episode.category}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-card-foreground leading-tight">
            {episode.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-2xl">
            {episode.summary}
          </p>

          {/* Play CTA */}
          {episode.audio_url && !showPlayer && (
            <div className="mt-6">
              <Button size="lg" onClick={() => setShowPlayer(true)} className="gap-2">
                <Play size={18} /> Listen now
              </Button>
            </div>
          )}

          {episode.audio_url && showPlayer && (
            <div className="mt-6 max-w-md">
              <AudioPlayer label={episode.title} src={episode.audio_url} />
            </div>
          )}

          {episode.video_url && (
            <div className="mt-6">
              <VideoPlayer url={episode.video_url} title={episode.title} />
            </div>
          )}

          {episode.side_a_label && episode.side_b_label && (
            <div className="mt-6">
              <SidesSplit
                sideALabel={episode.side_a_label}
                sideBLabel={episode.side_b_label}
                sideASummary={episode.side_a_summary}
                sideBSummary={episode.side_b_summary}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEpisode;