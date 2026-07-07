import { useState, useEffect, useRef } from "react";
import { projects, socials } from "@constants";
import { Globe } from "lucide-react";
import useSafari from "../../hooks/useSafari";
import { SafariDesktopToolbar, SafariMobileHeader } from "../components/SafariToolbar";
import SafariTabBar from "../components/SafariTabBar";
import SafariSidebar from "../components/SafariSidebar";
import SafariContentView from "../components/SafariContentView";
import SafariSettingsModal from "../components/SafariSettingsModal";
import SafariAboutModal from "../components/SafariAboutModal";

const SIDEBAR_HIDE_THRESHOLD = 600; // auto-hide sidebar below this width

const SafariSection = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const safari = useSafari();
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [canShowSidebar, setCanShowSidebar] = useState(true);

  // Auto-hide sidebar when Safari window is resized narrow & disable toggle
  useEffect(() => {
    const el = containerRef.current;
    if (!el || isMobile) return;

    const ro = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const tooNarrow = width < SIDEBAR_HIDE_THRESHOLD;
      setCanShowSidebar(!tooNarrow);
      if (tooNarrow && safari.showSidebar) {
        safari.setShowSidebar(false);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile, safari.showSidebar]);

  if (isMobile) {
    return (
      <div className="flex flex-col h-full w-full bg-white select-none overflow-hidden rounded-xl">
        <SafariMobileHeader
          activeTab={safari.activeTab}
          addressInput={safari.addressInput}
          setAddressInput={safari.setAddressInput}
          navigateTabTo={safari.navigateTabTo}
          handleGoBack={safari.handleGoBack}
          handleGoForward={safari.handleGoForward}
          handleReload={safari.handleReload}
          handleNewTab={safari.handleNewTab}
          showDownloads={safari.showDownloads}
          setShowDownloads={safari.setShowDownloads}
          openWindow={safari.openWindow}
        />
        <SafariContentView
          activeTab={safari.activeTab}
          tabs={safari.tabs}
          setActiveTabId={safari.setActiveTabId}
          handleCloseTab={safari.handleCloseTab}
          handleNewTab={safari.handleNewTab}
          showTabOverview={safari.showTabOverview}
          setShowTabOverview={safari.setShowTabOverview}
          addressInput={safari.addressInput}
          navigateTabTo={safari.navigateTabTo}
          bookmarks={safari.bookmarks}
          setBookmarks={safari.setBookmarks}
          projects={projects}
          socials={socials}
          backgroundImage={safari.backgroundImage}
          setBackgroundImage={safari.setBackgroundImage}
          enabledSections={safari.enabledSections}
          setEnabledSections={safari.setEnabledSections}
          isIframeable={safari.isIframeable}
          readerFont={safari.readerFont}
          setReaderFont={safari.setReaderFont}
          readerTheme={safari.readerTheme}
          setReaderTheme={safari.setReaderTheme}
          readerFontSize={safari.readerFontSize}
          setReaderFontSize={safari.setReaderFontSize}
          toggleReaderMode={safari.toggleReaderMode}
          searchEngine={safari.searchEngine}
          enableJavaScript={safari.enableJavaScript}
          preventTracking={safari.preventTracking}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full @container bg-white select-none overflow-hidden rounded-xl relative"
    >
      {/* 1. Main Unified Toolbar */}
      <SafariDesktopToolbar
        showSidebar={safari.showSidebar}
        onToggleSidebar={canShowSidebar ? () => safari.setShowSidebar(!safari.showSidebar) : null}
        activeTab={safari.activeTab}
        addressInput={safari.addressInput}
        setAddressInput={safari.setAddressInput}
        navigateTabTo={safari.navigateTabTo}
        handleGoBack={safari.handleGoBack}
        handleGoForward={safari.handleGoForward}
        handleReload={safari.handleReload}
        toggleReaderMode={safari.toggleReaderMode}
        toggleBookmark={safari.toggleBookmark}
        isBookmarked={safari.isBookmarked}
        showDownloads={safari.showDownloads}
        setShowDownloads={safari.setShowDownloads}
        showTabOverview={safari.showTabOverview}
        setShowTabOverview={safari.setShowTabOverview}
        handleNewTab={safari.handleNewTab}
        openWindow={safari.openWindow}
        homepage={safari.homepage}
        setShowSettings={safari.setShowSettings}
        isMaxTabsReached={safari.tabs.length >= 10}
      />

      {/* 2. Sleek Tab Bar */}
      <SafariTabBar
        tabs={safari.tabs}
        activeTabId={safari.activeTabId}
        setActiveTabId={safari.setActiveTabId}
        onCloseTab={safari.handleCloseTab}
        onNewTab={safari.handleNewTab}
        showTabIcons={safari.showTabIcons}
      />

      {/* 3. Sidebar + Main Content Split View */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Sidebar Container */}
        <div
          className={`h-full border-r border-[#c8cbd0] transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 ${
            safari.showSidebar ? "w-64 opacity-100" : "w-0 opacity-0 border-r-0"
          }`}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <SafariSidebar
            bookmarks={safari.bookmarks}
            setBookmarks={safari.setBookmarks}
            historyList={safari.historyList}
            setHistoryList={safari.setHistoryList}
            sidebarTab={safari.sidebarTab}
            setSidebarTab={safari.setSidebarTab}
            navigateTabTo={safari.navigateTabTo}
            projects={projects}
          />
        </div>

        {/* Content View Area */}
        <SafariContentView
          activeTab={safari.activeTab}
          tabs={safari.tabs}
          setActiveTabId={safari.setActiveTabId}
          handleCloseTab={safari.handleCloseTab}
          handleNewTab={safari.handleNewTab}
          showTabOverview={safari.showTabOverview}
          setShowTabOverview={safari.setShowTabOverview}
          addressInput={safari.addressInput}
          navigateTabTo={safari.navigateTabTo}
          bookmarks={safari.bookmarks}
          setBookmarks={safari.setBookmarks}
          projects={projects}
          socials={socials}
          backgroundImage={safari.backgroundImage}
          setBackgroundImage={safari.setBackgroundImage}
          enabledSections={safari.enabledSections}
          setEnabledSections={safari.setEnabledSections}
          isIframeable={safari.isIframeable}
          readerFont={safari.readerFont}
          setReaderFont={safari.setReaderFont}
          readerTheme={safari.readerTheme}
          setReaderTheme={safari.setReaderTheme}
          readerFontSize={safari.readerFontSize}
          setReaderFontSize={safari.setReaderFontSize}
          toggleReaderMode={safari.toggleReaderMode}
          searchEngine={safari.searchEngine}
          enableJavaScript={safari.enableJavaScript}
          preventTracking={safari.preventTracking}
        />
      </div>

      {/* 4. Safari Settings Dialog */}
      <SafariSettingsModal
        show={safari.showSettings}
        onClose={() => safari.setShowSettings(false)}
        homepage={safari.homepage}
        setHomepage={safari.setHomepage}
        searchEngine={safari.searchEngine}
        setSearchEngine={safari.setSearchEngine}
        showTabIcons={safari.showTabIcons}
        setShowTabIcons={safari.setShowTabIcons}
        preventTracking={safari.preventTracking}
        setPreventTracking={safari.setPreventTracking}
        blockCookies={safari.blockCookies}
        setBlockCookies={safari.setBlockCookies}
        enableJavaScript={safari.enableJavaScript}
        setEnableJavaScript={safari.setEnableJavaScript}
        developMenuEnabled={safari.developMenuEnabled}
        setDevelopMenuEnabled={safari.setDevelopMenuEnabled}
      />

      {/* 5. Safari About Dialog */}
      <SafariAboutModal show={safari.showAbout} onClose={() => safari.setShowAbout(false)} />

      {/* 6. Simulated Search Alert Dialog */}
      {safari.showSearchAlert &&
        (() => {
          const isSearch = safari.searchQuery.startsWith("https://www.google.com/search?q=");
          const displayName = isSearch
            ? decodeURIComponent(safari.searchQuery.split("?q=")[1])
            : safari.searchQuery;

          return (
            <div
              className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/25 backdrop-blur-xxs select-none font-sans"
              onClick={() => safari.setShowSearchAlert(false)}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div
                className="bg-white/95 border border-zinc-200/50 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center space-y-4 transform animate-in zoom-in-95 duration-150 backdrop-blur-md text-gray-800"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 bg-neutral-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-zinc-200 animate-in fade-in">
                  <Globe className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-800">Open in New Tab</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed px-1">
                    {isSearch ? (
                      <>
                        Do you want to search for{" "}
                        <span className="font-semibold text-gray-750">"{displayName}"</span> on
                        Google in a new tab?
                      </>
                    ) : (
                      <>
                        Do you want to open{" "}
                        <span className="font-semibold text-gray-750">"{displayName}"</span> in a
                        new tab?
                      </>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => safari.setShowSearchAlert(false)}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = document.createElement("a");
                      link.href = safari.searchQuery;
                      link.target = "_blank";
                      link.rel = "noopener noreferrer";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      safari.setShowSearchAlert(false);
                    }}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer text-center"
                  >
                    Open Link
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default SafariSection;
