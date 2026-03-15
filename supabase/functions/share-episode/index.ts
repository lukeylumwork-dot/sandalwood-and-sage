const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const episodes: Record<string, { title: string; description: string; category: string }> = {
  "should-governments-regulate-ai-development": {
    title: "Should Governments Regulate AI Development?",
    description: "Weighing innovation against systemic risk in the age of machine intelligence.",
    category: "Technology",
  },
  "is-universal-basic-income-inevitable": {
    title: "Is Universal Basic Income Inevitable?",
    description: "Exploring whether automation demands a new social contract.",
    category: "Money",
  },
  "should-social-media-have-age-limits": {
    title: "Should Social Media Have Age Limits?",
    description: "Balancing youth protection with digital participation rights.",
    category: "Society",
  },
  "can-nuclear-energy-solve-the-climate-crisis": {
    title: "Can Nuclear Energy Solve the Climate Crisis?",
    description: "Assessing nuclear power's role in a net-zero transition.",
    category: "Technology",
  },
  "should-universities-abolish-legacy-admissions": {
    title: "Should Universities Abolish Legacy Admissions?",
    description: "Merit versus tradition in higher education access.",
    category: "Society",
  },
  "is-remote-work-better-for-productivity": {
    title: "Is Remote Work Better for Productivity?",
    description: "Examining the evidence on flexibility, output, and collaboration.",
    category: "Work",
  },
  "should-professional-sport-embrace-ai-officiating": {
    title: "Should Professional Sport Embrace AI Officiating?",
    description: "Testing whether algorithms can replace human judgement on the pitch.",
    category: "Sport",
  },
  "should-voting-be-compulsory": {
    title: "Should Voting Be Compulsory?",
    description: "Debating whether democratic participation should be a duty, not a choice.",
    category: "Politics",
  },
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get("episode") || "";
  const siteUrl = "https://sandalwoodandsage.fm";

  const ep = episodes[slug];
  if (!ep) {
    return new Response(JSON.stringify({ error: "Episode not found", slugs: Object.keys(episodes) }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const title = `${ep.title} — Split Decision`;
  const description = ep.description;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${siteUrl}/?episode=${escapeHtml(slug)}" />
  <meta property="og:site_name" content="Split Decision" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta http-equiv="refresh" content="0;url=${siteUrl}/#episodes" />
</head>
<body>
  <p>Redirecting to <a href="${siteUrl}/#episodes">Split Decision</a>…</p>
</body>
</html>`;

  return new Response(html, {
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
});
