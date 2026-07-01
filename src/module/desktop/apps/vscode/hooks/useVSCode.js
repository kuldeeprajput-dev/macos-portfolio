import { useState, useEffect, useRef, useCallback } from "react";
import { INITIAL_FILES } from "../data/vscodeData";

const useVSCode = () => {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [activeFile, setActiveFile] = useState("src/App.jsx");
  const [openTabs, setOpenTabs] = useState(["src/App.jsx"]);
  const [showPreview, setShowPreview] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(224);
  const [previewWidth, setPreviewWidth] = useState(480);
  const [terminalHeight, setTerminalHeight] = useState(176);
  const [activeSidebarTab, setActiveSidebarTab] = useState("explorer");
  const [explorerExpanded, setExplorerExpanded] = useState({
    src: true,
    "src/components": true,
    "src/hooks": true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [modifiedFiles, setModifiedFiles] = useState({});
  const [installedExtensions, setInstalledExtensions] = useState(["GitHub Copilot", "Prettier"]);
  const [terminalHistory, setTerminalHistory] = useState([
    { type: "output", text: "Microsoft Windows / macOS Terminal Simulator" },
    { type: "output", text: "VS Code Integrated Terminal -- type 'help' for commands." },
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [notification, setNotification] = useState(null);
  const terminalBottomRef = useRef(null);

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
  }, []);

  const handleContentChange = useCallback(
    (newVal) => {
      setFiles((prev) => ({ ...prev, [activeFile]: newVal }));
      const initialContent = INITIAL_FILES[activeFile];
      if (newVal !== initialContent) {
        setModifiedFiles((prev) => ({ ...prev, [activeFile]: initialContent }));
      } else {
        setModifiedFiles((prev) => {
          const next = { ...prev };
          delete next[activeFile];
          return next;
        });
      }
    },
    [activeFile],
  );

  const selectFile = useCallback((filePath) => {
    setActiveFile(filePath);
    setOpenTabs((prev) => (prev.includes(filePath) ? prev : [...prev, filePath]));
  }, []);

  const closeTab = useCallback(
    (filePath, e) => {
      e.stopPropagation();
      setOpenTabs((prev) => {
        const next = prev.filter((t) => t !== filePath);
        if (activeFile === filePath && next.length > 0) {
          setActiveFile(next[next.length - 1]);
        }
        return next;
      });
    },
    [activeFile],
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = [];
    Object.entries(files).forEach(([path, content]) => {
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes(query)) {
          results.push({ path, lineNum: idx + 1, text: line.trim() });
        }
      });
    });
    setSearchResults(results);
  }, [searchQuery, files]);

  const runCommand = useCallback(
    (cmdStr) => {
      const trimmed = cmdStr.trim();
      if (!trimmed) return;
      const parts = trimmed.split(" ");
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);
      let output = [];

      switch (command) {
        case "help":
          output = [
            "Available commands:",
            "  help           - Show this help message",
            "  ls             - List workspace files",
            "  tree           - Show file tree structure",
            "  cat [file]     - Display file contents",
            "  echo [text]    - Print text to terminal",
            "  pwd            - Print working directory",
            "  whoami         - Display current user",
            "  date           - Show current date and time",
            "  uname -a       - Show system information",
            "  touch [file]   - Create a new empty file",
            "  node -v        - Show Node.js version",
            "  npm -v         - Show npm version",
            "  git status     - Show git repository status",
            "  git diff       - Show file changes",
            "  git log        - Show recent commit history",
            "  git branch     - List branches",
            "  bun run dev    - Start the dev server",
            "  bun run build  - Build the project",
            "  clear          - Clear the terminal",
          ];
          break;
        case "ls": {
          const allFiles = Object.keys(files);
          const topLevel = [...new Set(allFiles.map((f) => f.split("/")[0]))];
          output = topLevel.map((f) => {
            const isDir = allFiles.some((p) => p.startsWith(f + "/"));
            return isDir ? `\x1b[34m${f}/\x1b[0m` : f;
          });
          // Since we can't render ANSI, just show plainly
          output = topLevel.map((f) => {
            const isDir = allFiles.some((p) => p.startsWith(f + "/"));
            return isDir ? `📁 ${f}/` : `   ${f}`;
          });
          break;
        }
        case "tree": {
          output = [".", "├── src/"];
          const srcFiles = Object.keys(files).filter((f) => f.startsWith("src/"));
          const srcChildren = {};
          srcFiles.forEach((f) => {
            const rest = f.replace("src/", "");
            const parts = rest.split("/");
            if (parts.length === 1) {
              srcChildren[parts[0]] = "file";
            } else {
              if (!srcChildren[parts[0]]) srcChildren[parts[0]] = [];
              if (Array.isArray(srcChildren[parts[0]])) {
                srcChildren[parts[0]].push(parts.slice(1).join("/"));
              }
            }
          });
          const srcEntries = Object.entries(srcChildren);
          srcEntries.forEach(([name, val], i) => {
            const isLast = i === srcEntries.length - 1;
            const prefix = isLast ? "│   └── " : "│   ├── ";
            if (val === "file") {
              output.push(prefix + name);
            } else {
              output.push(prefix + name + "/");
              val.forEach((child, j) => {
                const childPrefix = isLast ? "│       " : "│   │   ";
                const childSymbol = j === val.length - 1 ? "└── " : "├── ";
                output.push(childPrefix + childSymbol + child);
              });
            }
          });
          const rootFiles = Object.keys(files).filter((f) => !f.includes("/"));
          rootFiles.forEach((f, i) => {
            const symbol = i === rootFiles.length - 1 ? "└── " : "├── ";
            output.push(symbol + f);
          });
          const totalFiles = Object.keys(files).length;
          const totalDirs = [
            ...new Set(
              Object.keys(files)
                .map((f) => f.split("/").slice(0, -1).join("/"))
                .filter(Boolean),
            ),
          ].length;
          output.push("");
          output.push(`${totalDirs} directories, ${totalFiles} files`);
          break;
        }
        case "cat":
          if (!args[0]) {
            output = ["Error: cat requires a file argument. (e.g. cat README.md)"];
          } else {
            let target = args[0];
            // Try exact match first, then try with src/ prefix
            if (files[target] !== undefined) {
              output = files[target].split("\n");
            } else if (files["src/" + target] !== undefined) {
              output = files["src/" + target].split("\n");
            } else {
              output = [`cat: ${args[0]}: No such file or directory`];
            }
          }
          break;
        case "echo":
          output = [args.join(" ") || ""];
          break;
        case "pwd":
          output = ["/Users/kuldeep/workspace/portfolio"];
          break;
        case "whoami":
          output = ["kuldeep"];
          break;
        case "date":
          output = [new Date().toString()];
          break;
        case "uname":
          output = ["Darwin MacBook-Pro.local 24.1.0 Darwin Kernel Version 24.1.0 arm64"];
          break;
        case "node":
          if (args[0] === "-v" || args[0] === "--version") {
            output = ["v22.12.0"];
          } else {
            output = ["Usage: node -v"];
          }
          break;
        case "npm":
          if (args[0] === "-v" || args[0] === "--version") {
            output = ["10.9.2"];
          } else if (args[0] === "run" && args[1] === "dev") {
            output = [
              "> portfolio@1.0.0 dev",
              "> next dev",
              "",
              "  ▲ Next.js 16.2.6",
              "  - Local:   http://localhost:3000",
            ];
          } else {
            output = ["Usage: npm -v | npm run dev"];
          }
          break;
        case "touch": {
          if (!args[0]) {
            output = ["Error: touch requires a filename argument."];
          } else {
            const newFile = args[0];
            if (files[newFile] !== undefined) {
              output = [`File '${newFile}' already exists.`];
            } else {
              setFiles((prev) => ({ ...prev, [newFile]: "" }));
              output = [`Created file: ${newFile}`];
            }
          }
          break;
        }
        case "mkdir":
          output = ["mkdir: directory created (simulated)"];
          break;
        case "clear":
          setTerminalHistory([]);
          return;
        case "git": {
          const sub = args[0] ? args[0].toLowerCase() : "";
          if (sub === "status") {
            const modifiedList = Object.keys(modifiedFiles);
            if (modifiedList.length === 0) {
              output = [
                "On branch main",
                "Your branch is up to date with 'origin/main'.",
                "",
                "nothing to commit, working tree clean",
              ];
            } else {
              output = [
                "On branch main",
                "Changes not staged for commit:",
                '  (use "git add <file>..." to update what will be committed)',
                "",
                ...modifiedList.map((f) => `\tmodified:   ${f}`),
                "",
                `${modifiedList.length} file(s) modified`,
              ];
            }
          } else if (sub === "diff") {
            const modifiedList = Object.keys(modifiedFiles);
            if (modifiedList.length === 0) {
              output = ["No changes to diff."];
            } else {
              output = [];
              modifiedList.forEach((file) => {
                output.push(`diff --git a/${file} b/${file}`);
                output.push(`--- a/${file}`);
                output.push(`+++ b/${file}`);
                output.push(`@@ changes @@`);
                const originalLines = (modifiedFiles[file] || "").split("\n").length;
                const currentLines = (files[file] || "").split("\n").length;
                output.push(`  ${originalLines} → ${currentLines} lines`);
              });
            }
          } else if (sub === "log") {
            output = [
              "commit a1b2c3d (HEAD -> main, origin/main)",
              "Author: Kuldeep Rajput <kuldeep@dev.com>",
              `Date:   ${new Date().toDateString()}`,
              "",
              "    Initial portfolio setup",
              "",
              "commit e4f5g6h",
              "Author: Kuldeep Rajput <kuldeep@dev.com>",
              "Date:   Sat Jun 7 2026",
              "",
              "    Add macOS desktop simulation",
            ];
          } else if (sub === "branch") {
            output = ["* main", "  develop", "  feature/weather-app"];
          } else {
            output = ["git subcommands: status, diff, log, branch"];
          }
          break;
        }
        case "bun":
          if (args[0] === "run" && args[1] === "dev") {
            output = [
              "  $ next dev",
              "  ▲ Next.js 16.2.6 (Turbopack)",
              "  - Local:        http://localhost:3000",
              "  - Network:      http://192.168.1.42:3000",
              "",
              "  ✓ Ready in 254ms",
            ];
          } else if (args[0] === "run" && args[1] === "build") {
            output = [
              "  $ next build",
              "  ▲ Next.js 16.2.6 (Turbopack)",
              "",
              "  Creating an optimized production build ...",
              "  ✓ Compiled successfully in 9.2s",
              "  ✓ Generating static pages (6/6)",
              "",
              "  Route (app)    Size     First Load JS",
              "  ○ /            5.2 kB   89.4 kB",
              "",
              "  ○ (Static)  prerendered as static content",
            ];
          } else {
            output = ["Usage: bun run dev | bun run build"];
          }
          break;
        default:
          output = [`zsh: command not found: ${command}`, "Type 'help' for available commands."];
      }

      setTerminalHistory((prev) => [
        ...prev,
        { type: "input", text: cmdStr },
        ...output.map((line) => ({ type: "output", text: line })),
      ]);
    },
    [files, modifiedFiles],
  );

  useEffect(() => {
    if (terminalBottomRef.current) {
      const container = terminalBottomRef.current.parentNode;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [terminalHistory]);

  return {
    files,
    setFiles,
    activeFile,
    openTabs,
    showPreview,
    setShowPreview,
    sidebarWidth,
    setSidebarWidth,
    previewWidth,
    setPreviewWidth,
    terminalHeight,
    setTerminalHeight,
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
    notification,
    setNotification,
    showNotification,
    handleContentChange,
    selectFile,
    closeTab,
    runCommand,
  };
};

export default useVSCode;
