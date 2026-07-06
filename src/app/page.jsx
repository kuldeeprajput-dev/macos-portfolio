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
    if (isMounted) {
      closeAllWindows();
    }
  }, [isMobile, closeAllWindows, isMounted]);

  if (!isMounted) {
    return <div className="fixed inset-0 bg-black z-99999" suppressHydrationWarning={true} />;
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
    </>
  );
}
