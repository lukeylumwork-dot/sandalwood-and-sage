import { useState, useRef } from "react";
import { Play, Pause, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturedEpisode = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    setPlaying((prev) => !prev);
    // Placeholder — no real audio source
  };

  return (
    <section id="featured" className="mx-auto max-w-4xl px-5 pb-16">
      <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">
        Latest Episode
      </p>
      <div className="rounded-lg border bg-card p-6 md:p-8">
        <span className="inline-block text-xs font-medium text-primary mb-2">
          Technology &amp; Society
        </span>
        <h2 className="text-xl font-semibold text-card-foreground md:text-2xl">
          Should Governments Regulate AI Development?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
          <Clock size={14} /> 14 min
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          One side argues that unchecked AI poses systemic risks demanding
          immediate oversight. The other contends that premature regulation
          stifles innovation and hands advantage to less cautious states.
        </p>
        <div className="mt-5">
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={togglePlay}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? "Pause" : "Play Episode"}
          </Button>
        </div>
        <audio ref={audioRef} />
      </div>
    </section>
  );
};

export default FeaturedEpisode;
