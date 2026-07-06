import { useState, useEffect } from "react";
import {
  AppWindow,
  Sparkles,
  Gamepad2,
  Layers,
  Download,
  Search,
  Shield,
  ChevronLeft,
} from "lucide-react";
import useWindowsStore from "@store/window";
import { STORE_APPS } from "../../data";
import { GITHUB_USERNAME } from "@constants";
import AppStoreContentSection from "./AppStoreContentSection";
import AppDetailsModal from "../components/AppDetailsModal";
import ProfileOverlay from "../../../appletv/ui/components/ProfileOverlay";
import WindowControls from "@components/WindowControls";

const AppStoreSection = () => {
  const { openWindow, closeWindow } = useWindowsStore();
  const [activeTab, setActiveTab] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileUrl, setProfileUrl] = useState("/images/profile.webp");
  const [showHeader, setShowHeader] = useState(true);
  const [forwardDestination, setForwardDestination] = useState(null);

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

  useEffect(() => {
    // Fetch GitHub avatar dynamically
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.avatar_url) {
          setProfileUrl(data.avatar_url);
        }
      })
      .catch((err) => console.error("Error fetching avatar in AppStoreSection:", err));
  }, []);

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
          const nextProgress = appState.progress + 20;
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
    const appsToUpdate = ["instagram", "tiktok", "whatsapp"];
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
            next[id] += Math.floor(Math.random() * 25) + 15;
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
          const nextVal = current + 25;
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

  useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app === "appstore") {
        if (alertApp) {
          e.preventDefault();
          setForwardDestination({ type: "alert", app: alertApp });
          setAlertApp(null);
        } else if (showProfile) {
          e.preventDefault();
          setForwardDestination({ type: "profile" });
          setShowProfile(false);
        } else if (selectedApp) {
          e.preventDefault();
          setForwardDestination({ type: "details", app: selectedApp });
          setSelectedApp(null);
        }
      }
    };
    const handleNavForward = (e) => {
      if (e.detail?.app !== "appstore" || !forwardDestination) return;

      e.preventDefault();
      if (forwardDestination.type === "alert") {
        setAlertApp(forwardDestination.app);
      } else if (forwardDestination.type === "profile") {
        setShowProfile(true);
      } else if (forwardDestination.type === "details") {
        setSelectedApp(forwardDestination.app);
      }
      setForwardDestination(null);
    };
    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
  }, [alertApp, forwardDestination, selectedApp, showProfile]);

  // Tab configurations
  const tabItems = [
    { id: "today", label: "Today", icon: <Sparkles size={18} /> },
    { id: "games", label: "Games", icon: <Gamepad2 size={18} /> },
    { id: "apps", label: "Apps", icon: <Layers size={18} /> },
    { id: "updates", label: "Updates", icon: <Download size={18} /> },
    { id: "search", label: "Search", icon: <Search size={18} /> },
  ];

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "today":
        return "Today";
      case "games":
        return "Games";
      case "apps":
        return "Apps";
      case "updates":
        return "Updates";
      case "search":
        return "Search";
      default:
        return "App Store";
    }
  };

  const handleScrollDirection = (direction) => {
    if (direction === "down") {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f2f2f7] rounded-xl overflow-hidden select-none text-gray-800 relative font-sans">
      {/* iOS style Top Header with Window Exit Controls */}
      <div
        id="window-header"
        className={`absolute top-0 left-0 right-0 flex items-center justify-between z-40 transition-all duration-300 ease-in-out ${
          showHeader
            ? "transform translate-y-0 opacity-100"
            : "transform -translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2">
          <WindowControls target="appstore" />
        </div>

        <span className="text-[15px] font-bold text-gray-900 absolute left-1/2 -translate-x-1/2 pointer-events-none capitalize">
          {getHeaderTitle()}
        </span>

        {/* Profile Avatar Button */}
        <button
          onClick={() => {
            setForwardDestination(null);
            setShowProfile(true);
          }}
          className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center border border-zinc-200 shadow-sm active:scale-95 transition-transform cursor-pointer relative z-50"
        >
          <img
            src={profileUrl}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/profile.webp";
            }}
          />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 relative bg-white">
        <AppStoreContentSection
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          installStates={installStates}
          onStartDownload={startDownload}
          onOpenApp={handleOpenApp}
          handleUpdateAll={handleUpdateAll}
          handleSingleUpdate={handleSingleUpdate}
          updateProgresses={updateProgresses}
          updatingAll={updatingAll}
          onSelectApp={(app) => {
            setForwardDestination(null);
            setSelectedApp(app);
          }}
          onScrollDirection={handleScrollDirection}
        />
      </div>

      {/* iOS style Bottom Navigation Tab Bar */}
      <nav className="shrink-0 bg-zinc-50/95 backdrop-blur-md border-t border-zinc-200/50 flex justify-around items-center py-2 pb-3.5 z-45">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id !== "search") setSearchQuery("");
              setShowHeader(true);
            }}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold transition-all w-16 cursor-pointer ${
              activeTab === tab.id ? "text-blue-500 scale-102" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className="transition-transform duration-200">{tab.icon}</div>
            <span className="tracking-wide">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* App Details Bottom Sheet Modal */}
      <AppDetailsModal
        app={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        installState={selectedApp ? installStates[selectedApp.id] : null}
        onStartDownload={startDownload}
        onOpenApp={handleOpenApp}
      />

      {/* Profile Detail Bottom Sheet Modal */}
      <ProfileOverlay
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        appName="appstore"
      />

      {/* Alert Overlay */}
      {alertApp && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[280px] bg-white rounded-3xl shadow-2xl border border-zinc-200 p-5 text-center flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shadow-inner">
              <AppWindow className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800">{alertApp.name} Simulated</h3>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {alertApp.name} has been successfully registered. You can simulate executing custom
                CLI launch parameters inside the system Terminal console.
              </p>
            </div>
            <button
              onClick={() => setAlertApp(null)}
              className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-xs font-bold transition-all active:scale-97 shadow-md cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppStoreSection;
