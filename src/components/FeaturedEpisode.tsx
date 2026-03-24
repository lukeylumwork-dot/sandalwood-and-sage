import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import SidesSplit from "@/components/SidesSplit";
import { VOICES } from "@/lib/voices";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─── Hardcoded fallback ─── */
const fallback = {
  title: "Should Governments Regulate AI Development?",
  category: "Technology",
  duration: "14 min",
  summary:
    "One side argues that unchecked artificial intelligence poses systemic risks demanding immediate oversight. The other contends that premature regulation could stifle innovation and concentrate advantage among less cautious states. Both draw on recent policy proposals and technical evidence.",
  question:
    "Is state-level regulation of AI necessary to prevent harm, or does it risk doing more damage than it prevents?",
  forArgument:
    "Governments must regulate AI development now. Unchecked artificial intelligence poses existential risks, from autonomous weapons to mass surveillance and algorithmic discrimination. The EU AI Act demonstrates that proportionate regulation is possible. Without guardrails, a handful of corporations will shape society's future with no democratic accountability.",
  againstArgument:
    "Government regulation of AI at this stage would be premature and counterproductive. Innovation moves faster than legislation, and rigid rules will lock in today's understanding of a rapidly evolving technology. Heavy regulation drives talent and investment to less cautious jurisdictions. We should foster innovation first and regulate specific harms as they emerge.",
  video_url: undefined as string | undefined,
  side_a_label: "For Regulation",
  side_b_label: "Against Regulation",
  side_a_summary:
    "Unchecked AI development poses systemic risks that only coordinated government oversight can address before the technology outpaces democratic control.",
  side_b_summary:
    "Premature regulation entrenches incumbents, stifles innovation, and cannot keep pace with a technology that moves faster than any legislature.",
};

function buildSegments(ep: typeof fallback) {
  return [
    { text: `${ep.title}. ${ep.question}`, voiceId: VOICES.HOST },
    { text: `The case for. ${ep.forArgument}`, voiceId: VOICES.FOR },
    { text: `The case against. ${ep.againstArgument}`, voiceId: VOICES.AGAINST },
  ];
}

const FeaturedEpisode = () => {
  const [episode, setEpisode] = useState(fallback);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Try pinned featured first, then fall back to latest
    supabase
      .from("generated_debates")
      .select("title, category, summary, question, for_argument, against_argument, video_url, side_a_label, side_b_label, side_a_summary, side_b_summary, is_featured")
      .eq("is_featured", true)
      .limit(1)
      .then(async ({ data: pinned }) => {
        let row = pinned && pinned.length > 0 ? pinned[0] : null;

        if (!row) {
          const { data: latest } = await supabase
            .from("generated_debates")
            .select("title, category, summary, question, for_argument, against_argument, video_url, side_a_label, side_b_label, side_a_summary, side_b_summary, is_featured")
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
            side_a_label: d.side_a_label || undefined,
            side_b_label: d.side_b_label || undefined,
            side_a_summary: d.side_a_summary || undefined,
            side_b_summary: d.side_b_summary || undefined,
          });
        }
      });
  }, []);

  return (
    <section id="featured" className="mx-auto max-w-4xl px-5 pt-24 pb-24">
      <p className="text-xs font-medium uppercase tracking-widest text-section-label mb-6">
        Latest Episode
      </p>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border bg-card p-8 md:p-12 text-left transition-colors hover:border-primary/30 cursor-pointer"
      >
        <span className="inline-block text-xs font-medium text-primary mb-3">
          {episode.category}
        </span>
        <h2 className="text-xl font-semibold text-card-foreground md:text-3xl">
          {episode.title}
        </h2>
        {episode.duration && (
          <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1.5">
            <Clock size={14} /> {episode.duration}
          </p>
        )}
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {episode.summary}
        </p>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg dark bg-background border-border">
          <DialogHeader>
            <span className="text-xs font-medium text-primary mb-1 block">
              {episode.category}
            </span>
            <DialogTitle className="text-lg leading-snug text-foreground">
              {episode.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {episode.video_url && (
              <VideoPlayer url={episode.video_url} title={episode.title} />
            )}

            {episode.side_a_label && episode.side_b_label && (
              <SidesSplit
                sideALabel={episode.side_a_label}
                sideBLabel={episode.side_b_label}
                sideASummary={episode.side_a_summary}
                sideBSummary={episode.side_b_summary}
              />
            )}

            <div className="pt-2">
              <AudioPlayer label={episode.title} segments={buildSegments(episode)} />
            </div>

            <div>
              <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-1">
                The question
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {episode.question}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-1">
                Summary
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {episode.summary}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedEpisode;
