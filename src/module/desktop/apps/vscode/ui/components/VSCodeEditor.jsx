import { useRef, useEffect, useState, useMemo } from "react";
import { FileText, ChevronRight } from "lucide-react";
import VSCodeFileIcon from "./VSCodeFileIcon";

// Syntax highlighter cache to prevent re-highlighting identical lines
const highlightCache = new Map();

// Syntax highlighter for JS/JSX/CSS/HTML (Light Theme)
const highlight = (code) => {
  if (!code) return " ";

  if (highlightCache.has(code)) {
    return highlightCache.get(code);
  }

  // Escape HTML tags to prevent execution/parsing bugs
  let html = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Single-pass regex highlighter for keywords, comments, strings, tags, functions, attributes, and numbers
  const combinedRegex =
    /(\/\/.*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(&lt;\/?[a-zA-Z][a-zA-Z0-9]*\b)|(\b(?:import|export|default|function|return|const|let|var|from|class|extends|if|else|for|while|switch|case|break|new|this|typeof|instanceof)\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*(?=\())|(\b[a-zA-Z_][a-zA-Z0-9_-]*(?=\s*=\s*(?:["'{])))|(\b\d+\b)/g;

  html = html.replace(combinedRegex, (match, comment, string, tag, keyword, fn, attr, number) => {
    if (comment) return `<span style="color: #008000; font-style: italic;">${match}</span>`;
    if (string) return `<span style="color: #a31515;">${match}</span>`;
    if (tag) return `<span style="color: #800000; font-weight: 550;">${match}</span>`;
    if (keyword) return `<span style="color: #0000ff; font-weight: 600;">${match}</span>`;
    if (fn) return `<span style="color: #795e26;">${match}</span>`;
    if (attr) return `<span style="color: #ff0000;">${match}</span>`;
    if (number) return `<span style="color: #098658;">${match}</span>`;
    return match;
  });

  highlightCache.set(code, html);
  return html;
};

// Breadcrumb bar showing the file path segments
const Breadcrumb = ({ activeFile }) => {
  if (!activeFile) return null;
  const segments = activeFile.split("/");
  return (
    <div className="h-[22px] bg-white border-b border-[#e5e5e5] flex items-center px-3 gap-0.5 shrink-0 text-[11px] text-[#616161] select-none overflow-x-auto">
      <VSCodeFileIcon filename={segments[segments.length - 1]} size={12} />
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-0.5 shrink-0">
          {i > 0 && <ChevronRight size={10} className="text-[#b0b0b0]" />}
          <span
            className={`hover:text-[#007acc] cursor-pointer transition-colors ${i === segments.length - 1 ? "text-[#333333] font-medium" : ""}`}
          >
            {seg}
          </span>
        </span>
      ))}
    </div>
  );
};

// Minimap component — renders a tiny scaled-down preview of the code
const Minimap = ({ content, isNarrow }) => {
  if (isNarrow) return null;
  const lines = content.split("\n");
  const maxLines = 80;
  const displayLines = lines.slice(0, maxLines);

  return (
    <div className="w-[48px] bg-[#f8f8f8] border-l border-[#eeeeee] shrink-0 overflow-hidden select-none relative hidden md:block">
      <div className="py-1 px-1">
        {displayLines.map((line, i) => {
          const trimmed = line.replace(/\s+/g, " ").slice(0, 40);
          const width = Math.min(trimmed.length * 0.9, 44);
          return (
            <div
              key={i}
              className="h-[2px] mb-[1px] rounded-sm"
              style={{
                width: `${width}px`,
                backgroundColor: trimmed.trim() ? "#c0c0c0" : "transparent",
                opacity: trimmed.trim() ? 0.5 : 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const VSCodeEditor = ({
  files,
  activeFile,
  openTabs,
  modifiedFiles,
  onContentChange,
  isNarrow,
}) => {
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  // Local state for fast typing
  const [localVal, setLocalVal] = useState("");

  // Sync local content when active file changes or files changes from parent
  useEffect(() => {
    setLocalVal(files[activeFile] || "");
  }, [activeFile, files]);

  // Debounced propagation to parent files state to reduce global re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localVal !== (files[activeFile] || "")) {
        onContentChange(localVal);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [localVal, activeFile, onContentChange, files]);

  // Sync scroll between textarea overlay and pre block underneath
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [activeFile]);

  if (openTabs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-[#a0a0a0] text-center bg-white select-none">
        <FileText size={48} className="text-[#e5e5e5] mb-3 animate-pulse" />
        <h4 className="text-sm font-bold text-[#333333]">No Editors Open</h4>
        <p className="text-xs text-[#616161] mt-1 max-w-xs leading-relaxed">
          Select a file from the explorer to start editing.
        </p>
        <div className="mt-6 flex flex-col items-center gap-2 text-[11px] text-[#a0a0a0]">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-[#f3f3f3] border border-[#e5e5e5] rounded text-[10px] font-mono">
              ⌘
            </kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-[#f3f3f3] border border-[#e5e5e5] rounded text-[10px] font-mono">
              P
            </kbd>
            <span className="ml-1">Quick Open</span>
          </div>
        </div>
      </div>
    );
  }

  const lines = localVal.split("\n");

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Breadcrumb */}
      <Breadcrumb activeFile={activeFile} />

      <div className="flex-1 min-h-0 flex relative bg-white">
        <div className="flex-1 h-full relative overflow-hidden">
          {/* Highlighted Pre Underneath */}
          <pre
            ref={preRef}
            className="absolute inset-0 w-full h-full font-mono text-[12px] py-3 pointer-events-none overflow-hidden select-none"
            style={{
              lineHeight: "20px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              color: "#333333",
            }}
          >
            {lines.map((line, idx) => (
              <div key={idx} className="flex items-start">
                <span className="w-[46px] text-right pr-3 text-[#b0b0b0] select-none shrink-0 bg-[#f8f8f8] border-r border-[#e5e5e5]">
                  {idx + 1}
                </span>
                <span
                  className="flex-1 whitespace-pre-wrap break-all pl-3 pr-4"
                  dangerouslySetInnerHTML={{ __html: highlight(line) || " " }}
                />
              </div>
            ))}
          </pre>

          {/* Transparent Textarea Overlay */}
          <textarea
            ref={textareaRef}
            value={localVal}
            onChange={(e) => setLocalVal(e.target.value)}
            onScroll={handleScroll}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-[#333333] py-3 border-none outline-none resize-none font-mono text-[12px] select-text overflow-y-auto selection:bg-[#add6ff] leading-5"
            style={{
              lineHeight: "20px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              paddingLeft: "58px",
              paddingRight: "16px",
            }}
            spellCheck="false"
          />
        </div>

        {/* Minimap */}
        <Minimap content={localVal} isNarrow={isNarrow} />

        {/* Unsaved changes badge */}
        {modifiedFiles[activeFile] && (
          <div className="absolute right-14 top-10 flex items-center gap-1.5 bg-[#fff6e6] border border-[#ffe6ba] px-2.5 py-1 rounded-md text-[10px] text-[#8f6d00] font-bold pointer-events-none animate-pulse shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8f6d00]" />
            <span>Modified</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VSCodeEditor;
