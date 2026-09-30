import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const DesktopContextMenu = ({
  menu,
  onClose,
  onNewFolder,
  onGetInfo,
  onChangeWallpaper,
  wallpapers = [],
  activeWallpaperIndex = 0,
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
  const openSubmenuLeft = left + menuWidth + 4 + 180 > window.innerWidth - 8;
  const wallpaperSubmenuWidth = 264;
  const openWallpaperSubmenuLeft = left + menuWidth + wallpaperSubmenuWidth > window.innerWidth - 8;
  const wallpaperSubmenuLeft = Math.max(
    8,
    Math.min(
      openWallpaperSubmenuLeft ? left - wallpaperSubmenuWidth : left + menuWidth,
      window.innerWidth - wallpaperSubmenuWidth - 8,
    ),
  );
  const wallpaperSubmenuTop = Math.max(8, Math.min(top + 64, window.innerHeight - menuHeight - 8));
  const wallpaperSubmenuOffsetLeft = wallpaperSubmenuLeft - left - 4;
  const wallpaperSubmenuOffsetTop = wallpaperSubmenuTop - top - 64;

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

  return createPortal(
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
          <div
            className="relative"
            onMouseEnter={() => setActiveSubmenu("wallpaper")}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            {activeSubmenu === "wallpaper" && (
              <span
                aria-hidden="true"
                className={`pointer-events-auto absolute top-0 z-[99999] h-full w-1 ${
                  openWallpaperSubmenuLeft ? "right-full" : "left-full"
                }`}
              />
            )}
            <button
              onClick={() =>
                setActiveSubmenu((current) => (current === "wallpaper" ? null : "wallpaper"))
              }
              aria-haspopup="true"
              aria-expanded={activeSubmenu === "wallpaper"}
              className={`group flex h-[26px] w-full items-center justify-between rounded-[5px] px-2.5 text-left text-white/90 transition-colors cursor-default ${
                activeSubmenu === "wallpaper"
                  ? "bg-gradient-to-b from-[#1687ff] to-[#0071e3] text-white"
                  : "hover:bg-gradient-to-b hover:from-[#1687ff] hover:to-[#0071e3] hover:text-white"
              }`}
            >
              <span>Change Wallpaper...</span>
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

            {activeSubmenu === "wallpaper" && (
              <div
                className="absolute z-[100000] w-[264px] max-w-[calc(100vw-16px)] rounded-[10px] p-2 font-sans text-[13px] text-[#f5f5f7] shadow-[0_18px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.12)_inset] animate-in fade-in zoom-in-95 duration-100"
                style={{
                  left: `${wallpaperSubmenuOffsetLeft}px`,
                  top: `${wallpaperSubmenuOffsetTop}px`,
                  maxHeight: "calc(100vh - 16px)",
                  overflowY: "auto",
                  background: "rgba(30, 30, 30, 0.85)",
                  backdropFilter: "blur(40px) saturate(210%)",
                  WebkitBackdropFilter: "blur(40px) saturate(210%)",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                }}
              >
                <p className="px-1 pb-2 text-[11px] font-medium text-white/55">
                  Choose a Wallpaper
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {wallpapers.map((wallpaper, index) => (
                    <button
                      key={wallpaper.id}
                      type="button"
                      aria-label={`Set ${wallpaper.label}`}
                      aria-pressed={activeWallpaperIndex === index}
                      onClick={() => {
                        onChangeWallpaper(wallpaper);
                        onClose();
                      }}
                      className="group min-w-0 rounded-md p-1 text-left text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1687ff]"
                    >
                      <span
                        className={`relative block overflow-hidden rounded-[5px] border ${
                          activeWallpaperIndex === index
                            ? "border-[#62aaff]"
                            : "border-white/15 group-hover:border-white/40"
                        }`}
                      >
                        <img
                          src={wallpaper.src}
                          alt=""
                          loading="eager"
                          className="aspect-[2/1] w-full object-cover"
                        />
                        {activeWallpaperIndex === index && (
                          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1687ff] text-[10px] text-white">
                            ✓
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block truncate px-0.5 text-[11px]">
                        {wallpaper.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

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
            {activeSubmenu === "sortBy" && (
              <span
                aria-hidden="true"
                className={`pointer-events-auto absolute top-0 z-[99999] h-full w-1 ${
                  openSubmenuLeft ? "right-full" : "left-full"
                }`}
              />
            )}
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
                  openSubmenuLeft ? "right-full -translate-x-1" : "left-full translate-x-1"
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
            {activeSubmenu === "cleanUpBy" && (
              <span
                aria-hidden="true"
                className={`pointer-events-auto absolute top-0 z-[99999] h-full w-1 ${
                  openSubmenuLeft ? "right-full" : "left-full"
                }`}
              />
            )}
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
                  openSubmenuLeft ? "right-full -translate-x-1" : "left-full translate-x-1"
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
    </div>,
    document.body,
  );
};

export default DesktopContextMenu;
