import { Clock } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import SidesSplit from "@/components/SidesSplit";
import { VOICES } from "@/lib/voices";

const featuredSegments = [
  {
    text: "Should Governments Regulate AI Development? Is state-level regulation of AI necessary to prevent harm, or does it risk doing more damage than it prevents?",
    voiceId: VOICES.HOST,
  },
  {
    text: "The case for. Governments must regulate AI development now. Unchecked artificial intelligence poses existential risks, from autonomous weapons to mass surveillance and algorithmic discrimination. The EU AI Act demonstrates that proportionate regulation is possible. Without guardrails, a handful of corporations will shape society's future with no democratic accountability.",
    voiceId: VOICES.FOR,
  },
  {
    text: "The case against. Government regulation of AI at this stage would be premature and counterproductive. Innovation moves faster than legislation, and rigid rules will lock in today's understanding of a rapidly evolving technology. Heavy regulation drives talent and investment to less cautious jurisdictions. We should foster innovation first and regulate specific harms as they emerge.",
    voiceId: VOICES.AGAINST,
  },
];

const featuredVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
const featuredSideA = {
  label: "For Regulation",
  summary: "Unchecked AI development poses systemic risks that only coordinated government oversight can address before the technology outpaces democratic control.",
};
const featuredSideB = {
  label: "Against Regulation",
  summary: "Premature regulation entrenches incumbents, stifles innovation, and cannot keep pace with a technology that moves faster than any legislature.",
};

const FeaturedEpisode = () => {
  return (
    <section id="featured" className="mx-auto max-w-4xl px-5 pt-24 pb-24">
      <p className="text-xs font-medium uppercase tracking-widest text-section-label mb-6">
        Latest Episode
      </p>
      <div className="rounded-lg border bg-card p-8 md:p-12">
        <span className="inline-block text-xs font-medium text-primary mb-3">
          Technology
        </span>
        <h2 className="text-xl font-semibold text-card-foreground md:text-3xl">
          Should Governments Regulate AI Development?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1.5">
          <Clock size={14} /> 14 min
        </p>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          One side argues that unchecked artificial intelligence poses systemic risks demanding
          immediate oversight. The other contends that premature regulation could stifle
          innovation and concentrate advantage among less cautious states. Both draw on recent
          policy proposals and technical evidence.
        </p>
        {/* Video player (primary) */}
        {featuredVideoUrl && (
          <div className="mt-5">
            <VideoPlayer
              url={featuredVideoUrl}
              title="Should Governments Regulate AI Development?"
            />
          </div>
        )}

        {/* Pro | Con split */}
        <div className="mt-4">
          <SidesSplit
            sideALabel={featuredSideA.label}
            sideBLabel={featuredSideB.label}
            sideASummary={featuredSideA.summary}
            sideBSummary={featuredSideB.summary}
          />
        </div>

        {/* Audio fallback */}
        <div className="mt-4 max-w-sm">
          <AudioPlayer
            label="Should Governments Regulate AI Development?"
            segments={featuredSegments}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedEpisode;
