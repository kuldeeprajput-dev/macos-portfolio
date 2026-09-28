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
  const invalidNumberAudioRef = useRef(null);
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
    if (!/^[0-9*#]$/.test(digit)) return;
    const key = digit === "*" ? "star" : digit === "#" ? "hash" : digit;
    const audio = new Audio(`/system/audio/dialpad-${key}.wav`);
    audio.play().catch((error) => {
      if (error.name !== "AbortError") console.error("Dialpad audio error", error);
    });
  }, []);

  const startRingbackSound = useCallback((onEnded = null) => {
    const audio = ringbackAudioRef.current ?? new Audio("/system/audio/ringback.mp3");
    ringbackAudioRef.current = audio;
    audio.loop = !onEnded;
    audio.onended = onEnded;
    audio.currentTime = 0;
    audio.play().catch((error) => {
      if (error.name !== "AbortError") console.error("Ringback error", error);
      if (onEnded && audio.onended === onEnded) onEnded();
    });
  }, []);

  const stopRingbackSound = useCallback(() => {
    const audio = ringbackAudioRef.current;
    if (!audio) return;
    audio.onended = null;
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

  const endCall = useCallback(() => {
    stopRingbackSound();
    const invalidNumberAudio = invalidNumberAudioRef.current;
    if (invalidNumberAudio) {
      invalidNumberAudio.onended = null;
      invalidNumberAudio.onerror = null;
      invalidNumberAudio.pause();
      invalidNumberAudio.currentTime = 0;
      invalidNumberAudioRef.current = null;
    }
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

  const initiateCall = useCallback(
    (name, type = "video") => {
      endCall();
      const contact = CONTACTS.find((c) => c.name.toLowerCase() === name.toLowerCase());
      setActiveCall({ name, type, status: "ringing", avatar: contact?.avatar });

      if (/^[0-9*#+]+$/.test(name)) {
        startRingbackSound(() => {
          stopRingbackSound();
          const audio = new Audio("/system/audio/invalid-number.mp3");
          invalidNumberAudioRef.current = audio;
          const finishCall = () => {
            if (invalidNumberAudioRef.current === audio) endCall();
          };
          audio.onended = finishCall;
          audio.onerror = finishCall;
          audio.play().catch((error) => {
            if (invalidNumberAudioRef.current !== audio) return;
            if (error.name !== "AbortError") console.error("Invalid number audio error", error);
            endCall();
          });
        });
        return;
      }

      startRingbackSound();
      ringTimeoutRef.current = setTimeout(() => {
        stopRingbackSound();
        setActiveCall((prev) => {
          if (!prev || prev.status !== "ringing") return prev;
          return { ...prev, status: "connected" };
        });
      }, 4500);
    },
    [endCall, startRingbackSound, stopRingbackSound],
  );

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
      const audio = invalidNumberAudioRef.current;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
        invalidNumberAudioRef.current = null;
      }
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
