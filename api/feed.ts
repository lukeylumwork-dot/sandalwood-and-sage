export const config = { runtime: "edge" };

export default async function handler(): Promise<Response> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    return new Response("RSS feed not configured", { status: 500 });
  }

  const upstream = await fetch(`${supabaseUrl}/functions/v1/rss-feed`);
  const body = await upstream.arrayBuffer();

  return new Response(body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ??
        "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}
