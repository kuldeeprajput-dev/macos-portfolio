import React from "react";
import WindowControls from "@components/WindowControls";
import { ChevronRight } from "lucide-react";
import { SIDEBAR_GROUPS, SidebarItem } from "../../data/settingsData";

const SettingsSidebar = ({
  activeTab,
  setActiveTab,
  githubData,
  isLoading,
  isMobile,
  mobileView,
  setMobileView,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  if (isMobile) {
    const filteredGroups = SIDEBAR_GROUPS.map((group) =>
      group.filter((item) => item.id.toLowerCase().includes(searchQuery.toLowerCase())),
    ).filter((group) => group.length > 0);

    return (
      <div
        className={`${mobileView === "main" ? "flex" : "hidden"} flex-col h-full w-full bg-[#f2f2f7]`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Header Bar */}
        <div className="flex flex-col shrink-0 bg-[#f2f2f7] pb-2">
          <div className="px-4 pt-5 pb-2 flex items-center justify-between">
            <WindowControls target="settings" />
          </div>
          <h1 className="text-[32px] font-extrabold text-black px-4 tracking-tight">Settings</h1>
        </div>

        {/* Scrollable Settings Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-5 scrollbar-none">
          {/* iOS Style Search Bar */}
          <div className="relative flex items-center bg-zinc-200/60 rounded-xl px-3 py-1.5 h-9 shrink-0">
            <svg
              className="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none border-none text-gray-800 placeholder-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 bg-transparent border-none"
              >
                Clear
              </button>
            )}
          </div>

          {/* Apple ID / Profile Card */}
          {(!searchQuery || "apple id".includes(searchQuery.toLowerCase())) && (
            <div
              className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4 p-4 cursor-pointer active:scale-[0.99] active:bg-zinc-50 transition-all border border-black/5"
              onClick={() => {
                setActiveTab("Apple ID");
                setMobileView("Apple ID");
              }}
            >
              {isLoading ? (
                <div className="w-[58px] h-[58px] rounded-full bg-gray-200 animate-pulse shrink-0" />
              ) : githubData ? (
                <img
                  src={githubData.profile.avatar_url}
                  className="w-[58px] h-[58px] rounded-full shrink-0 border border-black/10 object-cover"
                  alt="Avatar"
                />
              ) : (
                <div className="w-[58px] h-[58px] rounded-full bg-gray-200 shrink-0" />
              )}
              <div className="flex-1 overflow-hidden">
                <h2 className="text-[17px] font-bold text-gray-900 truncate leading-tight">
                  {githubData?.profile?.name || githubData?.profile?.login || "Apple Account"}
                </h2>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  Apple Account, iCloud, Sign-in & Security
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </div>
          )}

          {/* Grouped Settings Rows */}
          {filteredGroups.map((group, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden border border-black/5"
            >
              {group.map((item, j) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3.5 p-3.5 pl-4 cursor-pointer active:bg-zinc-50 transition-colors ${j < group.length - 1 ? "border-b border-zinc-100" : ""}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileView(item.id);
                  }}
                >
                  <div
                    className={`flex items-center justify-center w-[28px] h-[28px] rounded-[7px] text-white shadow-sm shrink-0 ${item.color}`}
                  >
                    {React.cloneElement(item.icon, { size: 15, strokeWidth: 2.2 })}
                  </div>
                  <span className="flex-1 text-[15px] font-semibold text-gray-800">{item.id}</span>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </div>
              ))}
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <p className="text-center py-10 text-xs text-gray-400 italic">
              No settings match "{searchQuery}"
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden @md:flex w-[240px] h-full shrink-0 bg-[#e8e8e8]/50 border-r border-black/10 flex-col">
      <div className="window-header h-[52px] shrink-0 flex items-center px-4 cursor-default">
        <WindowControls target="settings" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-4 thin-scrollbar">
        <div
          className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors border border-transparent ${activeTab === "Apple ID" ? "bg-black/5 border-black/5" : "hover:bg-black/5"}`}
          onClick={() => setActiveTab("Apple ID")}
        >
          {isLoading ? (
            <>
              <div className="w-[42px] h-[42px] rounded-full bg-gray-300 animate-pulse shrink-0"></div>
              <div className="flex-1 flex flex-col gap-1.5 justify-center">
                <div className="h-3 w-20 bg-gray-300 animate-pulse rounded"></div>
                <div className="h-2 w-28 bg-gray-300 animate-pulse rounded"></div>
              </div>
            </>
          ) : githubData ? (
            <>
              <img
                src={githubData.profile.avatar_url}
                alt="Avatar"
                className="w-[42px] h-[42px] rounded-full border border-gray-300 shadow-sm shrink-0"
                draggable="false"
              />
              <div className="flex-1 overflow-hidden">
                <h3 className="font-semibold text-[13px] text-gray-900 truncate leading-tight">
                  {githubData.profile.name || githubData.profile.login}
                </h3>
                <p className="text-[11px] text-gray-500 truncate leading-tight mt-0.5">
                  Apple ID, iCloud, Media
                </p>
              </div>
            </>
          ) : null}
        </div>

        <div className="space-y-4">
          {SIDEBAR_GROUPS.map((group, i) => (
            <div key={i} className="space-y-[2px]">
              {group.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.id}
                  color={item.color}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
