import React, { useState, useEffect, useRef } from "react";
import { executeSiriCommand, getSiriSystemPrompt } from "@module/siri/assistant";
import useLocationStore from "@store/location";
import useWindowsStore from "@store/window";
import { Play, Pause, SkipForward, SkipBack, Mic, Send, X } from "lucide-react";

const MobileNotch = () => {
  const {
    music,
    setMusicState,
    isSiriOpen,
    setSiriOpen,
    openWindow,
    closeWindow,
    closeAllWindows,
    minimizeWindow,
    unminimizeWindow,
    focusWindow,
    toggleMaximize,
    updateSystemSetting,
    systemSettings,
    setAboutPortfolioOpen,
  } = useWindowsStore();
  const { setActiveLocation } = useLocationStore();
  const [notchState, setNotchState] = useState("IDLE"); // IDLE, ACTIVE_MUSIC, EXPANDED_MUSIC, SIRI

  // Siri states – matching desktop implementation
  const [userQuestion, setUserQuestion] = useState("");
  const [siriResponse, setSiriResponse] = useState("Hi, I'm Siri. How can I help you?");
  const [siriStatus, setSiriStatus] = useState("IDLE"); // IDLE, LISTENING, TRANSCRIBING, THINKING, SPEAKING
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, I'm Siri. How can I help you?" },
  ]);
  const [inputVal, setInputVal] = useState("");

  // Refs – same as desktop Notch.jsx
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
  const utteranceRef = useRef(null);
  const audioPlaybackRef = useRef(typeof window !== "undefined" ? new Audio() : null);
  const messagesEndRef = useRef(null);

  const isSiriOpenRef = useRef(isSiriOpen);
  useEffect(() => {
    isSiriOpenRef.current = isSiriOpen;
  }, [isSiriOpen]);

  // Audio elements tracking states
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (sec) => {
    if (isNaN(sec) || sec === Infinity) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const updateTime = () => {
      const audioEl = document.querySelector("audio");
      if (audioEl) {
        setCurrentTime(audioEl.currentTime || 0);
        setDuration(audioEl.duration || 0);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 500);
    return () => clearInterval(interval);
  }, [notchState]);

  // Sync music state to notch state
  useEffect(() => {
    if (isSiriOpen) {
      setNotchState("SIRI");
    } else if (music.isPlaying) {
      if (notchState !== "EXPANDED_MUSIC") {
        setNotchState("ACTIVE_MUSIC");
      }
    } else {
      if (notchState !== "SIRI") {
        setNotchState("IDLE");
      }
    }
  }, [music.isPlaying, isSiriOpen]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSiriOpen]);

  // ─── Audio helpers (same as desktop) ───

  const stopAudio = () => {
    if (audioPlaybackRef.current) {
      try {
        audioPlaybackRef.current.pause();
        audioPlaybackRef.current.currentTime = 0;
      } catch (e) {
        console.error("Error stopping audio:", e);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    stopAudio();
    setIsListening(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    const synth = synthRef.current;
    return () => {
      stopRecording();
      if (synth) synth.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Recording (MediaRecorder → Whisper transcription, same as desktop) ───

  const startRecording = async () => {
    try {
      stopAudio();
      if (synthRef.current) synthRef.current.cancel();
      setIsSpeaking(false);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Check if Siri was closed while waiting for permission
      if (!isSiriOpenRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const recorderMimeType = MediaRecorder.isTypeSupported?.("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported?.("audio/webm")
          ? "audio/webm"
          : "";
      const mediaRecorder = new MediaRecorder(
        stream,
        recorderMimeType ? { mimeType: recorderMimeType } : undefined,
      );
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (!isSiriOpenRef.current) return;
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorderMimeType || "audio/webm",
        });
        if (audioBlob.size > 450) {
          transcribeAudio(audioBlob);
        } else {
          setIsListening(false);
          setSiriStatus("IDLE");
        }
      };

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const listenStartedAt = new Date().getTime();
      let heardSpeech = false;
      let lastVoiceTime = listenStartedAt;
      setIsListening(true);
      setSiriStatus("LISTENING");

      const checkSilence = () => {
        if (!mediaRecorderRef.current || mediaRecorder.state !== "recording") return;

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const averageVolume = sum / bufferLength;
        const now = new Date().getTime();

        if (averageVolume > 10) {
          heardSpeech = true;
          lastVoiceTime = now;
        }

        const initialGraceElapsed = now - listenStartedAt > 5500;
        const userStoppedSpeaking = heardSpeech && now - lastVoiceTime > 1200;
        const maxListenReached = now - listenStartedAt > 12000;

        if ((initialGraceElapsed && !heardSpeech) || userStoppedSpeaking || maxListenReached) {
          stopRecording();
        } else {
          requestAnimationFrame(checkSilence);
        }
      };

      mediaRecorder.start();
      requestAnimationFrame(checkSilence);
    } catch {
      console.error("Error accessing microphone");
      setIsListening(false);
      setUserQuestion("");
      setSiriResponse(
        "Microphone access denied. Please allow microphone permission in your browser settings.",
      );
      setSiriStatus("IDLE");
    }
  };

  // ─── Whisper transcription (same as desktop) ───

  const transcribeAudio = async (audioBlob) => {
    try {
      if (!isSiriOpenRef.current) return;

      setSiriStatus("TRANSCRIBING");

      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const response = await fetch("/api/groq/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.statusText}`);
      }

      const data = await response.json();
      const transcript = data.text;

      if (!isSiriOpenRef.current) return;

      if (transcript && transcript.trim()) {
        setUserQuestion(transcript);
        setSiriStatus("THINKING");
        handleSendToGroq(transcript);
      } else {
        setSiriStatus("IDLE");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setSiriStatus("IDLE");
    }
  };

  // ─── Siri launch sound ───

  const playSiriLaunchSound = () => {
    return new Promise((resolve) => {
      const sound = new Audio("/sound/siri.mp3");
      sound.volume = 0.5;
      sound.onended = () => resolve();
      sound.onerror = () => resolve();
      sound.play().catch(() => resolve());
    });
  };

  // ─── TTS: Groq TTS with fallback to Web Speech API (same as desktop) ───

  const fallbackSpeakText = (text, shouldStartRecordingAfter = false) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    setIsSpeaking(true);
    const cleanText = text.replace(/[*#`_\-[\]()]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;
    utterance.rate = 1.0;
    utterance.lang = "en-US";

    const voices = synthRef.current.getVoices();
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

    utterance.onend = () => {
      setIsSpeaking(false);
      if (shouldStartRecordingAfter && isSiriOpenRef.current) {
        setSiriStatus("LISTENING");
        startRecording();
      } else {
        setSiriStatus("IDLE");
      }
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (shouldStartRecordingAfter && isSiriOpenRef.current) {
        setSiriStatus("LISTENING");
        startRecording();
      } else {
        setSiriStatus("IDLE");
      }
    };

    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
    }
    synthRef.current.speak(utterance);
  };

  const speakText = async (text, shouldStartRecordingAfter = false) => {
    stopAudio();
    setIsSpeaking(true);

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

      audio.onended = () => {
        setIsSpeaking(false);
        if (shouldStartRecordingAfter && isSiriOpenRef.current) {
          startRecording();
        } else {
          setSiriStatus("IDLE");
        }
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setSiriStatus("IDLE");
      };

      await audio.play();
    } catch (err) {
      console.error("Groq TTS failed, falling back to Web Speech API:", err);
      fallbackSpeakText(text, shouldStartRecordingAfter);
    }
  };

  // ─── Siri open/close lifecycle (same as desktop) ───

  useEffect(() => {
    if (isSiriOpen) {
      setUserQuestion("");
      const greeting = "Hello, how can I assist you today?";
      setSiriResponse(greeting);
      setMessages([{ role: "assistant", content: greeting }]);
      setSiriStatus("SPEAKING");
      const timer = setTimeout(async () => {
        await playSiriLaunchSound();
        if (isSiriOpenRef.current) {
          speakText(greeting, true);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      stopRecording();
      if (synthRef.current) synthRef.current.cancel();
      setIsListening(false);
      setIsSpeaking(false);
      setSiriStatus("IDLE");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSiriOpen]);

  const parseSystemCommands = (text) =>
    executeSiriCommand(text, {
      platform: "mobile",
      music,
      systemSettings,
      setMusicState,
      setSiriOpen,
      openWindow,
      closeWindow,
      closeAllWindows,
      minimizeWindow,
      unminimizeWindow,
      focusWindow,
      toggleMaximize,
      updateSystemSetting,
      setAboutPortfolioOpen,
      setActiveLocation,
    });

  // ─── Groq LLM chat (same as desktop) ───

  const handleSendToGroq = async (text) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    const systemCommand = parseSystemCommands(text);
    if (systemCommand) {
      const systemResponse = systemCommand.response;
      setSiriResponse(systemResponse);
      setMessages((prev) => [...prev, { role: "assistant", content: systemResponse }]);
      setSiriStatus("SPEAKING");
      speakText(systemResponse, systemCommand.listenAfter);
      return;
    }

    try {
      setSiriStatus("THINKING");

      const response = await fetch("/api/groq/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 90,
          temperature: 0.35,
          messages: [
            {
              role: "system",
              content: getSiriSystemPrompt(),
            },
            ...messages.slice(-4),
            { role: "user", content: text },
          ],
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

      if (!isSiriOpenRef.current) return;

      setSiriResponse(reply);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setSiriStatus("SPEAKING");
      speakText(reply, true); // Auto-listen after speaking
    } catch (err) {
      console.error(err);
      const errMsg = "Sorry, I am having trouble connecting.";
      setSiriResponse(errMsg);
      setSiriStatus("SPEAKING");
      speakText(errMsg, false);
    }
  };

  // ─── Text input send handler ───

  const handleTextSend = (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;
    setInputVal("");
    setUserQuestion(text);
    setSiriStatus("THINKING");
    handleSendToGroq(text);
  };

  // ─── Notch click handler ───

  const handleNotchClick = () => {
    if (notchState === "IDLE") {
      setSiriOpen(true);
      setNotchState("SIRI");
    } else if (notchState === "ACTIVE_MUSIC") {
      setNotchState("EXPANDED_MUSIC");
    } else if (notchState === "EXPANDED_MUSIC") {
      openWindow("music");
      setNotchState(music.isPlaying ? "ACTIVE_MUSIC" : "IDLE");
    } else if (notchState === "SIRI") {
      // Toggle recording on notch tap
      if (!isListening && !isSpeaking) {
        startRecording();
      } else if (isListening) {
        stopRecording();
        setSiriStatus("IDLE");
      }
    }
  };

  const handleSiriOrbClick = (e) => {
    e.stopPropagation();

    if (siriStatus === "THINKING" || siriStatus === "TRANSCRIBING") return;

    if (isListening) {
      stopRecording();
      return;
    }

    setUserQuestion("");
    setSiriStatus("LISTENING");
    startRecording();
  };

  const handleCloseSiri = (e) => {
    e.stopPropagation();
    stopRecording();
    if (synthRef.current) synthRef.current.cancel();
    setSiriOpen(false);
    setSiriStatus("IDLE");
    setIsListening(false);
    setIsSpeaking(false);
    setNotchState(music.isPlaying ? "ACTIVE_MUSIC" : "IDLE");
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    setMusicState({ isPlaying: !music.isPlaying });
  };

  const handleNext = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("macos-portfolio-next-track"));
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("macos-portfolio-prev-track"));
  };

  // Siri status dot color
  const getStatusColor = () => {
    switch (siriStatus) {
      case "LISTENING":
        return "#ef4444";
      case "TRANSCRIBING":
        return "#f59e0b";
      case "THINKING":
        return "#f59e0b";
      case "SPEAKING":
        return "#10b981";
      default:
        return "#8e8e93";
    }
  };

  const getStatusLabel = () => {
    switch (siriStatus) {
      case "LISTENING":
        return "LISTENING...";
      case "TRANSCRIBING":
        return "TRANSCRIBING...";
      case "THINKING":
        return "THINKING...";
      case "SPEAKING":
        return "SPEAKING...";
      default:
        return "TAP MIC TO SPEAK";
    }
  };

  // Helper to dynamically return classes for the wrapper div
  const getNotchClass = () => {
    switch (notchState) {
      case "SIRI":
        return "w-[92%] h-[78px] rounded-[28px] bg-[#0c0c0d]/95 backdrop-blur-[35px] border border-white/10 px-4 pt-3.5 pb-3 flex items-center gap-3.5";
      case "EXPANDED_MUSIC":
        return "w-[92%] h-[142px] rounded-[24px] bg-[#0c0c0d]/95 backdrop-blur-[35px] border border-white/12 p-3.5 flex flex-col justify-between";
      case "ACTIVE_MUSIC":
        return "w-[125px] h-[30px] rounded-full bg-black border border-white/10 px-3 justify-between flex items-center";
      case "IDLE":
      default:
        return "w-28 h-[26px] bg-[#0a0a0a] rounded-full border border-neutral-900/60 px-3.5 justify-between flex items-center";
    }
  };

  const renderNotchContent = () => {
    switch (notchState) {
      case "SIRI":
        return (
          <div className="animate-content-fade flex items-center gap-3.5 w-full h-full">
            {/* Siri orb */}
            <button
              type="button"
              onClick={handleSiriOrbClick}
              className={`w-[54px] h-[54px] rounded-full overflow-hidden flex-shrink-0 border border-white/10 relative bg-[#040404] flex items-center justify-center transition-all active:scale-95 ${
                isListening
                  ? "shadow-[0_0_26px_rgba(239,68,68,0.65)] ring-2 ring-red-400/70"
                  : "shadow-[0_0_20px_rgba(168,85,247,0.35)]"
              }`}
              title={isListening ? "Stop listening" : "Start listening"}
              aria-label={isListening ? "Stop Siri listening" : "Start Siri listening"}
            >
              <img
                src="/images/siri.webp"
                alt="Siri"
                className="w-full h-full object-cover scale-[1.5]"
              />
            </button>
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <p className="text-[11.5px] font-bold text-white leading-snug line-clamp-2">
                {siriResponse}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-white/45 uppercase tracking-wider flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block animate-pulse"
                    style={{
                      backgroundColor: getStatusColor(),
                      boxShadow: `0 0 6px ${getStatusColor()}`,
                    }}
                  />
                  {getStatusLabel()}
                </span>
                <button
                  onClick={handleCloseSiri}
                  className="text-[10px] font-bold text-white/95 px-3 py-1 rounded-full bg-white/12 border border-white/10 active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      case "EXPANDED_MUSIC":
        return (
          <div className="animate-content-fade flex flex-col justify-between w-full h-full">
            <div className="flex items-center gap-3 w-full">
              <div
                className={`w-11 h-11 rounded-lg flex-shrink-0 bg-gradient-to-tr ${music.activeTrack?.coverColor || "from-pink-500 to-indigo-500"} flex items-center justify-center text-[22px] shadow-md relative overflow-hidden`}
              >
                {music.activeTrack?.coverUrl ? (
                  <img
                    src={music.activeTrack.coverUrl}
                    alt="art"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  music.activeTrack?.coverText || "🎵"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13.5px] font-bold text-white truncate leading-tight">
                  {music.activeTrack?.title || "No Title"}
                </h4>
                <p className="text-[11px] text-white/50 truncate mt-0.5">
                  {music.activeTrack?.artist || "Unknown Artist"}
                </p>
              </div>
              {/* Animated visualizer */}
              <div className="notch-wave">
                <div className="notch-wave-bar" />
                <div className="notch-wave-bar" />
                <div className="notch-wave-bar" />
                <div className="notch-wave-bar" />
                <div className="notch-wave-bar" />
              </div>
            </div>

            {/* Progress Bar (iPhone style with slider input) */}
            <div
              className="w-full px-1 flex flex-col gap-1 mt-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[4px] flex items-center group">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => {
                    const newTime = parseFloat(e.target.value);
                    setCurrentTime(newTime);
                    const audioEl = document.querySelector("audio");
                    if (audioEl) {
                      audioEl.currentTime = newTime;
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {/* Styled track */}
                <div className="w-full h-[3.5px] bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                {/* Thumb indicator dot */}
                <div
                  className="absolute w-2 h-2 rounded-full bg-white shadow-md -translate-x-1/2 pointer-events-none transition-transform duration-75 scale-0 group-hover:scale-100"
                  style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-white/35 font-medium leading-none mt-0.5 select-none">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
              </div>
            </div>

            {/* Media Control row */}
            <div
              className="flex items-center justify-center gap-8 w-full pb-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handlePrev}
                className="text-white/70 hover:text-white active:scale-90 transition-transform"
              >
                <SkipBack size={18} fill="currentColor" />
              </button>
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center active:scale-90 transition-transform shadow"
              >
                {music.isPlaying ? (
                  <Pause size={14} fill="currentColor" />
                ) : (
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                )}
              </button>
              <button
                onClick={handleNext}
                className="text-white/70 hover:text-white active:scale-90 transition-transform"
              >
                <SkipForward size={18} fill="currentColor" />
              </button>
            </div>
          </div>
        );
      case "ACTIVE_MUSIC":
        return (
          <div className="animate-content-fade flex items-center justify-between w-full h-full">
            {/* Album art cover art on the left */}
            <div className="w-[18px] h-[18px] rounded-[5px] flex-shrink-0 bg-black flex items-center justify-center text-[10px] shadow-[0_0_5px_rgba(255,255,255,0.15)] relative overflow-hidden">
              {music.activeTrack?.coverUrl ? (
                <img
                  src={music.activeTrack.coverUrl}
                  alt="art"
                  className="w-full h-full object-cover animate-spin [animation-duration:8s]"
                />
              ) : (
                <span className="text-[10px] leading-none select-none">
                  {music.activeTrack?.coverText || "🎵"}
                </span>
              )}
            </div>

            {/* Animated mini visualizer */}
            <div className="notch-wave">
              <div className="notch-wave-bar" />
              <div className="notch-wave-bar" />
              <div className="notch-wave-bar" />
              <div className="notch-wave-bar" />
              <div className="notch-wave-bar" />
            </div>
          </div>
        );
      case "IDLE":
      default:
        return (
          <div className="animate-content-fade flex items-center justify-between w-full h-full">
            {/* FaceID Sensor / TrueDepth Array */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#080808] border border-neutral-950 flex-shrink-0" />
            {/* Front Camera Lens */}
            <div className="w-3.5 h-3.5 rounded-full bg-[#030307] border border-[#1a1a24] shadow-inner flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0d2d4d] opacity-90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-cyan-400 opacity-60" />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[80] pointer-events-none flex justify-center">
      <style>{`
        @keyframes contentFadeIn {
          0% { opacity: 0; transform: scale(0.96); filter: blur(2px); }
          30% { opacity: 0; transform: scale(0.96); filter: blur(2px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .animate-content-fade {
          animation: contentFadeIn 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          width: 100%;
          height: 100%;
        }
        .dynamic-island-transition {
          transition: width 380ms cubic-bezier(0.16, 1, 0.3, 1),
                      height 380ms cubic-bezier(0.16, 1, 0.3, 1),
                      border-radius 380ms cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 380ms cubic-bezier(0.16, 1, 0.3, 1),
                      padding 380ms cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 380ms cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 380ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 150ms ease;
        }
      `}</style>

      {/* Click outside backdrop overlay for Siri & Expanded Music */}
      {(notchState === "SIRI" || notchState === "EXPANDED_MUSIC") && (
        <div
          className="fixed inset-0 bg-transparent pointer-events-auto z-[79] w-screen h-screen"
          onClick={
            notchState === "SIRI"
              ? handleCloseSiri
              : (e) => {
                  e.stopPropagation();
                  setNotchState(music.isPlaying ? "ACTIVE_MUSIC" : "IDLE");
                }
          }
        />
      )}

      {/* Dynamic Island notch container */}
      <div
        onClick={handleNotchClick}
        className={`pointer-events-auto z-[80] mt-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] select-none cursor-pointer active:scale-[0.97] overflow-hidden dynamic-island-transition ${getNotchClass()}`}
      >
        {renderNotchContent()}
      </div>
    </div>
  );
};

export default MobileNotch;
