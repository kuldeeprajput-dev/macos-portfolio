"use client";

import LoadingView from "@module/loading/ui/view/LoadingView";
import RefreshInterceptor from "@module/loading/ui/components/RefreshInterceptor";
import Desktop from "@module/desktop";
import Mobile from "@module/mobile";
import gsap from "gsap";
import { useState, useEffect } from "react";
import useWindowsStore from "@store/window";
import GlobalAudio from "@module/shared/ui/components/GlobalAudio";

import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [developerToolsDetected, setDeveloperToolsDetected] = useState(false);
  const [booting, setBooting] = useState(() => {
    if (typeof window !== "undefined") {
      const isRestarting = sessionStorage.getItem("isRestartingSystem") === "true";
      if (isRestarting) {
        return true;
      }
      const navigationEntries =
        window.performance && window.performance.getEntriesByType
          ? window.performance.getEntriesByType("navigation")
          : [];
      const isReload = navigationEntries[0] && navigationEntries[0].type === "reload";
      if (isReload) {
        return false;
      }
    }
    return true;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      const isRestarting = sessionStorage.getItem("isRestartingSystem") === "true";
      if (isRestarting) {
        return false;
      }
      const navigationEntries =
        window.performance && window.performance.getEntriesByType
          ? window.performance.getEntriesByType("navigation")
          : [];
      const isReload = navigationEntries[0] && navigationEntries[0].type === "reload";
      if (isReload) {
        return sessionStorage.getItem("wasLoggedIn") === "true";
      }
    }
    return false;
  });

  const closeAllWindows = useWindowsStore((state) => state.closeAllWindows);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const preventContextMenu = (event) => event.preventDefault();
    const initialWidthDifference = window.outerWidth - window.innerWidth;
    const initialHeightDifference = window.outerHeight - window.innerHeight;
    const toolsOpenOnLoad = initialWidthDifference > 280 || initialHeightDifference > 280;
    const blockDeveloperToolsShortcuts = (event) => {
      const key = event.key.toLowerCase();
      const isFunctionShortcut = key === "f12";
      const isWindowsShortcut =
        event.ctrlKey && event.shiftKey && ["i", "j", "c", "k", "m"].includes(key);
      const isMacShortcut =
        (event.metaKey && event.altKey && ["i", "j", "c"].includes(key)) ||
        (event.metaKey && event.shiftKey && key === "m");

      if (isFunctionShortcut || isWindowsShortcut || isMacShortcut) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const checkForDockedDeveloperTools = () => {
      const widthDifference = window.outerWidth - window.innerWidth - initialWidthDifference;
      const heightDifference = window.outerHeight - window.innerHeight - initialHeightDifference;
      const toolsLikelyOpen = toolsOpenOnLoad || widthDifference > 180 || heightDifference > 180;

      setDeveloperToolsDetected(toolsLikelyOpen);
    };

    document.addEventListener("contextmenu", preventContextMenu, true);
    document.addEventListener("keydown", blockDeveloperToolsShortcuts, true);
    window.addEventListener("resize", checkForDockedDeveloperTools);
    const detectionInterval = window.setInterval(checkForDockedDeveloperTools, 1000);
    checkForDockedDeveloperTools();

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu, true);
      document.removeEventListener("keydown", blockDeveloperToolsShortcuts, true);
      window.removeEventListener("resize", checkForDockedDeveloperTools);
      window.clearInterval(detectionInterval);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      closeAllWindows();
    }
  }, [isMobile, closeAllWindows, isMounted]);

  const developerToolsNotice = developerToolsDetected ? (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#08090d] px-6 text-center text-white"
      style={{ zIndex: 2147483647 }}
      role="alertdialog"
      aria-modal="true"
      aria-live="assertive"
    >
      <div className="max-w-md space-y-3">
        <h1 className="text-xl font-semibold">Developer tools detected</h1>
        <p className="text-sm text-white/65">Close Developer Tools to continue.</p>
      </div>
    </div>
  ) : null;

  if (!isMounted) {
    return (
      <>
        <div className="fixed inset-0 bg-black z-99999" suppressHydrationWarning={true} />
        {developerToolsNotice}
      </>
    );
  }

  if (isMobile) {
    return (
      <>
        <RefreshInterceptor
          enabled={!booting}
          isLoggedIn={isLoggedIn}
          setBooting={setBooting}
          setIsLoggedIn={setIsLoggedIn}
        />
        <LoadingView
          booting={booting}
          isLoggedIn={isLoggedIn}
          isMobile={isMobile}
          onBootComplete={() => {
            setBooting(false);
            sessionStorage.removeItem("isRestartingSystem");
            sessionStorage.removeItem("wasLoggedIn");
          }}
          onLogin={() => setIsLoggedIn(true)}
        />
        {isLoggedIn && (
          <>
            <Mobile />
            <GlobalAudio />
          </>
        )}
        {developerToolsNotice}
      </>
    );
  }

  return (
    <>
      <RefreshInterceptor
        enabled={!booting}
        isLoggedIn={isLoggedIn}
        setBooting={setBooting}
        setIsLoggedIn={setIsLoggedIn}
      />
      <LoadingView
        booting={booting}
        isLoggedIn={isLoggedIn}
        isMobile={isMobile}
        onBootComplete={() => {
          setBooting(false);
          sessionStorage.removeItem("isRestartingSystem");
          sessionStorage.removeItem("wasLoggedIn");
        }}
        onLogin={() => setIsLoggedIn(true)}
      />
      {isLoggedIn && (
        <>
          <Desktop />
          <GlobalAudio />
        </>
      )}
      {developerToolsNotice}
    </>
  );
}
