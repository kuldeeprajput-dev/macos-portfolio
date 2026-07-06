import useWindowsStore from "@store/window";
import { ChevronLeft, ChevronRight, Home, Maximize2, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AssistiveTouch = () => {
  const { closeWindow, windows, openWindow } = useWindowsStore();
  const [position, setPosition] = useState({ x: 280, y: 500 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    // Initialize AssistiveTouch position on client-side
    if (typeof window !== "undefined") {
      setPosition({ x: window.innerWidth - 65, y: window.innerHeight - 170 });
    }
  }, []);

  // AssistiveTouch Drag/Pointer Handlers
  const handlePointerDown = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
    isDragging.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;

    const moveX = e.clientX - dragStart.current.x;
    const moveY = e.clientY - dragStart.current.y;

    // Add a small threshold (5px) before considering it a drag, so taps don't get canceled
    if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      const nextX = dragStart.current.posX + moveX;
      const nextY = dragStart.current.posY + moveY;

      // Keep it constrained so the radial menu doesn't overflow off-screen
      const minX = 10;
      const minY = 70; // Extra padding for top radial menu
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 120; // Extra padding for bottom radial menu

      setPosition({
        x: Math.max(minX, Math.min(maxX, nextX)),
        y: Math.max(minY, Math.min(maxY, nextY)),
      });
    }
  };

  const handlePointerUp = (e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (!isDragging.current) {
      setIsMenuOpen((prev) => !prev);
    }
  };

  // Helper to find currently active window
  const getActiveWindowKey = () => {
    let activeKey = null;
    let maxZ = -1;
    Object.entries(windows).forEach(([key, win]) => {
      if (win.isOpen && !win.isMinimized && win.zIndex > maxZ) {
        maxZ = win.zIndex;
        activeKey = key;
      }
    });
    return activeKey;
  };

  const handleHomeAction = () => {
    Object.keys(windows).forEach((key) => {
      closeWindow(key);
    });
    setIsMenuOpen(false);
  };

  const handleFullscreenAction = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
    setIsMenuOpen(false);
  };

  const handleBackAction = () => {
    const activeApp = getActiveWindowKey();
    if (activeApp) {
      const event = new CustomEvent("app-navigate-back", {
        cancelable: true,
        detail: { app: activeApp },
      });
      window.dispatchEvent(event);
    }
    setIsMenuOpen(false);
  };

  const handleForwardAction = () => {
    const activeApp = getActiveWindowKey();
    if (activeApp) {
      const event = new CustomEvent("app-navigate-forward", {
        cancelable: true,
        detail: { app: activeApp },
      });
      window.dispatchEvent(event);
    }
    setIsMenuOpen(false);
  };

  const handleOpenApp = (appId) => {
    openWindow(appId);
    setIsMenuOpen(false);
  };

  const menuItems = [
    { label: "Settings", icon: Settings, onClick: () => handleOpenApp("settings") },
    { label: "Back", icon: ChevronLeft, onClick: handleBackAction },
    { label: "Home", icon: Home, onClick: handleHomeAction },
    { label: "Forward", icon: ChevronRight, onClick: handleForwardAction },
    { label: "Fullscreen", icon: Maximize2, onClick: handleFullscreenAction },
  ];

  return (
    <>
      {/* AssistiveTouch expanded menu overlay background */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/5 z-[99998] transition-opacity duration-300"
        />
      )}

      {/* AssistiveTouch Wrapper */}
      <div
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 99999,
        }}
      >
        {/* Radial Menu Items */}
        {menuItems.map((item, index) => {
          const isLeftSide =
            typeof window !== "undefined" ? position.x < window.innerWidth / 2 : true;
          // Arc from top (-90) to bottom (90 or -270)
          const angle = isLeftSide ? -90 + index * 45 : -90 - index * 45;
          const rad = (angle * Math.PI) / 180;
          const radius = 70;

          // Center of the 48x48 (w-12) ball is 24,24. Button size is 44x44, so offset by 22.
          const x = isMenuOpen ? 24 + radius * Math.cos(rad) - 22 : 24 - 22;
          const y = isMenuOpen ? 24 + radius * Math.sin(rad) - 22 : 24 - 22;

          return (
            <button
              key={item.label}
              aria-label={item.label}
              title={item.label}
              onClick={(e) => {
                e.stopPropagation();
                if (isMenuOpen) item.onClick();
              }}
              style={{
                position: "absolute",
                left: x,
                top: y,
                opacity: isMenuOpen ? 1 : 0,
                pointerEvents: isMenuOpen ? "auto" : "none",
                transform: `scale(${isMenuOpen ? 1 : 0.5})`,
                transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.03}s`,
              }}
              className="w-[44px] h-[44px] rounded-full bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 shadow-xl flex items-center justify-center text-white/90 hover:bg-[#2c2c2e] active:scale-95"
            >
              <item.icon size={20} strokeWidth={2.2} />
            </button>
          );
        })}

        {/* The Ball */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`w-12 h-12 rounded-full bg-black/45 backdrop-blur-md border-[2.5px] border-white/20 shadow-lg cursor-pointer flex items-center justify-center transition-all hover:bg-black/60 active:scale-95 ${
            isMenuOpen ? "opacity-40 scale-90" : ""
          }`}
          style={{ touchAction: "none" }}
        >
          <div className="w-6 h-6 rounded-full bg-white/35 border-[1.5px] border-white/40 flex items-center justify-center shadow-inner pointer-events-none transition-all">
            <div className="w-3.5 h-3.5 rounded-full bg-white/70 shadow-sm" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistiveTouch;
