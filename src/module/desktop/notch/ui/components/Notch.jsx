import React, { useState, useRef, useEffect } from "react";
import { executeSiriCommand, getSiriSystemPrompt } from "@module/siri/assistant";
import useLocationStore from "@store/location";
import useWindowsStore from "@store/window";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Mic,
  ExternalLink,
  Star,
  Cloud,
  Settings,
  Camera,
  Trash2,
  FileText,
} from "lucide-react";

const Notch = () => {
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
  const { activeTrack, isPlaying, _volume, _isMuted } = music;

  const [_dragProgress, setDragProgress] = useState(0);
  const [isMusicExpanded, setIsMusicExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [_duration, setDuration] = useState(0);

  const [activeTab, setActiveTab] = useState("nook"); // "nook" or "tray"
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [cameraFlash, setCameraFlash] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  const notchRef = useRef(null);

  // Siri specific states
  const [userQuestion, setUserQuestion] = useState("");
  const [siriResponse, setSiriResponse] = useState("Hi, I'm Siri. How can I help you today?");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [siriStatus, setSiriStatus] = useState("IDLE");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, I'm Siri. How can I help you today?" },
  ]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const audioPlaybackRef = useRef(new Audio());

  const isSiriOpenRef = useRef(isSiriOpen);
  useEffect(() => {
    isSiriOpenRef.current = isSiriOpen;
  }, [isSiriOpen]);

  // Click outside listener to collapse popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notchRef.current && !notchRef.current.contains(event.target)) {
        setIsMusicExpanded(false);
        setSiriOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSiriOpen]);

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

  useEffect(() => {
    const synth = synthRef.current;
    return () => {
      stopRecording();
      if (synth) synth.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      // Check if Siri was closed while waiting for user to allow permission
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
      console.error("Error accessing microphone:");
      setIsListening(false);
      setUserQuestion("");
      setSiriResponse(
        "Microphone access denied. Please allow microphone permission in your browser settings.",
      );
    }
  };

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

  const playSiriLaunchSound = () => {
    return new Promise((resolve) => {
      const sound = new Audio("/sound/siri.mp3");
      sound.volume = 0.5;
      sound.onended = () => resolve();
      sound.onerror = () => resolve();
      sound.play().catch((err) => {
        console.error("Failed to play launch sound:", err);
        resolve(); // Continue even if blocked
      });
    });
  };

  const fallbackSpeakText = (text, shouldStartRecordingAfter = false) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    setIsSpeaking(true);
    const cleanText = text.replace(/[*#`_\-[\]()]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;
    utterance.rate = 1.0;

    const isHinglish =
      /(^|\s)(hoon|hai|aap|kaise|kya|meri|madad|kar|sakti|ho|main|yahan|tum|kaun|theek|gaya|rha|ki|siri|virtual|assistant|aur|liye)(\s|$)/i.test(
        text,
      ) || text.toLowerCase().includes("siri hoon");
    const voices = synthRef.current.getVoices();
    let selectedVoice;
    if (isHinglish) {
      utterance.lang = "hi-IN";
      selectedVoice =
        voices.find((v) => v.lang.startsWith("hi") || v.lang.includes("IN")) ||
        voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) ||
        voices.find((v) => v.lang.startsWith("en"));
    } else {
      utterance.lang = "en-US";
      selectedVoice =
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
    }
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: text,
          voice: "hannah",
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Groq TTS API error: ${response.statusText}`);
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

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsSpeaking(false);
        setSiriStatus("IDLE");
      };

      await audio.play();
    } catch (err) {
      console.error("Groq TTS failed, falling back to Web Speech API:", err);
      fallbackSpeakText(text, shouldStartRecordingAfter);
    }
  };

  // When Siri opens, start listening
  useEffect(() => {
    if (isSiriOpen) {
      setUserQuestion("");
      const greeting = "Hello, how can I assist you today?";
      setSiriResponse(greeting);
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
      platform: "desktop",
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
        headers: {
          "Content-Type": "application/json",
        },
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
      speakText(reply, true); // Automatically start listening again after Siri finishes speaking
    } catch (err) {
      console.error(err);
      const errMsg = "Sorry, I am having trouble connecting.";
      setSiriResponse(errMsg);
      setSiriStatus("SPEAKING");
      speakText(errMsg, false);
    }
  };

  // Music Handlers
  const hasSong = activeTrack && activeTrack.id !== 0;

  const togglePlay = (e) => {
    e.stopPropagation();
    if (activeTrack.url) {
      setMusicState({ isPlaying: !isPlaying });
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("macos-portfolio-next-track"));
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("macos-portfolio-prev-track"));
  };

  const getCalendarDays = () => {
    const days = [];
    const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      days.push({
        dayName: weekdays[date.getDay()],
        dayNum: String(date.getDate()).padStart(2, "0"),
        isToday: i === 0,
      });
    }
    return days;
  };

  const getMonthName = () => {
    const today = new Date();
    return today.toLocaleString("default", { month: "long" });
  };

  const openCamera = async (e) => {
    e.stopPropagation();
    setCameraError("");
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setCameraStream(stream);
    } catch {
      setCameraError("Camera access denied. Please allow camera permission.");
    }
  };

  // Wire the webcam stream to the <video> element once camera overlay is rendered
  useEffect(() => {
    if (isCameraOpen && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraOpen, cameraStream]);

  const closeCamera = (e) => {
    if (e) e.stopPropagation();
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCameraError("");
  };

  const takeSnapshot = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      const link = document.createElement("a");
      link.download = `snapshot-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      // Flash animation
      setCameraFlash(true);
      try {
        const sound = new Audio("/sound/shutter.mp3");
        sound.volume = 0.4;
        sound.play().catch(() => {});
      } catch {
        /* silent */
      }
      setTimeout(() => setCameraFlash(false), 180);
    } catch (err) {
      console.error("Snapshot failed:", err);
    }
  };

  // Close camera stream on unmount or isMusicExpanded change
  useEffect(() => {
    if (!isMusicExpanded) closeCamera(null);
  }, [isMusicExpanded]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        url: URL.createObjectURL(file),
        type: file.type,
      }));
      setDroppedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveFile = (e, index) => {
    e.stopPropagation();
    setDroppedFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
        const progress = (audioEl.currentTime / audioEl.duration) * 100;
        setDragProgress(isNaN(progress) ? 0 : progress);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 500);
    return () => clearInterval(interval);
  }, [isSiriOpen, isMusicExpanded]);

  let notchClass = "macos-notch compact";
  if (isSiriOpen) {
    notchClass = "macos-notch siri-active";
  } else if (isMusicExpanded) {
    notchClass = "macos-notch expanded";
  } else if (isPlaying && hasSong) {
    notchClass = "macos-notch active-music";
  }

  // Handle clicking notch: middle -> Siri, sides -> Music popup
  const handleNotchClick = (e) => {
    if (isSiriOpen) {
      if (!isListening && !isSpeaking) {
        startRecording();
      } else {
        stopRecording();
        setSiriStatus("IDLE");
      }
      return;
    }

    if (isMusicExpanded) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;

    if (clickPercent >= 0.35 && clickPercent <= 0.65) {
      setSiriOpen(true);
      setIsMusicExpanded(false);
      if (audioPlaybackRef.current) {
        audioPlaybackRef.current.src =
          "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
        audioPlaybackRef.current.play().catch((e) => console.log("Audio unlock failed:", e));
      }
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(u);
      }
    } else {
      setIsMusicExpanded(true);
      setSiriOpen(false);
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

  return (
    <div ref={notchRef} className="macos-notch-container" onClick={handleNotchClick}>
      <div className={notchClass}>
        {/* Compact Default State */}
        {notchClass === "macos-notch compact" && (
          <div className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-800" />
        )}

        {/* Active Music Playing Mini State */}
        {notchClass === "macos-notch active-music" && (
          <div className="notch-music-compact">
            <div className="flex items-center gap-1.5 overflow-hidden w-28">
              {activeTrack.coverUrl ? (
                <img
                  src={activeTrack.coverUrl}
                  alt="art"
                  className="w-4 h-4 rounded-sm object-cover flex-shrink-0 animate-spin [animation-duration:8s]"
                />
              ) : (
                <span className="text-[10px] flex-shrink-0">{activeTrack.coverText || "🎵"}</span>
              )}
              <span className="truncate text-white text-[10px] select-none font-medium">
                {activeTrack.title}
              </span>
            </div>
            <div className="notch-wave">
              <div className="notch-wave-bar" />
              <div className="notch-wave-bar" />
              <div className="notch-wave-bar" />
              <div className="notch-wave-bar" />
              <div className="notch-wave-bar" />
            </div>
          </div>
        )}

        {/* Fully Expanded Media Player State */}
        {notchClass === "macos-notch expanded" && (
          <div className="notch-nook-expanded w-full h-full flex flex-col justify-between relative">
            <div className="notch-ambient-glow" />

            {/* Header section */}
            <div
              className="notch-nook-header flex justify-between items-center w-full select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="notch-nook-tabs flex items-center gap-4">
                <button
                  className={`notch-nook-tab flex items-center gap-1.5 text-xs font-semibold transition-all ${activeTab === "nook" ? "text-white active" : "text-zinc-400 hover:text-zinc-200"}`}
                  onClick={() => setActiveTab("nook")}
                >
                  <Star size={11} fill={activeTab === "nook" ? "currentColor" : "none"} />
                  Nook
                </button>
                <button
                  className={`notch-nook-tab flex items-center gap-1.5 text-xs font-semibold transition-all ${activeTab === "tray" ? "text-white active" : "text-zinc-400 hover:text-zinc-200"}`}
                  onClick={() => setActiveTab("tray")}
                >
                  <Cloud size={11} />
                  Tray
                </button>
              </div>

              <button
                className="notch-nook-settings text-zinc-400 hover:text-white transition-all"
                onClick={() => {
                  openWindow("settings");
                  setIsMusicExpanded(false);
                }}
                title="System Settings"
              >
                <Settings size={14} />
              </button>
            </div>

            {/* Divider line under header */}
            <div className="w-full h-[1px] bg-zinc-800/60 my-1" />

            {/* Camera flash screen animation */}
            {cameraFlash && (
              <div className="absolute inset-0 bg-white z-50 pointer-events-none rounded-[22px] animate-flash-shutter" />
            )}

            {/* Camera Live Feed Overlay */}
            {isCameraOpen && (
              <div
                className="absolute inset-0 z-40 bg-zinc-950/95 backdrop-blur-sm rounded-[22px] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {cameraError ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-6">
                    <Camera size={24} className="text-zinc-500" />
                    <p className="text-zinc-400 text-[11px]">{cameraError}</p>
                    <button
                      className="mt-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-semibold rounded-full transition-all"
                      onClick={closeCamera}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Live video feed */}
                    <div className="relative flex-1 overflow-hidden rounded-t-[24px] bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                      {/* Green live indicator */}
                      <div className="absolute top-2 left-3 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[8px] text-white/70 font-medium tracking-widest">
                          LIVE
                        </span>
                      </div>
                    </div>
                    {/* Controls bar */}
                    <div className="flex items-center justify-between px-5 py-2 bg-zinc-950">
                      <button
                        className="text-zinc-400 hover:text-white text-[10px] font-semibold tracking-wide transition-colors"
                        onClick={closeCamera}
                      >
                        ✕ Close
                      </button>
                      {/* Shutter button */}
                      <button
                        className="w-10 h-10 rounded-full border-2 border-white bg-transparent flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all group"
                        onClick={takeSnapshot}
                        title="Take snapshot"
                      >
                        <div className="w-7 h-7 rounded-full bg-white group-active:scale-90 transition-transform" />
                      </button>
                      <span className="text-[10px] text-zinc-500 w-14 text-right">Snapshot</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab content area */}
            <div className="flex-1 w-full overflow-hidden flex flex-col justify-center">
              {activeTab === "nook" ? (
                /* Nook Tab: Music | Calendar | Camera */
                <div className="notch-nook-grid grid grid-cols-[1.25fr_1.5fr_0.85fr] items-center h-full w-full gap-2.5">
                  {/* Column 1: Music */}
                  <div
                    className="nook-music-section flex items-center gap-2.5 pr-2.5 border-r border-zinc-800/40 h-[80%] min-w-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`nook-album-art w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden bg-zinc-800 shadow-lg ${isPlaying ? "playing" : ""}`}
                    >
                      {hasSong && activeTrack.coverUrl ? (
                        <img
                          src={activeTrack.coverUrl}
                          alt="album art"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">{activeTrack.coverText || "🎵"}</span>
                      )}
                    </div>
                    <div className="nook-music-info flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                      <span className="text-[12.5px] text-white font-semibold truncate block">
                        {hasSong ? activeTrack.title : "Select a Song"}
                      </span>
                      <span className="text-[10.5px] text-zinc-400 truncate block">
                        {hasSong ? formatTime(currentTime) : "JioSaavn"}
                      </span>
                      <div className="flex items-center gap-3 mt-1">
                        <button
                          className="text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
                          onClick={handlePrev}
                        >
                          <SkipBack size={12} fill="currentColor" />
                        </button>
                        <button
                          className="text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
                          onClick={togglePlay}
                        >
                          {isPlaying ? (
                            <Pause size={14} fill="currentColor" />
                          ) : (
                            <Play size={14} fill="currentColor" />
                          )}
                        </button>
                        <button
                          className="text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
                          onClick={handleNext}
                        >
                          <SkipForward size={12} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Calendar */}
                  <div
                    className="nook-calendar-section px-2.5 border-r border-zinc-800/40 h-[80%] flex flex-col justify-center select-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[12px] text-white font-extrabold tracking-wide">
                        {getMonthName()}
                      </span>
                      <div className="flex-1 flex justify-between text-[9px] font-extrabold text-zinc-500 tracking-wider">
                        {getCalendarDays().map((day, idx) => (
                          <span key={idx} className={day.isToday ? "text-[#3b82f6]" : ""}>
                            {day.dayName}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 mb-1">
                      <div className="flex-1 flex justify-between">
                        {getCalendarDays().map((day, idx) => (
                          <span
                            key={idx}
                            className={`w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold ${day.isToday ? "bg-[#3b82f6] text-white shadow-md shadow-blue-500/25" : "text-zinc-300 hover:bg-white/5 transition-colors"}`}
                          >
                            {day.dayNum}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center mt-1.5 text-[9px] text-zinc-500 font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] flex-shrink-0 animate-pulse" />
                      <span>Nothing for today</span>
                    </div>
                  </div>

                  {/* Column 3: Camera */}
                  <div className="nook-camera-section flex flex-col justify-center items-center h-[80%] pl-2 gap-1.5">
                    <button
                      className="nook-camera-button w-[42px] h-[42px] rounded-full border border-zinc-800 bg-gradient-to-b from-zinc-700 to-zinc-900 flex items-center justify-center shadow-lg transition-all hover:scale-105 hover:border-zinc-600 active:scale-95 text-zinc-400 hover:text-white"
                      onClick={openCamera}
                      title="Open camera"
                    >
                      <div className="w-[34px] h-[34px] rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center shadow-inner">
                        <Camera size={14} className="opacity-80" />
                      </div>
                    </button>
                    <span className="text-[7.5px] text-zinc-500 font-bold tracking-wider uppercase">
                      Camera
                    </span>
                  </div>
                </div>
              ) : (
                /* Tray Tab: Drag & Drop files storage area */
                <div
                  className="notch-tray-container flex flex-col h-full w-full overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {droppedFiles.length === 0 ? (
                    <div
                      className={`notch-tray-dropzone flex-1 border border-dashed rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-500 p-2 ${isDragOver ? "border-[#3b82f6] bg-[#3b82f6]/5 text-white scale-[0.98]" : "border-zinc-800/80 hover:border-zinc-700"}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Cloud
                        size={16}
                        className={`transition-transform ${isDragOver ? "translate-y-[-2px] text-[#3b82f6]" : ""}`}
                      />
                      <span className="text-[10px] font-medium tracking-wide">
                        Drop files to store temporarily
                      </span>
                    </div>
                  ) : (
                    <div className="notch-tray-files flex-1 overflow-x-auto flex items-center gap-3 py-1 px-2 scrollbar-none">
                      {droppedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="notch-tray-file-card relative group flex flex-col items-center justify-center p-1.5 bg-zinc-900/60 border border-zinc-800/40 rounded-lg w-16 h-16 flex-shrink-0 select-none"
                        >
                          <FileText size={16} className="text-zinc-400 mb-0.5" />
                          <span className="text-[7px] text-white truncate w-full text-center font-medium">
                            {file.name}
                          </span>
                          <span className="text-[6px] text-zinc-500">{file.size}</span>

                          <button
                            className="absolute -top-1 -right-1 p-0.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleRemoveFile(e, idx)}
                            title="Remove file"
                          >
                            <Trash2 size={7} />
                          </button>
                        </div>
                      ))}

                      {/* Dropzone Mini to add more files if files are already dropped */}
                      <div
                        className={`w-16 h-16 flex-shrink-0 border border-dashed rounded-lg flex flex-col items-center justify-center gap-1 transition-all text-zinc-500 cursor-pointer ${isDragOver ? "border-[#3b82f6] bg-[#3b82f6]/5 text-white" : "border-zinc-800/80 hover:border-zinc-700"}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Cloud size={10} />
                        <span className="text-[6px] font-medium">Add Files</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Siri Active Dropdown State */}
        {notchClass === "macos-notch siri-active" && (
          <>
            <button
              type="button"
              className={`notch-siri-gif-container ${isListening ? "is-listening" : ""}`}
              onClick={handleSiriOrbClick}
              title={isListening ? "Stop listening" : "Start listening"}
              aria-label={isListening ? "Stop Siri listening" : "Start Siri listening"}
            >
              <img src="/images/siri.gif" alt="Siri" className="notch-siri-gif" />
            </button>
            <div className="notch-siri-content">
              <div className="notch-siri-text">
                {userQuestion && <div className="notch-siri-user-question">{userQuestion}</div>}
                <div className="notch-siri-response">{siriResponse}</div>
              </div>
              <div className="notch-siri-footer">
                <div className="notch-siri-status">
                  <div
                    className="notch-siri-status-dot"
                    style={{
                      background:
                        siriStatus === "LISTENING"
                          ? "#ef4444"
                          : siriStatus === "SPEAKING"
                            ? "#10b981"
                            : "#f59e0b",
                      boxShadow: `0 0 6px ${siriStatus === "LISTENING" ? "#ef4444" : siriStatus === "SPEAKING" ? "#10b981" : "#f59e0b"}`,
                    }}
                  />
                  {siriStatus === "LISTENING"
                    ? "LISTENING..."
                    : siriStatus === "TRANSCRIBING"
                      ? "TRANSCRIBING..."
                      : siriStatus === "THINKING"
                        ? "THINKING..."
                        : siriStatus === "SPEAKING"
                          ? "SPEAKING..."
                          : "IDLE"}
                </div>
                <button
                  className="notch-siri-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSiriOpen(false);
                  }}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Notch;
