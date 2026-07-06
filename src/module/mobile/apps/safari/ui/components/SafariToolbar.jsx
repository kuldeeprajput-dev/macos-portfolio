import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layout,
  Plus,
  Search,
  Share,
  ShieldHalf,
  RotateCw,
  Lock,
  AlertTriangle,
  Globe,
  ArrowRight,
  X,
  Copy,
  Bookmark,
  FileText,
  Home,
} from "lucide-react";
import useSafari from "../../hooks/useSafari";

const SafariMobileHeader = ({ projects }) => {
  const {
    tabs,
    activeTabId,
    setActiveTabId,
    inputValue,
    setInputValue,
    showTabsOverview,
    setShowTabsOverview,
    showShareSheet,
    setShowShareSheet,
    showFormatMenu,
    setShowFormatMenu,
    textSize,
    setTextSize,
    toastMessage,
    iframeLoading,
    setIframeLoading,
    currentUrl,
    historyIndex,
    triggerToast,
    navigateTo,
    handleBack,
    handleForward,
    handleSearchSubmit,
    getCleanDomain,
    isIframeable,
    handleNewTab,
    handleCloseTab,
    handleCopyLink,
    handleAddBookmark,
    mobileBookmarks,
    closeWindow,
  } = useSafari();

  return (
    <div className="flex flex-col h-full w-full bg-[#f2f2f7] select-none text-zinc-950 relative overflow-hidden">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .hide-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
      {/* iOS 17 Minimal Top Bar */}
      <div className="shrink-0 bg-white/80 backdrop-blur-md border-b border-zinc-200/50 px-4 py-2 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (historyIndex > 0) {
                handleBack();
              } else {
                closeWindow("safari");
              }
            }}
            className="flex items-center gap-0.5 text-zinc-800 font-medium text-[12px] bg-transparent border-none outline-none cursor-pointer p-0 active:opacity-60 transition-opacity"
          >
            <ChevronLeft size={14} />
            <span>Back</span>
          </button>
        </div>
        <span className="text-xs font-bold text-zinc-800 absolute left-1/2 -translate-x-1/2">
          {getCleanDomain(currentUrl)}
        </span>
        <div className="w-16" />
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 overflow-y-auto hide-scrollbar min-h-0 relative bg-[#f2f2f7]"
        style={{ fontSize: `${textSize}%` }}
      >
        {/* Render Start Page */}
        {currentUrl === "safari://start" && (
          <div className="px-5 py-6 pb-40 space-y-6 bg-[#f2f2f7] min-h-full">
            {/* Central Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-2.5 bg-white border border-zinc-200 shadow-sm rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#007aff]/30">
                <Search size={15} className="text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search or enter website name"
                  className="w-full bg-transparent border-none outline-none text-sm text-zinc-850 placeholder-zinc-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>

            {/* Bookmarks / Favorites */}
            <div>
              <h2 className="text-[20px] font-extrabold text-zinc-900 tracking-tight mb-3.5">
                Favorites
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {mobileBookmarks
                  .filter(
                    (fav) =>
                      !fav.title.toLowerCase().includes("wikipedia") &&
                      !fav.title.toLowerCase().includes("openstreetmap"),
                  )
                  .map((fav) => (
                    <button
                      key={fav.id}
                      onClick={() => {
                        navigateTo(fav.url);
                      }}
                      className="flex flex-col items-center gap-1.5 transition-all active:scale-95 group text-decoration-none bg-transparent border-none outline-none cursor-pointer"
                    >
                      <div className="w-13 h-13 rounded-2xl bg-white border border-zinc-200/50 shadow-sm flex items-center justify-center transition-all group-hover:shadow-md">
                        <img src={fav.img} alt={fav.title} className="w-7 h-7 object-contain" />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-600 truncate max-w-full">
                        {fav.title}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Privacy Report Card */}
            <div
              onClick={() => navigateTo("safari://privacy-report")}
              className="bg-white border border-zinc-200/50 rounded-2xl p-4 shadow-sm flex items-center gap-3.5 transition-all hover:shadow-md cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <ShieldHalf className="text-blue-600" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-zinc-900">Privacy Report</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5 font-medium leading-relaxed">
                  Safari protected your portfolio from 14 trackers.
                </p>
              </div>
              <ChevronRight size={18} className="text-zinc-350" />
            </div>

            {/* Featured Projects */}
            <div>
              <h2 className="text-[20px] font-extrabold text-zinc-900 tracking-tight mb-3.5">
                Featured Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white border border-zinc-200/50 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md cursor-pointer"
                    onClick={() => navigateTo(project.link)}
                  >
                    <div className="h-32 bg-zinc-100 overflow-hidden relative border-b border-zinc-100">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4" onClick={(e) => e.stopPropagation()}>
                      <h3
                        className="text-sm font-bold text-zinc-900 mb-1 hover:text-[#007aff] cursor-pointer"
                        onClick={() => navigateTo(project.link)}
                      >
                        {project.title}
                      </h3>
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => navigateTo(project.link)}
                          className="flex items-center gap-1 text-xs font-bold text-[#007aff] hover:underline bg-transparent border-none outline-none cursor-pointer"
                        >
                          <ExternalLink size={12} /> Live Demo
                        </button>
                        <button
                          onClick={() => navigateTo(project.github)}
                          className="flex items-center gap-1 text-xs font-bold text-[#007aff] hover:underline bg-transparent border-none outline-none cursor-pointer"
                        >
                          Source
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render Privacy Report Page */}
        {currentUrl === "safari://privacy-report" && (
          <div className="px-5 py-6 pb-24 space-y-6 bg-[#f2f2f7] min-h-full">
            <div className="flex items-center gap-2.5">
              <ShieldHalf size={26} className="text-blue-600" />
              <div>
                <h1 className="text-lg font-bold">Privacy Report</h1>
                <p className="text-[11px] text-zinc-400">
                  Blocked trackers on this portfolio visit
                </p>
              </div>
            </div>
            <div className="bg-white border border-zinc-200/25 rounded-xl p-4 shadow-sm space-y-3">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Blocked Trackers (Past 7 Days)
              </h3>
              <div className="h-32 w-full flex items-end justify-between gap-1.5 pt-4">
                {[12, 18, 14, 25, 9, 32, 14].map((count, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                  >
                    <span className="text-[9px] text-zinc-500 font-bold">{count}</span>
                    <div
                      className="w-full bg-[#007aff] rounded-t-sm"
                      style={{ height: `${(count / 35) * 100}%` }}
                    />
                    <span className="text-[8px] text-zinc-400 font-semibold">Day {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-zinc-200/25 rounded-xl p-4 shadow-sm">
              <h2 className="text-xs font-bold text-zinc-800 mb-3">Prevented Trackers</h2>
              <div className="divide-y divide-zinc-100/60">
                {[
                  { name: "doubleclick.net", cat: "Advertising", count: 4 },
                  { name: "google-analytics.com", cat: "Analytics", count: 3 },
                  { name: "facebook.com", cat: "Social Tracker", count: 5 },
                  { name: "hotjar.com", cat: "Behavioral Analytics", count: 2 },
                ].map((tracker, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 text-xs">
                    <div>
                      <p className="font-bold text-zinc-700">{tracker.name}</p>
                      <p className="text-[9.5px] text-zinc-400">{tracker.cat}</p>
                    </div>
                    <span className="bg-blue-50 text-[#007aff] px-2.5 py-0.5 rounded-full font-extrabold text-[9px]">
                      {tracker.count} Blocked
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render Search Results Mockup */}
        {currentUrl.includes("google.com/search") && (
          <div className="px-5 py-5 pb-24 space-y-5 bg-white min-h-full select-text">
            <div className="flex items-center gap-3 border-b pb-3 border-zinc-100">
              <span
                onClick={() => navigateTo("safari://start")}
                className="font-bold text-xl tracking-tight text-blue-600 cursor-pointer select-none"
              >
                Google
              </span>
              <div className="flex-1 max-w-[200px] border border-zinc-300 rounded-full px-3 py-1 text-xs flex items-center bg-white shadow-inner">
                <span className="truncate flex-1 font-semibold">
                  {decodeURIComponent(new URL(currentUrl).searchParams.get("q") || "")}
                </span>
                <Search className="w-3 h-3 text-[#007aff]" />
              </div>
            </div>
            <div className="space-y-5 pt-1">
              {[
                {
                  site: "openstreetmap.org",
                  title: "OpenStreetMap - Interactive Wiki World Map",
                  url: "https://openstreetmap.org",
                  desc: "OpenStreetMap is a map of the world, created by volunteers and free to use under an open license.",
                },
                {
                  site: "wikipedia.org",
                  title: "React (software) - Wikipedia",
                  url: "https://en.wikipedia.org",
                  desc: "React is a free and open-source front-end JavaScript library for building user interfaces based on components.",
                },
                {
                  site: "example.com",
                  title: "Example Domain - Standard Sandbox",
                  url: "https://example.com",
                  desc: "This domain is for use in illustrative examples in documents. You can test your sandboxed browsing fallbacks here.",
                },
              ].map((res, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[9.5px] text-zinc-400 font-semibold">{res.site}</span>
                  <h4
                    onClick={() => navigateTo(res.url)}
                    className="text-sm font-bold text-blue-600 hover:underline cursor-pointer leading-tight"
                  >
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-zinc-650 leading-normal">{res.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real Iframe Support */}
        {!currentUrl.startsWith("safari://") &&
          !currentUrl.includes("google.com/search") &&
          isIframeable(currentUrl) && (
            <div className="w-full h-full relative flex flex-col bg-white">
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 select-none">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-[3px] border-zinc-200 border-t-[#007aff] rounded-full animate-spin" />
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-zinc-700">Loading...</span>
                      <span className="text-[10px] text-zinc-400 truncate max-w-[200px]">
                        {currentUrl}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <iframe
                src={
                  currentUrl.toLowerCase().includes("openstreetmap.org")
                    ? "https://www.openstreetmap.org/export/embed.html"
                    : currentUrl
                }
                title="Safari Iframe Browser"
                className={`w-full h-full border-none bg-white relative z-0 transition-opacity duration-300 ${
                  iframeLoading ? "opacity-0" : "opacity-100"
                }`}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                onLoad={() => setIframeLoading(false)}
              />
            </div>
          )}

        {/* Fallback Sandboxed Page Warning */}
        {!currentUrl.startsWith("safari://") &&
          !currentUrl.includes("google.com/search") &&
          !isIframeable(currentUrl) && (
            <div className="p-6 bg-zinc-50 flex items-center justify-center min-h-full">
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-lg max-w-sm w-full text-center space-y-5">
                <div className="w-13 h-13 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-zinc-950">Connection Sandboxed</h3>
                  <p className="text-[11.5px] text-zinc-500 leading-relaxed">
                    To protect your security, this website prohibits rendering its contents inside
                    other windows.
                  </p>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 flex items-center justify-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[10.5px] font-bold text-zinc-600 truncate">
                    {currentUrl}
                  </span>
                </div>
                <div className="flex flex-col gap-2 pt-1.5">
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#007aff] hover:bg-[#0062cc] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 text-decoration-none"
                  >
                    Open in New Tab <ArrowRight className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => navigateTo("safari://start")}
                    className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-250 text-zinc-700 rounded-xl text-xs font-bold transition-all border-none outline-none cursor-pointer"
                  >
                    Back to Start Page
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* iOS 17 Bottom Unified Section (URL + Nav) */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white/94 backdrop-blur-xl border-t border-zinc-200/80 z-30 flex flex-col ${currentUrl === "safari://start" ? "gap-2.5 pb-7 pt-2 px-4" : "gap-1 pb-5 pt-2.5 px-4"} shadow-lg shrink-0`}
      >
        {/* Floating URL Address Bar */}
        {currentUrl === "safari://start" && (
          <div className="w-full h-[38px] bg-zinc-100 border border-zinc-200/40 rounded-2xl flex items-center justify-between px-3 shadow-inner relative overflow-hidden">
            <style>{`
              @keyframes safariLoad {
                0% { width: 0%; }
                30% { width: 45%; }
                70% { width: 75%; }
                100% { width: 90%; }
              }
              .animate-safari-load {
                animation: safariLoad 2.5s cubic-bezier(0.1, 0.85, 0.45, 1) forwards;
              }
            `}</style>
            {iframeLoading &&
              !currentUrl.startsWith("safari://") &&
              !currentUrl.includes("google.com/search") && (
                <div className="absolute bottom-0 left-0 h-[2.5px] bg-[#007aff] animate-safari-load transition-all" />
              )}
            <button
              onClick={() => setShowFormatMenu(!showFormatMenu)}
              className="text-[11px] font-bold text-zinc-600 hover:text-zinc-900 select-none tracking-wide bg-transparent border-none outline-none cursor-pointer p-1"
            >
              aA
            </button>
            <div className="flex items-center gap-1 max-w-[60%]">
              <Lock size={10} className="text-black shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search or enter website"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit(inputValue);
                  }
                }}
                className="text-[11.5px] font-bold text-zinc-700 bg-transparent border-none outline-none w-full text-center"
              />
            </div>
            <button
              onClick={() => handleSearchSubmit(currentUrl)}
              className="p-1 hover:bg-zinc-200/60 rounded-full transition-colors text-zinc-500 border-none outline-none bg-transparent cursor-pointer"
            >
              <RotateCw size={12} strokeWidth={2.4} />
            </button>
          </div>
        )}

        {/* Bottom Toolbar Icons */}
        <div className="flex justify-around items-center w-full px-2 mt-0.5">
          <button
            onClick={handleBack}
            className="border-none bg-transparent cursor-pointer p-2 active:opacity-50 transition-opacity"
          >
            <ChevronLeft size={24} className={historyIndex > 0 ? "text-black" : "text-zinc-300"} />
          </button>
          <button
            onClick={handleForward}
            className="border-none bg-transparent cursor-pointer p-2 active:opacity-50 transition-opacity"
          >
            <ChevronRight
              size={24}
              className={historyIndex < history.length - 1 ? "text-black" : "text-zinc-300"}
            />
          </button>
          <button
            onClick={() => setShowShareSheet(!showShareSheet)}
            className="border-none bg-transparent cursor-pointer p-2 active:scale-90 transition-transform"
          >
            <Share size={21} className="text-black" />
          </button>
          <button
            onClick={() => navigateTo("safari://start")}
            className="border-none bg-transparent cursor-pointer p-2 active:scale-90 transition-transform"
          >
            <Home size={21} className="text-black" />
          </button>
          <button onClick={handleNewTab} className="border-none bg-transparent cursor-pointer p-1">
            <Plus size={21} className="text-black active:scale-90 transition-transform" />
          </button>
          <button
            onClick={() => setShowTabsOverview(!showTabsOverview)}
            className="border-none bg-transparent cursor-pointer p-2 active:scale-90 transition-transform"
          >
            <Layout size={21} className="text-black" />
          </button>
        </div>
      </div>

      {/* iOS 17 aA Text Settings Dropdown */}
      {showFormatMenu && (
        <div className="absolute bottom-[115px] left-4 bg-white/95 backdrop-blur-xl border border-zinc-200/60 rounded-2xl p-3 shadow-2xl z-40 w-52 flex flex-col gap-2">
          <div className="flex justify-between items-center bg-zinc-100 rounded-xl p-1">
            <button
              onClick={() => setTextSize(Math.max(50, textSize - 15))}
              className="text-xs font-semibold px-3 py-1 bg-white rounded-lg shadow-sm border border-zinc-200 text-zinc-700 cursor-pointer"
            >
              A-
            </button>
            <span className="text-xs font-bold text-zinc-650">{textSize}%</span>
            <button
              onClick={() => setTextSize(Math.min(180, textSize + 15))}
              className="text-xs font-semibold px-3 py-1 bg-white rounded-lg shadow-sm border border-zinc-200 text-zinc-700 cursor-pointer"
            >
              A+
            </button>
          </div>
          <hr className="border-zinc-150 my-1" />
          <button
            onClick={() => {
              navigateTo("safari://privacy-report");
              setShowFormatMenu(false);
            }}
            className="w-full text-left py-2 px-3 hover:bg-zinc-50 rounded-xl text-xs font-bold text-zinc-850 flex items-center gap-2 bg-transparent border-none outline-none cursor-pointer"
          >
            <ShieldHalf size={14} className="text-zinc-500" />
            <span>Privacy Report</span>
          </button>
          <button
            onClick={() => {
              triggerToast("Desktop site requested");
              setShowFormatMenu(false);
            }}
            className="w-full text-left py-2 px-3 hover:bg-zinc-50 rounded-xl text-xs font-bold text-zinc-850 flex items-center gap-2 bg-transparent border-none outline-none cursor-pointer"
          >
            <Globe size={14} className="text-zinc-500" />
            <span>Request Desktop Site</span>
          </button>
        </div>
      )}

      {/* iOS 17 Premium Share Sheet */}
      {showShareSheet && (
        <div
          className="absolute inset-0 bg-black/30 z-40 flex flex-col justify-end"
          onClick={() => setShowShareSheet(false)}
        >
          <div
            className="bg-[#f2f2f7] rounded-t-[30px] p-5 pb-8 space-y-4 max-h-[70%] overflow-y-auto shadow-2xl transition-transform transform translate-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info bar */}
            <div className="flex items-center gap-3 border-b border-zinc-200 pb-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border shadow-sm shrink-0">
                <Globe className="text-zinc-500" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-zinc-900 truncate">
                  {getCleanDomain(currentUrl)}
                </h4>
                <p className="text-[10px] text-zinc-400 truncate">{currentUrl}</p>
              </div>
              <button
                onClick={() => setShowShareSheet(false)}
                className="w-7 h-7 rounded-full bg-zinc-200/80 flex items-center justify-center text-zinc-500 hover:text-zinc-800 border-none outline-none cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyLink}
                className="bg-white border border-zinc-200/50 hover:bg-zinc-50 p-3.5 rounded-2xl flex flex-col items-center gap-1.5 shadow-sm text-decoration-none cursor-pointer text-zinc-950 font-bold"
              >
                <Copy size={20} className="text-blue-500" />
                <span className="text-[11px]">Copy Link</span>
              </button>
              <button
                onClick={handleAddBookmark}
                className="bg-white border border-zinc-200/50 hover:bg-zinc-50 p-3.5 rounded-2xl flex flex-col items-center gap-1.5 shadow-sm text-decoration-none cursor-pointer text-zinc-950 font-bold"
              >
                <Bookmark size={20} className="text-blue-500" />
                <span className="text-[11px]">Add Bookmark</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl divide-y divide-zinc-100 overflow-hidden border shadow-sm">
              <button
                onClick={() => {
                  triggerToast("Added to Reading List");
                  setShowShareSheet(false);
                }}
                className="w-full text-left p-3.5 hover:bg-zinc-50 text-xs font-bold text-zinc-850 flex items-center gap-3 bg-transparent border-none outline-none cursor-pointer"
              >
                <FileText size={16} className="text-zinc-400" />
                <span>Add to Reading List</span>
              </button>
              <button
                onClick={() => {
                  triggerToast("Added to Home Screen");
                  setShowShareSheet(false);
                }}
                className="w-full text-left p-3.5 hover:bg-zinc-50 text-xs font-bold text-zinc-850 flex items-center gap-3 bg-transparent border-none outline-none cursor-pointer"
              >
                <Plus size={16} className="text-zinc-400" />
                <span>Add to Home Screen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS 17 Premium Tabs Grid Overview Screen */}
      {showTabsOverview && (
        <div className="absolute inset-0 bg-zinc-100/96 backdrop-blur-xl z-50 flex flex-col justify-between p-4 text-zinc-900">
          <div className="flex items-center justify-between shrink-0 py-2">
            <span className="text-sm font-extrabold tracking-wide uppercase text-zinc-550">
              {tabs.length} {tabs.length === 1 ? "Tab" : "Tabs"}
            </span>
            <button
              onClick={() => setShowTabsOverview(false)}
              className="text-sm font-bold text-black bg-transparent border-none outline-none cursor-pointer hover:text-zinc-700"
            >
              Done
            </button>
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 my-4 content-start pb-24 hide-scrollbar">
            {tabs.map((tab) => {
              const isTabActive = tab.id === activeTabId;
              const tabDomain = getCleanDomain(tab.url);
              return (
                <div
                  key={tab.id}
                  onClick={() => {
                    setActiveTabId(tab.id);
                    setShowTabsOverview(false);
                  }}
                  className={`relative h-44 rounded-2xl overflow-hidden bg-white border transition-all duration-200 active:scale-[0.97] hover:scale-[1.03] cursor-pointer flex flex-col justify-between p-3.5 ${
                    isTabActive
                      ? "border-[#007aff] ring-4 ring-[#007aff]/20"
                      : "border-zinc-200 hover:border-zinc-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-zinc-800 truncate max-w-[80%]">
                      {tabDomain}
                    </span>
                    <button
                      onClick={(e) => handleCloseTab(tab.id, e)}
                      className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-300 hover:text-zinc-900 border-none outline-none cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </div>

                  {/* Tab Mock content preview */}
                  <div className="flex-1 flex items-center justify-center mt-2 bg-zinc-50 rounded-xl border border-zinc-200/50 shadow-inner overflow-hidden select-none relative">
                    {(() => {
                      const urlLower = tab.url.toLowerCase();
                      if (urlLower.includes("newtube") || urlLower.includes("youtube")) {
                        return (
                          <img
                            src="/projects/newtube.webp"
                            alt="NewTube"
                            className="w-full h-full object-cover object-top"
                          />
                        );
                      }
                      if (urlLower.includes("insta") || urlLower.includes("snsta")) {
                        return (
                          <img
                            src="/projects/snsta.webp"
                            alt="Insta Downloader"
                            className="w-full h-full object-cover object-top"
                          />
                        );
                      }
                      if (urlLower.includes("resume")) {
                        return (
                          <img
                            src="/projects/resume-ats.webp"
                            alt="Resume ATS"
                            className="w-full h-full object-cover object-top"
                          />
                        );
                      }
                      if (urlLower.includes("docs")) {
                        return (
                          <img
                            src="/projects/docs-editor.webp"
                            alt="Docs Editor"
                            className="w-full h-full object-cover object-top"
                          />
                        );
                      }
                      if (urlLower.includes("openstreetmap") || urlLower.includes("map")) {
                        return (
                          <img
                            src="/images/openstreetmap.webp"
                            alt="Map"
                            className="w-full h-full object-cover"
                          />
                        );
                      }
                      if (urlLower.includes("wikipedia")) {
                        return (
                          <div className="flex flex-col items-center gap-1.5 transform scale-[1.35]">
                            <span className="text-3xl font-serif text-zinc-400">W</span>
                            <span className="text-[7px] font-bold text-zinc-400">WIKIPEDIA</span>
                          </div>
                        );
                      }
                      if (urlLower.includes("google.com")) {
                        return (
                          <div className="flex flex-col items-center gap-1 transform scale-[1.35]">
                            <span className="text-base font-bold tracking-tight text-blue-600">
                              Google
                            </span>
                          </div>
                        );
                      }
                      if (tab.url === "safari://start") {
                        return (
                          <div className="flex flex-col items-center gap-1.5 transform scale-[1.35]">
                            <img
                              src="/images/safari.webp"
                              alt="Safari"
                              className="w-10 h-10 object-contain"
                            />
                            <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-zinc-400">
                              Start Page
                            </span>
                          </div>
                        );
                      }
                      if (tab.url === "safari://privacy-report") {
                        return (
                          <div className="flex flex-col items-center gap-1.5 transform scale-[1.35]">
                            <ShieldHalf className="text-[#007aff] w-8 h-8" />
                            <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-zinc-400">
                              Privacy Report
                            </span>
                          </div>
                        );
                      }
                      return <Globe className="text-zinc-300 w-10 h-10 transform scale-[1.35]" />;
                    })()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Plus / Add new tab button at the bottom */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center shrink-0">
            <button
              onClick={handleNewTab}
              className="w-13 h-13 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-lg active:scale-95 transition-transform border border-zinc-200/85 outline-none cursor-pointer"
            >
              <Plus size={24} strokeWidth={2.5} className="text-zinc-950" />
            </button>
          </div>
        </div>
      )}

      {/* Floating dynamic iOS Premium Toast notice */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/85 text-white/95 px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl z-50 animate-bounce tracking-wide backdrop-blur-md select-none border border-white/10">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export { SafariMobileHeader };
