import { dockApps, locations } from "@constants";
import useWindowsStore from "@store/window";
import useLocationStore from "@store/location";
import { Fragment, useMemo, useState, useRef } from "react";
import DockIcon from "./DockIcon";
import useDock from "../../hooks/useDock";

const Dock = () => {
  const {
    openWindow,
    closeWindow,
    unminimizeWindow,
    windows,
    isDockHiddenByCollision,
    dockAppIds,
    reorderDockApps,
    setDockDragging,
  } = useWindowsStore();
  const setActiveLocation = useLocationStore((state) => state.setActiveLocation);
  const [hoveredAppId, setHoveredAppId] = useState(null);
  const [draggedAppId, setDraggedAppId] = useState(null);
  const draggedAppIdRef = useRef(null);
  const dockRef = useDock();

  const focusedWindowId = useMemo(() => {
    return Object.entries(windows).reduce((focusedId, [id, win]) => {
      if (!win.isOpen || win.isMinimized) return focusedId;
      if (!focusedId) return id;
      return win.zIndex > windows[focusedId].zIndex ? id : focusedId;
    }, null);
  }, [windows]);

  const orderedDockApps = useMemo(() => {
    if (!dockAppIds) return dockApps;
    return dockAppIds.map((id) => dockApps.find((app) => app.id === id)).filter(Boolean);
  }, [dockAppIds]);

  const toggleApp = (app) => {
    if (!app.canOpen) return;

    if (app.id === "trash") {
      setActiveLocation(locations.trash);
      const window = windows["finder"];
      if (window?.isOpen) {
        if (window.isMinimized) {
          unminimizeWindow("finder");
        } else {
          const activeLocation = useLocationStore.getState().activeLocation;
          if (activeLocation?.id === locations.trash.id) {
            closeWindow("finder");
          } else {
            unminimizeWindow("finder");
          }
        }
      } else {
        openWindow("finder");
      }
      return;
    }

    if (app.id === "folder") {
      setActiveLocation(locations.work);
      const window = windows["finder"];
      if (window?.isOpen) {
        if (window.isMinimized) {
          unminimizeWindow("finder");
        } else {
          const activeLocation = useLocationStore.getState().activeLocation;
          if (activeLocation?.id === locations.work.id) {
            closeWindow("finder");
          } else {
            unminimizeWindow("finder");
          }
        }
      } else {
        openWindow("finder");
      }
      return;
    }

    const appId = app.id === "folder" ? "finder" : app.id;
    const window = windows[appId];
    if (window?.isOpen) {
      if (window.isMinimized) {
        unminimizeWindow(appId);
      } else {
        closeWindow(appId);
      }
    } else {
      openWindow(appId);
    }
  };

  const isAnyWindowMaximized = Object.values(windows).some(
    (win) => win.isOpen && win.isMaximized && !win.isMinimized,
  );

  const handleDragStart = (e, id) => {
    draggedAppIdRef.current = id;
    setDockDragging(true);

    const currentIds = useWindowsStore.getState().dockAppIds || [];
    const index = currentIds.indexOf(id);

    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.setData("drag-source", "dock");
    e.dataTransfer.setData("drag-index", index >= 0 ? index.toString() : "0");
    e.dataTransfer.effectAllowed = "copyMove";

    // Set custom clean drag image using the inner icon/image element only
    const img =
      e.currentTarget.querySelector("img") || e.currentTarget.querySelector(".size-full > div");
    if (img) {
      e.dataTransfer.setDragImage(img, 24, 24);
    }

    // Timeout ensures the browser has successfully captured the drag image before we hide it in the DOM
    setTimeout(() => {
      setDraggedAppId(id);
    }, 0);
  };

  const handleDragOver = (e, targetId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const sourceId = draggedAppIdRef.current;
    if (!sourceId || sourceId === targetId) return;

    const currentIds = useWindowsStore.getState().dockAppIds;
    if (!currentIds) return;

    const fromIndex = currentIds.indexOf(sourceId);
    const toIndex = currentIds.indexOf(targetId);

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      reorderDockApps(fromIndex, toIndex);
    }
  };

  const handleDragEnd = () => {
    draggedAppIdRef.current = null;
    setDraggedAppId(null);
    setDockDragging(false);
  };

  return (
    <section
      id="dock"
      className={isAnyWindowMaximized || isDockHiddenByCollision ? "dock-hidden" : ""}
      aria-label="Dock"
    >
      <div ref={dockRef} className="dock-container">
        {orderedDockApps.map(({ id, name, icon, canOpen }) => (
          <Fragment key={id}>
            {id === "folder" && (
              <div className="dock-separator-wrap" aria-hidden="true">
                <span className="dock-separator" />
              </div>
            )}
            <DockIcon
              app={{ id, name, icon, canOpen }}
              state={windows[id === "folder" ? "finder" : id]}
              isFocused={focusedWindowId === (id === "folder" ? "finder" : id)}
              isHovered={hoveredAppId === id}
              onMouseEnter={() => setHoveredAppId(id)}
              onMouseLeave={() => setHoveredAppId(null)}
              onClick={() => toggleApp({ id, canOpen })}
              onDragStart={(e) => handleDragStart(e, id)}
              onDragOver={(e) => handleDragOver(e, id)}
              onDragEnd={handleDragEnd}
              isDragging={draggedAppId === id}
              style={{
                opacity: draggedAppId === id ? 0.3 : 1,
              }}
            />
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export default Dock;
