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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const siteUrl = "https://sandalwoodandsage.fm";

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data } = await supabase
    .from("generated_debates")
    .select("title, category, summary, created_at")
    .order("created_at", { ascending: false });

  const items = (data ?? [])
    .map((ep: any) => `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <description>${escapeXml(ep.summary ?? "")}</description>
      <category>${escapeXml(ep.category ?? "")}</category>
      <pubDate>${new Date(ep.created_at).toUTCString()}</pubDate>
      <itunes:explicit>false</itunes:explicit>
    </item>`)
    .join("\n");

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
