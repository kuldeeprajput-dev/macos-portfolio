import { NextResponse } from "next/server";

export async function POST(req) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Siri is not configured yet." }, { status: 503 });
  }

  try {
    const incoming = await req.formData();
    const file = incoming.get("file");
    if (!(file instanceof File) || !file.size || file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "The recording is empty or too large." }, { status: 400 });
    }

    const formData = new FormData();
    formData.append("file", file);
    // Translation keeps English commands usable while also accepting spoken Hindi.
    formData.append("model", "whisper-large-v3");
    formData.append("response_format", "verbose_json");

    const response = await fetch("https://api.groq.com/openai/v1/audio/translations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            response.status === 429
              ? "Siri has reached the transcription limit. Please try again shortly."
              : "Siri could not understand that recording. Please try again.",
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    const text = typeof data.text === "string" ? data.text.trim() : "";
    const detectedLanguage = String(data.language || "").toLowerCase();
    const unexpectedLanguage =
      detectedLanguage && !/^(en|english|hi|hindi|ur|urdu)$/u.test(detectedLanguage);
    const onlySilence =
      Array.isArray(data.segments) &&
      data.segments.length > 0 &&
      data.segments.every((segment) => segment.no_speech_prob >= 0.8);

    if (!text || onlySilence || unexpectedLanguage || /[\u0400-\u052f]/u.test(text)) {
      return NextResponse.json(
        {
          error:
            "I couldn't clearly hear English or Hindi. Please speak again near the microphone.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Siri transcription failed:", error);
    return NextResponse.json(
      { error: "Siri could not transcribe the recording." },
      { status: 502 },
    );
  }
}
