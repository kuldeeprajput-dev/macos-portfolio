import { NextResponse } from "next/server";
import { getSiriSystemPrompt } from "@module/siri/assistant";

export async function POST(req) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Siri is not configured yet." }, { status: 503 });
  }

  try {
    const body = await req.json();
    const input = typeof body.input === "string" ? body.input.trim() : "";
    if (!input || input.length > 500) {
      return NextResponse.json({ error: "Please ask a shorter question." }, { status: 400 });
    }

    const history = Array.isArray(body.history)
      ? body.history
          .filter(
            (message) =>
              (message.role === "user" || message.role === "assistant") &&
              typeof message.content === "string" &&
              message.content.length <= 500,
          )
          .slice(-4)
      : [];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        max_completion_tokens: 180,
        reasoning_effort: "low",
        temperature: 0.35,
        stream: true,
        messages: [
          { role: "system", content: getSiriSystemPrompt(input) },
          ...history,
          { role: "user", content: input },
        ],
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            response.status === 429
              ? "Siri has reached the Groq free plan limit. Please try again shortly."
              : "Siri could not get a reply from Groq. Please try again.",
        },
        { status: response.status },
      );
    }

    return new Response(response.body, {
      headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Siri chat request failed:", error);
    return NextResponse.json({ error: "Siri could not connect to Groq." }, { status: 502 });
  }
}
