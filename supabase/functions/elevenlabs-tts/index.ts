import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Segment {
  text: string;
  voiceId?: string;
}

const DEFAULT_VOICE = "JBFqnCBsd6RMkjVDRZzb"; // George

async function hashKey(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function generateSegment(
  text: string,
  voiceId: string,
  apiKey: string
): Promise<ArrayBuffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("ElevenLabs error:", response.status, errorText);
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return response.arrayBuffer();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ELEVENLABS_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build segments
    let segments: Segment[];
    if (body.segments && Array.isArray(body.segments)) {
      segments = body.segments;
    } else if (body.text) {
      segments = [{ text: body.text, voiceId: body.voiceId }];
    } else {
      return new Response(
        JSON.stringify({ error: "Missing 'text' or 'segments' field" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate cache key from segments content
    const cacheInput = JSON.stringify(
      segments.map((s) => ({ text: s.text, voiceId: s.voiceId || DEFAULT_VOICE }))
    );
    const cacheKey = await hashKey(cacheInput);
    const cachePath = `${cacheKey}.mp3`;

    // Check cache
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: existing } = await supabase.storage
      .from("audio-cache")
      .createSignedUrl(cachePath, 86400);

    if (existing?.signedUrl) {
      // Serve from cache - redirect to the signed URL
      const cached = await fetch(existing.signedUrl);
      if (cached.ok) {
        const audioData = await cached.arrayBuffer();
        return new Response(audioData, {
          headers: {
            ...corsHeaders,
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
            "X-Cache": "HIT",
          },
        });
      }
    }

    // Generate audio for each segment
    const audioBuffers: ArrayBuffer[] = [];
    for (const seg of segments) {
      if (!seg.text || typeof seg.text !== "string") continue;
      const buf = await generateSegment(
        seg.text,
        seg.voiceId || DEFAULT_VOICE,
        ELEVENLABS_API_KEY
      );
      audioBuffers.push(buf);
    }

    if (audioBuffers.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid segments to generate" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Concatenate MP3 buffers
    const totalLength = audioBuffers.reduce((sum, b) => sum + b.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of audioBuffers) {
      combined.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }

    // Store in cache (fire-and-forget)
    supabase.storage
      .from("audio-cache")
      .upload(cachePath, combined.buffer, {
        contentType: "audio/mpeg",
        upsert: false,
      })
      .then(({ error }) => {
        if (error) console.log("Cache store skipped:", error.message);
        else console.log("Cached audio:", cachePath);
      });

    return new Response(combined.buffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "X-Cache": "MISS",
      },
    });
  } catch (e) {
    console.error("TTS error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
