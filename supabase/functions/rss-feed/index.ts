const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Episode {
  title: string;
  category: string;
  duration: string;
  description: string;
  pubDate: string;
}

const episodes: Episode[] = [
  {
    title: "Should Governments Regulate AI Development?",
    category: "Technology",
    duration: "14:00",
    description:
      "One side argues that unchecked artificial intelligence poses systemic risks demanding immediate oversight. The other contends that premature regulation could stifle innovation.",
    pubDate: "Mon, 03 Mar 2026 08:00:00 GMT",
  },
  {
    title: "Is Universal Basic Income Inevitable?",
    category: "Money",
    duration: "13:00",
    description:
      "Exploring whether automation demands a new social contract. A structured look at whether rising automation makes universal basic income unavoidable.",
    pubDate: "Mon, 24 Feb 2026 08:00:00 GMT",
  },
  {
    title: "Should Social Media Have Age Limits?",
    category: "Society",
    duration: "15:00",
    description:
      "Balancing youth protection with digital participation rights. Examining proposals to impose minimum age requirements on social media platforms.",
    pubDate: "Mon, 17 Feb 2026 08:00:00 GMT",
  },
  {
    title: "Can Nuclear Energy Solve the Climate Crisis?",
    category: "Technology",
    duration: "14:00",
    description:
      "Assessing nuclear power's role in a net-zero transition. A balanced look at whether nuclear should feature prominently in climate strategy.",
    pubDate: "Mon, 10 Feb 2026 08:00:00 GMT",
  },
  {
    title: "Should Universities Abolish Legacy Admissions?",
    category: "Society",
    duration: "12:00",
    description:
      "Merit versus tradition in higher education access. Examining whether preferential treatment for alumni children is compatible with meritocracy.",
    pubDate: "Mon, 03 Feb 2026 08:00:00 GMT",
  },
  {
    title: "Is Remote Work Better for Productivity?",
    category: "Work",
    duration: "13:00",
    description:
      "Examining the evidence on flexibility, output, and collaboration. Weighing measured productivity gains against concerns about culture and innovation.",
    pubDate: "Mon, 27 Jan 2026 08:00:00 GMT",
  },
  {
    title: "Should Professional Sport Embrace AI Officiating?",
    category: "Sport",
    duration: "14:00",
    description:
      "Testing whether algorithms can replace human judgement on the pitch. Exploring the growing use of technology in sports officiating.",
    pubDate: "Mon, 20 Jan 2026 08:00:00 GMT",
  },
  {
    title: "Should Voting Be Compulsory?",
    category: "Politics",
    duration: "13:00",
    description:
      "Debating whether democratic participation should be a duty, not a choice. A structured exchange on mandatory voting.",
    pubDate: "Mon, 13 Jan 2026 08:00:00 GMT",
  },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function durationToSeconds(dur: string): number {
  const [m, s] = dur.split(":").map(Number);
  return m * 60 + (s || 0);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const siteUrl = "https://sandalwoodandsage.fm";

  const items = episodes
    .map(
      (ep) => `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <description>${escapeXml(ep.description)}</description>
      <category>${escapeXml(ep.category)}</category>
      <pubDate>${ep.pubDate}</pubDate>
      <itunes:duration>${durationToSeconds(ep.duration)}</itunes:duration>
      <itunes:explicit>false</itunes:explicit>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Split Decision</title>
    <link>${siteUrl}</link>
    <language>en</language>
    <description>Two Sides. One Question. Short, structured debates grounded in evidence — not opinion. Each episode tackles one question from two perspectives in around fifteen minutes.</description>
    <itunes:author>Split Decision</itunes:author>
    <itunes:summary>Short, structured debates grounded in evidence — not opinion.</itunes:summary>
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
