import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/sandalwoodandsage\.fm$/,
  /^https:\/\/([a-z0-9-]+\.)*lovable\.app$/,
  /^https:\/\/([a-z0-9-]+\.)*lovableproject\.com$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : "https://sandalwoodandsage.fm",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

// In-memory rate limiter: max 5 failed attempts per IP per 15 minutes.
// Note: Edge function instances are ephemeral, so this is best-effort
// throttling that slows down automated attacks but does not persist
// across cold starts.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const FAILURE_DELAY_MS = 500;
const attempts = new Map<string, { count: number; firstAt: number }>();

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || "unknown";
}

function checkRateLimit(ip: string): { blocked: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    return { blocked: false };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return {
      blocked: true,
      retryAfter: Math.ceil((WINDOW_MS - (now - entry.firstAt)) / 1000),
    };
  }
  return { blocked: false };
}

function recordFailure(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
  } else {
    entry.count += 1;
  }
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (rl.blocked) {
    return new Response(
      JSON.stringify({ error: "Too many attempts. Please try again later." }),
      {
        status: 429,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Retry-After": String(rl.retryAfter ?? 60),
        },
      },
    );
  }

  try {
    const { password } = await req.json();
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");

    if (!adminPassword) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...headers, "Content-Type": "application/json" } },
      );
    }

    if (typeof password === "string" && password === adminPassword) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...headers, "Content-Type": "application/json" } },
      );
    }

    recordFailure(ip);
    await new Promise((r) => setTimeout(r, FAILURE_DELAY_MS));
    return new Response(
      JSON.stringify({ error: "Invalid password" }),
      { status: 401, headers: { ...headers, "Content-Type": "application/json" } },
    );
  } catch {
    recordFailure(ip);
    return new Response(
      JSON.stringify({ error: "Bad request" }),
      { status: 400, headers: { ...headers, "Content-Type": "application/json" } },
    );
  }
});
