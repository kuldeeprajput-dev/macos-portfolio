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
  const [activeFilter, setActiveFilter] = useState("none");
  const [isDemoMode, setIsDemoMode] = useState(false);

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
    setIsDemoMode(false);
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
    setIsDemoMode(false);
    setCameraError("");
  };

  const takeSnapshot = (e) => {
    e.stopPropagation();
    // Shutter flash animation and sound
    setCameraFlash(true);
    try {
      const sound = new Audio("/sound/shutter.mp3");
      sound.volume = 0.4;
      sound.play().catch(() => {});
    } catch {
      /* silent */
    }
    setTimeout(() => setCameraFlash(false), 180);

    if (isDemoMode) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext("2d");

        // Draw background gradient
        const grad = ctx.createLinearGradient(0, 0, 640, 480);
        grad.addColorStop(0, "#1e1b4b");
        grad.addColorStop(1, "#311042");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 640, 480);

        // Draw Grid
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let x = 0; x < 640; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 480);
          ctx.stroke();
        }
        for (let y = 0; y < 480; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(640, y);
          ctx.stroke();
        }

        // Apply active filter
        if (activeFilter === "grayscale") ctx.filter = "grayscale(100%)";
        else if (activeFilter === "sepia") ctx.filter = "sepia(100%)";
        else if (activeFilter === "cold") ctx.filter = "hue-rotate(180deg) saturate(140%)";
        else if (activeFilter === "vintage")
          ctx.filter = "sepia(50%) contrast(120%) brightness(90%)";
        else if (activeFilter === "invert") ctx.filter = "invert(100%)";
        else ctx.filter = "none";

        // Draw Face box
        ctx.strokeStyle = "rgba(34, 197, 94, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(220, 140, 200, 200);

        // Draw text
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("FACE DETECTED", 230, 165);

        // Draw Simulated emoji avatar in center
        ctx.font = "60px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("👨‍💻", 320, 240);

        const link = document.createElement("a");
        link.download = `snapshot-demo-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (err) {
        console.error("Demo Snapshot failed:", err);
      }
      return;
    }

    if (!videoRef.current) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      // Apply active filter to normal camera snapshot
      if (activeFilter === "grayscale") ctx.filter = "grayscale(100%)";
      else if (activeFilter === "sepia") ctx.filter = "sepia(100%)";
      else if (activeFilter === "cold") ctx.filter = "hue-rotate(180deg) saturate(140%)";
      else if (activeFilter === "vintage") ctx.filter = "sepia(50%) contrast(120%) brightness(90%)";
      else if (activeFilter === "invert") ctx.filter = "invert(100%)";
      else ctx.filter = "none";

      ctx.drawImage(videoRef.current, 0, 0);

      const link = document.createElement("a");
      link.download = `snapshot-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
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

  const getNotchStyle = () => {
    if (isSiriOpen) {
      return { width: "620px", height: "150px" };
    }
    if (isMusicExpanded) {
      return { width: "640px", height: "190px" };
    }
    if (isPlaying && hasSong) {
      return { width: "220px", height: "30px" };
    }
    return { width: "150px", height: "30px" };
  };

  return (
    <div ref={notchRef} className="macos-notch-container" onClick={handleNotchClick}>
      <div className={notchClass} style={getNotchStyle()}>
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
          <div
            className="notch-nook-expanded w-full h-full flex flex-col justify-between relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient background glow */}
            <div className="notch-ambient-glow" />

            {/* Header section */}
            <div className="notch-nook-header">
              <div className="notch-nook-tabs">
                <button
                  className={`notch-nook-tab ${activeTab === "nook" ? "active" : ""}`}
                  onClick={() => setActiveTab("nook")}
                >
                  <Star size={11} fill={activeTab === "nook" ? "currentColor" : "none"} />
                  Nook
                </button>
                <button
                  className={`notch-nook-tab ${activeTab === "tray" ? "active" : ""}`}
                  onClick={() => setActiveTab("tray")}
                >
                  <Cloud size={11} />
                  Tray
                </button>
              </div>

              <button
                className="notch-nook-settings"
                onClick={() => {
                  openWindow("settings");
                  setIsMusicExpanded(false);
                }}
                title="System Settings"
              >
                <Settings size={14} />
              </button>
            </div>

            {/* Camera flash screen animation */}
            {cameraFlash && (
              <div className="absolute inset-0 bg-white z-50 pointer-events-none rounded-[28px] animate-flash-shutter" />
            )}

            {/* Camera Live Feed Overlay */}
            {isCameraOpen && (
              <div className="notch-camera-live-overlay">
                {cameraError && !isDemoMode ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-6">
                    <Camera size={24} className="text-zinc-500" />
                    <p className="text-zinc-400 text-[11px]">{cameraError}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-semibold rounded-full transition-all"
                        onClick={closeCamera}
                      >
                        Close
                      </button>
                      <button
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold rounded-full transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDemoMode(true);
                        }}
                      >
                        Try Demo Mode
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Live feed (either video or simulated) */}
                    <div className="relative flex-1 overflow-hidden bg-black">
                      {isDemoMode ? (
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center overflow-hidden">
                          {/* Grid scan lines */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                          {/* Animated scanning bar */}
                          <div className="absolute left-0 right-0 h-[2px] bg-green-500/30 shadow-[0_0_6px_#22c55e] animate-scan-bar pointer-events-none" />

                          {/* Pulsing indicator */}
                          <div className="absolute top-3 left-4 flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] text-green-400 font-bold tracking-widest">
                              DEMO FEED
                            </span>
                          </div>

                          {/* Simulated Face Bracket */}
                          <div className="w-24 h-24 border border-dashed border-green-500/40 rounded-xl relative flex items-center justify-center animate-face-pulse">
                            <span className="absolute top-1 left-1.5 text-[7px] font-bold text-green-400/80 tracking-wider">
                              MOCK FEED
                            </span>
                            <div className="w-2 h-2 border-t-2 border-l-2 border-green-400 absolute top-0 left-0" />
                            <div className="w-2 h-2 border-t-2 border-r-2 border-green-400 absolute top-0 right-0" />
                            <div className="w-2 h-2 border-b-2 border-l-2 border-green-400 absolute bottom-0 left-0" />
                            <div className="w-2 h-2 border-b-2 border-r-2 border-green-400 absolute bottom-0 right-0" />

                            {/* Mock Avatar */}
                            <div className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden">
                              <span className="text-2xl animate-bounce">👨‍💻</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="notch-camera-live-video"
                          style={{
                            filter:
                              activeFilter === "grayscale"
                                ? "grayscale(1)"
                                : activeFilter === "sepia"
                                  ? "sepia(1)"
                                  : activeFilter === "cold"
                                    ? "hue-rotate(180deg) saturate(1.4)"
                                    : activeFilter === "vintage"
                                      ? "sepia(0.5) contrast(1.2) brightness(0.9)"
                                      : activeFilter === "invert"
                                        ? "invert(1)"
                                        : "none",
                          }}
                        />
                      )}

                      {/* Live indicator (for real feed) */}
                      {!isDemoMode && (
                        <div className="absolute top-3 left-4 flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[9px] text-white/80 font-bold tracking-widest">
                            LIVE
                          </span>
                        </div>
                      )}

                      {/* Floating filter switcher */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 z-10">
                        {[
                          { id: "none", name: "Normal" },
                          { id: "grayscale", name: "Mono" },
                          { id: "sepia", name: "Sepia" },
                          { id: "cold", name: "Cold" },
                          { id: "vintage", name: "Warm" },
                          { id: "invert", name: "X-Ray" },
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilter(f.id);
                            }}
                            className={`px-2 py-0.5 text-[8.5px] font-bold rounded-full transition-all ${
                              activeFilter === f.id
                                ? "bg-white text-black"
                                : "text-white/60 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Capture control bar */}
                    <div className="flex items-center justify-between px-5 py-2.5 bg-zinc-950/90 border-t border-white/5">
                      <button
                        className="text-zinc-400 hover:text-white text-[11px] font-semibold tracking-wide transition-colors"
                        onClick={closeCamera}
                      >
                        ✕ Close
                      </button>
                      <button
                        className="w-10 h-10 rounded-full border-2 border-white bg-transparent flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all group"
                        onClick={takeSnapshot}
                        title="Take Snapshot"
                      >
                        <div className="w-7 h-7 rounded-full bg-white group-active:scale-95 transition-all" />
                      </button>
                      <span className="text-[11px] text-zinc-500 w-14 text-right font-medium">
                        Capture
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab content area */}
            <div className="flex-1 w-full overflow-hidden flex flex-col justify-center mt-2.5">
              {activeTab === "nook" ? (
                /* Nook Tab: Music | Calendar | Camera */
                <div
                  className="flex items-center justify-between h-full w-full select-none"
                  style={{ gap: "0" }}
                >
                  {/* Column 1: Music */}
                  <div className="flex items-center gap-3 pr-3.5 border-r border-white/10 h-[85%] w-[33%] flex-shrink-0">
                    <div
                      className="nook-album-art-container flex-shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                      onClick={() => {
                        openWindow("music");
                        setIsMusicExpanded(false);
                      }}
                      title="Open Music App"
                    >
                      <div
                        className={`nook-album-art flex items-center justify-center overflow-hidden relative ${isPlaying ? "playing" : ""}`}
                      >
                        {hasSong && activeTrack.coverUrl ? (
                          <img
                            src={activeTrack.coverUrl}
                            alt="album art"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">{activeTrack.coverText || "🎵"}</span>
                        )}
                      </div>
                      <div className="nook-album-art-glow" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                      <span className="nook-music-title truncate w-full">
                        {hasSong ? activeTrack.title : "Select a Song"}
                      </span>
                      <span className="nook-music-subtitle truncate w-full">
                        {hasSong ? formatTime(currentTime) : "Jamendo"}
                      </span>
                      <div className="nook-music-controls mt-1 flex items-center gap-1.5">
                        <button className="nook-ctrl-btn" onClick={handlePrev} title="Previous">
                          <SkipBack size={10} fill="currentColor" />
                        </button>
                        <button
                          className="nook-ctrl-btn"
                          onClick={togglePlay}
                          title={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? (
                            <Pause size={11} fill="currentColor" />
                          ) : (
                            <Play size={11} fill="currentColor" />
                          )}
                        </button>
                        <button className="nook-ctrl-btn" onClick={handleNext} title="Next">
                          <SkipForward size={10} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Calendar */}
                  <div className="flex flex-col justify-center px-4 border-r border-white/10 h-[85%] w-[45%] flex-shrink-0 min-w-0">
                    <div className="nook-cal-month text-left mb-1 pl-0.5 font-bold text-[9.5px] uppercase tracking-wider text-zinc-500">
                      {getMonthName()}
                    </div>
                    <div className="nook-cal-days-row mb-1">
                      {getCalendarDays().map((day, idx) => (
                        <span
                          key={idx}
                          className="nook-cal-day-header-cell"
                          style={{ color: day.isToday ? "#0a84ff" : "" }}
                        >
                          {day.dayName}
                        </span>
                      ))}
                    </div>
                    <div className="nook-cal-days-row mb-1.5">
                      {getCalendarDays().map((day, idx) => (
                        <span
                          key={idx}
                          className={`nook-cal-day-cell ${day.isToday ? "today" : ""}`}
                        >
                          {day.dayNum}
                        </span>
                      ))}
                    </div>
                    <div className="nook-cal-status flex items-center gap-1.5 text-[8.5px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span>Schedule Clear</span>
                    </div>
                  </div>

                  {/* Column 3: Camera */}
                  <div className="flex flex-col items-center justify-center gap-1.5 pl-3.5 h-[85%] w-[22%] flex-shrink-0">
                    <button
                      className="nook-camera-lens-btn"
                      onClick={openCamera}
                      title="Open Camera"
                    >
                      <div className="nook-camera-lens-inner">
                        <Camera size={13} />
                      </div>
                    </button>
                    <span className="nook-camera-label">Camera</span>
                  </div>
                </div>
              ) : (
                /* Tray Tab: Drag & Drop files storage area */
                <div className="notch-tray-container">
                  {droppedFiles.length === 0 ? (
                    <div
                      className={`notch-tray-dropzone ${isDragOver ? "dragover" : ""}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Cloud
                        size={18}
                        className={`transition-transform ${isDragOver ? "translate-y-[-2px] text-[#0a84ff]" : ""}`}
                      />
                      <span className="text-[10px] font-semibold tracking-wide">
                        Drop files to store temporarily
                      </span>
                    </div>
                  ) : (
                    <div className="notch-tray-files scrollbar-none">
                      {droppedFiles.map((file, idx) => (
                        <div key={idx} className="notch-tray-file-card group">
                          <FileText size={16} className="text-zinc-400 mb-0.5" />
                          <span className="text-[8px] text-white truncate w-full text-center font-medium">
                            {file.name}
                          </span>
                          <span className="text-[6.5px] text-zinc-500">{file.size}</span>

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
                        className={`notch-tray-add-card ${isDragOver ? "border-[#0a84ff] bg-[#0a84ff]/5 text-white" : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Cloud size={12} />
                        <span className="text-[7px] font-bold tracking-wide mt-0.5">Add Files</span>
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
              <img src="/images/siri.webp" alt="Siri" className="notch-siri-gif" />
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
