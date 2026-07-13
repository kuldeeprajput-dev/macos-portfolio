import React, { useState, useEffect, useRef } from "react";
import useWindowsStore from "@store/window";
import { Mic, X, Send, Volume2, VolumeX } from "lucide-react";

const Siri = () => {
  const { isSiriOpen, setSiriOpen, openWindow, setMusicState } = useWindowsStore();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, I'm Siri. How can I help you today?" },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const handleSendRef = useRef(handleSend);
  const audioPlaybackRef = useRef(null);

  useEffect(() => {
    handleSendRef.current = handleSend;
  });

  // Stop any playing Groq TTS audio when Siri is closed or muted
  useEffect(() => {
    if (!isSiriOpen || isMuted) {
      if (audioPlaybackRef.current) {
        try {
          audioPlaybackRef.current.pause();
          audioPlaybackRef.current.currentTime = 0;
        } catch (e) {
          console.error("Error stopping audio:", e);
        }
      }
    }
  }, [isSiriOpen, isMuted]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          handleSendRef.current(transcript);
        }
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentNode;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, isSiriOpen]);

  // Fallback local TTS helper
  const fallbackSpeakText = (text) => {
    if (isMuted || !synthRef.current) return;
    synthRef.current.cancel(); // Stop any previous speech
    const cleanText = text.replace(/[*#`_\-[\]()]/g, ""); // Strip markdown
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = synthRef.current.getVoices();
    // Prioritize English female voices
    const selectedVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("zira") ||
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("google us english") ||
            v.name.toLowerCase().includes("hazel")),
      ) ||
      voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) ||
      voices.find((v) => v.lang.startsWith("en"));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    synthRef.current.speak(utterance);
  };

  // Main Premium TTS helper (using Groq hannah voice)
  const speakText = async (text) => {
    if (isMuted) return;

    if (audioPlaybackRef.current) {
      try {
        audioPlaybackRef.current.pause();
        audioPlaybackRef.current.currentTime = 0;
      } catch (e) {
        console.error("Error stopping audio:", e);
      }
    }

    try {
      const response = await fetch("/api/groq/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text, voice: "hannah" }),
      });

      if (!response.ok) {
        throw new Error(`Groq TTS API error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioPlaybackRef.current = audio;

      await audio.play();
    } catch (err) {
      console.error("Groq TTS failed, falling back to Web Speech API:", err);
      fallbackSpeakText(text);
    }
  };

  // Perform client-side portfolio commands based on speech/text
  const parseSystemCommands = (text) => {
    const query = text.toLowerCase();

    if (query.includes("open finder")) {
      openWindow("finder");
      return "Opening Finder.";
    }
    if (query.includes("open weather")) {
      openWindow("weather");
      return "Opening Weather.";
    }
    if (
      query.includes("open safari") ||
      query.includes("open internet") ||
      query.includes("open browser")
    ) {
      openWindow("safari");
      return "Opening Safari.";
    }
    if (
      query.includes("open terminal") ||
      query.includes("open bash") ||
      query.includes("open shell")
    ) {
      openWindow("terminal");
      return "Opening Terminal.";
    }
    if (query.includes("open resume") || query.includes("view resume")) {
      openWindow("resume");
      return "Opening Resume.";
    }
    if (query.includes("open music") || query.includes("open jamendo")) {
      openWindow("music");
      return "Opening Music app.";
    }
    if (
      query.includes("play music") ||
      query.includes("resume song") ||
      query.includes("play song")
    ) {
      setMusicState({ isPlaying: true });
      return "Playing music.";
    }
    if (
      query.includes("pause music") ||
      query.includes("stop music") ||
      query.includes("pause song")
    ) {
      setMusicState({ isPlaying: false });
      return "Pausing playback.";
    }
    if (query.includes("open chrome")) {
      openWindow("safari");
      return "Google Chrome is not installed, opening Safari browser instead.";
    }
    if (
      query.includes("open code") ||
      query.includes("open vscode") ||
      query.includes("open editor")
    ) {
      openWindow("vscode");
      return "Opening Visual Studio Code.";
    }
    if (query.includes("open calculator")) {
      openWindow("calculator");
      return "Opening Calculator.";
    }
    if (query.includes("open map")) {
      openWindow("map");
      return "Opening Maps.";
    }
    if (query.includes("open messages")) {
      openWindow("messages");
      return "Opening Messages.";
    }
    if (query.includes("open notes")) {
      openWindow("notes");
      return "Opening Notes.";
    }
    if (query.includes("open launchpad")) {
      openWindow("launchpad");
      return "Opening Launchpad.";
    }
    if (
      query.includes("close siri") ||
      query.includes("bye siri") ||
      query.includes("goodbye siri")
    ) {
      setTimeout(() => setSiriOpen(false), 1000);
      return "Goodbye!";
    }

    return null;
  };

  async function handleSend(textToSend) {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInputVal("");
    setIsLoading(true);

    // Check system action command
    const systemResponse = parseSystemCommands(text);
    if (systemResponse) {
      setIsLoading(false);
      setMessages((prev) => [...prev, { role: "assistant", content: systemResponse }]);
      speakText(systemResponse);
      return;
    }

    // Call Groq API via our backend
    try {
      const response = await fetch("/api/groq/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are Siri, a helpful voice assistant on Kuldeep Rajput's macOS Portfolio.
Rules:
- Respond strictly in English. Never use Hinglish, Hindi, Urdu, or any other languages.
- Be witty, conversational, concise, and limit responses to 3 sentences.
- Guide users to apps: Music, Weather, Safari, Finder, VSCode, Terminal, Resume.
- Kuldeep's Projects Context:
  1. Newtube: A feature-rich YouTube clone built with React.
  2. Snsta: An Instagram media downloader tool for downloading posts, reels, etc.
  3. Resume ATS Scanner: An ATS (Applicant Tracking System) parser that analyzes and scores resumes.
  4. Docs Editor: A collaborative real-time rich-text document editor.
  Explain these projects briefly and enthusiastically if the user asks about them.`,
            },
            ...messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: text },
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      const reply =
        data.choices?.[0]?.message?.content || "Sorry, I couldn't process that request.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      speakText(reply);
    } catch (err) {
      console.error("Groq API Call failed:", err);
      const errMsg = "Sorry, I am having trouble connecting to the network right now.";
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
      speakText(errMsg);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (synthRef.current) synthRef.current.cancel(); // Stop talking
      recognitionRef.current.start();
    }
  };

  if (!isSiriOpen) return null;

  return (
    <div className="siri-container">
      {/* Header */}
      <div className="siri-header">
        <div className="siri-title">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Siri</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute Siri" : "Mute Siri"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <button className="siri-close" onClick={() => setSiriOpen(false)}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body / Dialog */}
      <div className="siri-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`siri-chat-bubble ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="siri-chat-bubble assistant flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Siri Sphere */}
      <div className="siri-footer">
        <div className="siri-orb-wrapper" onClick={toggleListening}>
          <div className="siri-orb-glow" />
          <div className={`siri-orb ${isListening ? "siri-orb-listening" : ""}`} />
          <Mic size={18} className="absolute text-white pointer-events-none" />
        </div>

        <form
          className="siri-input-wrapper"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="siri-input"
            placeholder={isListening ? "Listening..." : "Ask Siri anything..."}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isListening}
          />
          <button type="submit" className="siri-send-btn" disabled={isListening}>
            <Send size={12} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Siri;
