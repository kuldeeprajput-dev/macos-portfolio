import { useState, useEffect, useRef } from "react";
import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import useVSCode from "../../hooks/useVSCode";
import VSCodeSection from "../section/VSCodeSection";
import VSCodeAboutModal from "./VSCodeAboutModal";

const VSCodeNotification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  const isError = notification.type === "error";

  return (
    <div
      className="absolute bottom-6 right-6 z-50 w-[320px] bg-white border border-[#e5e5e5] rounded shadow-xl flex flex-col p-3 text-[12px] text-[#333333] select-none font-sans"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        boxShadow: "0 4px 18px rgba(0, 0, 0, 0.12)",
        animation: "slideIn 0.22s cubic-bezier(0, 0, 0.2, 1) forwards",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div className="flex items-start gap-2.5">
        <span
          className={isError ? "text-[#cd1a2b] shrink-0 mt-0.5" : "text-[#007acc] shrink-0 mt-0.5"}
        >
          {isError ? (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM7.5 4h1v5h-1V4zm0 6h1v1.5h-1V10z" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm-.5-5V5h1v4h-1zm0 2V9.5h1V11h-1z" />
            </svg>
          )}
        </span>
        <div className="flex-1 pr-4 whitespace-pre-line leading-relaxed text-[#333333]">
          {notification.message}
        </div>
        <button
          onClick={onClose}
          className="text-[#616161] hover:text-[#333333] hover:bg-[#e8e8e8] p-0.5 rounded transition-colors shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 7.293l4.146-4.147.708.708L8.707 8l4.147 4.146-.708.708L8 8.707l-4.146 4.147-.708-.708L7.293 8 3.146 3.854l.708-.708L8 7.293z" />
          </svg>
        </button>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={onClose}
          className="px-3 py-1 bg-[#007acc] hover:bg-[#0062b3] active:bg-[#004b93] text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const VSCode = () => {
  const { windows, setWindowData } = useWindowsStore();
  const [showAbout, setShowAbout] = useState(false);
  const hook = useVSCode();
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isNarrow = containerWidth < 650;

  const { activeSidebarTab, setActiveSidebarTab } = hook;
  const lastIsNarrow = useRef(isNarrow);

  useEffect(() => {
    if (isNarrow !== lastIsNarrow.current) {
      if (isNarrow) {
        setActiveSidebarTab(null);
      } else {
        setActiveSidebarTab("explorer");
      }
      lastIsNarrow.current = isNarrow;
    }
  }, [isNarrow, setActiveSidebarTab]);

  useEffect(() => {
    if (windows.vscode?.data?.openAbout) {
      setShowAbout(true);
      setWindowData("vscode", { ...windows.vscode.data, openAbout: false });
    }
  }, [windows.vscode?.data?.openAbout, windows.vscode?.data, setWindowData]);

  return (
    <>
      <div
        ref={containerRef}
        className="relative flex flex-col h-full w-full bg-white text-[#333333] font-sans select-none rounded-xl overflow-hidden shadow-2xl border border-[#cccccc]"
      >
        <div
          id="window-header"
          className="shrink-0 bg-[#f3f3f3] border-b border-[#e5e5e5] px-4 py-2 flex items-center justify-between text-xs text-[#333333] font-sans"
        >
          <div className="flex items-center gap-2">
            <WindowControls target="vscode" />
            {containerWidth >= 620 && (
              <div className="flex items-center gap-3 pl-4 font-semibold select-none">
                <span className="hover:text-black cursor-pointer transition-colors">File</span>
                <span className="hover:text-black cursor-pointer transition-colors">Edit</span>
                <span className="hover:text-black cursor-pointer transition-colors">Selection</span>
                <span className="hover:text-black cursor-pointer transition-colors">View</span>
                <span className="hover:text-black cursor-pointer transition-colors">Go</span>
              </div>
            )}
          </div>
          {containerWidth >= 400 && (
            <div className="flex-1 text-center font-medium text-[11px] truncate px-4">
              {containerWidth >= 520
                ? `${hook.activeFile} — portfolio (Workspace)`
                : hook.activeFile.split("/").pop()}
            </div>
          )}
          {containerWidth >= 480 && (
            <div className="w-16 flex justify-end">
              <span className="text-[10px] bg-[#e5e5e5] text-[#333333] px-2 py-0.5 rounded font-bold border border-[#cccccc]">
                Local
              </span>
            </div>
          )}
        </div>

        <VSCodeSection
          {...hook}
          isTerminalOpen={isTerminalOpen}
          onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
          isNarrow={isNarrow}
          containerWidth={containerWidth}
        />

        {hook.notification && (
          <VSCodeNotification
            notification={hook.notification}
            onClose={() => hook.setNotification(null)}
          />
        )}
      </div>
      <VSCodeAboutModal show={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
};

const VSCodeWindow = windowWrapper(VSCode, "vscode");
export default VSCodeWindow;
