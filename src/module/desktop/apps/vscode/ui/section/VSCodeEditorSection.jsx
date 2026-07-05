import { useState } from "react";
import { Globe, RefreshCw, X } from "lucide-react";
import { PORTFOLIO_ALT_URL } from "@constants";
import VSCodeTabs from "../components/VSCodeTabs";
import VSCodeEditor from "../components/VSCodeEditor";
import VSCodeTerminalSection from "./VSCodeTerminalSection";

const VSCodeEditorSection = ({
  openFiles,
  activeFile,
  onSelectFile,
  onCloseFile,
  files,
  modifiedFiles,
  onContentChange,
  isNarrow,
  showPreview,
  setShowPreview,
  isTerminalOpen,
  onToggleTerminal,
  terminalHistory,
  terminalInput,
  setTerminalInput,
  terminalBottomRef,
  runCommand,
  previewWidth,
  setPreviewWidth,
  terminalHeight,
  setTerminalHeight,
}) => {
  const [reloadKey, setReloadKey] = useState(0);

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const showSplitPreview = showPreview && !isNarrow && openFiles.length > 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white h-full">
      <VSCodeTabs
        openTabs={openFiles}
        activeFile={activeFile}
        onSelectFile={onSelectFile}
        onCloseTab={onCloseFile}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview((prev) => !prev)}
      />

      <div className="flex-1 flex min-h-0 relative divide-x divide-[#e5e5e5]">
        {/* Code Editor & Terminal Drawer */}
        <div className="flex-1 flex flex-col min-h-0 h-full relative">
          <VSCodeEditor
            files={files}
            activeFile={activeFile}
            openTabs={openFiles}
            modifiedFiles={modifiedFiles}
            onContentChange={onContentChange}
            isNarrow={isNarrow}
          />

          {/* Draggable Horizontal Divider for Terminal */}
          {isTerminalOpen && (
            <div
              className="h-[4px] hover:h-[6px] bg-transparent hover:bg-[#007acc]/30 active:bg-[#007acc] cursor-row-resize transition-all shrink-0 select-none z-20 -my-[2px]"
              onMouseDown={(e) => {
                e.preventDefault();
                const startY = e.clientY;
                const startHeight = terminalHeight;

                const handleMouseMove = (moveEvent) => {
                  const deltaY = moveEvent.clientY - startY;
                  const newHeight = Math.max(80, Math.min(350, startHeight - deltaY));
                  setTerminalHeight(newHeight);
                };

                const handleMouseUp = () => {
                  window.removeEventListener("mousemove", handleMouseMove);
                  window.removeEventListener("mouseup", handleMouseUp);
                };

                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", handleMouseUp);
              }}
            />
          )}

          <VSCodeTerminalSection
            isTerminalOpen={isTerminalOpen}
            onToggleTerminal={onToggleTerminal}
            terminalHistory={terminalHistory}
            terminalInput={terminalInput}
            setTerminalInput={setTerminalInput}
            terminalBottomRef={terminalBottomRef}
            runCommand={runCommand}
            isNarrow={isNarrow}
            terminalHeight={terminalHeight}
          />
        </div>

        {/* Draggable Vertical Divider for Live Preview */}
        {showSplitPreview && (
          <div
            className="w-[4px] hover:w-[6px] bg-transparent hover:bg-[#007acc]/30 active:bg-[#007acc] cursor-col-resize transition-all shrink-0 select-none z-20 -mx-[2px]"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = previewWidth;

              const handleMouseMove = (moveEvent) => {
                const deltaX = moveEvent.clientX - startX;
                const newWidth = Math.max(200, Math.min(750, startWidth - deltaX));
                setPreviewWidth(newWidth);
              };

              const handleMouseUp = () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
              };

              window.addEventListener("mousemove", handleMouseMove);
              window.addEventListener("mouseup", handleMouseUp);
            }}
          />
        )}

        {/* Live Preview Panel */}
        {showSplitPreview && (
          <div
            style={{ width: `${previewWidth}px`, maxWidth: "60%" }}
            className="flex flex-col shrink-0 bg-[#f8f8f8] h-full"
          >
            {/* Toolbar / Address Bar Header */}
            <div className="h-[34px] bg-[#f3f3f3] border-b border-[#e5e5e5] px-3 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <Globe size={13} className="text-[#007acc]" />
                <span className="text-[11px] font-bold text-[#333333] tracking-wide">
                  Live Preview: localhost:3000
                </span>
                <span className="flex items-center gap-1 text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-200 font-bold uppercase tracking-wider scale-95">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReload}
                  className="p-1 rounded text-[#616161] hover:text-[#333333] hover:bg-[#e8e8e8] transition-colors cursor-pointer"
                  title="Reload Preview"
                >
                  <RefreshCw size={12} />
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1 rounded text-[#616161] hover:text-[#333333] hover:bg-[#e8e8e8] transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Address Bar */}
            <div className="h-[28px] bg-white border-b border-[#e5e5e5] px-3 flex items-center gap-2 shrink-0 select-none">
              <div className="flex-1 bg-[#f3f3f3] rounded border border-[#e5e5e5] px-2.5 py-0.5 text-[10px] text-[#616161] font-mono select-all flex items-center justify-between">
                <span>http://localhost:3000/</span>
                <a
                  href={PORTFOLIO_ALT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#007acc] hover:underline"
                >
                  Open External
                </a>
              </div>
            </div>

            {/* Iframe View */}
            <div className="flex-1 bg-white relative">
              <iframe
                key={reloadKey}
                src={PORTFOLIO_ALT_URL}
                title="Portfolio Live Preview"
                className="w-full h-full border-none"
                style={{ background: "#ffffff" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VSCodeEditorSection;
