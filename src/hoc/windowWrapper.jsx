import useWindowsStore from "@store/window";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useRef, useState, useEffect, useMemo } from "react";

const checkDockCollision = () => {
  if (typeof window === "undefined") return;
  const dockEl = document.querySelector(".dock-container");
  if (!dockEl) return;
  const dockRect = dockEl.getBoundingClientRect();

  const windowsList = document.querySelectorAll("main > section");
  let collision = false;
  for (const winEl of windowsList) {
    if (
      winEl.style.display !== "none" &&
      winEl.id &&
      winEl.id !== "dock" &&
      winEl.id !== "navbar" &&
      winEl.id !== "desktop-area"
    ) {
      const winRect = winEl.getBoundingClientRect();
      const overlap = !(
        winRect.right < dockRect.left ||
        winRect.left > dockRect.right ||
        winRect.bottom < dockRect.top ||
        winRect.top > dockRect.bottom
      );
      if (overlap) {
        collision = true;
        break;
      }
    }
  }

  const currentVal = useWindowsStore.getState().isDockHiddenByCollision;
  if (currentVal !== collision) {
    useWindowsStore.getState().setDockHiddenByCollision(collision);
  }
};

const windowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowsStore();
    const { isOpen, zIndex: baseZIndex } = windows[windowKey] || { isOpen: false, zIndex: 1000 };
    const zIndex = baseZIndex;
    const ref = useRef(null);
    const prevOpenRef = useRef(false);
    const [isMobile, setIsMobile] = useState(() =>
      typeof window !== "undefined" ? window.innerWidth < 768 : false,
    );

    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useGSAP(() => {
      const el = ref.current;
      if (!el || isMobile || !isOpen) return;

      const headers = el.querySelectorAll("#window-header, .window-header");
      const dragTrigger = headers.length > 0 ? Array.from(headers) : el;
      const [instance] = Draggable.create(el, {
        trigger: dragTrigger,
        cursor: "default",
        bounds: "#desktop-area",
        onPress: () => focusWindow(windowKey),
        onDragStart: () => {
          document.body.classList.add("window-dragging");
        },
        onDrag: checkDockCollision,
        onDragEnd: () => {
          document.body.classList.remove("window-dragging");
          checkDockCollision();
        },
      });

      return () => {
        instance.kill();
        checkDockCollision();
      };
    }, [isMobile, isOpen]);

    const isMinimized = windows[windowKey]?.isMinimized;
    const [shouldRender, setShouldRender] = useState(isOpen && !isMinimized);
    const prevMinimizedRef = useRef(isMinimized);
    const lastPosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
      if (isMobile) return;
      if (isOpen && !isMinimized) {
        setShouldRender(true);
      }
      checkDockCollision();
    }, [isOpen, isMinimized, isMobile]);

    useEffect(() => {
      if (!isMobile) return;
      const isActive = isOpen && !isMinimized;
      if (isActive) {
        setShouldRender(true);
      } else {
        const timer = setTimeout(() => {
          setShouldRender(false);
        }, 450);
        return () => clearTimeout(timer);
      }
    }, [isOpen, isMinimized, isMobile]);

    useGSAP(() => {
      const el = ref.current;
      if (!el || isMobile) return;

      // Case 1: Window opening
      if (isOpen && !isMinimized && !prevOpenRef.current) {
        gsap.killTweensOf(el);
        gsap.fromTo(
          el,
          { scale: 0.85, opacity: 0, y: 30, x: 0 },
          { scale: 1, opacity: 1, y: 0, x: 0, duration: 0.35, ease: "back.out(1.1)" },
        );
      }
      // Case 2: Window closing
      else if (!isOpen && prevOpenRef.current) {
        gsap.killTweensOf(el);
        gsap.to(el, {
          scale: 0.85,
          opacity: 0,
          y: 30,
          duration: 0.25,
          ease: "power2.inOut",
          onComplete: () => {
            setShouldRender(false);
          },
        });
      }
      // Case 3: Window minimizing
      else if (isOpen && isMinimized && !prevMinimizedRef.current) {
        // Save current coordinates
        lastPosRef.current = {
          x: gsap.getProperty(el, "x") || 0,
          y: gsap.getProperty(el, "y") || 0,
        };
        const startRect = el.getBoundingClientRect();
        gsap.killTweensOf(el);
        gsap.to(el, {
          scale: 0.15,
          opacity: 0,
          y: window.innerHeight - 80,
          x: window.innerWidth / 2 - startRect.width / 2, // animate to bottom-center dock area
          duration: 0.35,
          ease: "power2.inOut",
          onComplete: () => {
            setShouldRender(false);
          },
        });
      }
      // Case 4: Window restoring (unminimizing)
      else if (isOpen && !isMinimized && prevMinimizedRef.current) {
        const startRect = el.getBoundingClientRect();
        gsap.killTweensOf(el);
        gsap.fromTo(
          el,
          {
            scale: 0.15,
            opacity: 0,
            y: window.innerHeight - 80,
            x: window.innerWidth / 2 - startRect.width / 2,
          },
          {
            scale: 1,
            opacity: 1,
            y: lastPosRef.current.y,
            x: lastPosRef.current.x,
            duration: 0.38,
            ease: "back.out(1.1)",
          },
        );
      }

      prevOpenRef.current = isOpen;
      prevMinimizedRef.current = isMinimized;
    }, [isOpen, isMinimized, isMobile]);

    const [viewportHeight, setViewportHeight] = useState("100dvh");
    const [viewportOffsetTop, setViewportOffsetTop] = useState(0);

    useEffect(() => {
      if (!isMobile) return;
      const handleViewportChange = () => {
        if (window.visualViewport) {
          setViewportHeight(`${window.visualViewport.height}px`);
          setViewportOffsetTop(window.visualViewport.offsetTop);
          if (window.scrollY !== 0) {
            window.scrollTo(0, 0);
          }
        }
      };

      handleViewportChange();

      window.visualViewport?.addEventListener("resize", handleViewportChange);
      window.visualViewport?.addEventListener("scroll", handleViewportChange);
      return () => {
        window.visualViewport?.removeEventListener("resize", handleViewportChange);
        window.visualViewport?.removeEventListener("scroll", handleViewportChange);
      };
    }, [isMobile, isOpen]);

    const mobileStyles = {
      position: "fixed",
      top: `${viewportOffsetTop}px`,
      left: 0,
      width: "100dvw",
      height: viewportHeight,
      zIndex: isOpen ? zIndex : -1,
      background: "transparent",
      flexDirection: "column",
      overflow: "hidden",
      display: shouldRender ? "flex" : "none",
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? "auto" : "none",
      transform: isOpen ? "translateY(0)" : "translateY(100%)",
      transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.35s ease",
      border: "none",
      outline: "none",
      boxShadow: "none",
      borderRadius: 0,
    };

    const desktopStyles = {
      zIndex,
      display: shouldRender ? "block" : "none",
    };

    const handleResizeStart = (e, direction) => {
      e.stopPropagation();
      e.preventDefault();

      const el = ref.current;
      if (!el) return;

      // Ensure the window comes to front when resizing
      focusWindow(windowKey);

      document.body.classList.add("window-resizing");

      const startX = e.clientX;
      const startY = e.clientY;
      const startRect = el.getBoundingClientRect();

      const startGsapX = gsap.getProperty(el, "x") || 0;
      const startGsapY = gsap.getProperty(el, "y") || 0;

      const minWidth =
        windowKey === "appstore"
          ? 550
          : windowKey === "settings"
            ? 450
            : windowKey === "safari"
              ? 420
              : windowKey === "font"
                ? 480
                : windowKey === "postman"
                  ? 360
                  : windowKey === "calendar"
                    ? 360
                    : windowKey === "music"
                      ? 350
                      : 300;

      const handlePointerMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        let newWidth = startRect.width;
        let newHeight = startRect.height;
        let newX = startGsapX;
        let newY = startGsapY;

        if (direction.includes("e")) {
          newWidth = Math.max(minWidth, startRect.width + deltaX);
        } else if (direction.includes("w")) {
          const possibleWidth = startRect.width - deltaX;
          if (possibleWidth >= minWidth) {
            newWidth = possibleWidth;
            newX = startGsapX + deltaX;
          } else {
            newWidth = minWidth;
            newX = startGsapX + (startRect.width - minWidth);
          }
        }

        if (direction.includes("s")) {
          newHeight = Math.max(200, startRect.height + deltaY);
        } else if (direction.includes("n")) {
          let clampedDeltaY = deltaY;
          // Navbar is ~35px tall. Don't let the window's top edge go above it.
          if (startRect.top + clampedDeltaY < 35) {
            clampedDeltaY = 35 - startRect.top;
          }

          const possibleHeight = startRect.height - clampedDeltaY;
          if (possibleHeight >= 200) {
            newHeight = possibleHeight;
            newY = startGsapY + clampedDeltaY;
          } else {
            newHeight = 200;
            newY = startGsapY + (startRect.height - 200);
          }
        }

        el.style.width = `${newWidth}px`;
        el.style.height = `${newHeight}px`;
        el.style.maxWidth = "none";
        el.style.maxHeight = "none";

        if (newX !== startGsapX || newY !== startGsapY) {
          gsap.set(el, { x: newX, y: newY });
        }

        checkDockCollision();
      };

      const handlePointerUp = () => {
        document.body.classList.remove("window-resizing");
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    };

    const prevPropsRef = useRef(props);
    const memoizedProps = useMemo(() => {
      const prev = prevPropsRef.current;
      const keys = Object.keys(props);
      const prevKeys = Object.keys(prev);
      if (keys.length !== prevKeys.length) {
        prevPropsRef.current = props;
        return props;
      }
      for (const key of keys) {
        if (props[key] !== prev[key]) {
          prevPropsRef.current = props;
          return props;
        }
      }
      return prev;
    }, [props]);

    const componentElement = useMemo(() => {
      return <Component {...memoizedProps} />;
    }, [memoizedProps]);
    const shouldMountComponent = isOpen || shouldRender;

    return (
      <section
        id={windowKey}
        ref={ref}
        style={isMobile ? mobileStyles : desktopStyles}
        className={`${isMobile ? "" : "absolute"} ${windows[windowKey]?.isMaximized ? "maximized" : ""} ${shouldRender ? "window-visible" : "window-hidden"}`}
        onPointerDown={() => {
          if (!isMobile) focusWindow(windowKey);
        }}
      >
        {shouldMountComponent ? componentElement : null}
        {!isMobile && !windows[windowKey]?.isMaximized && !windows[windowKey]?.isMinimized && (
          <>
            <div
              className="resize-handle resize-n"
              onPointerDown={(e) => handleResizeStart(e, "n")}
            />
            <div
              className="resize-handle resize-s"
              onPointerDown={(e) => handleResizeStart(e, "s")}
            />
            <div
              className="resize-handle resize-e"
              onPointerDown={(e) => handleResizeStart(e, "e")}
            />
            <div
              className="resize-handle resize-w"
              onPointerDown={(e) => handleResizeStart(e, "w")}
            />
            <div
              className="resize-handle resize-ne"
              onPointerDown={(e) => handleResizeStart(e, "ne")}
            />
            <div
              className="resize-handle resize-nw"
              onPointerDown={(e) => handleResizeStart(e, "nw")}
            />
            <div
              className="resize-handle resize-se"
              onPointerDown={(e) => handleResizeStart(e, "se")}
            />
            <div
              className="resize-handle resize-sw"
              onPointerDown={(e) => handleResizeStart(e, "sw")}
            />
          </>
        )}
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;

  return Wrapped;
};

export default windowWrapper;
