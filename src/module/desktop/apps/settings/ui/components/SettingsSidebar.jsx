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
  isSidebarOpen = true,
  onCloseSidebar,
  isNarrow = false,
  hideHeader = false,
}) => {
  if (isMobile) {
    return (
      <div
        className={`${mobileView === "main" ? "flex" : "hidden"} flex-col h-full w-full bg-[#f2f2f7]`}
      >
        <div className="flex flex-col shrink-0 bg-[#f2f2f7] border-b border-gray-300">
          <div className="px-4 py-3 pb-2 flex items-center justify-between">
            <WindowControls target="settings" />
          </div>
          <h1 className="text-[28px] font-bold text-black px-4 pb-2">Settings</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 thin-scrollbar">
          <div
            className="bg-white rounded-xl shadow-sm flex items-center gap-4 p-4 cursor-pointer active:bg-gray-50 transition-colors"
            onClick={() => {
              setActiveTab("Apple ID");
              setMobileView("Apple ID");
            }}
          >
            {isLoading ? (
              <div className="w-[60px] h-[60px] rounded-full bg-gray-200 animate-pulse shrink-0" />
            ) : githubData ? (
              <img
                src={githubData.profile.avatar_url}
                className="w-[60px] h-[60px] rounded-full shrink-0 border border-gray-200"
                alt="Avatar"
              />
            ) : (
              <div className="w-[60px] h-[60px] rounded-full bg-gray-200 shrink-0" />
            )}
            <div className="flex-1 overflow-hidden">
              <h2 className="text-[17px] font-semibold text-black truncate leading-tight">
                {githubData?.profile?.name || githubData?.profile?.login || "Loading..."}
              </h2>
              <p className="text-[13px] text-gray-500 truncate mt-0.5">Apple ID, iCloud, Media</p>
            </div>
            <ChevronRight size={18} className="text-gray-400 shrink-0" />
          </div>

          {SIDEBAR_GROUPS.map((group, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {group.map((item, j) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 pl-4 cursor-pointer active:bg-gray-50 transition-colors ${j < group.length - 1 ? "border-b border-gray-100" : ""}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileView(item.id);
                  }}
                >
                  <div
                    className={`flex items-center justify-center w-[28px] h-[28px] rounded-md shadow-sm text-white ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <span className="flex-1 text-[16px] font-medium text-black">{item.id}</span>
                  <ChevronRight size={18} className="text-gray-400 shrink-0" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {isNarrow && isSidebarOpen && (
        <div
          onClick={onCloseSidebar}
          className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-20"
        />
      )}
      <div
        className={`inset-y-0 left-0 z-30 shrink-0 h-full bg-gray-50 flex-col transition-all duration-300 ease-in-out ${
          isNarrow
            ? "absolute bg-gray-50 shadow-lg border-r border-gray-200"
            : "relative border-r border-gray-200"
        } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} flex overflow-hidden`}
        style={{ width: isNarrow ? "240px" : isSidebarOpen ? "240px" : "0px" }}
      >
        <div className="w-[240px] h-full flex flex-col shrink-0">
          {!hideHeader && (
            <div className="window-header bg-[#f3f3f3]! border-b-[#d1d1d6]! px-4 h-[46px] shrink-0 flex items-center cursor-default">
              <WindowControls target="settings" />
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-3 pt-[5px] pb-4 space-y-4 thin-scrollbar">
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
      </div>
    </>
  );
};

export default SettingsSidebar;
