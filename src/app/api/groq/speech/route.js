import { NextResponse } from "next/server";

export async function POST(req) {
  if (process.env.NEXT_PUBLIC_GROQ_TTS_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Groq voice is disabled until the Orpheus terms are accepted." },
      { status: 503 },
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Siri is not configured yet." }, { status: 503 });
  }

  try {
    const body = await req.json();
    const input = typeof body.input === "string" ? body.input.trim() : "";
    if (!input || input.length > 200) {
      return NextResponse.json(
        { error: "Speech text must be 1 to 200 characters." },
        { status: 400 },
      );
    }

    const payload = {
      model: "canopylabs/orpheus-v1-english",
      input,
      voice: "hannah",
      response_format: "wav",
    };

    const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            response.status === 429
              ? "Siri voice has reached the Groq free plan limit."
              : "Siri voice is temporarily unavailable.",
        },
        { status: response.status },
      );
    }

    return new NextResponse(response.body, {
      headers: { "Content-Type": "audio/wav", "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Siri speech request failed:", error);
    return NextResponse.json({ error: "Siri voice could not connect to Groq." }, { status: 502 });
  }
}
