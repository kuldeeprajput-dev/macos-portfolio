import { useState, useEffect, useRef } from "react";

const DesktopContextMenu = ({
  menu,
  onClose,
  onNewFolder,
  onGetInfo,
  onChangeWallpaper,
  onOpenProjects,
  onOpenProject,
  projects = [],
  onOpenApp,
  onOpenTerminal,
  onOpenSettings,
  onCleanUp,
  onOpenFolder,
  onRenameFolder,
  onDeleteFolder,
  onDeleteCustomFolder,
  onOpenShortcut,
  onDeleteShortcut,
}) => {
  const menuRef = useRef(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [copied, setCopied] = useState(false);

  // Close when clicking outside or pressing Escape / shortcut key
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (
        (e.key === "Backspace" || e.key === "Delete") &&
        (e.metaKey || e.ctrlKey || menu?.type === "folder" || menu?.type === "shortcut")
      ) {
        if (menu?.type === "folder" && menu?.target) {
          e.preventDefault();
          if (onDeleteFolder) {
            onDeleteFolder(menu.target);
          } else if (onDeleteCustomFolder) {
            onDeleteCustomFolder(menu.target?.id);
          }
          onClose();
        } else if (menu?.type === "shortcut" && menu?.target) {
          e.preventDefault();
          if (onDeleteShortcut) {
            onDeleteShortcut(menu.target.id);
          }
          onClose();
        }
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", onClose);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", onClose);
    };
  }, [menu, onDeleteFolder, onDeleteCustomFolder, onDeleteShortcut, onClose]);

  if (!menu) return null;

  // Viewport clamping
  const menuWidth = 240;
  const menuHeight = menu.type === "desktop" ? 340 : 180;
  const left = Math.max(10, Math.min(menu.x, window.innerWidth - menuWidth - 10));
  const top = Math.max(40, Math.min(menu.y, window.innerHeight - menuHeight - 10));
  const openSubmenuLeft = left + menuWidth + 180 > window.innerWidth;

  const handleCopy = (text) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 600);
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[99999] w-[240px] select-none rounded-[10px] p-1 font-sans text-[13px] leading-tight text-[#f5f5f7] animate-in fade-in zoom-in-95 duration-100 ease-out shadow-[0_18px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.12)_inset]"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        background: "rgba(30, 30, 30, 0.72)",
        backdropFilter: "blur(40px) saturate(210%)",
        WebkitBackdropFilter: "blur(40px) saturate(210%)",
        border: "1px solid rgba(255, 255, 255, 0.16)",
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* ─── DESKTOP CONTEXT MENU ─── */}
      {menu.type === "desktop" && (
        <div className="flex flex-col">
          {/* New Folder */}
          <button
            onClick={() => {
              onNewFolder();
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>New Folder</span>
            <span className="text-[12px] text-white/40 tracking-wider group-hover:text-white">
              ⇧⌘N
            </span>
          </button>

          <div className="my-1 h-[0.5px] bg-white/12 mx-1" />

          {/* Get Info */}
          <button
            onClick={() => {
              onGetInfo();
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Get Info</span>
            <span className="text-[12px] text-white/40 tracking-wider group-hover:text-white">
              ⌘I
            </span>
          </button>

          {/* Change Wallpaper */}
          <button
            onClick={() => {
              onChangeWallpaper();
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Change Wallpaper...</span>
          </button>

          {/* Contacts */}
          <button
            onClick={() => {
              onOpenApp("contact");
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Contacts</span>
          </button>

          <div className="my-1 h-[0.5px] bg-white/12 mx-1" />

          {/* Browse Projects */}
          <button
            onClick={() => {
              onOpenProjects();
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Browse Projects</span>
          </button>

          {/* Choose a Project (Submenu) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveSubmenu("sortBy")}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <button
              className={`group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors cursor-default ${
                activeSubmenu === "sortBy"
                  ? "bg-gradient-to-b from-[#1687ff] to-[#0071e3] text-white"
                  : "hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white"
              }`}
            >
              <span>Choose a Project</span>
              <svg
                className="h-3 w-3 text-white/50 group-hover:text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {activeSubmenu === "sortBy" && (
              <div
                className={`absolute top-0 z-[100000] w-[180px] rounded-[10px] p-1 font-sans text-[13px] text-[#f5f5f7] shadow-[0_18px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.12)_inset] animate-in fade-in zoom-in-95 duration-100 ${
                  openSubmenuLeft ? "right-full" : "left-full"
                }`}
                style={{
                  background: "rgba(30, 30, 30, 0.85)",
                  backdropFilter: "blur(40px) saturate(210%)",
                  WebkitBackdropFilter: "blur(40px) saturate(210%)",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                }}
              >
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      onOpenProject(project);
                      onClose();
                    }}
                    className="flex h-[26px] w-full items-center rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
                  >
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
                {projects.length === 0 && (
                  <span className="px-2.5 py-1.5 text-xs text-white/50">No projects available</span>
                )}
              </div>
            )}
          </div>

          {/* Reset Folder Positions */}
          <button
            onClick={() => {
              onCleanUp();
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Reset Folder Positions</span>
          </button>

          {/* Quick Open (Submenu) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveSubmenu("cleanUpBy")}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <button
              className={`group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors cursor-default ${
                activeSubmenu === "cleanUpBy"
                  ? "bg-gradient-to-b from-[#1687ff] to-[#0071e3] text-white"
                  : "hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white"
              }`}
            >
              <span>Quick Open</span>
              <svg
                className="h-3 w-3 text-white/50 group-hover:text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {activeSubmenu === "cleanUpBy" && (
              <div
                className={`absolute top-0 z-[100000] w-[180px] rounded-[10px] p-1 font-sans text-[13px] text-[#f5f5f7] shadow-[0_18px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.12)_inset] animate-in fade-in zoom-in-95 duration-100 ${
                  openSubmenuLeft ? "right-full" : "left-full"
                }`}
                style={{
                  background: "rgba(30, 30, 30, 0.85)",
                  backdropFilter: "blur(40px) saturate(210%)",
                  WebkitBackdropFilter: "blur(40px) saturate(210%)",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                }}
              >
                {[
                  { label: "Projects", action: onOpenProjects },
                  { label: "Contact", action: () => onOpenApp("contact") },
                  { label: "Resume", action: () => onOpenApp("resume") },
                ].map(({ label, action }) => (
                  <button
                    key={label}
                    onClick={() => {
                      action();
                      onClose();
                    }}
                    className="flex h-[26px] w-full items-center rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="my-1 h-[0.5px] bg-white/12 mx-1" />

          {/* Open in Terminal */}
          <button
            onClick={() => {
              onOpenTerminal();
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Open in Terminal</span>
            <span className="text-[12px] text-white/40 tracking-wider group-hover:text-white">
              ⌃⌥T
            </span>
          </button>

          {/* Open Settings */}
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Open Settings...</span>
            <span className="text-[12px] text-white/40 tracking-wider group-hover:text-white">
              ⌘J
            </span>
          </button>
        </div>
      )}

      {/* ─── FOLDER CONTEXT MENU ─── */}
      {menu.type === "folder" && (
        <div className="flex flex-col">
          {/* Rename */}
          <button
            onClick={() => {
              if (onRenameFolder) {
                onRenameFolder(menu.target);
              }
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Rename</span>
          </button>

          <button
            onClick={() => {
              onOpenFolder(menu.target);
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Open in Finder</span>
          </button>

          <div className="my-1 h-[0.5px] bg-white/12 mx-1" />

          {/* Get Info */}
          <button
            onClick={() => {
              onGetInfo(menu.target);
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Get Info</span>
            <span className="text-[12px] text-white/40 tracking-wider group-hover:text-white">
              ⌘I
            </span>
          </button>

          {/* Copy Name */}
          <button
            onClick={() => handleCopy(menu.target?.name || "Folder")}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>{copied ? "Copied!" : "Copy"}</span>
            <span className="text-[12px] text-white/40 tracking-wider group-hover:text-white">
              ⌘C
            </span>
          </button>

          <div className="my-1 h-[0.5px] bg-white/12 mx-1" />

          {/* Move to Trash */}
          <button
            onClick={() => {
              if (onDeleteFolder) {
                onDeleteFolder(menu.target);
              } else if (onDeleteCustomFolder) {
                onDeleteCustomFolder(menu.target?.id);
              }
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Move to Trash</span>
            <span className="text-[12px] text-white/40 tracking-wider group-hover:text-white">
              ⌘⌫
            </span>
          </button>
        </div>
      )}

      {/* ─── DESKTOP SHORTCUT CONTEXT MENU ─── */}
      {menu.type === "shortcut" && (
        <div className="flex flex-col">
          {/* Open App */}
          <button
            onClick={() => {
              onOpenShortcut(menu.target?.appId);
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Open {menu.target?.name || "App"}</span>
            <span className="text-[12px] text-white/40 tracking-wider group-hover:text-white">
              ⌘O
            </span>
          </button>

          <div className="my-1 h-[0.5px] bg-white/12 mx-1" />

          {/* Get Info */}
          <button
            onClick={() => {
              onGetInfo(menu.target);
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Get Info</span>
            <span className="text-[12px] text-white/40 tracking-wider group-hover:text-white">
              ⌘I
            </span>
          </button>

          <div className="my-1 h-[0.5px] bg-white/12 mx-1" />

          {/* Delete Shortcut */}
          <button
            onClick={() => {
              onDeleteShortcut(menu.target?.id);
              onClose();
            }}
            className="group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white cursor-default"
          >
            <span>Delete Shortcut</span>
            <span className="text-[12px] text-white/40 tracking-wider group-hover:text-white">
              ⌘⌫
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DesktopContextMenu;
