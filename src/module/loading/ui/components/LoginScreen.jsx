import { useState, useEffect } from "react";
import {
  ArrowRight,
  Moon,
  Power,
  RotateCcw,
  Lock,
  ChevronLeft,
  Delete,
  Volume2,
  Camera,
  Shield,
} from "lucide-react";

const LoginScreen = ({ onLogin, isMobile }) => {
  const [password, setPassword] = useState("");
  const [isAsleep, setIsAsleep] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [error, setError] = useState(false);
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [torchTrack, setTorchTrack] = useState(null);

  const togglePhysicalTorch = async (activate) => {
    if (activate) {
      try {
        if (
          typeof navigator === "undefined" ||
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        )
          return;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: true }],
          });
          setTorchTrack(track);
        }
      } catch (err) {
        console.warn("Physical torch error:", err);
      }
    } else {
      if (torchTrack) {
        try {
          await torchTrack.applyConstraints({
            advanced: [{ torch: false }],
          });
          torchTrack.stop();
        } catch (err) {
          console.warn("Error turning off physical torch:", err);
        }
        setTorchTrack(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (torchTrack) {
        torchTrack.stop();
      }
    };
  }, [torchTrack]);
  const [showCameraView, setShowCameraView] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [activeFilter, setActiveFilter] = useState("normal");
  const [shutterFlash, setShutterFlash] = useState(false);

  const startCamera = async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      console.warn(
        "Camera API not supported in this context (requires HTTPS or localhost). Launching mock camera.",
      );
      setShowCameraView(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setCameraStream(stream);
      setShowCameraView(true);
      setTimeout(() => {
        const video = document.getElementById("lockscreen-camera-video");
        if (video) {
          video.srcObject = stream;
          video.play().catch((err) => console.log("Video playback error:", err));
        }
      }, 100);
    } catch (err) {
      console.warn("Camera API error:", err);
      // Fallback to mock if permission is denied
      setShowCameraView(true);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraView(false);
  };

  const takePhoto = () => {
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 250);
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Time and Date State
  const getFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes}`;
  };

  const getFormattedDate = () => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    return new Date().toLocaleDateString("en-US", options);
  };

  const [time, setTime] = useState(getFormattedTime());
  const [dateStr, setDateStr] = useState(getFormattedDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getFormattedTime());
      setDateStr(getFormattedDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Alternating between Namaste SVG (0) and Hello SVG (1) - Desktop Only
  const [activeSvg, setActiveSvg] = useState(0);

  useEffect(() => {
    if (!isMobile) {
      const timer = setInterval(() => {
        setActiveSvg((prev) => (prev === 0 ? 1 : 0));
      }, 2500);
      return () => clearInterval(timer);
    }
  }, [isMobile]);

  const triggerFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log("Error attempting to enable fullscreen:", err);
      });
    }
  };

  // Handle keypresses for Unlock (Enter) or Escape to go back
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showPasswordInput) {
        if (e.key === "Enter" || e.key === " ") {
          triggerFullscreen();
          setShowPasswordInput(true);
        }
      } else {
        if (e.key === "Escape") {
          setShowPasswordInput(false);
          setPassword("");
        } else if (!isMobile) {
          // Keyboard entry for passcode on mobile or desktop password
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPasswordInput, isMobile]);

  const handleShutDown = () => {
    setIsShuttingDown(true);
    setTimeout(() => {
      window.location.href = "about:blank";
    }, 2000);
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    triggerFullscreen();
    const currentYear = new Date().getFullYear().toString();
    if (password === currentYear) {
      onLogin();
    } else {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 500);
    }
  };

  // Custom keypads for iOS
  const handleKeypadPress = (num) => {
    triggerFullscreen();
    if (password.length < 4) {
      const nextPass = password + num;
      setPassword(nextPass);

      // Auto-unlock if 4 digits are completed
      if (nextPass.length === 4) {
        const currentYear = new Date().getFullYear().toString();
        if (nextPass === currentYear) {
          setTimeout(() => {
            onLogin();
          }, 150);
        } else {
          setTimeout(() => {
            setError(true);
            setTimeout(() => {
              setPassword("");
              setError(false);
            }, 500);
          }, 150);
        }
      }
    }
  };

  const handleBackspace = () => {
    triggerFullscreen();
    setPassword((prev) => prev.slice(0, -1));
  };

  // iOS 17 Lock Screen (Mobile Version)
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-between text-white select-none overflow-hidden"
        style={{
          backgroundImage:
            "image-set(url('/images/mobile-wallpaper.webp') type('image/webp'), url('/images/mobile-wallpaper.png'))",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={() => {
          if (!showPasswordInput && !showCameraView) {
            triggerFullscreen();
            setShowPasswordInput(true);
          }
        }}
      >
        {/* Dynamic abstract wallpaper patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none z-0" />

        {/* Flashlight screen effect */}
        {flashlightActive && (
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] pointer-events-none z-10 transition-opacity duration-300" />
        )}

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
          }
          .shake-animation {
            animation: shake 0.4s ease-in-out;
          }
        `}</style>

        {/* Dynamic Island cutout at the very top */}
        <div className="w-28 h-[26px] bg-[#0a0a0a] rounded-full border border-neutral-900 flex items-center justify-between px-3.5 mt-3 shadow-lg z-20">
          {/* FaceID Sensor / TrueDepth Array */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#080808] border border-neutral-950 flex-shrink-0" />
          {/* Front Camera Lens with blue AR glass element reflection */}
          <div className="w-3.5 h-3.5 rounded-full bg-[#030307] border border-[#1a1a24] shadow-inner flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0d2d4d] opacity-90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-cyan-400 opacity-60" />
            </div>
          </div>
        </div>

        {!showPasswordInput ? (
          /* iOS 17 Lock Screen Phase */
          <div className="flex flex-col items-center justify-between h-full w-full px-6 py-8 z-10 animate-in fade-in zoom-in-95 duration-300">
            {/* Top Lock status, date, and clock */}
            <div className="flex flex-col items-center mt-8">
              <div className="flex items-center gap-1 opacity-80 mb-2">
                <Lock className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Locked</span>
              </div>
              <p className="text-white/80 text-sm font-semibold tracking-wide drop-shadow-md">
                {dateStr}
              </p>
              <h1 className="text-white text-8xl font-semibold tracking-tighter drop-shadow-lg mt-0.5">
                {time}
              </h1>
            </div>

            {/* Notification preview (iOS Widget style) */}
            <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex gap-3.5 shadow-xl animate-bounce duration-[3000ms] mt-10">
              <img
                src="/images/profile.webp"
                alt="Profile Avatar"
                className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-sm shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-white leading-tight">Welcome</span>
                  <span className="text-[9px] text-white/50 font-medium">now</span>
                </div>
                <p className="text-[11px] text-white/95 leading-normal mt-0.5 truncate font-semibold">
                  Kuldeep rajput's Portfolio
                </p>
                <p className="text-[10px] text-white/60 leading-normal truncate">
                  Swipe up or Tap to view portfolio. Passcode is {new Date().getFullYear()}.
                </p>
              </div>
            </div>

            {/* Bottom Actions & Home Swipe Line */}
            <div className="w-full max-w-sm flex flex-col items-center gap-6 mt-auto">
              <div className="flex justify-between w-full px-4">
                {/* Flashlight button */}
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const nextActive = !flashlightActive;
                    setFlashlightActive(nextActive);
                    await togglePhysicalTorch(nextActive);
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    flashlightActive
                      ? "bg-white text-black shadow-lg shadow-white/20"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/5"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M18 6c0-2.2-1.8-4-4-4h-4C7.8 2 6 3.8 6 6v4c0 .6.4 1.2 1 1.4L9 12.3V19c0 1.7 1.3 3 3 3s3-1.3 3-3v-6.7l2-1c.6-.2 1-.8 1-1.4V6z" />
                    <path d="M9 7h6M9 10h6" />
                  </svg>
                </button>

                {/* Home Swipe Text Indicator */}
                <div className="flex flex-col items-center justify-center opacity-70">
                  <span className="text-[11px] font-bold tracking-wider text-white uppercase animate-pulse">
                    Tap to unlock
                  </span>
                </div>

                {/* Camera placeholder button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/5 flex items-center justify-center transition-colors cursor-pointer text-white"
                >
                  <Camera className="w-4.5 h-4.5" strokeWidth={2.5} />
                </button>
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="w-32 h-1 bg-white/80 rounded-full mb-1 shadow-sm" />
            </div>
          </div>
        ) : (
          /* iOS 17 Passcode Keypad Phase */
          <div className="flex flex-col items-center justify-between h-full w-full px-6 py-8 z-10 animate-in fade-in duration-300">
            {/* Back button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPasswordInput(false);
                setPassword("");
              }}
              className="self-start mt-6 flex items-center gap-1 bg-white/5 border border-white/5 rounded-full px-3 py-1.5 text-[11px] text-white/80 transition-all cursor-pointer active:bg-white/15"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Cancel</span>
            </button>

            {/* Lock / Header Section */}
            <div className="flex flex-col items-center mt-3">
              <Lock className="w-4.5 h-4.5 text-white/90 mb-3" />
              <h2 className="text-[15px] font-bold tracking-wide text-white">Enter Passcode</h2>
              <p className="text-[10px] text-white/40 font-semibold mt-1">
                Passcode is the current year (e.g. {new Date().getFullYear()})
              </p>
            </div>

            {/* Passcode dots with optional shake on error */}
            <div className={error ? "shake-animation" : ""}>
              <div className="flex gap-4 my-8 justify-center">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border border-white transition-all duration-150 ${
                      password.length > i ? "bg-white scale-110" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Interactive Keypad */}
            <div
              className="w-full max-w-[280px] mx-auto mb-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-3 gap-y-4 gap-x-6 justify-items-center">
                {[
                  { num: "1", letters: "" },
                  { num: "2", letters: "A B C" },
                  { num: "3", letters: "D E F" },
                  { num: "4", letters: "G H I" },
                  { num: "5", letters: "J K L" },
                  { num: "6", letters: "M N O" },
                  { num: "7", letters: "P Q R S" },
                  { num: "8", letters: "T U V" },
                  { num: "9", letters: "W X Y Z" },
                ].map((key) => (
                  <button
                    key={key.num}
                    onClick={() => handleKeypadPress(key.num)}
                    className="w-16 h-16 rounded-full bg-white/10 active:bg-white/30 backdrop-blur-md flex flex-col items-center justify-center transition-colors border border-white/5 shadow-md cursor-pointer"
                  >
                    <span className="text-2xl font-semibold text-white">{key.num}</span>
                    {key.letters && (
                      <span className="text-[7px] text-white/50 tracking-widest font-bold mt-0.5">
                        {key.letters}
                      </span>
                    )}
                  </button>
                ))}

                {/* Cancel button */}
                <button
                  onClick={() => {
                    setShowPasswordInput(false);
                    setPassword("");
                  }}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xs font-semibold text-white/80 active:opacity-60 cursor-pointer"
                >
                  Cancel
                </button>

                {/* 0 Key */}
                <button
                  onClick={() => handleKeypadPress("0")}
                  className="w-16 h-16 rounded-full bg-white/10 active:bg-white/30 backdrop-blur-md flex flex-col items-center justify-center transition-colors border border-white/5 shadow-md cursor-pointer"
                >
                  <span className="text-2xl font-semibold text-white">0</span>
                </button>

                {/* Delete / Backspace */}
                <button
                  onClick={handleBackspace}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xs font-semibold text-white/80 active:opacity-60 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Camera modal view overlay */}
        {showCameraView && (
          <div
            className="absolute inset-0 bg-black z-[120] flex flex-col justify-between py-6 px-4 animate-in fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar controls */}
            <div className="flex justify-between items-center z-[130] mt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stopCamera();
                }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5 active:bg-white/20 transition-all cursor-pointer text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="bg-black/40 border border-white/5 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/85 select-none">
                Live Filter: {activeFilter}
              </div>

              <div className="w-10 h-10 opacity-0 pointer-events-none" />
            </div>

            {/* Video preview with live CSS filter / Mock preview fallback */}
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
              {cameraStream ? (
                <video
                  id="lockscreen-camera-video"
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{
                    filter:
                      activeFilter === "mono"
                        ? "grayscale(1)"
                        : activeFilter === "noir"
                          ? "contrast(1.4) grayscale(1)"
                          : activeFilter === "vivid"
                            ? "saturate(1.8)"
                            : "none",
                    transform: "scaleX(-1)", // mirror for front camera feel
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center relative bg-neutral-950">
                  <img
                    src="/images/profile.webp"
                    alt="Mock viewfinder"
                    className="w-full h-full object-cover opacity-50 transition-all duration-300"
                    style={{
                      filter:
                        activeFilter === "mono"
                          ? "grayscale(1)"
                          : activeFilter === "noir"
                            ? "contrast(1.4) grayscale(1)"
                            : activeFilter === "vivid"
                              ? "saturate(1.8)"
                              : "none",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 pointer-events-none p-6 text-center">
                    <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase bg-black/60 px-4 py-2 rounded-full border border-white/5 shadow-lg">
                      Preview Mode (HTTP/Non-Secure)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Visual flash effect */}
            {shutterFlash && (
              <div className="absolute inset-0 bg-white z-[999] pointer-events-none transition-opacity duration-300" />
            )}

            {/* Bottom Controls */}
            <div className="flex justify-between items-center px-6 mb-8 z-[130]">
              {/* Filter toggle button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const filters = ["normal", "mono", "noir", "vivid"];
                  const idx = filters.indexOf(activeFilter);
                  const nextFilter = filters[(idx + 1) % filters.length];
                  setActiveFilter(nextFilter);
                }}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-white active:bg-white/20 transition-colors cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2v16a8 8 0 0 0 0-16z" />
                </svg>
              </button>

              {/* Shutter button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  takePhoto();
                }}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-white active:bg-neutral-250 transition-colors" />
              </button>

              {/* Camera flip mock / placeholder */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-white active:bg-white/20 transition-colors cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Classic Desktop Lock/Login Screen (macOS style)
  return (
    <>
      {isAsleep && (
        <div
          className="fixed inset-0 z-[999999] bg-black cursor-pointer"
          onClick={() => setIsAsleep(false)}
        ></div>
      )}

      {isShuttingDown && (
        <div className="fixed inset-0 bg-black z-[9999999] flex flex-col items-center justify-center select-none cursor-none">
          <img
            src="/icons/appleLogo.svg"
            alt="Apple Logo"
            className="w-14 h-14 invert dark:invert-0 opacity-95 animate-pulse mb-8"
          />
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Styles for shake and smooth SVG drawing */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }

        @keyframes drawSvgPathNamaste {
          0% {
            stroke-dashoffset: 3462.72;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }
        .svg-drawing-path-namaste {
          stroke-dasharray: 3462.72;
          stroke-dashoffset: 3462.72;
          animation: drawSvgPathNamaste 2.5s ease-in-out forwards;
        }

        @keyframes drawSvgPathHello {
          0% {
            stroke-dashoffset: -2000;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }
        .svg-drawing-path-hello {
          stroke-dasharray: 2000;
          stroke-dashoffset: -2000;
          animation: drawSvgPathHello 2.5s ease-in-out forwards;
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/10 backdrop-blur-lg select-none py-12 px-6"
        onClick={() => {
          if (!showPasswordInput) {
            triggerFullscreen();
            setShowPasswordInput(true);
          }
        }}
      >
        {!showPasswordInput ? (
          /* Lock Screen Phase */
          <div className="flex flex-col items-center justify-between h-full w-full max-w-lg text-white">
            {/* Top Lock and Date/Time */}
            <div className="flex flex-col items-center mt-6">
              <Lock className="w-5 h-5 text-white/90 mb-3" />
              <p className="text-white/90 text-lg font-medium tracking-wide drop-shadow-md">
                {dateStr}
              </p>
              <h1 className="text-white text-7xl sm:text-8xl font-light tracking-tighter drop-shadow-lg mt-1 select-text">
                {time}
              </h1>
            </div>

            {/* Central Animated SVG Greeting */}
            <div className="flex-1 flex items-center justify-center py-10 w-full max-w-xl px-4 overflow-hidden">
              {activeSvg === 0 ? (
                /* Namaste SVG */
                <svg
                  key="namaste"
                  viewBox="0 0 786 331"
                  className="w-full h-auto drop-shadow-[0_8px_24px_rgba(255,255,255,0.2)]"
                >
                  <path
                    d="M152.163 130.821C155.884 171.241 155.392 193.902 152.163 234.321M151.663 303.824C155.663 354.324 147.329 268.298 152.163 234.321M152.163 234.321C108.727 198.737 83.1502 190.409 60.663 193.324M60.663 193.324C32.0982 193.351 29.5781 200.382 22.6628 217.324C19.4228 234.668 22.5001 240.864 33.6628 247.824C45.9487 254.637 53.3756 255.923 67.6628 253.324C75.2641 250.491 79.8886 245.664 82.163 225.324C82.3946 204.561 77.6677 199.437 60.663 193.324ZM263.663 128.824C269.565 162.487 269.176 180.577 263.663 211.824C261.738 228.106 257.035 239.784 242.663 264.824C229.588 281.175 198.205 273.237 196.663 245.824C195.678 228.313 210.163 214.824 210.163 214.824C210.163 214.824 220.663 205.324 249.663 205.324C278.663 205.324 342.219 234.321 342.219 234.321L343.295 130.565C345.972 129.913 338.626 371.48 339.663 307.824M453.663 130.684C498.393 145.245 516.058 159.254 529.663 178.324C546.163 200.324 527.578 241.7 495.163 257.824M495.163 257.824C495.163 257.824 441.163 261.824 417.663 245.824C394.163 229.824 405.163 207.324 417.663 200.324C430.163 193.324 465.793 204.292 484.163 237.824C484.163 237.824 514.162 312.824 517.162 319.324C520.163 325.824 495.163 257.824 495.163 257.824ZM535.162 229.824C570.663 242.324 633.664 247.324 613.163 234.824M722.163 304.324C721.186 251.842 719.663 129.436 719.663 129.436C712.603 90.5507 700.11 46.8239 700.663 60.8239M722.163 304.324C722.163 252.824 720.499 356.062 722.163 304.324ZM722.163 304.324C720.849 254.412 696.918 197.632 663.663 202.824C630.408 208.015 621.888 223.105 617.163 238.824C609.368 268.718 649.663 353.324 628.663 303.324M22.6629 128.824C-110.337 133.324 887.663 129.436 769.163 129.436M700.663 60.8239C699.163 22.8238 625.163 -1.17599 613.163 16.324C601.163 33.8239 623.055 46.5272 640.163 55.324C657.271 64.1207 687.163 83.3239 700.663 60.8239Z"
                    stroke="white"
                    strokeWidth="21"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="svg-drawing-path-namaste"
                  />
                </svg>
              ) : (
                /* Hello SVG */
                <svg
                  key="hello"
                  viewBox="0 0 512 342"
                  className="w-full h-auto drop-shadow-[0_8px_24px_rgba(255,255,255,0.2)]"
                >
                  <g transform="translate(256, 171)">
                    <path
                      d="M210.25,1.907C191.75,22.382,184.25,11.881,159.25,2.516C122.234,-11.35,101.515,58.907,144.75,58.907C174.25,58.907,187.75,0.881,149.25,0.881C116.016,0.881,121.25,58.907,88.25,58.907C26.064,58.907,62.25,-63.593,88.25,-63.593C117.75,-63.593,82.75,58.907,31.75,58.907C-19.25,58.907,3.75,-63.593,29.75,-63.593C59.75,-63.593,33.25,58.907,-27.75,58.907C-69.25,58.907,-65.75,1.907,-36.25,1.907C-6.75,1.907,-62.313,81.381,-92.25,61.381C-110.25,49.356,-80.25,1.907,-111.25,1.907C-142.25,1.907,-143.25,51.286,-145.25,66.119C-137.25,-44.119,-125.75,-66.119,-107.75,-66.119C-89.75,-66.119,-94.275,-37.834,-107.75,-19.119C-129.258,10.754,-153.75,32.381,-210.25,47.881"
                      stroke="white"
                      strokeWidth="9"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-drawing-path-hello"
                    />
                  </g>
                </svg>
              )}
            </div>

            {/* Bottom Profile and Prompt */}
            <div className="flex flex-col items-center gap-4">
              <img
                src="/images/profile.webp"
                alt="Profile Avatar"
                className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-md"
              />
              <div className="text-center">
                <p className="text-white/80 text-sm font-medium tracking-wide drop-shadow-sm animate-pulse">
                  Press Enter or Click to continue
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-white/50 text-[11px]">
                  <span>Press</span>
                  <span className="bg-white/10 px-1.5 py-0.5 rounded border border-white/15 text-[10px] font-mono">
                    F11
                  </span>
                  <span>for Full Screen</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Password Screen Phase */
          <div className="flex flex-col items-center justify-between h-full w-full text-white">
            {/* Back Button to Lock Screen */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPasswordInput(false);
                setPassword("");
              }}
              className="absolute top-8 left-8 flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-full px-3.5 py-1.5 text-xs text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {/* Main Form Center */}
            <div className="flex-1 flex flex-col items-center justify-center mt-[-4vh]">
              <div className={error ? "shake-animation" : ""}>
                <div className="flex flex-col items-center">
                  <img
                    src="/images/profile.webp"
                    alt="User Profile"
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg border-2 border-white/20 mb-4"
                  />
                  <h1 className="text-white text-2xl font-medium tracking-wide mb-6 drop-shadow-md">
                    Kuldeep rajput
                  </h1>

                  <form
                    onSubmit={handleLogin}
                    onClick={(e) => e.stopPropagation()}
                    className="relative flex items-center group w-48"
                  >
                    <input
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                      className="w-full bg-white/20 hover:bg-white/30 focus:bg-white/30 backdrop-blur-md text-white placeholder-white/60 rounded-full py-1.5 px-4 pr-10 outline-none text-sm font-medium transition-colors border border-white/10 focus:border-white/30"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 w-6 h-6 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
                    >
                      <ArrowRight className="text-white w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                  </form>
                  <p className="text-white/60 text-xs mt-3 font-medium drop-shadow-sm">
                    Password is current year (e.g. {new Date().getFullYear()})
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Power Controls */}
            <div className="flex gap-10 mt-auto" onClick={(e) => e.stopPropagation()}>
              <button
                className="flex flex-col items-center gap-2 group outline-none cursor-pointer"
                onClick={() => setIsAsleep(true)}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10">
                  <Moon className="text-white w-4 h-4" />
                </div>
                <span className="text-white text-xs font-medium drop-shadow-md">Sleep</span>
              </button>
              <button
                className="flex flex-col items-center gap-2 group outline-none cursor-pointer"
                onClick={() => {
                  sessionStorage.setItem("isRestartingSystem", "true");
                  window.location.reload();
                }}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10">
                  <RotateCcw className="text-white w-4 h-4" />
                </div>
                <span className="text-white text-xs font-medium drop-shadow-md">Restart</span>
              </button>
              <button
                className="flex flex-col items-center gap-2 group outline-none cursor-pointer"
                onClick={handleShutDown}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10">
                  <Power className="text-white w-4 h-4" />
                </div>
                <span className="text-white text-xs font-medium drop-shadow-md">Shut Down</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginScreen;
