import { useState, useEffect } from "react";
import { Sparkles, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AudioPlayer, { type AudioSegment } from "@/components/AudioPlayer";
import { VOICES } from "@/lib/voices";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

interface SavedDebate {
  id: string;
  topic: string;
  title: string;
  category: string;
  question: string;
  summary: string;
  host_intro: string;
  for_argument: string;
  against_argument: string;
  key_points: string[];
  created_at: string;
}

const GENERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-debate`;

function toScript(d: SavedDebate): DebateScript {
  return {
    title: d.title,
    category: d.category,
    question: d.question,
    summary: d.summary,
    hostIntro: d.host_intro,
    forArgument: d.for_argument,
    againstArgument: d.against_argument,
    keyPoints: d.key_points,
  };
}

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
  const minutes = Math.round(totalWords / 150);
  return `${minutes} min`;
}

const DebateGenerator = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<DebateScript | null>(null);
  const [pastDebates, setPastDebates] = useState<SavedDebate[]>([]);

  useEffect(() => {
    supabase
      .from("generated_debates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setPastDebates(data as unknown as SavedDebate[]);
      });
  }, []);

  const saveDebate = async (topicText: string, s: DebateScript) => {
    const { data } = await supabase
      .from("generated_debates")
      .insert({
        topic: topicText,
        title: s.title,
        category: s.category,
        question: s.question,
        summary: s.summary,
        host_intro: s.hostIntro,
        for_argument: s.forArgument,
        against_argument: s.againstArgument,
        key_points: s.keyPoints as unknown as any,
      })
      .select()
      .single();
    if (data) setPastDebates((prev) => [data as unknown as SavedDebate, ...prev]);
  };

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
      await saveDebate(topic.trim(), data);
    } catch (e) {
      console.error("Generate error:", e);
      toast.error("Failed to generate debate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const activeScript = script;

  return (
    <section id="generate" className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-section-label mb-4">
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

        {activeScript && (
          <div className="mt-6 space-y-5 border-t pt-5">
            <div>
              <span className="inline-block text-xs font-medium text-primary mb-1">
                {activeScript.category}
              </span>
              <h3 className="text-lg font-semibold text-card-foreground leading-snug">
                {activeScript.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
                <Clock size={14} /> {estimateDuration(activeScript)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {activeScript.summary}
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Host Introduction
                </p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {activeScript.hostIntro}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  The Case For
                </p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {activeScript.forArgument}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  The Case Against
                </p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {activeScript.againstArgument}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Key Points
              </p>
              <ul className="space-y-1.5">
                {activeScript.keyPoints.map((point, idx) => (
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
            <div className="pt-2 max-w-sm">
              <AudioPlayer
                label={activeScript.title}
                segments={buildSegments(activeScript)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Past generated debates */}
      {pastDebates.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-3">
            Previously Generated
          </p>
          <div className="grid gap-3">
            {pastDebates.map((d) => (
              <button
                key={d.id}
                onClick={() => setScript(toScript(d))}
                className="flex flex-col gap-1 rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <span className="text-xs font-medium text-primary">{d.category}</span>
                  <h4 className="text-sm font-semibold text-card-foreground mt-0.5 leading-snug">
                    {d.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">
                  {new Date(d.created_at).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default DebateGenerator;
