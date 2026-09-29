export const isGroqVoiceEnabled = process.env.NEXT_PUBLIC_GROQ_TTS_ENABLED === "true";

export const readSiriApiError = async (response) => {
  const data = await response.json().catch(() => ({}));
  return new Error(data.error || `Siri request failed (${response.status}).`);
};

export const getRecordingFilename = (type) => {
  if (type.includes("mp4")) return "recording.mp4";
  if (type.includes("ogg")) return "recording.ogg";
  return "recording.webm";
};

export const splitSiriSpeech = (text) => {
  const chunks = [];
  let remaining = text.replace(/\s+/gu, " ").trim();

  while (remaining.length > 200) {
    const sentenceEnd = Math.max(
      remaining.lastIndexOf(". ", 199),
      remaining.lastIndexOf("? ", 199),
      remaining.lastIndexOf("! ", 199),
    );
    const wordEnd = remaining.lastIndexOf(" ", 200);
    const end = sentenceEnd >= 80 ? sentenceEnd + 1 : wordEnd >= 80 ? wordEnd : 200;
    chunks.push(remaining.slice(0, end).trim());
    remaining = remaining.slice(end).trim();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
};

export const playGroqSpeech = async (text, signal, onAudioStart, onAudioFinish) => {
  const chunks = splitSiriSpeech(text);
  const requestChunk = async (index) => {
    try {
      const response = await fetch("/api/groq/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: chunks[index] }),
        signal,
      });
      if (!response.ok) throw await readSiriApiError(response);
      return { blob: await response.blob() };
    } catch (error) {
      return { error };
    }
  };
  let pendingChunk = chunks.length ? requestChunk(0) : null;

  for (let index = 0; index < chunks.length; index += 1) {
    let audio;
    let audioUrl;

    try {
      const { blob: audioBlob, error } = await pendingChunk;
      if (error) throw error;
      if (signal.aborted) throw new DOMException("Speech interrupted", "AbortError");
      pendingChunk = index + 1 < chunks.length ? requestChunk(index + 1) : null;

      audioUrl = URL.createObjectURL(audioBlob);
      audio = new Audio(audioUrl);
      onAudioStart(audio, audioUrl);

      await new Promise((resolve, reject) => {
        let settled = false;
        const finish = (error) => {
          if (settled) return;
          settled = true;
          signal.removeEventListener("abort", abort);
          audio.onended = null;
          audio.onerror = null;
          if (error) reject(error);
          else resolve();
        };
        const abort = () => {
          audio.pause();
          finish(new DOMException("Speech interrupted", "AbortError"));
        };

        signal.addEventListener("abort", abort, { once: true });
        audio.onended = () => finish();
        audio.onerror = () => finish(new Error("Audio playback failed."));
        if (signal.aborted) abort();
        else audio.play().catch(finish);
      });
    } catch (error) {
      if (!signal.aborted) error.remainingText = chunks.slice(index).join(" ");
      throw error;
    } finally {
      if (audio) {
        audio.pause();
        onAudioFinish(audio);
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    }
  }
};

export const readSiriReply = async (response, onText) => {
  if (!response.body) throw new Error("Siri did not return a reply.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = "";
  let reply = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    pending += decoder.decode(value, { stream: true });

    const lines = pending.split("\n");
    pending = lines.pop() || "";
    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
      const chunk = JSON.parse(line.slice(6));
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        reply += delta;
        onText(reply);
      }
    }
  }

  return reply.trim();
};
