import { useState, useCallback, useRef } from "react";
import { locations } from "@constants";
import useLocationStore from "@store/location";
import useWindowsStore from "@store/window";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import OptimizedImage from "@module/shared/ui/components/OptimizedImage";
import HomeFolder from "./HomeFolder";
import DesktopShortcut from "./DesktopShortcut";
import DesktopContextMenu from "./DesktopContextMenu";
import FolderRenameInput from "./FolderRenameInput";

const projects = locations.work?.children ?? [];
const desktopWallpapers = [
  { id: "wallpaper", label: "Wallpaper 1", src: "/wallpapers/wallpaper.webp" },
  { id: "wallpaper2", label: "Wallpaper 2", src: "/wallpapers/wallpaper2.webp" },
  { id: "wallpaper3", label: "Wallpaper 3", src: "/wallpapers/wallpaper3.webp" },
  { id: "wallpaper4", label: "Wallpaper 4", src: "/wallpapers/wallpaper4.webp" },
  { id: "wallpaper5", label: "Wallpaper 5", src: "/wallpapers/wallpaper5.webp" },
  { id: "wallpaper6", label: "Wallpaper 6", src: "/wallpapers/wallpaper6.webp" },
];

const Home = () => {
  const { setActiveLocation } = useLocationStore();
  const {
    openWindow,
    unminimizeWindow,
    focusWindow,
    windows,
    desktopShortcuts,
    addDesktopShortcut,
    removeDesktopShortcut,
    updateShortcutPosition,
    setAboutPortfolioOpen,
  } = useWindowsStore();

  const [contextMenu, setContextMenu] = useState(null);
  const [customFolders, setCustomFolders] = useState([]);
  const [deletedFolderIds, setDeletedFolderIds] = useState([]);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [renamedProjects, setRenamedProjects] = useState({});
  const suppressCustomFolderClickRef = useRef(null);

  const visibleProjects = projects.filter((project) => !deletedFolderIds.includes(project.id));

  const handleRenameFolder = (target) => {
    if (!target) return;
    setEditingFolderId(target.id);
  };

  const handleRenameProject = (projectId, newName) => {
    if (newName && newName.trim()) {
      setRenamedProjects((prev) => ({
        ...prev,
        [projectId]: newName.trim(),
      }));
    }
    setEditingFolderId(null);
  };

  const handleRenameCustomFolder = (folderId, newName) => {
    if (newName && newName.trim()) {
      setCustomFolders((prev) =>
        prev.map((f) => (f.id === folderId ? { ...f, name: newName.trim() } : f)),
      );
    }
    setEditingFolderId(null);
  };

  const handleOpenProjectFinder = (project) => {
    setActiveLocation(project);
    openWindow("finder");
  };

  const handleOpenApp = (appId) => {
    const window = windows[appId];
    if (window?.isOpen) {
      if (window.isMinimized) {
        unminimizeWindow(appId);
      } else {
        focusWindow(appId);
      }
    } else {
      openWindow(appId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const source = e.dataTransfer.getData("drag-source");
    const appId = e.dataTransfer.getData("text/plain");

    if (source === "dock" && appId) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - 32; // center icon (half of w-16 = 32px)
      const y = e.clientY - rect.top - 40;
      addDesktopShortcut(appId, x, y);
    }
  };

  useGSAP(() => {
    const instances = Draggable.create(".folder, .desktop-shortcut", {
      bounds: "#home",
      allowContextMenu: true,
      cursor: "default",
      activeCursor: "default",
      onDragStart: function () {
        document.body.classList.add("folder-dragging");
      },
      onDragEnd: function () {
        document.body.classList.remove("folder-dragging");
        const el = this.target;
        if (el.classList.contains("desktop-shortcut")) {
          const id = el.dataset.id;
          const left = parseFloat(el.style.left || 0) + this.x;
          const top = parseFloat(el.style.top || 0) + this.y;

          updateShortcutPosition(id, left, top);
          gsap.set(el, { x: 0, y: 0 });
        } else if (el.dataset.custom === "true") {
          const id = el.dataset.id;
          suppressCustomFolderClickRef.current = id;
          setCustomFolders((prev) =>
            prev.map((f) => {
              if (f.id === id) {
                return {
                  ...f,
                  x: (f.x || 0) + this.x,
                  y: (f.y || 0) + this.y,
                };
              }
              return f;
            }),
          );
          gsap.set(el, { x: 0, y: 0 });
        }
      },
      onRelease: function () {
        document.body.classList.remove("folder-dragging");
      },
    });

    return () => {
      document.body.classList.remove("folder-dragging");
      instances.forEach((instance) => instance.kill());
    };
  }, [desktopShortcuts, customFolders, deletedFolderIds]);

  // Context Menu Handlers
  const handleDesktopContextMenu = (e) => {
    // Only trigger desktop context menu if clicking directly on background
    if (e.target.closest(".folder") || e.target.closest(".desktop-shortcut")) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: "desktop",
      target: null,
    });
  };

  const handleFolderContextMenu = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: "folder",
      target: project,
    });
  };

  const handleShortcutContextMenu = (e, shortcut) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: "shortcut",
      target: shortcut,
    });
  };

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleNewFolder = () => {
    const newId = `folder-custom-${Date.now()}`;
    const x = Math.max(20, Math.min(contextMenu?.x || 100, window.innerWidth - 120));
    const y = Math.max(50, Math.min((contextMenu?.y || 100) - 35, window.innerHeight - 150));
    setCustomFolders((prev) => [
      ...prev,
      {
        id: newId,
        name: "Untitled Folder",
        isCustom: true,
        x,
        y,
      },
    ]);
  };

  const handleGetInfo = (target) => {
    if (target?.id && !target.isCustom && target.children) {
      handleOpenProjectFinder(target);
    } else {
      setAboutPortfolioOpen(true);
    }
  };

  const handleChangeWallpaper = (wallpaper) => {
    const nextIdx = desktopWallpapers.findIndex((item) => item.id === wallpaper.id);
    if (nextIdx === -1) return;

    setWallpaperIndex(nextIdx);
    document.body.style.backgroundImage = `url("${wallpaper.src}")`;
  };

  const handleOpenProjects = () => {
    if (!locations.work) return;
    setActiveLocation(locations.work);
    openWindow("finder");
  };

  const handleCleanUp = () => {
    gsap.to(".folder, .desktop-shortcut", {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.03,
    });
  };

  const handleOpenTerminal = () => openWindow("terminal");
  const handleOpenSettings = () => openWindow("settings");

  const handleDeleteFolder = (target) => {
    if (!target) return;
    const targetId = target.id;
    if (target.isCustom) {
      setCustomFolders((prev) => prev.filter((f) => f.id !== targetId));
    } else {
      setDeletedFolderIds((prev) => [...prev, targetId]);
    }

    try {
      if (locations.trash && Array.isArray(locations.trash.children)) {
        const exists = locations.trash.children.some((item) => item.name === target.name);
        if (!exists) {
          locations.trash.children.push({
            id: Date.now(),
            name: target.name || "Untitled Folder",
            type: "folder",
            icon: "/system/icons/files/folder.webp",
          });
        }
      }
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="home"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onContextMenu={handleDesktopContextMenu}
    >
      <ul>
        {visibleProjects.map((project) => (
          <HomeFolder
            key={project.id}
            project={project}
            displayName={renamedProjects[project.id]}
            isEditing={editingFolderId === project.id}
            onRename={(newName) => handleRenameProject(project.id, newName)}
            onClick={() => handleOpenProjectFinder(project)}
            onContextMenu={handleFolderContextMenu}
          />
        ))}

        {customFolders.map((folder) => {
          const isEditing = editingFolderId === folder.id;
          return (
            <li
              key={folder.id}
              data-id={folder.id}
              data-custom="true"
              className="folder cursor-default absolute select-none flex items-center flex-col"
              style={{
                left: `${folder.x}px`,
                top: `${folder.y}px`,
              }}
              onPointerDown={() => {
                suppressCustomFolderClickRef.current = null;
              }}
              onClick={() => {
                if (suppressCustomFolderClickRef.current === folder.id) {
                  suppressCustomFolderClickRef.current = null;
                  return;
                }
                if (!isEditing) openWindow("finder");
              }}
              onContextMenu={(e) => handleFolderContextMenu(e, folder)}
            >
              <div className="w-[62px] h-[52px] flex items-center justify-center pointer-events-none">
                <OptimizedImage
                  src="/system/icons/files/folder.webp"
                  alt={folder.name}
                  width={62}
                  height={52}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
              {isEditing ? (
                <FolderRenameInput
                  initialValue={folder.name}
                  onSave={(val) => handleRenameCustomFolder(folder.id, val)}
                  onCancel={() => setEditingFolderId(null)}
                />
              ) : (
                <p>{folder.name}</p>
              )}
            </li>
          );
        })}

        {desktopShortcuts.map((shortcut) => (
          <DesktopShortcut
            key={shortcut.id}
            shortcut={shortcut}
            onDoubleClick={() => handleOpenApp(shortcut.appId)}
            onRemove={() => removeDesktopShortcut(shortcut.id)}
            onContextMenu={handleShortcutContextMenu}
          />
        ))}
      </ul>

      {/* macOS Desktop Context Menu */}
      <DesktopContextMenu
        menu={contextMenu}
        onClose={handleCloseContextMenu}
        onNewFolder={handleNewFolder}
        onGetInfo={handleGetInfo}
        onChangeWallpaper={handleChangeWallpaper}
        wallpapers={desktopWallpapers}
        activeWallpaperIndex={wallpaperIndex}
        onOpenProjects={handleOpenProjects}
        onOpenProject={handleOpenProjectFinder}
        projects={visibleProjects}
        onOpenApp={handleOpenApp}
        onCleanUp={handleCleanUp}
        onOpenTerminal={handleOpenTerminal}
        onOpenSettings={handleOpenSettings}
        onOpenFolder={handleOpenProjectFinder}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
        onDeleteCustomFolder={handleDeleteFolder}
        onOpenShortcut={handleOpenApp}
        onDeleteShortcut={removeDesktopShortcut}
      />
    </section>
  );
};

export default Home;
