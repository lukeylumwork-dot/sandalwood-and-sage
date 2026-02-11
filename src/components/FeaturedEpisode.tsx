import { useState, useRef } from "react";
import { Clock } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";

const FeaturedEpisode = () => {
  return (
    <section id="featured" className="mx-auto max-w-4xl px-5 pb-16">
      <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">
        Latest Episode
      </p>
      <div className="rounded-lg border bg-card p-6 md:p-8">
        <span className="inline-block text-xs font-medium text-primary mb-2">
          Technology
        </span>
        <h2 className="text-xl font-semibold text-card-foreground md:text-2xl">
          Should Governments Regulate AI Development?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
          <Clock size={14} /> 14 min
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          One side argues that unchecked artificial intelligence poses systemic risks demanding
          immediate oversight. The other contends that premature regulation could stifle
          innovation and concentrate advantage among less cautious states. Both draw on recent
          policy proposals and technical evidence.
        </p>
        <div className="mt-5 max-w-sm">
          <AudioPlayer
            label="Should Governments Regulate AI Development?"
            text="Should Governments Regulate AI Development? One side argues that unchecked artificial intelligence poses systemic risks demanding immediate oversight. The other contends that premature regulation could stifle innovation and concentrate advantage among less cautious states. Both draw on recent policy proposals and technical evidence."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedEpisode;
