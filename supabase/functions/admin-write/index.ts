import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://sandalwoodandsage.fm",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : "https://sandalwoodandsage.fm",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-admin-password",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!adminPassword) {
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

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { operation, id, payload } = await req.json();

    let result;
    switch (operation) {
      case "insert":
        result = await supabaseAdmin.from("generated_debates").insert(payload);
        break;
      case "update":
        if (!id) throw new Error("id required for update");
        result = await supabaseAdmin
          .from("generated_debates")
          .update(payload)
          .eq("id", id);
        break;
      case "delete":
        if (!id) throw new Error("id required for delete");
        result = await supabaseAdmin
          .from("generated_debates")
          .delete()
          .eq("id", id);
        break;
      case "update-featured": {
        if (!id) throw new Error("id required for update-featured");
        const isFeatured = payload?.is_featured ?? false;
        if (isFeatured) {
          await supabaseAdmin
            .from("generated_debates")
            .update({ is_featured: false })
            .eq("is_featured", true);
        }
        result = await supabaseAdmin
          .from("generated_debates")
          .update({ is_featured: isFeatured })
          .eq("id", id);
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
