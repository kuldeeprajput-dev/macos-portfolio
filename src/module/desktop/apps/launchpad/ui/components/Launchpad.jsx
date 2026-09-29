import { useState, useEffect, useRef } from "react";
import useWindowsStore from "@store/window";
import { dockApps } from "@constants";
import LaunchpadSearch from "./LaunchpadSearch";
import LaunchpadGrid from "./LaunchpadGrid";

const Launchpad = () => {
  const { windows, openWindow, closeWindow } = useWindowsStore();
  const isOpen = windows.launchpad?.isOpen || false;
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeWindow("launchpad");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeWindow]);

  if (!isOpen) return null;

  const appItems = dockApps.filter(
    (app) => !["launchpad", "trash", "folder"].includes(app.id) && app.canOpen,
  );

  const filteredApps = appItems.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLaunch = (appId) => {
    openWindow(appId);
    setSearchQuery("");
    closeWindow("launchpad");
  };

  const handleClose = () => {
    setSearchQuery("");
    closeWindow("launchpad");
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 w-screen h-screen z-[9980] backdrop-blur-3xl bg-black/15 flex flex-col items-center pt-16 pb-10 px-12 sm:px-20 md:px-32 lg:px-44 animate-fade-in select-none"
    >
      <LaunchpadSearch
        inputRef={inputRef}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <LaunchpadGrid apps={filteredApps} onLaunch={handleLaunch} searchQuery={searchQuery} />
    </div>
  );
};

export default Launchpad;
