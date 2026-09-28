import { locations } from "@constants";
import useLocationStore from "@store/location";
import useWindowsStore from "@store/window";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import HomeFolder from "./HomeFolder";
import DesktopShortcut from "./DesktopShortcut";

const projects = locations.work?.children ?? [];

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
  } = useWindowsStore();

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
      cursor: "pointer",
      activeCursor: "grabbing",
      onPress: function () {
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
  }, [desktopShortcuts]);

  return (
    <section id="home" onDragOver={handleDragOver} onDrop={handleDrop}>
      <ul>
        {projects.map((project) => (
          <HomeFolder
            key={project.id}
            project={project}
            onClick={() => handleOpenProjectFinder(project)}
          />
        ))}

        {desktopShortcuts.map((shortcut) => (
          <DesktopShortcut
            key={shortcut.id}
            shortcut={shortcut}
            onDoubleClick={() => handleOpenApp(shortcut.appId)}
            onRemove={() => removeDesktopShortcut(shortcut.id)}
          />
        ))}
      </ul>
    </section>
  );
};

export default Home;
