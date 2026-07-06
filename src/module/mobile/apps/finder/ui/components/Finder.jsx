import WindowControls from "@components/WindowControls";
import { locations } from "@constants";
import { fileIconMap } from "./finderData";
import windowWrapper from "@hoc/windowWrapper";
import useLocationStore from "@store/location";
import useWindowsStore from "@store/window";
import { Search, ChevronRight, FileText, ChevronLeft, Clock, Folder } from "lucide-react";
import { useState, useEffect } from "react";
import FinderToolbar from "./FinderToolbar";
import FinderSidebar from "./FinderSidebar";
import FinderFileList from "./FinderFileList";
import FinderSection from "../section/FinderSection";

const Finder = () => {
  const { openWindow, setGithubRedirect } = useWindowsStore();
  const { activeLocation, setActiveLocation } = useLocationStore();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [navStack, setNavStack] = useState([]);
  const [forwardStack, setForwardStack] = useState([]);
  const [activeTab, setActiveTab] = useState("browse"); // "recents" or "browse"
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const _goBack = () => {
    if (navStack.length > 0) {
      const prev = navStack[navStack.length - 1];
      setNavStack((s) => s.slice(0, -1));
      setForwardStack((s) => [...s, activeLocation]);
      setActiveLocation(prev);
    }
  };

  const _goForward = () => {
    if (forwardStack.length > 0) {
      const next = forwardStack[forwardStack.length - 1];
      setForwardStack((s) => s.slice(0, -1));
      setNavStack((s) => [...s, activeLocation]);
      setActiveLocation(next);
    }
  };

  const openFolder = (location) => {
    setNavStack((prev) => [...prev, activeLocation]);
    setForwardStack([]);
    setActiveLocation(location);
  };

  useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app === "finder") {
        if (navStack.length > 0) {
          e.preventDefault();
        }
        _goBack();
      }
    };
    const handleNavForward = (e) => {
      if (e.detail?.app === "finder") {
        if (forwardStack.length > 0) {
          e.preventDefault();
        }
        _goForward();
      }
    };
    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navStack, forwardStack, activeLocation]);

  const openItem = (item) => {
    if (item.fileType === "pdf") return openWindow("resume");
    if (item.kind === "folder") {
      if (isMobile) {
        openFolder(item);
        return;
      }
      return setActiveLocation(item);
    }
    if ((item.fileType === "fig" || item.name?.toLowerCase().includes("github")) && item.href) {
      setGithubRedirect({ href: item.href, name: item.name });
      return;
    }
    if (item.fileType === "url" && item.href) {
      return openWindow("safari", { url: item.href });
    }
    openWindow(`${item.fileType}${item.kind}`, item);
  };

  if (isMobile) {
    const isRoot = navStack.length === 0;

    // Filter folder items if searching
    const folderItems = activeLocation?.children || [];
    const filteredItems = searchVal.trim()
      ? folderItems.filter((item) => item.name.toLowerCase().includes(searchVal.toLowerCase()))
      : folderItems;

    return (
      <div className="flex flex-col h-full bg-[#f2f2f7] select-none text-black relative">
        {/* iOS style Top Header */}
        <div className="shrink-0 bg-white/80 backdrop-blur-md border-b border-zinc-200/50 px-4 py-2 flex items-center justify-between z-20 relative">
          {isRoot ? (
            <WindowControls target="finder" />
          ) : (
            <button
              onClick={_goBack}
              style={{
                border: "none",
                background: "none",
                color: "#27272a",
                display: "flex",
                alignItems: "center",
                gap: 2,
                fontSize: 12,
                fontWeight: 500,
                padding: "0",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={14} />
              <span>Back</span>
            </button>
          )}

          <h2 className="text-xs font-bold text-zinc-800 absolute left-1/2 -translate-x-1/2 pointer-events-none">
            {!isRoot ? activeLocation?.name : "Browse"}
          </h2>

          {/* Spacer to keep title centered */}
          <div className="w-[60px] flex justify-end">
            {isRoot && (
              <button
                onClick={() => openWindow("finder")}
                className="text-[#007aff] text-[12px] font-bold active:opacity-60"
              >
                Done
              </button>
            )}
          </div>
        </div>

        {/* Search Bar Wrapper */}
        <div className="px-4 pt-3 pb-2 bg-[#f2f2f7]">
          <div className="relative flex items-center bg-[#e3e3e8] rounded-xl px-3 py-1.5 shadow-inner">
            <Search size={15} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent text-[15px] outline-none text-black placeholder-gray-500"
            />
            {searchVal && (
              <button
                onClick={() => setSearchVal("")}
                className="text-gray-400 font-semibold text-sm active:opacity-60 ml-1.5"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto pb-[76px] WebkitOverflowScrolling-touch">
          {activeTab === "recents" ? (
            /* Recents Tab View */
            <div className="p-4">
              <h1 className="text-3xl font-bold text-black mb-4 tracking-tight">Recents</h1>
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/50 divide-y divide-neutral-100 overflow-hidden">
                {/* Seed a couple of recent files based on mock data */}
                {Object.values(locations)
                  .flatMap((loc) => loc.children || [])
                  .slice(0, 4)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => openItem(item)}
                      className="flex items-center gap-3.5 w-full p-4 hover:bg-neutral-50 active:bg-neutral-100 text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                        {item.kind === "folder" ? (
                          <img
                            src={item.icon}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          fileIconMap[item.fileType] || (
                            <FileText size={18} className="text-gray-400" />
                          )
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-neutral-900 truncate">
                          {item.name}
                        </p>
                        <span className="text-[12px] text-neutral-400">Recently Opened</span>
                      </div>
                      <ChevronRight size={16} className="text-neutral-300" />
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            /* Browse Tab View */
            <>
              {isRoot ? (
                /* Browse Main Landing Screen (Locations list) */
                <div className="p-4 flex flex-col gap-5">
                  <h1 className="text-3xl font-bold text-black tracking-tight pl-1">Browse</h1>

                  <div>
                    <h3 className="text-[13px] font-bold text-neutral-500 uppercase tracking-wider pl-1 mb-2">
                      Locations
                    </h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/50 divide-y divide-neutral-100 overflow-hidden">
                      {Object.values(locations).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            openFolder(item);
                          }}
                          className="flex items-center gap-3.5 w-full p-4 hover:bg-neutral-50 active:bg-neutral-100 text-left"
                        >
                          <img
                            src={item.icon}
                            alt={item.name}
                            className="w-9 h-9 object-cover rounded-lg flex-shrink-0 shadow-sm"
                          />
                          <span className="flex-1 text-[16px] font-semibold text-neutral-800">
                            {item.name}
                          </span>
                          <ChevronRight size={17} className="text-neutral-300" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Folder Content View */
                <div className="p-4">
                  <div className="flex items-center justify-between pl-1 mb-3.5">
                    <h3 className="text-[13px] font-bold text-neutral-500 uppercase tracking-wider">
                      {activeLocation.name}
                    </h3>
                    <span className="text-[12px] text-neutral-400 font-semibold">
                      {filteredItems.length} items
                    </span>
                  </div>

                  {filteredItems.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/50 divide-y divide-neutral-100 overflow-hidden">
                      {filteredItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => openItem(item)}
                          className="flex items-center gap-3.5 w-full p-4 hover:bg-neutral-50 active:bg-neutral-100 text-left"
                        >
                          <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                            {item.kind === "folder" ? (
                              <img
                                src={item.icon}
                                alt=""
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              fileIconMap[item.fileType] || (
                                <FileText size={18} className="text-gray-400" />
                              )
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-semibold text-neutral-900 truncate">
                              {item.name}
                            </p>
                            {item.kind === "folder" && (
                              <p className="text-[12px] text-neutral-400">
                                {item.children?.length || 0} items
                              </p>
                            )}
                          </div>

                          {item.kind === "folder" && (
                            <ChevronRight size={16} className="text-neutral-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-14 text-neutral-400">
                      <Folder size={40} strokeWidth={1.5} className="mb-2 opacity-50" />
                      <p className="text-[14px]">No Files Found</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* iOS Style Bottom Tab Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[65px] bg-[#f9f9f9]/85 backdrop-blur-xl border-t border-[#d1d1d6] flex justify-around items-center px-6 z-10">
          <button
            onClick={() => setActiveTab("recents")}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              activeTab === "recents" ? "text-[#007aff]" : "text-gray-400"
            }`}
          >
            <Clock size={20} strokeWidth={activeTab === "recents" ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">Recents</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("browse");
              // Go to root folder if already in Browse
              if (activeTab === "browse") {
                setNavStack([]);
                setActiveLocation(locations.home || Object.values(locations)[0]);
              }
            }}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              activeTab === "browse" ? "text-[#007aff]" : "text-gray-400"
            }`}
          >
            <Folder
              size={20}
              strokeWidth={activeTab === "browse" ? 2.5 : 2}
              fill={activeTab === "browse" ? "currentColor" : "none"}
              className={activeTab === "browse" ? "opacity-90" : ""}
            />
            <span className="text-[10px] font-semibold">Browse</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <FinderSection
      activeLocation={activeLocation}
      setActiveLocation={setActiveLocation}
      openItem={openItem}
    />
  );
};

const FinderWindow = windowWrapper(Finder, "finder");
export default FinderWindow;
