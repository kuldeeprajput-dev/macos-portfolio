import React from "react";
import { Plus, X, Globe } from "lucide-react";

const SafariTabBar = ({
  tabs,
  activeTabId,
  setActiveTabId,
  onCloseTab,
  onNewTab,
  showTabIcons,
}) => {
  const isMaxTabsReached = tabs.length >= 10;

  return (
    <div
      className="flex items-end bg-[#eef1f5] border-b border-[#c8cbd0] px-2 h-10 select-none w-full"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Scrollable Tabs Container */}
      <div className="flex items-end flex-1 overflow-x-auto scrollbar-none min-w-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isStartPage = tab.url === "safari://start";

          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group relative flex items-center h-8 min-w-[36px] @sm:min-w-[85px] @md:min-w-[120px] max-w-[200px] flex-1 px-1.5 @sm:px-3 rounded-t-lg text-xs transition-all duration-150 cursor-pointer ${
                tabs.length <= 2 ? "justify-start" : "justify-center @sm:justify-start"
              } ${
                isActive
                  ? "bg-white text-gray-800 shadow-[0_-1px_3px_rgba(0,0,0,0.06)] border-t border-x border-[#c8cbd0]/60 z-10 font-medium"
                  : "bg-black/5 hover:bg-black/10 text-gray-500 border-t border-x border-transparent hover:border-black/5"
              }`}
            >
              {/* Divider on the right of inactive tabs */}
              {!isActive && (
                <div className="absolute right-0 top-2 bottom-2 w-[1px] bg-[#c8cbd0] group-hover:opacity-0 transition-opacity" />
              )}

              {/* Tab Icon */}
              {showTabIcons && (
                <span
                  className={`mr-0 @sm:mr-1.5 flex-shrink-0 transition-opacity duration-150 ${
                    tabs.length > 2 ? "group-hover:opacity-0 @sm:group-hover:opacity-100" : ""
                  }`}
                >
                  {isStartPage ? (
                    <span className="text-[10px]">🧭</span>
                  ) : (
                    <Globe size={11} className={isActive ? "text-blue-500" : "text-gray-400"} />
                  )}
                </span>
              )}

              {/* Title */}
              <span
                className={`truncate pr-4 flex-1 ${
                  tabs.length <= 2 ? "inline" : "hidden @sm:inline"
                }`}
              >
                {tab.title}
              </span>

              {/* Close Button */}
              <button
                onClick={(e) => onCloseTab(tab.id, e)}
                className={
                  tabs.length <= 2
                    ? `absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-black/10 transition-colors text-gray-400 hover:text-gray-700 block ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`
                    : `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 @sm:left-auto @sm:right-1.5 @sm:translate-x-0 @sm:-translate-y-1/2 p-0.5 rounded-full hover:bg-black/10 transition-colors text-gray-400 hover:text-gray-700 transition-opacity duration-150 ${
                        isActive
                          ? "opacity-0 group-hover:opacity-100 @sm:opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`
                }
              >
                <X size={10} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Plus Button - Outside the scroll container so it's always visible */}
      <button
        onClick={onNewTab}
        disabled={isMaxTabsReached}
        className={`flex-shrink-0 p-1 mb-1.5 ml-1 rounded text-gray-600 transition-colors ${
          isMaxTabsReached ? "opacity-30 cursor-not-allowed" : "hover:bg-black/10 cursor-pointer"
        }`}
        title={isMaxTabsReached ? "Tab limit reached (Max 10)" : "Open a new tab"}
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default SafariTabBar;
