import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a debate script writer for a podcast called "Split Decision". Each episode presents two sides of a controversial question in a structured, evidence-based format.

Given a debate topic, generate a full-length episode script with three distinct sections:

1. HOST INTRODUCTION: A 2-3 paragraph introduction by the host that frames the question, provides context, and previews what each side will argue. Should be engaging and neutral.

2. THE CASE FOR: A 4-6 paragraph argument in favour of the proposition. Should be well-reasoned, cite specific examples, statistics, or historical precedents, and build a compelling case. Write in first person plural ("we argue that...").

3. THE CASE AGAINST: A 4-6 paragraph counterargument of similar length and rigour. Should directly address points made in the "for" case and present equally strong evidence. Write in first person plural.

Guidelines:
- Total script should be 1500-2500 words
- Use concrete examples, data points, and real-world references
- Both sides should be intellectually honest and compelling
- Avoid straw-manning either position
- Write in a conversational but intelligent tone suitable for audio`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let body: { topic?: string };
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const { topic } = body;
    if (!topic || typeof topic !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing 'topic' field" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Generate a full debate episode script for the topic: "${topic}"`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_debate_script",
              description: "Return a structured debate script with host intro, for argument, and against argument.",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "A compelling episode title phrased as a question",
                  },
                  category: {
                    type: "string",
                    enum: ["Tech", "Society", "Money", "Work", "Sport", "Politics", "Science", "Culture"],
                    description: "The episode category",
                  },
                  question: {
                    type: "string",
                    description: "The central debate question (1-2 sentences)",
                  },
                  summary: {
                    type: "string",
                    description: "A neutral 2-3 sentence summary of the episode",
                  },
                  hostIntro: {
                    type: "string",
                    description: "The host's introduction (2-3 paragraphs, 200-400 words)",
                  },
                  forArgument: {
                    type: "string",
                    description: "The case FOR the proposition (4-6 paragraphs, 500-800 words)",
                  },
                  againstArgument: {
                    type: "string",
                    description: "The case AGAINST the proposition (4-6 paragraphs, 500-800 words)",
                  },
                  keyPoints: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 key takeaway points from the debate",
                  },
                },
                required: ["title", "category", "question", "summary", "hostIntro", "forArgument", "againstArgument", "keyPoints"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_debate_script" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "Failed to generate debate script" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "AI did not return structured output" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const script = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(script), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-debate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
