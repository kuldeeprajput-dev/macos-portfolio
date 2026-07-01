import VSCodeActivityBarSection from "./VSCodeActivityBarSection";
import VSCodeSidebarSection from "./VSCodeSidebarSection";
import VSCodeEditorSection from "./VSCodeEditorSection";
import VSCodeStatusBarSection from "./VSCodeStatusBarSection";

const languageMap = {
  jsx: "JavaScript React",
  js: "JavaScript",
  tsx: "TypeScript React",
  ts: "TypeScript",
  json: "JSON",
  css: "CSS",
  md: "Markdown",
  html: "HTML",
  py: "Python",
  rs: "Rust",
};

const VSCodeSection = ({
  files,
  activeFile,
  openTabs,
  activeSidebarTab,
  setActiveSidebarTab,
  explorerExpanded,
  setExplorerExpanded,
  searchQuery,
  setSearchQuery,
  searchResults,
  commitMessage,
  setCommitMessage,
  modifiedFiles,
  setModifiedFiles,
  installedExtensions,
  setInstalledExtensions,
  terminalHistory,
  terminalInput,
  setTerminalInput,
  terminalBottomRef,
  handleContentChange,
  selectFile,
  closeTab,
  runCommand,
  isTerminalOpen,
  onToggleTerminal,
  showNotification,
  isNarrow,
  containerWidth,
  showPreview,
  setShowPreview,
  sidebarWidth,
  setSidebarWidth,
  previewWidth,
  setPreviewWidth,
  terminalHeight,
  setTerminalHeight,
}) => {
  const ext = activeFile?.split(".").pop();
  const language = languageMap[ext] || "Plain Text";
  const lineCount = (files[activeFile] || "").split("\n").length;
  const modifiedCount = Object.keys(modifiedFiles).length;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex min-h-0">
        <VSCodeActivityBarSection
          activeSidebar={activeSidebarTab}
          onSidebarChange={(tabId) => {
            setActiveSidebarTab((prev) => (prev === tabId ? null : tabId));
          }}
          modifiedCount={modifiedCount}
          onToggleTerminal={onToggleTerminal}
        />

        <VSCodeSidebarSection
          activeSidebar={activeSidebarTab}
          files={files}
          expandedFolders={explorerExpanded}
          toggleFolder={(name) => setExplorerExpanded((prev) => ({ ...prev, [name]: !prev[name] }))}
          selectedFile={activeFile}
          onSelectFile={selectFile}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchResults={searchResults}
          commitMessage={commitMessage}
          modifiedFiles={modifiedFiles}
          installedExtensions={installedExtensions}
          onCommitMessageChange={setCommitMessage}
          onCommit={() => {
            if (!commitMessage.trim()) {
              showNotification("Please type a commit message first!", "error");
              return;
            }
            showNotification(`Successfully committed changes to main:\n"${commitMessage}"`, "info");
            setModifiedFiles({});
            setCommitMessage("");
          }}
          onToggleExtension={(name) => {
            if (installedExtensions.includes(name)) {
              setInstalledExtensions((prev) => prev.filter((n) => n !== name));
            } else {
              setInstalledExtensions((prev) => [...prev, name]);
            }
          }}
          isNarrow={isNarrow}
          containerWidth={containerWidth}
          sidebarWidth={sidebarWidth}
        />

        {/* Draggable Vertical Divider for Sidebar */}
        {activeSidebarTab && !isNarrow && (
          <div
            className="w-[4px] hover:w-[6px] bg-transparent hover:bg-[#007acc]/30 active:bg-[#007acc] cursor-col-resize transition-all shrink-0 select-none z-20 -mx-[2px]"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = sidebarWidth;

              const handleMouseMove = (moveEvent) => {
                const deltaX = moveEvent.clientX - startX;
                const newWidth = Math.max(140, Math.min(400, startWidth + deltaX));
                setSidebarWidth(newWidth);
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

        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <VSCodeEditorSection
            openFiles={openTabs}
            activeFile={activeFile}
            onSelectFile={selectFile}
            onCloseFile={closeTab}
            files={files}
            modifiedFiles={modifiedFiles}
            onContentChange={handleContentChange}
            isNarrow={isNarrow}
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            isTerminalOpen={isTerminalOpen}
            onToggleTerminal={onToggleTerminal}
            terminalHistory={terminalHistory}
            terminalInput={terminalInput}
            setTerminalInput={setTerminalInput}
            terminalBottomRef={terminalBottomRef}
            runCommand={runCommand}
            previewWidth={previewWidth}
            setPreviewWidth={setPreviewWidth}
            terminalHeight={terminalHeight}
            setTerminalHeight={setTerminalHeight}
          />
        </div>
      </div>

      <VSCodeStatusBarSection
        activeFile={activeFile}
        language={language}
        lineCount={lineCount}
        isNarrow={isNarrow}
      />
    </div>
  );
};

export default VSCodeSection;
