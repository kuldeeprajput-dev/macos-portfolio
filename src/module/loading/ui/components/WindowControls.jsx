import useWindowsStore from "@store/window";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";

const WindowControls = ({ target, onBack }) => {
  const { closeWindow, toggleMaximize, minimizeWindow } = useWindowsStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <button
        onClick={(e) => {
          console.log("Back button clicked in WindowControls for target:", target);
          if (onBack) {
            onBack(e);
          } else {
            closeWindow(target);
          }
        }}
        style={{
          border: "none",
          background: "none",
          color: "#27272a",
          display: "flex",
          alignItems: "center",
          gap: 2,
          fontSize: 12,
          fontWeight: 500,
          padding: "0",
          cursor: "pointer",
          position: "relative",
          zIndex: 30,
          pointerEvents: "auto",
        }}
      >
        <ChevronLeft size={14} />
        <span>Back</span>
      </button>
    );
  }

  return (
    <div id="window-controls">
      <div className="close" onClick={() => closeWindow(target)} />
      <div className="minimize" onClick={() => minimizeWindow(target)} title="Minimize" />
      <div className="maximize" onClick={() => toggleMaximize(target)} title="Zoom" />
    </div>
  );
};

export default WindowControls;
