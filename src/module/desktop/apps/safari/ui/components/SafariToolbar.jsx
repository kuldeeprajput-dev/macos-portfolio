import React, { useState } from "react";
import WindowControls from "@components/WindowControls";
import { TWITTER_URL, LINKEDIN_URL } from "@constants";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Share,
  ShieldHalf,
  PanelLeft,
  RotateCw,
  Star,
  Download,
  Layout,
  AlignLeft,
  Home,
  Copy,
  Settings,
} from "lucide-react";

const SafariDesktopToolbar = ({
  _showSidebar,
  onToggleSidebar,
  activeTab,
  addressInput,
  setAddressInput,
  navigateTabTo,
  handleGoBack,
  handleGoForward,
  handleReload,
  toggleReaderMode,
  toggleBookmark,
  isBookmarked,
  showDownloads,
  setShowDownloads,
  showTabOverview,
  setShowTabOverview,
  handleNewTab,
  openWindow,
  homepage,
  _setShowSettings,
  isMaxTabsReached,
}) => {
  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;
  const isReaderCompatible = activeTab.url.includes("wikipedia.org");

  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeTab.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigateTabTo(addressInput);
      e.target.blur();
    }
  };

  return (
    <div
      id="window-header"
      className="!bg-[#eef1f5] !border-b-[#c8cbd0] !px-4 !py-2 flex flex-col gap-1.5 select-none relative z-20 shrink-0"
    >
      <div className="flex items-center gap-2 @lg:gap-4 w-full">
        {/* Left Side: Window Controls & Sidebar toggle */}
        <div className="flex items-center gap-3">
          <WindowControls target="safari" />
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="hidden @lg:block p-1 rounded hover:bg-black/5 transition-colors border-none outline-none focus:outline-none shadow-none"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <PanelLeft size={16} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-1 @lg:gap-1.5">
          <button
            onClick={handleGoBack}
            disabled={!canGoBack}
            className={`p-1 rounded hover:bg-black/5 transition-colors ${
              canGoBack ? "text-gray-700 cursor-pointer" : "text-gray-300 cursor-not-allowed"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <ChevronLeft size={17} />
          </button>
          <button
            onClick={handleGoForward}
            disabled={!canGoForward}
            className={`p-1 rounded hover:bg-black/5 transition-colors ${
              canGoForward ? "text-gray-700 cursor-pointer" : "text-gray-300 cursor-not-allowed"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <ChevronRight size={17} />
          </button>
        </div>

        {/* Home Button */}
        <button
          onClick={() => navigateTabTo(homepage || "safari://start")}
          className="p-1 rounded hover:bg-black/5 text-gray-600 transition-colors flex-shrink-0"
          title="Go to Home"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Home size={16} />
        </button>

        {/* Center: Address Bar */}
        <div className="hidden @md:block flex-1 max-w-2xl mx-auto w-full">
          <div
            className="flex items-center gap-2 bg-white border border-[#c8cbd0] rounded-lg px-2.5 py-1 text-sm text-gray-700 shadow-inner focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Padlock / Security report */}
            <div
              className="hidden @md:flex items-center gap-1 cursor-pointer hover:bg-black/5 rounded p-0.5"
              title="Privacy Report"
            >
              <ShieldHalf size={13} className="text-green-600" />
            </div>

            {/* Reader Mode Button */}
            {isReaderCompatible && (
              <button
                onClick={toggleReaderMode}
                className={`hidden @md:inline-block p-0.5 rounded transition-colors ${
                  activeTab.isReaderMode
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:bg-black/5"
                }`}
                title="Reader View"
              >
                <AlignLeft size={13} />
              </button>
            )}

            {/* Search Icon */}
            {!activeTab.isReaderMode && (
              <Search size={12} className="hidden @md:block text-gray-400" />
            )}

            {/* Address Input - Large Container */}
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search or enter website name"
              className="hidden @lg:block flex-1 bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 text-center focus:text-left"
            />
            {/* Address Input - Medium Container */}
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search or enter website"
              className="hidden @md:block @lg:hidden flex-1 bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 text-center focus:text-left"
            />
            {/* Address Input - Small Container */}
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className="block @md:hidden flex-1 bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 text-center focus:text-left"
            />

            {/* Bookmark Star Button */}
            <button
              onClick={toggleBookmark}
              className="hidden @md:inline-block p-0.5 rounded transition-colors text-gray-400 hover:text-amber-500"
              title="Bookmark this page"
            >
              <Star size={13} className={isBookmarked ? "text-amber-500 fill-amber-500" : ""} />
            </button>

            {/* Reload Button */}
            <button
              onClick={handleReload}
              className="p-0.5 rounded hover:bg-black/5 transition-colors text-gray-500"
              title="Reload page"
            >
              <RotateCw size={12} />
            </button>
          </div>
        </div>

        {/* Right Side: Share, Downloads, Plus, Layout */}
        <div className="flex items-center gap-1.5 @lg:gap-3">
          <div className="relative hidden @2xl:block">
            <button
              onClick={() => setShowShare(!showShare)}
              className={`p-1.5 rounded hover:bg-black/5 text-gray-600 transition-colors ${
                showShare ? "bg-black/8" : ""
              }`}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Share size={16} />
            </button>

            {/* Share Popover */}
            {showShare && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border border-[#c8cbd0] rounded-xl shadow-xl p-2 text-xs z-50 text-gray-700 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="space-y-1">
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-blue-500 hover:text-white rounded-lg text-left font-medium transition-colors"
                  >
                    <Copy size={13} />
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                  </button>
                  <button
                    onClick={() => {
                      toggleBookmark();
                      setShowShare(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-blue-500 hover:text-white rounded-lg text-left font-medium transition-colors"
                  >
                    <Star size={13} />
                    <span>{isBookmarked ? "Remove Bookmark" : "Add Bookmark"}</span>
                  </button>
                  <div className="h-[1px] bg-gray-200 my-1" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowShare(false);
                      navigateTabTo(TWITTER_URL);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-blue-500 hover:text-white rounded-lg text-left font-medium transition-colors border-none bg-transparent cursor-pointer text-gray-700"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Twitter / X</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowShare(false);
                      navigateTabTo(LINKEDIN_URL);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-blue-500 hover:text-white rounded-lg text-left font-medium transition-colors border-none bg-transparent cursor-pointer text-gray-700"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>LinkedIn</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative hidden @xl:block">
            <button
              onClick={() => setShowDownloads(!showDownloads)}
              className={`p-1.5 rounded hover:bg-black/5 text-gray-600 transition-colors ${
                showDownloads ? "bg-black/8" : ""
              }`}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Download size={16} />
            </button>

            {/* Downloads Popover */}
            {showDownloads && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white border border-[#c8cbd0] rounded-xl shadow-xl p-4 text-xs z-50 text-gray-700 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-[#c8cbd0]/40 pb-2 mb-3">
                  <span className="font-bold">Downloads</span>
                  <button
                    onClick={() => setShowDownloads(false)}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-3">
                  <div
                    onClick={() => {
                      openWindow("resume");
                      setShowDownloads(false);
                    }}
                    className="flex items-center gap-2.5 cursor-pointer hover:bg-black/5 p-1 rounded transition-colors"
                  >
                    <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center font-bold text-red-600 text-[10px]">
                      PDF
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-left">Kuldeep_Resume.pdf</p>
                      <p className="text-[10px] text-gray-400 text-left">2.4 MB — Complete</p>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      openWindow("vscode");
                      setShowDownloads(false);
                    }}
                    className="flex items-center gap-2.5 cursor-pointer hover:bg-black/5 p-1 rounded transition-colors"
                  >
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-[10px]">
                      ZIP
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-left">
                        Project_Portfolio_Source.zip
                      </p>
                      <p className="text-[10px] text-gray-400 text-left">14.8 MB — Complete</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleNewTab}
            disabled={isMaxTabsReached}
            className={`hidden @xl:inline-block p-1.5 rounded text-gray-600 transition-colors ${
              isMaxTabsReached ? "opacity-30 cursor-not-allowed" : "hover:bg-black/5 cursor-pointer"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            title={isMaxTabsReached ? "Tab limit reached (Max 10)" : "Open a new tab"}
          >
            <Plus size={16} />
          </button>

          <button
            onClick={() => setShowTabOverview(!showTabOverview)}
            className={`hidden @2xl:inline-block p-1.5 rounded hover:bg-black/5 text-gray-600 transition-colors ${
              showTabOverview ? "bg-black/8" : ""
            }`}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Layout size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SafariMobileHeader = ({
  activeTab,
  addressInput,
  setAddressInput,
  navigateTabTo,
  handleGoBack,
  handleGoForward,
  handleReload,
  handleNewTab,
  showDownloads,
  setShowDownloads,
  openWindow,
}) => {
  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigateTabTo(addressInput);
      e.target.blur();
    }
  };

  return (
    <div
      id="window-header"
      className="flex flex-col p-2.5 bg-[#f8f8f8] border-b border-[#d1d1d6] gap-2 shrink-0 select-none relative z-20"
    >
      <div className="flex items-center gap-2 w-full">
        <WindowControls target="safari" />
        <div className="flex-1 flex items-center gap-1.5 bg-[#e9e9eb] rounded-lg px-2 py-1.5 min-h-[34px]">
          <ShieldHalf size={13} className="text-green-600 flex-shrink-0" />
          <Search size={11} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or enter website"
            className="flex-1 bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 focus:text-left text-center"
          />
          <button onClick={handleReload} className="text-gray-400 hover:text-gray-600">
            <RotateCw size={12} />
          </button>
        </div>
        <button
          onClick={() => setShowDownloads(!showDownloads)}
          className="text-blue-500 relative p-1"
        >
          <Download size={18} />
        </button>
      </div>

      <div className="flex items-center justify-between w-full px-2 relative">
        <div className="flex items-center gap-5">
          <button
            onClick={handleGoBack}
            disabled={!canGoBack}
            className={canGoBack ? "text-blue-500" : "text-gray-300"}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={handleGoForward}
            disabled={!canGoForward}
            className={canGoForward ? "text-blue-500" : "text-gray-300"}
          >
            <ChevronRight size={22} />
          </button>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={handleNewTab} className="text-blue-500">
            <Plus size={20} />
          </button>
        </div>

        {/* Mobile Downloads Popover */}
        {showDownloads && (
          <div className="absolute right-2 top-0 mt-8 w-64 bg-white border border-[#c8cbd0] rounded-xl shadow-xl p-3.5 text-xs z-50 text-gray-700 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#c8cbd0]/40 pb-1.5 mb-2">
              <span className="font-bold">Downloads</span>
              <button
                onClick={() => setShowDownloads(false)}
                className="text-blue-500 hover:underline font-medium"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2">
              <div
                onClick={() => {
                  openWindow("resume");
                  setShowDownloads(false);
                }}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-black/5 p-1 rounded transition-colors"
              >
                <div className="w-7 h-7 rounded bg-red-100 flex items-center justify-center font-bold text-red-600 text-[9px]">
                  PDF
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-left">Kuldeep_Resume.pdf</p>
                  <p className="text-[9px] text-gray-400 text-left">2.4 MB — Complete</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { SafariDesktopToolbar, SafariMobileHeader };
