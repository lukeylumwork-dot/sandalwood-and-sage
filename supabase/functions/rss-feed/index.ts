import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type Episode = {
  id: string;
  title: string;
  category: string | null;
  summary: string | null;
  created_at: string;
  audio_url: string | null;
  cover_image_url: string | null;
};

function audioType(url: string): string {
  if (/\.m4a(\?|$)/i.test(url)) return "audio/mp4";
  if (/\.wav(\?|$)/i.test(url)) return "audio/wav";
  if (/\.ogg(\?|$)/i.test(url)) return "audio/ogg";
  return "audio/mpeg";
}

async function audioLength(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(url, { method: "HEAD", signal: controller.signal });
    const length = res.headers.get("content-length");
    return length && /^\d+$/.test(length) ? length : "0";
  } catch {
    return "0";
  } finally {
    clearTimeout(timeout);
  }
}

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

  const siteUrl = "https://sandalwoodandsage.fm";
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonError("Server configuration error", 500);
  }

  const shareBaseUrl = `${supabaseUrl}/functions/v1/share-episode`;

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey,
  );

  const { data, error } = await supabase
    .from("generated_debates")
    .select("id, title, category, summary, created_at, audio_url, cover_image_url")
    .order("created_at", { ascending: false });

  if (error) {
    return jsonError("Failed to load episodes", 500);
  }

  const itemParts = await Promise.all(
    ((data ?? []) as Episode[]).map(async (ep) => {
      const link = `${shareBaseUrl}?id=${encodeURIComponent(ep.id)}`;
      const length = ep.audio_url ? await audioLength(ep.audio_url) : "0";
      const enclosure = ep.audio_url
        ? `      <enclosure url="${escapeXml(ep.audio_url)}" length="${length}" type="${audioType(ep.audio_url)}" />`
        : "";
      const image = ep.cover_image_url
        ? `      <itunes:image href="${escapeXml(ep.cover_image_url)}" />`
        : "";

      return `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(ep.id)}</guid>
      <description>${escapeXml(ep.summary ?? "")}</description>
      <category>${escapeXml(ep.category ?? "")}</category>
      <pubDate>${new Date(ep.created_at).toUTCString()}</pubDate>
${enclosure}
${image}
      <itunes:explicit>false</itunes:explicit>
    </item>`;
    })
  );

  const items = itemParts.join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Sandalwood &amp; Sage</title>
    <link>${siteUrl}</link>
    <language>en</language>
    <description>A short-form debate podcast built for modern attention spans. Each episode tackles one question from two perspectives in under fifteen minutes.</description>
    <itunes:author>Sandalwood &amp; Sage</itunes:author>
    <itunes:summary>Two sides. One question. Fifteen minutes.</itunes:summary>
    <itunes:category text="Society &amp; Culture" />
    <itunes:explicit>false</itunes:explicit>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
});
