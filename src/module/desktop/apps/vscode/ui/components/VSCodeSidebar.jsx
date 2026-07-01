import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { extensionsList } from "../../data/vscodeData";
import VSCodeFileIcon, { FolderIcon } from "./VSCodeFileIcon";

// Recursive tree layout for nested workspace folder structures (Light Theme)
const FileTree = ({ files, activeFile, explorerExpanded, onToggleExpand, onSelectFile }) => {
  const buildTree = (filePaths) => {
    const root = {};
    filePaths.forEach((path) => {
      const parts = path.split("/");
      let current = root;
      let currentPath = "";
      parts.forEach((part, i) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        if (!current[part]) {
          current[part] =
            i === parts.length - 1
              ? { type: "file", path }
              : { type: "folder", fullPath: currentPath, children: {} };
        }
        current = current[part].children || {};
      });
    });
    return root;
  };

  const tree = buildTree(Object.keys(files));

  const renderNode = (name, node, depth = 0) => {
    const isFolder = node.type !== "file";
    const path = isFolder ? null : node.path;
    const isSelected = activeFile === path;
    const fullPath = isFolder ? node.fullPath : path;
    const isExpanded = explorerExpanded[fullPath];

    if (isFolder) {
      return (
        <div key={fullPath} className="select-none">
          <button
            type="button"
            onClick={() => onToggleExpand(fullPath)}
            className="w-full flex items-center gap-1.5 py-[3px] hover:bg-[#e8e8e8] cursor-pointer text-[#333333] text-[12px] font-medium focus:outline-none text-left transition-colors"
            style={{ paddingLeft: `${depth * 14 + 8}px` }}
          >
            {isExpanded ? (
              <ChevronDown size={12} className="text-[#424242] shrink-0" />
            ) : (
              <ChevronRight size={12} className="text-[#424242] shrink-0" />
            )}
            <FolderIcon isOpen={isExpanded} size={15} />
            <span>{name}</span>
          </button>
          {isExpanded && node.children && (
            <div>
              {Object.entries(node.children).map(([childName, childNode]) =>
                renderNode(childName, childNode, depth + 1),
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        type="button"
        key={path}
        onClick={() => onSelectFile(path)}
        className={`w-full flex items-center gap-2 py-[3px] hover:bg-[#e8e8e8] cursor-pointer text-[12px] transition-colors focus:outline-none text-left ${
          isSelected ? "bg-[#d6ebff] text-[#333333] font-semibold" : "text-[#333333]"
        }`}
        style={{ paddingLeft: `${depth * 14 + 22}px` }}
      >
        <VSCodeFileIcon filename={name} size={15} />
        <span className="truncate">{name}</span>
      </button>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto py-0.5">
      {Object.entries(tree).map(([name, node]) => renderNode(name, node))}
    </div>
  );
};

const VSCodeExplorerPanel = ({
  files,
  activeFile,
  explorerExpanded,
  onToggleExpand,
  onSelectFile,
}) => (
  <div className="flex-1 flex flex-col min-h-0 bg-[#f3f3f3]">
    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#616161] flex items-center justify-between border-b border-[#e5e5e5] shrink-0">
      <span>Explorer</span>
    </div>
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex items-center gap-1.5 py-1.5 px-2 text-[11px] font-bold text-[#424242] shrink-0">
        <ChevronDown size={12} />
        <span>PORTFOLIO</span>
      </div>
      <FileTree
        files={files}
        activeFile={activeFile}
        explorerExpanded={explorerExpanded}
        onToggleExpand={onToggleExpand}
        onSelectFile={onSelectFile}
      />
    </div>
  </div>
);

const VSCodeSearchPanel = ({ searchQuery, onSearchChange, searchResults, onSelectFile }) => (
  <div className="flex-1 flex flex-col p-3 gap-3 min-h-0 bg-[#f3f3f3]">
    <div className="text-[11px] font-bold uppercase tracking-wider text-[#616161]">Search</div>
    <input
      type="text"
      placeholder="Search text in workspace"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full bg-white border border-[#cecece] rounded px-2.5 py-1.5 text-xs text-[#333333] outline-none focus:border-[#007acc] shadow-sm placeholder-[#a0a0a0] shrink-0"
    />
    <div className="flex-1 overflow-y-auto space-y-1.5 pt-1">
      {searchResults.length > 0
        ? searchResults.map((res, i) => (
            <div
              key={i}
              onClick={() => onSelectFile(res.path)}
              className="text-[11px] p-2 bg-white hover:bg-[#e8e8e8] rounded cursor-pointer border border-[#e5e5e5] hover:border-[#cccccc] transition-all text-[#333333]"
            >
              <div className="font-semibold text-[#007acc] truncate flex items-center gap-1.5">
                <VSCodeFileIcon filename={res.path.split("/").pop()} size={12} />
                {res.path}
              </div>
              <div className="text-[#616161] mt-0.5 italic pl-4">
                Line {res.lineNum}:{" "}
                <span className="text-[#a31515] not-italic font-mono bg-[#fff6e6] px-1 rounded">
                  {res.text}
                </span>
              </div>
            </div>
          ))
        : searchQuery.trim() && (
            <div className="text-xs text-[#616161] text-center py-4">No results found.</div>
          )}
    </div>
  </div>
);

const VSCodeGitPanel = ({
  modifiedFiles,
  commitMessage,
  onCommitMessageChange,
  onCommit,
  onSelectFile,
}) => (
  <div className="flex-1 flex flex-col p-3 gap-3 min-h-0 bg-[#f3f3f3]">
    <div className="text-[11px] font-bold uppercase tracking-wider text-[#616161]">
      Source Control: Git
    </div>
    <div className="space-y-1.5 shrink-0">
      <input
        type="text"
        placeholder="Commit message..."
        value={commitMessage}
        onChange={(e) => onCommitMessageChange(e.target.value)}
        className="w-full bg-white border border-[#cecece] rounded px-2.5 py-1.5 text-xs text-[#333333] outline-none focus:border-[#007acc] shadow-sm placeholder-[#a0a0a0]"
      />
      <button
        onClick={onCommit}
        className="w-full py-1.5 bg-[#007acc] hover:bg-[#0062b3] active:bg-[#004b93] text-white rounded text-xs font-semibold transition-colors mt-1.5 cursor-pointer"
      >
        Commit to main
      </button>
    </div>
    <div className="flex-1 overflow-y-auto pt-2">
      <div className="text-[10px] font-bold text-[#616161] uppercase tracking-wider mb-2">
        Changes
      </div>
      {Object.keys(modifiedFiles).length > 0 ? (
        Object.keys(modifiedFiles).map((file) => (
          <div
            key={file}
            onClick={() => onSelectFile(file)}
            className="flex items-center justify-between p-1.5 hover:bg-[#e8e8e8] rounded cursor-pointer text-xs text-[#333333]"
          >
            <div className="flex items-center gap-1.5 truncate">
              <VSCodeFileIcon filename={file.split("/").pop()} size={13} />
              <span className="truncate">{file}</span>
            </div>
            <span className="text-[10px] text-[#8f6d00] font-bold px-1.5 bg-[#fff6e6] rounded border border-[#ffe6ba] shrink-0 ml-2">
              M
            </span>
          </div>
        ))
      ) : (
        <div className="text-xs text-[#616161] text-center py-4">No modified files.</div>
      )}
    </div>
  </div>
);

const VSCodeExtensionsPanel = ({ installedExtensions, onToggleExtension }) => (
  <div className="flex-1 flex flex-col p-3 gap-3 min-h-0 bg-[#f3f3f3]">
    <div className="text-[11px] font-bold uppercase tracking-wider text-[#616161]">
      Extensions Marketplace
    </div>
    <div className="flex-1 overflow-y-auto space-y-2.5">
      {extensionsList.map((ext) => {
        const isInstalled = installedExtensions.includes(ext.name);
        return (
          <div
            key={ext.name}
            className="p-2.5 border border-[#e5e5e5] bg-white rounded-lg space-y-1 shadow-sm text-[#333333]"
          >
            <div className="flex justify-between items-start">
              <div className="font-semibold text-xs text-[#333333]">{ext.name}</div>
              <span className="text-[9px] text-[#616161]">{ext.version}</span>
            </div>
            <p className="text-[10px] text-[#616161] leading-tight">{ext.desc}</p>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[9px] text-[#616161]">by {ext.publisher}</span>
              <button
                onClick={() => onToggleExtension(ext.name)}
                className={`px-2.5 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                  isInstalled
                    ? "bg-[#e5e5e5] text-[#333333] hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent"
                    : "bg-[#007acc] text-white hover:bg-[#0062b3]"
                }`}
              >
                {isInstalled ? "Disable" : "Install"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const VSCodeSidebar = ({
  activeSidebarTab,
  files,
  activeFile,
  explorerExpanded,
  searchQuery,
  searchResults,
  commitMessage,
  modifiedFiles,
  installedExtensions,
  onToggleExpand,
  onSelectFile,
  onSearchChange,
  onCommitMessageChange,
  onCommit,
  onToggleExtension,
  containerWidth,
  sidebarWidth,
}) => {
  if (!activeSidebarTab) return null;

  return (
    <div
      style={{ width: `${sidebarWidth}px`, maxWidth: "50%" }}
      className="bg-[#f3f3f3] border-r border-[#e5e5e5] flex flex-col shrink-0 min-w-0"
    >
      {activeSidebarTab === "explorer" && (
        <VSCodeExplorerPanel
          files={files}
          activeFile={activeFile}
          explorerExpanded={explorerExpanded}
          onToggleExpand={onToggleExpand}
          onSelectFile={onSelectFile}
        />
      )}
      {activeSidebarTab === "search" && (
        <VSCodeSearchPanel
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchResults={searchResults}
          onSelectFile={onSelectFile}
        />
      )}
      {activeSidebarTab === "git" && (
        <VSCodeGitPanel
          modifiedFiles={modifiedFiles}
          commitMessage={commitMessage}
          onCommitMessageChange={onCommitMessageChange}
          onCommit={onCommit}
          onSelectFile={onSelectFile}
        />
      )}
      {activeSidebarTab === "extensions" && (
        <VSCodeExtensionsPanel
          installedExtensions={installedExtensions}
          onToggleExtension={onToggleExtension}
        />
      )}
    </div>
  );
};

export { VSCodeExplorerPanel, VSCodeSearchPanel, VSCodeGitPanel, VSCodeExtensionsPanel };
export default VSCodeSidebar;
