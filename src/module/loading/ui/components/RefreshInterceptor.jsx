import React, { useState, useEffect, useRef } from "react";
import { Moon, Power, RotateCcw } from "lucide-react";

const RefreshInterceptor = ({ enabled, isLoggedIn, setBooting, setIsLoggedIn }) => {
  const [showPopup, setShowPopup] = useState(() => {
    if (typeof window !== "undefined") {
      const isRestarting = sessionStorage.getItem("isRestartingSystem") === "true";
      if (isRestarting) {
        return false;
      }
      const navigationEntries =
        window.performance && window.performance.getEntriesByType
          ? window.performance.getEntriesByType("navigation")
          : [];
      const isReload = navigationEntries[0] && navigationEntries[0].type === "reload";
      return isReload;
    }
    return false;
  });
  const [isAsleep, setIsAsleep] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });
  const isBypassingReload = useRef(false);

  // iOS slider drag states
  const [powerOffPos, setPowerOffPos] = useState(0);
  const powerOffRef = useRef(null);
  const isDraggingPower = useRef(false);
  const startXPower = useRef(0);

  const [restartPos, setRestartPos] = useState(0);
  const restartRef = useRef(null);
  const isDraggingRestart = useRef(false);
  const startXRestart = useRef(0);

  // Check mobile screen size
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  // Sync login state to sessionStorage to remember it on reload
  useEffect(() => {
    if (enabled) {
      sessionStorage.setItem("wasLoggedIn", isLoggedIn ? "true" : "false");
    }
  }, [enabled, isLoggedIn]);

  // Detect browser reload on mount and restore state without showing browser warnings
  useEffect(() => {
    if (sessionStorage.getItem("isRestartingSystem") === "true") {
      setBooting(true);
      setIsLoggedIn(false);
      setShowPopup(false);
      return;
    }

    const navigationEntries =
      window.performance && window.performance.getEntriesByType
        ? window.performance.getEntriesByType("navigation")
        : [];
    const isReload = navigationEntries[0] && navigationEntries[0].type === "reload";

    if (isReload) {
      const savedWasLoggedIn = sessionStorage.getItem("wasLoggedIn") === "true";
      setBooting(false);
      setIsLoggedIn(savedWasLoggedIn);
      setShowPopup(true);
    }
  }, [setBooting, setIsLoggedIn]);

  useEffect(() => {
    if (!enabled) return;

    // Intercept keyboard shortcuts to prevent immediate refresh and show popup
    const handleKeyDown = (e) => {
      const isR = e.key === "r" || e.key === "R" || e.keyCode === 82;
      const isF5 = e.key === "F5" || e.keyCode === 116;
      const isMetaOrCtrl = e.metaKey || e.ctrlKey;

      if (isF5 || (isMetaOrCtrl && isR)) {
        e.preventDefault();
        setShowPopup(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);

  const handleCancel = () => {
    setShowPopup(false);
    setPowerOffPos(0);
    setRestartPos(0);
  };

  const handleRestart = () => {
    sessionStorage.setItem("isRestartingSystem", "true");
    isBypassingReload.current = true;
    window.location.reload();
  };

  const handleSleep = () => {
    setShowPopup(false);
    setIsAsleep(true);
  };

  const handleShutdown = () => {
    setShowPopup(false);
    setIsShuttingDown(true);
    setTimeout(() => {
      isBypassingReload.current = true;
      window.location.href = "about:blank";
    }, 2000);
  };

  // iOS Slider Touch/Mouse Handlers
  const handlePowerDragStart = (e) => {
    isDraggingPower.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startXPower.current = clientX - powerOffPos;
  };

  const handlePowerDragMove = (e) => {
    if (!isDraggingPower.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const containerWidth = powerOffRef.current ? powerOffRef.current.clientWidth - 56 : 240;
    let newPos = clientX - startXPower.current;
    newPos = Math.max(0, Math.min(newPos, containerWidth));
    setPowerOffPos(newPos);

    if (newPos >= containerWidth - 3) {
      isDraggingPower.current = false;
      handleShutdown();
    }
  };

  const handlePowerDragEnd = () => {
    if (!isDraggingPower.current) return;
    isDraggingPower.current = false;
    setPowerOffPos(0);
  };

  const handleRestartDragStart = (e) => {
    isDraggingRestart.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startXRestart.current = clientX - restartPos;
  };

  const handleRestartDragMove = (e) => {
    if (!isDraggingRestart.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const containerWidth = restartRef.current ? restartRef.current.clientWidth - 56 : 240;
    let newPos = clientX - startXRestart.current;
    newPos = Math.max(0, Math.min(newPos, containerWidth));
    setRestartPos(newPos);

    if (newPos >= containerWidth - 3) {
      isDraggingRestart.current = false;
      handleRestart();
    }
  };

  const handleRestartDragEnd = () => {
    if (!isDraggingRestart.current) return;
    isDraggingRestart.current = false;
    setRestartPos(0);
  };

  return (
    <>
      {/* Sleep Overlay */}
      {isAsleep && (
        <div
          className="fixed inset-0 z-[99999999] bg-black cursor-pointer transition-opacity duration-300"
          onClick={() => setIsAsleep(false)}
          title="Click to wake up"
        />
      )}

      {/* Shutdown Overlay */}
      {isShuttingDown && (
        <div className="fixed inset-0 bg-black z-[99999999] flex flex-col items-center justify-center select-none cursor-none">
          <img
            src="/icons/appleLogo.svg"
            alt="Apple Logo"
            className="w-16 h-16 invert dark:invert-0 opacity-95 animate-pulse mb-8"
          />
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Custom Dialog */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/45 backdrop-blur-[1.5px] flex items-center justify-center z-[9999999] transition-all duration-300"
          onClick={handleCancel}
        >
          {isMobile ? (
            /* iOS 23 / iPhone 17-19 Style Action Sheet */
            <div
              className="fixed inset-x-0 bottom-0 max-w-md mx-auto mb-6 px-4 pb-4 z-[99999999] flex flex-col gap-3 animate-in slide-in-from-bottom-12 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Sheet Container */}
              <div className="bg-zinc-950/75 border border-white/10 rounded-[30px] p-5 space-y-5 backdrop-blur-3xl shadow-[0_-15px_45px_rgba(0,0,0,0.6)]">
                {/* Drag Handle Indicator */}
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto -mt-1 mb-1" />

                {/* iOS Slide to Power Off Slider */}
                <div
                  ref={powerOffRef}
                  className="relative w-full h-14 bg-white/5 border border-white/10 rounded-full flex items-center p-1 select-none overflow-hidden"
                  onTouchStart={handlePowerDragStart}
                  onTouchMove={handlePowerDragMove}
                  onTouchEnd={handlePowerDragEnd}
                  onMouseDown={handlePowerDragStart}
                  onMouseMove={handlePowerDragMove}
                  onMouseUp={handlePowerDragEnd}
                  onMouseLeave={handlePowerDragEnd}
                >
                  {/* Glowing active track */}
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-650 to-orange-500 rounded-full transition-all duration-75"
                    style={{ width: `${powerOffPos + 48}px`, opacity: 0.8 }}
                  />

                  {/* Shimmering / Pulsing Text */}
                  <span
                    className="absolute inset-0 flex items-center justify-center text-[13px] font-medium text-white/50 pointer-events-none select-none"
                    style={{ opacity: Math.max(0, 1 - powerOffPos / 120) }}
                  >
                    slide to power off
                  </span>

                  {/* Slider Drag Handle */}
                  <div
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl cursor-grab active:cursor-grabbing select-none"
                    style={{ transform: `translateX(${powerOffPos}px)` }}
                  >
                    <Power className="w-5 h-5 text-red-600" />
                  </div>
                </div>

                {/* iOS Slide to Restart Slider */}
                <div
                  ref={restartRef}
                  className="relative w-full h-14 bg-white/5 border border-white/10 rounded-full flex items-center p-1 select-none overflow-hidden"
                  onTouchStart={handleRestartDragStart}
                  onTouchMove={handleRestartDragMove}
                  onTouchEnd={handleRestartDragEnd}
                  onMouseDown={handleRestartDragStart}
                  onMouseMove={handleRestartDragMove}
                  onMouseUp={handleRestartDragEnd}
                  onMouseLeave={handleRestartDragEnd}
                >
                  {/* Glowing active track */}
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-75"
                    style={{ width: `${restartPos + 48}px`, opacity: 0.8 }}
                  />

                  {/* Shimmering / Pulsing Text */}
                  <span
                    className="absolute inset-0 flex items-center justify-center text-[13px] font-medium text-white/50 pointer-events-none select-none"
                    style={{ opacity: Math.max(0, 1 - restartPos / 120) }}
                  >
                    slide to restart
                  </span>

                  {/* Slider Drag Handle */}
                  <div
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl cursor-grab active:cursor-grabbing select-none"
                    style={{ transform: `translateX(${restartPos}px)` }}
                  >
                    <RotateCcw className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* iOS Cancel Button Container */}
              <button
                onClick={handleCancel}
                className="w-full py-4 bg-zinc-950/75 border border-white/10 hover:bg-zinc-900/75 active:scale-[0.98] text-white rounded-[24px] text-sm font-semibold transition-all backdrop-blur-3xl shadow-lg cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          ) : (
            /* macOS Alert Panel (Desktop) - Authentic Ventura/Sonoma Dialog Box (Light Theme) */
            <div
              className="bg-[#ececec]/95 backdrop-blur-2xl p-5 rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.18)] w-[465px] transform scale-100 transition-transform duration-200 select-none flex gap-4 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Column: Apple Logo */}
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <img
                  src="/icons/appleLogo.svg"
                  alt="System Logo"
                  className="w-12 h-12 invert opacity-85"
                />
              </div>

              {/* Right Column: Title, Subtitle, Checkbox, Actions */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-[13px] font-bold text-neutral-900 tracking-tight leading-tight">
                    Are you sure you want to shut down or restart your computer now?
                  </h3>
                  <p className="text-[11px] text-neutral-500 leading-normal">
                    If you do nothing, the system will continue running. You can also choose to put
                    the system to sleep.
                  </p>
                </div>

                {/* macOS Checkbox */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="reopen-windows"
                    defaultChecked
                    className="accent-blue-500 w-3 h-3 rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor="reopen-windows"
                    className="text-[11px] text-neutral-600 select-none cursor-pointer"
                  >
                    Reopen windows when logging back in
                  </label>
                </div>

                {/* Horizontal Buttons at Bottom Right */}
                <div className="flex justify-end gap-2 pt-1.5">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 rounded-[6px] text-[11px] font-medium transition-colors cursor-pointer shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSleep}
                    className="px-4 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 rounded-[6px] text-[11px] font-medium transition-colors cursor-pointer shadow-sm"
                  >
                    Sleep
                  </button>
                  <button
                    onClick={handleRestart}
                    className="px-4 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 rounded-[6px] text-[11px] font-medium transition-colors cursor-pointer shadow-sm"
                  >
                    Restart
                  </button>
                  <button
                    onClick={handleShutdown}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-[6px] text-[11px] font-semibold transition-colors cursor-pointer shadow-sm"
                  >
                    Shut Down
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RefreshInterceptor;
