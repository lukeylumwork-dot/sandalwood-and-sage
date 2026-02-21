import { useState } from "react";
import { Sparkles, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AudioPlayer, { type AudioSegment } from "@/components/AudioPlayer";
import { VOICES } from "@/lib/voices";
import { toast } from "sonner";

interface DebateScript {
  title: string;
  category: string;
  question: string;
  summary: string;
  hostIntro: string;
  forArgument: string;
  againstArgument: string;
  keyPoints: string[];
}

const GENERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-debate`;

function buildSegments(script: DebateScript): AudioSegment[] {
  return [
    { text: script.hostIntro, voiceId: VOICES.HOST },
    { text: `The case for. ${script.forArgument}`, voiceId: VOICES.FOR },
    { text: `The case against. ${script.againstArgument}`, voiceId: VOICES.AGAINST },
  ];
}

function estimateDuration(script: DebateScript): string {
  const totalWords =
    script.hostIntro.split(/\s+/).length +
    script.forArgument.split(/\s+/).length +
    script.againstArgument.split(/\s+/).length;
  const minutes = Math.round(totalWords / 150); // ~150 wpm spoken
  return `${minutes} min`;
}

const DebateGenerator = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<DebateScript | null>(null);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setScript(null);
    try {
      const resp = await fetch(GENERATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (resp.status === 429) {
        toast.error("Rate limit reached. Please wait a moment and try again.");
        return;
      }
      if (resp.status === 402) {
        toast.error("AI credits exhausted. Please add credits to continue.");
        return;
      }
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `HTTP ${resp.status}`);
      }

      const data: DebateScript = await resp.json();
      setScript(data);
      toast.success("Debate script generated!");
    } catch (e) {
      console.error("Generate error:", e);
      toast.error("Failed to generate debate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="generate" className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">
        AI Debate Generator
      </p>
      <p className="text-sm text-muted-foreground mb-5 max-w-lg">
        Enter any topic and our AI will write a full debate episode script with
        opposing arguments — then listen to it with distinct voices.
      </p>

      <div className="rounded-lg border bg-card p-6 max-w-2xl">
        <div className="space-y-3">
          <div>
            <label
              htmlFor="gen-topic"
              className="text-xs font-medium text-card-foreground block mb-1"
            >
              Debate topic <span className="text-primary">*</span>
            </label>
            <Textarea
              id="gen-topic"
              placeholder="e.g. Should cities ban private car ownership?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={2}
              className="text-sm"
              disabled={loading}
            />
          </div>
          <Button onClick={generate} disabled={loading || !topic.trim()} size="sm">
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1.5" />
                Generating script…
              </>
            ) : (
              <>
                <Sparkles size={14} className="mr-1.5" />
                Generate Debate
              </>
            )}
          </Button>
        </div>

        {script && (
          <div className="mt-6 space-y-5 border-t pt-5">
            {/* Header */}
            <div>
              <span className="inline-block text-xs font-medium text-primary mb-1">
                {script.category}
              </span>
              <h3 className="text-lg font-semibold text-card-foreground leading-snug">
                {script.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
                <Clock size={14} /> {estimateDuration(script)}
              </p>
            </div>

            {/* Summary */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {script.summary}
            </p>

            {/* Script sections */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Host Introduction
                </p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {script.hostIntro}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  The Case For
                </p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {script.forArgument}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  The Case Against
                </p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {script.againstArgument}
                </p>
              </div>
            </div>

            {/* Key points */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Key Points
              </p>
              <ul className="space-y-1.5">
                {script.keyPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-muted-foreground leading-relaxed flex gap-2"
                  >
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Audio player */}
            <div className="pt-2 max-w-sm">
              <AudioPlayer
                label={script.title}
                segments={buildSegments(script)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DebateGenerator;
