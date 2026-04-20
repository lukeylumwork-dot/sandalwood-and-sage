import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STORAGE_BUCKET = "episode-media";
const MAX_AUDIO_BYTES = 100 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/sandalwood-and-sage\.com$/,
  /^https:\/\/www\.sandalwood-and-sage\.com$/,
  /^https:\/\/sandalwoodandsage\.fm$/,
  /^https:\/\/www\.sandalwoodandsage\.fm$/,
  /^https:\/\/([a-z0-9-]+\.)*lovable\.app$/,
  /^https:\/\/([a-z0-9-]+\.)*lovableproject\.com$/,
  /^https:\/\/([a-z0-9-]+\.)*vercel\.app$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : "https://sandalwood-and-sage.com",
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

function safeExtension(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext || "bin";
}

function validateUpload(file: File, folder: string) {
  if (!["audio", "artwork"].includes(folder)) {
    throw new Error("Unsupported upload folder");
  }

  if (folder === "audio") {
    if (!file.type.startsWith("audio/")) throw new Error("Audio upload must be an audio file");
    if (file.size > MAX_AUDIO_BYTES) throw new Error("Audio file is too large");
  }

  if (folder === "artwork") {
    if (!file.type.startsWith("image/")) throw new Error("Artwork upload must be an image file");
    if (file.size > MAX_IMAGE_BYTES) throw new Error("Artwork file is too large");
  }
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

    const formData = await req.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "");

    if (!(file instanceof File)) {
      throw new Error("file is required");
    }

    validateUpload(file, folder);

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const ext = safeExtension(file.name);
    const filePath = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        contentType: file.type || undefined,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    return new Response(JSON.stringify({ publicUrl: data.publicUrl, path: filePath }), {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 400, headers: { ...headers, "Content-Type": "application/json" } },
    );
  }
});
