import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface AudioPlayerProps {
  label?: string;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// A short silent MP3 data URI so the player has something to load
const SILENT_MP3 =
  "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRwmHAAAAAAD/+1DEAAAHAAGf9AAAIiWkM/80AQAAAAAB//t+sGBgYP/BgYGD/4YGBg/+GBgYGBgYAAACYGBQMDAwAAAAIAAAhv/7UsQBgAeAAaf9BEAIAAAz/6CIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UMQIAAAADSAAAAAAAAGkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxBcAAADSAAAAAAAAAaQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

const AudioPlayer = ({ label }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!playing) {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }, [playing]);

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

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2.5">
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
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
        aria-label="Restart"
        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw size={14} />
      </button>

      <audio ref={audioRef} src={SILENT_MP3} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;
