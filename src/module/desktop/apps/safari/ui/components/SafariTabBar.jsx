import React, { useRef, useEffect, useState } from "react";
import { Plus, X, Globe } from "lucide-react";

const ICON_ONLY_THRESHOLD = 60; // below this width per tab → hide text, show icon only

const SafariTabBar = ({
  tabs,
  activeTabId,
  setActiveTabId,
  onCloseTab,
  onNewTab,
  showTabIcons,
}) => {
  const isMaxTabsReached = tabs.length >= 10;
  const barRef = useRef(null);
  const [iconOnly, setIconOnly] = useState(false);

  // Watch container width to decide icon-only mode
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const check = () => {
      const available = el.clientWidth - 40; // 40 = plus btn + padding
      const perTab = available / (tabs.length || 1);
      setIconOnly(perTab < ICON_ONLY_THRESHOLD);
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tabs.length]);

  return (
    <div
      ref={barRef}
      className="flex items-end bg-[#eef1f5] border-b border-[#c8cbd0] px-2 h-10 select-none"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Tabs — fill available space, shrink like a real browser */}
      <div className="flex items-end min-w-0 flex-1 h-full">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isStartPage = tab.url === "safari://start";

          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              style={{ maxWidth: 200 }}
              className={`group relative flex items-center h-8 flex-1 min-w-0 rounded-t-lg text-xs cursor-pointer transition-colors duration-100 ${
                iconOnly ? "justify-center px-1" : "px-2"
              } ${
                isActive
                  ? "bg-white text-gray-800 shadow-[0_-1px_3px_rgba(0,0,0,0.06)] border-t border-x border-[#c8cbd0]/60 z-10 font-medium"
                  : "bg-black/5 hover:bg-black/10 text-gray-500 border-t border-x border-transparent hover:border-black/5"
              }`}
            >
              {/* Separator */}
              {!isActive && (
                <div className="absolute right-0 top-2 bottom-2 w-[1px] bg-[#c8cbd0] group-hover:opacity-0 transition-opacity" />
              )}

              {/* Favicon */}
              {showTabIcons && (
                <span className={`flex-shrink-0 ${iconOnly ? "" : "mr-1"}`}>
                  {isStartPage ? (
                    <span className="text-[10px]">🧭</span>
                  ) : (
                    <Globe size={11} className={isActive ? "text-blue-500" : "text-gray-400"} />
                  )}
                </span>
              )}

              {/* Title — hidden when in icon-only mode */}
              {!iconOnly && (
                <span className="truncate flex-1 min-w-0 pr-4 text-[11px]">{tab.title}</span>
              )}

              {/* Close × */}
              <button
                onClick={(e) => onCloseTab(tab.id, e)}
                className={`absolute top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-black/15 transition-all text-gray-400 hover:text-gray-700 ${
                  iconOnly
                    ? "left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100"
                    : `right-1.5 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`
                }`}
              >
                <X size={10} />
              </button>
            </div>
          );
        })}

        {/* + button — aligned right beside the last tab */}
        <button
          onClick={onNewTab}
          disabled={isMaxTabsReached}
          className={`flex-shrink-0 h-7 w-7 mb-[2px] flex items-center justify-center ml-1.5 rounded-md text-gray-600 transition-colors ${
            isMaxTabsReached ? "opacity-30 cursor-not-allowed" : "hover:bg-black/10 cursor-pointer"
          }`}
          title={isMaxTabsReached ? "Tab limit reached (Max 10)" : "Open a new tab"}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

export default SafariTabBar;
