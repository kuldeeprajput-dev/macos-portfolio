import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import useWindowsStore from "@store/window";
import {
  X,
  Wifi,
  Bluetooth,
  Flashlight,
  Sun,
  Moon,
  Battery,
  Calculator,
  Camera,
  Search,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Tv,
  Radio,
  Sliders,
  Music,
  Settings as SettingsIcon,
  Bell,
  BellOff,
} from "lucide-react";

const MobileOSControlCenter = ({
  isControlOpen,
  setIsControlOpen,
  settings,
  now,
  toggle,
  brightness,
  setBrightness,
  volume,
  setVolume,
  controlCenterRef,
  openWindow,
}) => {
  const { systemSettings, updateSystemSetting, music, setMusicState } = useWindowsStore();
  const isLowPowerActive = systemSettings.lowPowerMode === "Always";
  const isPlaying = music.isPlaying;
  const brightnessSliderRef = useRef(null);
  const volumeSliderRef = useRef(null);

  const isNightMode = !!systemSettings.nightLight;

  // Track playback time
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSilent, setIsSilent] = useState(false);
  const [speedToast, setSpeedToast] = useState(false);
  const [silentBanner, setSilentBanner] = useState(null); // 'on' | 'off' | null

  const handleVolumeChange = (val) => {
    setVolume(val);
    setMusicState({ volume: val });
    const audioEl = document.querySelector("audio");
    if (audioEl) {
      audioEl.volume = val / 100;
    }
  };

  const handleToggleSilent = (e) => {
    e.stopPropagation();
    const nextSilent = !isSilent;
    setIsSilent(nextSilent);
    setSilentBanner(nextSilent ? "on" : "off");
    setTimeout(() => setSilentBanner(null), 2500);
  };

  const handleTriggerSpeedToast = (e) => {
    e.stopPropagation();
    setSpeedToast(true);
    setTimeout(() => setSpeedToast(false), 3000);
  };

  const handleLaunchApp = (appKey) => {
    setIsControlOpen(false);
    if (openWindow) {
      openWindow(appKey);
    }
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
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleControlCenterNext = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("macos-portfolio-next-track"));
  };

  const handleControlCenterPrev = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("macos-portfolio-prev-track"));
  };

  const handleControlCenterPlayPause = (e) => {
    e.stopPropagation();
    setMusicState({ isPlaying: !music.isPlaying });
  };

  const handleToggleNightMode = (e) => {
    e.stopPropagation();
    updateSystemSetting("nightLight", !systemSettings.nightLight);
  };

  useEffect(() => {
    if (!controlCenterRef.current) return;
    if (isControlOpen) {
      gsap.fromTo(
        controlCenterRef.current,
        { y: "-100%", opacity: 0, pointerEvents: "none" },
        {
          y: "0%",
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.45,
          ease: "power4.out",
          force3D: true,
        },
      );
    } else {
      gsap.to(controlCenterRef.current, {
        y: "-100%",
        opacity: 0,
        pointerEvents: "none",
        duration: 0.35,
        ease: "power3.inOut",
        force3D: true,
      });
    }
  }, [isControlOpen, controlCenterRef]);

  useEffect(() => {
    if (!isControlOpen) return;
    const handleOutside = (e) => {
      if (controlCenterRef.current && !controlCenterRef.current.contains(e.target)) {
        setIsControlOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isControlOpen, setIsControlOpen, controlCenterRef]);

  const handleVerticalSlider = (e, ref, setValue) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const updateValue = (clientY) => {
      const height = rect.height;
      const relativeY = rect.bottom - clientY;
      const percentage = Math.max(0, Math.min(100, Math.round((relativeY / height) * 100)));
      setValue(percentage);
    };

    updateValue(e.clientY || (e.touches && e.touches[0].clientY));

    const handlePointerMove = (moveEvent) => {
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      updateValue(clientY);
    };

    const handlePointerUp = () => {
      document.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseup", handlePointerUp);
      document.removeEventListener("touchmove", handlePointerMove);
      document.removeEventListener("touchend", handlePointerUp);
    };

    document.addEventListener("mousemove", handlePointerMove);
    document.addEventListener("mouseup", handlePointerUp);
    document.addEventListener("touchmove", handlePointerMove, { passive: false });
    document.addEventListener("touchend", handlePointerUp);
  };

  return (
    <>
      {/* Static Frosted Backdrop Overlay */}
      <div
        onClick={() => setIsControlOpen(false)}
        className="fixed inset-0 z-[74] bg-[rgba(10,10,12,0.78)] backdrop-blur-[45px] backdrop-saturate-[2.1] pointer-events-none opacity-0"
        style={{
          opacity: isControlOpen ? 1 : 0,
          pointerEvents: isControlOpen ? "auto" : "none",
          transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "opacity",
        }}
      />

      <aside
        ref={controlCenterRef}
        className="absolute top-0 left-0 w-full z-[75] overflow-hidden -translate-y-full opacity-0"
        style={{
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
      >
        <div
          onClick={() => setIsControlOpen(false)}
          className="bg-transparent min-h-dvh pt-[55px] pb-10 px-5 flex flex-col gap-4 select-none relative overflow-y-auto"
        >
          {/* Ambient decorative glowing blobs behind the glass (iOS 18 wallpaper style) */}
          <div className="absolute top-[10%] left-[-25%] w-[320px] h-[320px] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none z-0" />
          <div className="absolute top-[5%] right-[-20%] w-[300px] h-[300px] rounded-full bg-yellow-500/15 blur-[100px] pointer-events-none z-0" />
          <div className="absolute bottom-[10%] left-[10%] w-[320px] h-[320px] rounded-full bg-red-500/20 blur-[100px] pointer-events-none z-0" />

          {/* Speed Toast Banner */}
          {speedToast && (
            <div className="absolute top-[65px] left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full shadow-lg text-[11px] font-semibold flex items-center gap-2 animate-[slideDown_0.3s_ease-out] text-white">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span>Network Speed: 184.2 Mbps (5G)</span>
            </div>
          )}

          {/* Silent Mode Notification Banner */}
          {silentBanner && (
            <div className="absolute top-[65px] left-1/2 -translate-x-1/2 z-50 bg-black/85 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full shadow-2xl text-[11.5px] font-bold flex items-center gap-2.5 animate-[slideDown_0.25s_ease-out] text-white">
              {silentBanner === "on" ? (
                <>
                  <BellOff size={13} className="text-red-500" />
                  <span>Silent Mode</span>
                  <span className="text-red-500 font-extrabold uppercase text-[10px] ml-1 bg-red-500/10 px-1.5 py-0.5 rounded-md">
                    Silent
                  </span>
                </>
              ) : (
                <>
                  <Bell size={13} className="text-gray-400" />
                  <span>Silent Mode</span>
                  <span className="text-gray-400 font-extrabold uppercase text-[10px] ml-1 bg-white/10 px-1.5 py-0.5 rounded-md">
                    Ring
                  </span>
                </>
              )}
            </div>
          )}

          {/* Header Area with Date / Close */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between mt-2 mb-1 z-10"
          >
            <div className="w-[34px]" />
            <h2 className="text-sm font-semibold tracking-wider uppercase text-white/70">
              Control Center
            </h2>
            <button
              onClick={() => setIsControlOpen(false)}
              className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-white/10 hover:bg-white/15 transition-colors active:scale-95"
            >
              <X size={16} strokeWidth={2.5} className="text-white" />
            </button>
          </div>

          {/* Page Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex-1 w-full z-10 flex flex-col justify-start"
          >
            <div className="flex flex-col gap-4 animate-[fadeIn_0.25s_ease-out]">
              {/* Top Connectivity Horizontal Row */}
              <div className="grid grid-cols-4 gap-3.5 w-full bg-white/[0.03] border border-white/[0.05] rounded-[28px] p-3 shadow-lg justify-items-center">
                {[
                  { key: "wifi", icon: <Wifi size={18} />, color: "#007aff", label: "Wi-Fi" },
                  {
                    key: "airplane",
                    icon: (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white transform rotate-45"
                      >
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                      </svg>
                    ),
                    color: "#ff9500",
                    label: "Airplane",
                  },
                  {
                    key: "cellular",
                    icon: (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <circle cx="12" cy="9" r="1.5" fill="currentColor" />
                        <path d="M12 10.5v9.5" />
                        <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        <path d="M7.76 7.76a6 6 0 0 0 0 8.49" />
                        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
                      </svg>
                    ),
                    color: "#30d158",
                    label: "Cellular",
                  },
                  {
                    key: "bluetooth",
                    icon: <Bluetooth size={18} />,
                    color: "#007aff",
                    label: "Bluetooth",
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => toggle(item.key)}
                    className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-all border border-white/[0.05] shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
                    style={{
                      background: settings[item.key] ? item.color : "rgba(255,255,255,0.06)",
                    }}
                    title={item.label}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>

              {/* Music / Now Playing Widget (Full Width Layout) */}
              <div className="bg-white/[0.05] border border-white/[0.06] shadow-xl rounded-[24px] p-3 flex gap-3 w-full">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-tr ${music.activeTrack?.coverColor || "from-pink-500 via-purple-600 to-indigo-500"} flex items-center justify-center shadow-md ${isPlaying ? "animate-pulse" : ""} flex-shrink-0 relative overflow-hidden`}
                >
                  {music.activeTrack?.coverUrl ? (
                    <img
                      src={music.activeTrack.coverUrl}
                      alt="art"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-base font-bold">
                      {music.activeTrack?.coverText || "🎵"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="flex justify-between items-center">
                    <div className="truncate pr-2">
                      <p className="text-[11.5px] font-bold text-white truncate leading-snug">
                        {music.activeTrack?.title || "Not Playing"}
                      </p>
                      <p className="text-[9.5px] text-white/40 truncate">
                        {music.activeTrack?.artist || "Select a Song"}
                      </p>
                    </div>
                    <Radio size={13} className="text-white/45 flex-shrink-0 animate-pulse" />
                  </div>

                  <div className="flex items-center gap-4 mt-1">
                    {/* Media Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleControlCenterPrev}
                        className="text-white/70 active:scale-75 transition-all"
                      >
                        <SkipBack size={13} fill="currentColor" />
                      </button>
                      <button
                        onClick={handleControlCenterPlayPause}
                        className="w-5.5 h-5.5 rounded-full bg-white text-black flex items-center justify-center active:scale-90 transition-transform shadow"
                      >
                        {isPlaying ? (
                          <Pause size={9} fill="currentColor" />
                        ) : (
                          <Play size={9} fill="currentColor" className="ml-0.5" />
                        )}
                      </button>
                      <button
                        onClick={handleControlCenterNext}
                        className="text-white/70 active:scale-75 transition-all"
                      >
                        <SkipForward size={13} fill="currentColor" />
                      </button>
                    </div>

                    {/* Progress Line */}
                    <div
                      className="flex-1 relative h-3 flex items-center group"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => {
                          const newTime = parseFloat(e.target.value);
                          setCurrentTime(newTime);
                          const audioEl = document.querySelector("audio");
                          if (audioEl) audioEl.currentTime = newTime;
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full h-[3px] bg-white/15 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full"
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Section: Sliders on Right, Rec buttons on Left */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Left Column (Mirroring & Night Mode Rectangles) */}
                <div className="flex flex-col gap-4 justify-between h-[180px]">
                  {/* Screen Mirroring Rect Button */}
                  <button className="flex items-center gap-3 p-3 rounded-[20px] bg-white/[0.05] border border-white/[0.06] shadow-lg active:scale-95 transition-all text-left w-full h-[82px] justify-start">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white/80"
                      >
                        <rect x="2" y="5" width="13" height="9" rx="2" />
                        <rect x="8" y="10" width="13" height="9" rx="2" fill="#0d0d10" />
                        <rect x="8" y="10" width="13" height="9" rx="2" />
                      </svg>
                    </div>
                    <div className="truncate">
                      <p className="text-[11px] font-bold text-white leading-tight">Mirroring</p>
                      <p className="text-[8px] text-white/40 mt-0.5">AirPlay TV</p>
                    </div>
                  </button>

                  {/* Night Mode Rect Button */}
                  <button
                    onClick={handleToggleNightMode}
                    className="flex items-center gap-3 p-3 rounded-[20px] border border-white/[0.06] shadow-lg active:scale-95 transition-all text-left w-full h-[82px] justify-start"
                    style={{
                      background: isNightMode ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{
                        background: isNightMode ? "#ff9500" : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                        <path
                          d="M12.2 7.8a4.2 4.2 0 0 0 4 4 4.8 4.8 0 1 1-4-4Z"
                          fill={isNightMode ? "currentColor" : "none"}
                        />
                      </svg>
                    </div>
                    <div className="truncate">
                      <p className="text-[11px] font-bold text-white leading-tight">Night Mode</p>
                      <p className="text-[8px] text-white/45 mt-0.5">
                        {isNightMode ? "Active" : "Off"}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Right Column (Vertical Capsule Sliders) */}
                <div className="grid grid-cols-2 gap-3 bg-white/[0.05] border border-white/[0.06] shadow-lg rounded-[28px] p-3 h-[180px]">
                  {/* Brightness */}
                  <div className="flex flex-col items-center justify-between h-full">
                    <div
                      ref={brightnessSliderRef}
                      onMouseDown={(e) =>
                        handleVerticalSlider(e, brightnessSliderRef, setBrightness)
                      }
                      onTouchStart={(e) =>
                        handleVerticalSlider(e, brightnessSliderRef, setBrightness)
                      }
                      className="relative w-full h-[125px] bg-white/[0.06] border border-white/[0.05] rounded-3xl overflow-hidden cursor-pointer select-none active:scale-[0.98] transition-transform"
                    >
                      <div
                        className="absolute bottom-0 left-0 w-full bg-white/20 backdrop-blur-[2px] transition-all duration-75"
                        style={{ height: `${brightness}%` }}
                      />
                      <div className="absolute inset-0 flex flex-col justify-end items-center pb-2.5 pointer-events-none">
                        <Sun size={16} className="text-white/80" />
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-white/50 mt-0.5">{brightness}%</span>
                  </div>

                  {/* Volume */}
                  <div className="flex flex-col items-center justify-between h-full">
                    <div
                      ref={volumeSliderRef}
                      onMouseDown={(e) =>
                        handleVerticalSlider(e, volumeSliderRef, handleVolumeChange)
                      }
                      onTouchStart={(e) =>
                        handleVerticalSlider(e, volumeSliderRef, handleVolumeChange)
                      }
                      className="relative w-full h-[125px] bg-white/[0.06] border border-white/[0.05] rounded-3xl overflow-hidden cursor-pointer select-none active:scale-[0.98] transition-transform"
                    >
                      <div
                        className="absolute bottom-0 left-0 w-full bg-white/20 backdrop-blur-[2px] transition-all duration-75"
                        style={{ height: `${volume}%` }}
                      />
                      <div className="absolute inset-0 flex flex-col justify-end items-center pb-2.5 pointer-events-none">
                        <Volume2 size={16} className="text-white/80" />
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-white/50 mt-0.5">{volume}%</span>
                  </div>
                </div>
              </div>

              {/* Bottom 2x4 Circular Utility Grid */}
              <div className="w-full bg-white/[0.03] border border-white/[0.05] rounded-[28px] p-4 flex flex-col gap-3 mt-1 shadow-lg">
                <h4 className="text-[9px] font-bold text-white/40 uppercase tracking-wider pl-1">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-4 gap-4 justify-items-center">
                  <button
                    onClick={() => handleLaunchApp("calculator")}
                    className="w-11 h-11 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.05] flex items-center justify-center transition-all active:scale-90"
                    title="Calculator"
                  >
                    <Calculator size={18} className="text-white/80" />
                  </button>
                  <button
                    onClick={() => handleLaunchApp("photos")}
                    className="w-11 h-11 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.05] flex items-center justify-center transition-all active:scale-90"
                    title="Camera"
                  >
                    <Camera size={18} className="text-white/80" />
                  </button>
                  <button
                    onClick={() => handleLaunchApp("safari")}
                    className="w-11 h-11 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.05] flex items-center justify-center transition-all active:scale-90"
                    title="Search"
                  >
                    <Search size={18} className="text-white/80" />
                  </button>
                  <button
                    onClick={() =>
                      updateSystemSetting("lowPowerMode", isLowPowerActive ? "Never" : "Always")
                    }
                    className="w-11 h-11 rounded-full border border-white/[0.05] flex items-center justify-center transition-all active:scale-90"
                    style={{
                      background: isLowPowerActive ? "#30d158" : "rgba(255,255,255,0.06)",
                    }}
                    title="Low Power Mode"
                  >
                    <Battery size={18} className="text-white" />
                  </button>

                  <button
                    onClick={() => toggle("flashlight")}
                    className="w-11 h-11 rounded-full border border-white/[0.05] flex items-center justify-center transition-all active:scale-90"
                    style={{
                      background: settings.flashlight ? "#ffcc00" : "rgba(255,255,255,0.06)",
                    }}
                    title="Flashlight"
                  >
                    <Flashlight
                      size={18}
                      className={settings.flashlight ? "text-black" : "text-white"}
                    />
                  </button>
                  <button
                    className="w-11 h-11 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.05] flex items-center justify-center transition-all active:scale-90"
                    title="Settings"
                    onClick={() => {
                      setIsControlOpen(false);
                      updateSystemSetting("activeTab", "General");
                      if (openWindow) openWindow("settings");
                    }}
                  >
                    <SettingsIcon size={18} className="text-white/80" />
                  </button>
                  <button
                    onClick={handleTriggerSpeedToast}
                    className="w-11 h-11 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.05] flex items-center justify-center transition-all active:scale-90"
                    title="Network Speed"
                  >
                    <Sliders size={18} className="text-white/80" />
                  </button>
                  <button
                    onClick={handleToggleSilent}
                    className="w-11 h-11 rounded-full border border-white/[0.05] flex items-center justify-center transition-all active:scale-90"
                    style={{
                      background: isSilent ? "#ff453a" : "rgba(255,255,255,0.06)",
                    }}
                    title="Silent Mode"
                  >
                    {isSilent ? (
                      <BellOff size={18} className="text-white" />
                    ) : (
                      <Bell size={18} className="text-white/80" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global CSS for fade animation */}
        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.985) translateY(2px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
      </aside>
    </>
  );
};

export default MobileOSControlCenter;
