import { useState, useEffect, useRef } from "react";
import { AppWindow } from "lucide-react";
import useWindowsStore from "@store/window";
import { STORE_APPS } from "../../data";
import { GITHUB_USERNAME } from "@constants";
import AppStoreNavSection from "./AppStoreNavSection";
import AppStoreSidebarSection from "./AppStoreSidebarSection";
import AppStoreContentSection from "./AppStoreContentSection";
import ProfileOverlay from "../../../appletv/ui/components/ProfileOverlay";

const AppStoreSection = () => {
  const { openWindow, closeWindow } = useWindowsStore();
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [containerHeight, setContainerHeight] = useState(620);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [githubProfile, setGithubProfile] = useState(null);
  const [isFirstLayout, setIsFirstLayout] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const initialWidth = rect.width;
    setContainerWidth(initialWidth);
    setContainerHeight(rect.height);
    if (initialWidth < 800) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
        setContainerHeight(entry.contentRect.height);
        setIsFirstLayout(false);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isNarrow = containerWidth < 800;
  const isVeryNarrow = containerWidth < 480;

  useEffect(() => {
    // Only update if it's not the first layout (to let the initial mount state be set synchronously)
    if (!isFirstLayout) {
      if (isNarrow) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    }
  }, [isNarrow, isFirstLayout]);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          setGithubProfile(data);
        }
      })
      .catch((err) => console.error("Error fetching avatar in desktop AppStoreSection:", err));
  }, []);

  const [installStates, setInstallStates] = useState(() => {
    const initial = {};
    STORE_APPS.forEach((app) => {
      initial[app.id] = app.native ? "open" : "get";
    });
    return initial;
  });
  const [activeDownloadId, setActiveDownloadId] = useState(null);
  const [alertApp, setAlertApp] = useState(null);
  const [updatingAll, setUpdatingAll] = useState(false);
  const [updateProgresses, setUpdateProgresses] = useState({});

  const startDownload = (appId) => {
    setInstallStates((prev) => ({
      ...prev,
      [appId]: { status: "downloading", progress: 0 },
    }));
    setActiveDownloadId(appId);
  };

  useEffect(() => {
    if (!activeDownloadId) return;
    const interval = setInterval(() => {
      setInstallStates((prev) => {
        const appState = prev[activeDownloadId];
        if (appState && appState.status === "downloading") {
          const nextProgress = appState.progress + 10;
          if (nextProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => setActiveDownloadId(null), 100);
            return { ...prev, [activeDownloadId]: "open" };
          }
          return {
            ...prev,
            [activeDownloadId]: { ...appState, progress: nextProgress },
          };
        }
        return prev;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [activeDownloadId]);

  const handleOpenApp = (app) => {
    if (app.native) {
      closeWindow("appstore");
      openWindow(app.id);
    } else {
      setAlertApp(app);
    }
  };

  const handleUpdateAll = () => {
    if (updatingAll) return;
    setUpdatingAll(true);
    const appsToUpdate = ["figma", "vscode", "slack"];
    const initialProgress = {};
    appsToUpdate.forEach((id) => {
      initialProgress[id] = 0;
    });
    setUpdateProgresses(initialProgress);
    const interval = setInterval(() => {
      setUpdateProgresses((prev) => {
        let allDone = true;
        const next = { ...prev };
        appsToUpdate.forEach((id) => {
          if (next[id] < 100) {
            next[id] += Math.floor(Math.random() * 15) + 5;
            if (next[id] > 100) next[id] = 100;
            if (next[id] < 100) allDone = false;
          }
        });
        if (allDone) {
          clearInterval(interval);
          setUpdatingAll(false);
        }
        return next;
      });
    }, 300);
  };

  const handleSingleUpdate = (id) => {
    if (updatingAll) return;
    setUpdateProgresses((p) => ({ ...p, [id]: 0 }));
    const updateInterval = setInterval(() => {
      setUpdateProgresses((prev) => {
        const current = prev[id];
        if (current < 100) {
          const nextVal = current + 20;
          if (nextVal >= 100) {
            clearInterval(updateInterval);
            return { ...prev, [id]: 100 };
          }
          return { ...prev, [id]: nextVal };
        }
        return prev;
      });
    }, 200);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-black/10 select-none text-gray-800 relative"
    >
      <AppStoreNavSection
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isNarrow={isNarrow}
      />

      <div className="flex-1 flex min-h-0 relative">
        <AppStoreSidebarSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          githubProfile={githubProfile}
          onProfileClick={() => setShowProfile(true)}
          isNarrow={isNarrow}
          isFirstLayout={isFirstLayout}
          containerHeight={containerHeight}
        />

        <AppStoreContentSection
          activeTab={activeTab}
          searchQuery={searchQuery}
          installStates={installStates}
          onStartDownload={startDownload}
          onOpenApp={handleOpenApp}
          handleUpdateAll={handleUpdateAll}
          handleSingleUpdate={handleSingleUpdate}
          updateProgresses={updateProgresses}
          updatingAll={updatingAll}
          isNarrow={isNarrow}
        />
      </div>

      <ProfileOverlay
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        appName="appstore"
      />

      {alertApp && (
        <div className="absolute inset-0 bg-black/15 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="w-full max-w-[300px] rounded-2xl shadow-2xl border border-black/10 p-5 text-center flex flex-col items-center gap-4 animate-modal-pop"
            style={{ backgroundColor: "#ffffff", color: "#000000" }}
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shadow-inner">
              <AppWindow className="w-5.5 h-5.5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-extrabold leading-none" style={{ color: "#000000" }}>
                {alertApp.name} Installed
              </h3>
              <p className="text-[11px] leading-relaxed" style={{ color: "#555555" }}>
                {alertApp.name} is successfully installed on your desktop! You can now access and
                run it via custom command simulations inside the Terminal application.
              </p>
            </div>
            <button
              onClick={() => setAlertApp(null)}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppStoreSection;
