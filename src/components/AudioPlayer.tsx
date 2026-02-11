import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AudioPlayerProps {
  label?: string;
  text?: string;
  voiceId?: string;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

const AudioPlayer = ({ label, text, voiceId }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const generateAudio = useCallback(async () => {
    if (!text) return;
    setLoading(true);
    try {
      const resp = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text, voiceId }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `HTTP ${resp.status}`);
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      return url;
    } catch (e) {
      console.error("TTS error:", e);
      toast.error("Failed to generate audio. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [text, voiceId]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioUrl && text) {
      const url = await generateAudio();
      if (!url) return;
      // Audio element will pick up the new src via effect
      return;
    }

    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing, audioUrl, text, generateAudio]);

  // Auto-play when audioUrl is first set
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    audio.src = audioUrl;
    audio.load();
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }, [audioUrl]);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!playing) {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }, [playing, audioUrl]);

  const seek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = progressRef.current;
      const audio = audioRef.current;
      if (!bar || !audio || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * duration;
      setCurrentTime(audio.currentTime);
    },
    [duration]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2.5">
      <button
        onClick={toggle}
        disabled={loading}
        aria-label={loading ? "Generating audio" : playing ? "Pause" : "Play"}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : playing ? (
          <Pause size={14} />
        ) : (
          <Play size={14} className="ml-0.5" />
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {label && (
          <span className="truncate text-xs font-medium text-card-foreground">
            {label}
          </span>
        )}
        <div
          ref={progressRef}
          onClick={seek}
          className="group relative h-1.5 w-full cursor-pointer rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] tabular-nums text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{duration ? formatTime(duration) : "—"}</span>
        </div>
      </div>

      <button
        onClick={restart}
        disabled={!audioUrl}
        aria-label="Restart"
        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        <RotateCcw size={14} />
      </button>

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;
