import VSCodeSidebar from "../components/VSCodeSidebar";

const VSCodeSidebarSection = ({
  activeSidebar,
  files,
  expandedFolders,
  toggleFolder,
  selectedFile,
  onSelectFile,
  searchQuery,
  onSearchChange,
  searchResults,
  commitMessage,
  modifiedFiles,
  installedExtensions,
  onCommitMessageChange,
  onCommit,
  onToggleExtension,
  isNarrow,
  containerWidth,
  sidebarWidth,
}) => (
  <VSCodeSidebar
    activeSidebarTab={activeSidebar}
    files={files}
    activeFile={selectedFile}
    explorerExpanded={expandedFolders}
    onToggleExpand={toggleFolder}
    onSelectFile={onSelectFile}
    searchQuery={searchQuery}
    onSearchChange={onSearchChange}
    searchResults={searchResults}
    commitMessage={commitMessage}
    modifiedFiles={modifiedFiles}
    installedExtensions={installedExtensions}
    onCommitMessageChange={onCommitMessageChange}
    onCommit={onCommit}
    onToggleExtension={onToggleExtension}
    containerWidth={containerWidth}
    sidebarWidth={sidebarWidth}
  />
);

export default VSCodeSidebarSection;
