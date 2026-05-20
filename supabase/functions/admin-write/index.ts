import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/sandalwood-and-sage\.com$/,
  /^https:\/\/www\.sandalwood-and-sage\.com$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : "",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-admin-password",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

type EpisodePayload = {
  title?: unknown;
  topic?: unknown;
  category?: unknown;
  question?: unknown;
  summary?: unknown;
  host_intro?: unknown;
  for_argument?: unknown;
  against_argument?: unknown;
  video_url?: unknown;
  audio_url?: unknown;
  cover_image_url?: unknown;
  side_a_label?: unknown;
  side_b_label?: unknown;
  side_a_summary?: unknown;
  side_b_summary?: unknown;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CATEGORIES = new Set(["Current Affairs", "Society", "Politics", "Sport"]);

function requireUuid(id: unknown, operation: string): string {
  if (typeof id !== "string" || !UUID_RE.test(id)) {
    throw new Error(`valid id required for ${operation}`);
  }
  return id;
}

function optionalString(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") throw new Error("Invalid optional string field");
  return value.trim() || null;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

function sanitizePayload(payload: EpisodePayload, partial = false) {
  if (!payload || typeof payload !== "object") {
    throw new Error("payload is required");
  }

  const sanitized: Record<string, string | null> = {};

  const requiredFields = [
    "title",
    "topic",
    "category",
    "question",
    "summary",
    "host_intro",
    "for_argument",
    "against_argument",
  ] as const;

  for (const field of requiredFields) {
    if (partial && payload[field] === undefined) continue;
    sanitized[field] = requiredString(payload[field], field);
  }

  if (sanitized.category && !CATEGORIES.has(sanitized.category)) {
    throw new Error("Invalid category");
  }

  for (const field of [
    "video_url",
    "audio_url",
    "cover_image_url",
    "side_a_label",
    "side_b_label",
    "side_a_summary",
    "side_b_summary",
  ] as const) {
    if (partial && payload[field] === undefined) continue;
    sanitized[field] = optionalString(payload[field]);
  }

  return sanitized;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  try {
    let adminPassword: string;
    let supabaseUrl: string;
    let serviceRoleKey: string;
    try {
      adminPassword = requireEnv("ADMIN_PASSWORD");
      supabaseUrl = requireEnv("SUPABASE_URL");
      serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
    } catch {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const providedPassword = req.headers.get("x-admin-password");
    if (!providedPassword || providedPassword !== adminPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { operation, id, payload } = await req.json();

    let result;
    switch (operation) {
      case "insert":
        result = await supabaseAdmin.from("generated_debates").insert(sanitizePayload(payload));
        break;
      case "update":
        result = await supabaseAdmin
          .from("generated_debates")
          .update(sanitizePayload(payload, true))
          .eq("id", requireUuid(id, "update"));
        break;
      case "delete":
        result = await supabaseAdmin
          .from("generated_debates")
          .delete()
          .eq("id", requireUuid(id, "delete"));
        break;
      case "update-featured": {
        const episodeId = requireUuid(id, "update-featured");
        const isFeatured = Boolean(payload?.is_featured);
        if (isFeatured) {
          await supabaseAdmin
            .from("generated_debates")
            .update({ is_featured: false })
            .eq("is_featured", true);
        }
        result = await supabaseAdmin
          .from("generated_debates")
          .update({ is_featured: isFeatured })
          .eq("id", episodeId);
        break;
      }
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    if (result?.error) throw result.error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...headers, "Content-Type": "application/json" } },
    );
  }
});
