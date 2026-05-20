import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;");
}

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type Episode = {
  id: string;
  title: string;
  summary: string | null;
  category: string | null;
  cover_image_url: string | null;
};

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";
  const slug = url.searchParams.get("episode") || "";
  const siteUrl = "https://sandalwood-and-sage.com";
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!id && !slug) {
    return jsonError("Episode id is required", 400);
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonError("Server configuration error", 500);
  }

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey,
  );

  const { data, error } = await supabase
    .from("generated_debates")
    .select("id, title, summary, category, cover_image_url");

  if (error) {
    return jsonError("Failed to load episodes", 500);
  }

  const episodes = (data ?? []) as Episode[];
  const ep = episodes.find((d) => (id ? d.id === id : toSlug(d.title) === slug));

  if (!ep) {
    return jsonError("Episode not found", 404);
  }

  const title = `${ep.title} — Sandalwood & Sage`;
  const description = ep.summary ?? "";
  const appUrl = `${siteUrl}/?episode=${encodeURIComponent(ep.id)}#episodes`;
  const imageMeta = ep.cover_image_url
    ? `  <meta property="og:image" content="${escapeHtml(ep.cover_image_url)}" />
  <meta name="twitter:image" content="${escapeHtml(ep.cover_image_url)}" />`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${escapeHtml(appUrl)}" />
  <meta property="og:site_name" content="Sandalwood & Sage" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
${imageMeta}
  <meta http-equiv="refresh" content="0;url=${escapeHtml(appUrl)}" />
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(appUrl)}">Sandalwood & Sage</a>...</p>
</body>
</html>`;

  return new Response(html, {
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
});
