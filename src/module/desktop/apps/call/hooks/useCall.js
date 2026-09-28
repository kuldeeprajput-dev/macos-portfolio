import { useState, useEffect, useRef, useCallback } from "react";
import useWindowsStore from "@store/window";
import { CONTACTS } from "../data";

const useCall = () => {
  const { windows } = useWindowsStore();
  const [sidebarTab, setSidebarTab] = useState("contacts");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialNumber, setDialNumber] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraMuted, setCameraMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);

  const ringbackAudioRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const ringTimeoutRef = useRef(null);

  const isWindowFocused = useCallback(() => {
    const callWin = windows.call;
    if (!callWin || !callWin.isOpen || callWin.isMinimized) return false;
    let maxZ = -1;
    let focusedKey = "";
    Object.keys(windows).forEach((key) => {
      const win = windows[key];
      if (win.isOpen && !win.isMinimized && win.zIndex > maxZ) {
        maxZ = win.zIndex;
        focusedKey = key;
      }
    });
    return focusedKey === "call";
  }, [windows]);

  const playDTMFTone = useCallback((digit) => {
    try {
      const dtmfFrequencies = {
        1: [697, 1209],
        2: [697, 1336],
        3: [697, 1477],
        4: [770, 1209],
        5: [770, 1336],
        6: [770, 1477],
        7: [852, 1209],
        8: [852, 1336],
        9: [852, 1477],
        "*": [941, 1209],
        0: [941, 1336],
        "#": [941, 1477],
      };
      const freqs = dtmfFrequencies[digit];
      if (!freqs) return;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];
      osc1.type = "sine";
      osc2.type = "sine";
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.12);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.16);
      osc2.stop(ctx.currentTime + 0.16);
    } catch (e) {
      console.error("DTMF Tone Error", e);
    }
  }, []);

  const startRingbackSound = useCallback(() => {
    const audio = ringbackAudioRef.current ?? new Audio("/system/audio/ringback.mp3");
    ringbackAudioRef.current = audio;
    audio.loop = true;
    audio.currentTime = 0;
    audio.play().catch((error) => {
      if (error.name !== "AbortError") console.error("Ringback error", error);
    });
  }, []);

  const stopRingbackSound = useCallback(() => {
    const audio = ringbackAudioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  const handleDialPress = useCallback(
    (val) => {
      playDTMFTone(val);
      setDialNumber((prev) => prev + val);
    },
    [playDTMFTone],
  );

  const handleBackspace = useCallback(() => {
    setDialNumber((prev) => prev.slice(0, -1));
  }, []);

  const initiateCall = useCallback(
    (name, type = "video") => {
      if (ringTimeoutRef.current) {
        clearTimeout(ringTimeoutRef.current);
        ringTimeoutRef.current = null;
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      const contact = CONTACTS.find((c) => c.name.toLowerCase() === name.toLowerCase());
      setActiveCall({
        name,
        type,
        status: "ringing",
        avatar: contact?.avatar,
        callPreview: contact?.callPreview,
      });
      setCallTimer(0);
      startRingbackSound();
      ringTimeoutRef.current = setTimeout(() => {
        stopRingbackSound();
        setActiveCall((prev) => {
          if (!prev || prev.status !== "ringing") return prev;
          return { ...prev, status: "connected" };
        });
      }, 4500);
    },
    [startRingbackSound, stopRingbackSound],
  );

  const endCall = useCallback(() => {
    stopRingbackSound();
    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setActiveCall(null);
    setCallTimer(0);
    setMicMuted(false);
    setCameraMuted(false);
    setSpeakerMuted(false);
  }, [stopRingbackSound]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isWindowFocused()) return;
      const key = e.key;
      if (activeCall) {
        if (key === "Escape") {
          e.preventDefault();
          endCall();
        }
        return;
      }
      if (
        document.activeElement &&
        document.activeElement.tagName === "INPUT" &&
        !document.activeElement.readOnly
      ) {
        if (key === "Enter" && dialNumber) {
          e.preventDefault();
          initiateCall(dialNumber, "video");
          setIsSidebarOpen(false);
        }
        return;
      }
      if (sidebarTab === "dialpad") {
        if (/[0-9*#]/.test(key)) {
          e.preventDefault();
          handleDialPress(key);
        } else if (key === "Backspace") {
          e.preventDefault();
          handleBackspace();
        } else if (key === "Enter" && dialNumber) {
          e.preventDefault();
          initiateCall(dialNumber, "video");
          setIsSidebarOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    sidebarTab,
    activeCall,
    dialNumber,
    isWindowFocused,
    initiateCall,
    endCall,
    handleDialPress,
    handleBackspace,
  ]);

  useEffect(() => {
    return () => {
      stopRingbackSound();
    };
  }, [stopRingbackSound]);

  useEffect(() => {
    if (activeCall?.status === "connected") {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setCallTimer((t) => t + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [activeCall?.status]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${mins}:${seconds}`;
  };

  return {
    sidebarTab,
    setSidebarTab,
    searchQuery,
    setSearchQuery,
    dialNumber,
    setDialNumber,
    isSidebarOpen,
    setIsSidebarOpen,
    activeCall,
    callTimer,
    micMuted,
    setMicMuted,
    cameraMuted,
    setCameraMuted,
    speakerMuted,
    setSpeakerMuted,
    handleDialPress,
    handleBackspace,
    initiateCall,
    endCall,
    formatTimer,
  };
};

export default useCall;
