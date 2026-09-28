import { dockApps, locations } from "@constants";
import useWindowsStore from "@store/window";
import useLocationStore from "@store/location";
import { Fragment, useMemo, useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
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
  const dragStartTimerRef = useRef(null);
  const dockRef = useDock();

  const resetAllIcons = () => {
    if (dockRef.current) {
      const icons = dockRef.current.querySelectorAll(".dock-icon");
      icons.forEach((icon) => {
        gsap.killTweensOf(icon);
        gsap.set(icon, { clearProps: "all" });
      });
    }
  };

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
    setHoveredAppId(null);
    draggedAppIdRef.current = id;
    setDockDragging(true);
    resetAllIcons();

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

    // Wait for a sustained drag before dimming the icon and showing the grabbing cursor.
    dragStartTimerRef.current = setTimeout(() => {
      if (draggedAppIdRef.current === id) {
        setDraggedAppId(id);
      }
      dragStartTimerRef.current = null;
    }, 150);
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

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    // Midpoint threshold check: only reorder once pointer crosses the midpoint
    // of the target item in the drag direction to prevent rapid oscillation/flicker
    const targetElement = e.currentTarget;
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const targetCenter = rect.left + rect.width / 2;

      if (fromIndex < toIndex && e.clientX < targetCenter) {
        return;
      }
      if (fromIndex > toIndex && e.clientX > targetCenter) {
        return;
      }
    }

    reorderDockApps(fromIndex, toIndex);
  };

  const handleDragEnd = useCallback(() => {
    clearTimeout(dragStartTimerRef.current);
    dragStartTimerRef.current = null;
    draggedAppIdRef.current = null;
    setDraggedAppId(null);
    setHoveredAppId(null);
    setDockDragging(false);
    resetAllIcons();
  }, [setDockDragging]);

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      if (draggedAppIdRef.current) {
        handleDragEnd();
      }
    };
    window.addEventListener("dragend", handleGlobalDragEnd);
    window.addEventListener("drop", handleGlobalDragEnd, true);
    return () => {
      window.removeEventListener("dragend", handleGlobalDragEnd);
      window.removeEventListener("drop", handleGlobalDragEnd, true);
      clearTimeout(dragStartTimerRef.current);
    };
  }, [handleDragEnd]);

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
              isHovered={hoveredAppId === id && !draggedAppId}
              onMouseEnter={() => {
                if (!draggedAppIdRef.current) {
                  setHoveredAppId(id);
                }
              }}
              onMouseLeave={() => {
                setHoveredAppId((prev) => (prev === id ? null : prev));
              }}
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
