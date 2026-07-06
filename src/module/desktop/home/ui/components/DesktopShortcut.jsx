import { useState, useEffect } from "react";
import OptimizedImage from "@module/shared/ui/components/OptimizedImage";

const scaleMap = {
  finder: "scale-[0.90]",
  launchpad: "scale-[0.90]",
  safari: "scale-[0.90]",
  photos: "scale-[0.90]",
  contact: "scale-[0.90]",
  terminal: "scale-[0.90]",
  settings: "scale-[0.83]",
  calculator: "scale-[0.83]",
  notes: "scale-[0.90]",
  messages: "scale-[0.90]",
  appletv: "scale-[0.80]",
  call: "scale-[0.71]",
  appstore: "scale-[0.90]",
  weather: "scale-[0.79]",
  vscode: "scale-[0.95]",
  postman: "scale-[0.95]",
  map: "scale-[0.73]",
  font: "scale-[2.7]",
  telegram: "scale-[0.90]",
  music: "scale-[0.90]",
  folder: "scale-[0.80]",
  trash: "scale-[0.80]",
};

const CalendarIcon = () => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date();
  return (
    <div className="w-full h-full bg-white rounded-[13px] border border-black/10 shadow-sm overflow-hidden flex flex-col items-center select-none scale-[0.76] relative aspect-square transition-all duration-200">
      <div className="w-full bg-[#ff3b30] text-white text-[9px] font-extrabold py-0.5 text-center leading-none tracking-wider uppercase">
        {days[today.getDay()]}
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-800 font-bold text-2xl leading-none font-sans -mt-0.5">
        {today.getDate()}
      </div>
    </div>
  );
};

const DesktopShortcut = ({ shortcut, onDoubleClick, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRightSide, setIsRightSide] = useState(false);

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(true);
  };

  const handlePointerDown = (e) => {
    if (e.button === 2) {
      handleRightClick(e);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsRightSide(shortcut.x > window.innerWidth / 2);
    }
  }, [shortcut.x]);

  useEffect(() => {
    if (!showMenu) return;
    const close = () => setShowMenu(false);

    // Defer listener registration to the next frame to prevent the current
    // bubble phase contextmenu/click events from immediately closing the menu.
    const timer = setTimeout(() => {
      window.addEventListener("click", close);
      window.addEventListener("contextmenu", close);
    }, 0);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", close);
      window.removeEventListener("contextmenu", close);
    };
  }, [showMenu]);

  return (
    <li
      className="group desktop-shortcut absolute select-none flex items-center flex-col cursor-grab active:cursor-grabbing"
      style={{
        left: `${shortcut.x}px`,
        top: `${shortcut.y}px`,
      }}
      data-id={shortcut.id}
      onDoubleClick={onDoubleClick}
      onContextMenu={handleRightClick}
      onPointerDown={handlePointerDown}
    >
      {/* App Icon Container - exact 64px (w-16 h-16) matching the desktop folder icon size */}
      <div className="relative w-16 h-16 flex items-center justify-center transition-all duration-200 group-hover:scale-105 pointer-events-none">
        {shortcut.appId === "calendar" ? (
          <CalendarIcon />
        ) : (
          <OptimizedImage
            src={`/images/${shortcut.icon}`}
            alt={shortcut.name}
            width={64}
            height={64}
            className={`w-full h-full object-contain ${scaleMap[shortcut.appId] || ""}`}
          />
        )}
      </div>

      {/* App Name Label */}
      <p className="text-sm text-white text-center px-1.5 py-0.5 rounded group-hover:bg-black/45 transition-colors max-w-40 font-medium select-none shadow-sm mt-1">
        {shortcut.name}
      </p>

      {/* macOS-style context menu for delete, positioned absolutely beside the icon container */}
      {showMenu && (
        <div
          className={`absolute top-2 bg-[#282828]/90 backdrop-blur-xl text-white rounded-lg p-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 text-xs w-36 z-[9999] font-sans flex flex-col pointer-events-auto ${
            isRightSide ? "right-[70px]" : "left-[70px]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onRemove();
              setShowMenu(false);
            }}
            className="w-full text-left py-1.5 px-2 rounded-md hover:bg-[#ff3b30] hover:text-white transition-colors duration-100 flex items-center gap-2 cursor-pointer font-normal text-[#f5f5f7]"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Shortcut
          </button>
        </div>
      )}
    </li>
  );
};

export default DesktopShortcut;
