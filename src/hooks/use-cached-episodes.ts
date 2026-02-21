import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Episode } from "@/components/EpisodesList";
import { VOICES } from "@/lib/voices";

async function hashKey(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function buildCacheInput(ep: Episode): string {
  const segments = [
    { text: `${ep.title}. ${ep.question}`, voiceId: VOICES.HOST },
    { text: `The case for. ${ep.forArgument}`, voiceId: VOICES.FOR },
    { text: `The case against. ${ep.againstArgument}`, voiceId: VOICES.AGAINST },
  ];
  return JSON.stringify(segments.map((s) => ({ text: s.text, voiceId: s.voiceId })));
}

export function useCachedEpisodes(episodes: Episode[]) {
  const [cachedSet, setCachedSet] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (episodes.length === 0) return;

    (async () => {
      // List all cached files
      const { data: files } = await supabase.storage
        .from("audio-cache")
        .list("", { limit: 500 });

      if (!files || files.length === 0) return;

      const fileNames = new Set(files.map((f) => f.name));

      const indices = new Set<number>();
      for (let i = 0; i < episodes.length; i++) {
        const key = await hashKey(buildCacheInput(episodes[i]));
        if (fileNames.has(`${key}.mp3`)) {
          indices.add(i);
        }
      }
      setCachedSet(indices);
    })();
  }, [episodes]);

  return cachedSet;
}
