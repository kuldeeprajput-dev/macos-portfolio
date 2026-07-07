import React, { useState, useEffect, useRef } from "react";
import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import useSettings from "../../hooks/useSettings";
import SettingsSidebar from "./SettingsSidebar";
import SettingsPane from "./SettingsPane";
import SettingsAboutModal from "./SettingsAboutModal";
import WindowControls from "@components/WindowControls";
import { PanelLeft } from "lucide-react";

const Settings = () => {
  const { activeTab, setActiveTab, githubData, isLoading, isMobile, mobileView, setMobileView } =
    useSettings();
  const { windows, setWindowData } = useWindowsStore();
  const [showAbout, setShowAbout] = useState(false);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isNarrow = containerWidth < 700;

  useEffect(() => {
    if (isNarrow) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isNarrow]);

  useEffect(() => {
    if (windows.settings?.data?.openAbout) {
      setShowAbout(true);
      setWindowData("settings", { ...windows.settings.data, openAbout: false });
    }
  }, [windows.settings?.data?.openAbout, windows.settings?.data, setWindowData]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (isNarrow) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="@container w-full h-full" ref={containerRef}>
      <div className="flex flex-col h-full w-full bg-white overflow-hidden rounded-lg font-sans select-none border border-black/10">
        {!isMobile && (
          <div
            id="window-header"
            className="window-header bg-[#f3f3f3]! border-b-[#d1d1d6]! px-4 h-[46px] flex items-center justify-between shrink-0 text-gray-600 gap-4 z-40 relative select-none cursor-default"
          >
            <div className="flex items-center gap-2 z-10">
              <WindowControls target="settings" />
              {isNarrow && (
                <button
                  onClick={() => setIsSidebarOpen((prev) => !prev)}
                  className="p-1 rounded hover:bg-zinc-200 transition-colors ml-1 cursor-pointer text-gray-700 flex items-center justify-center border-none outline-none focus:outline-none shadow-none"
                  title="Toggle Sidebar"
                >
                  <PanelLeft className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-bold text-gray-700 text-xs">Settings</span>
            </div>
            <div className="w-14" />
          </div>
        )}

        <div className="flex-1 flex min-h-0 relative">
          <SettingsSidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            githubData={githubData}
            isLoading={isLoading}
            isMobile={isMobile}
            mobileView={mobileView}
            setMobileView={setMobileView}
            isSidebarOpen={isSidebarOpen}
            onCloseSidebar={() => setIsSidebarOpen(false)}
            isNarrow={isNarrow}
            hideHeader={true}
          />

          <div
            className={`${isMobile ? (mobileView !== "main" ? "flex w-full" : "hidden") : "flex-1 flex min-w-0"} flex-col bg-white`}
          >
            <SettingsPane
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              githubData={githubData}
              isLoading={isLoading}
              isMobile={isMobile}
              mobileView={mobileView}
              setMobileView={setMobileView}
            />
          </div>
        </div>
      </div>
      <SettingsAboutModal show={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
};

const SettingsWindow = windowWrapper(Settings, "settings");
export default SettingsWindow;
