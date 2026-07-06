import React, { useEffect, useState } from "react";
import { Bell, ChevronRight, ArrowLeft } from "lucide-react";

const Toggle = ({ active, onChange }) => (
  <button
    onClick={() => onChange(!active)}
    className={`w-10 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer focus:outline-none ${active ? "bg-blue-500" : "bg-zinc-200"}`}
  >
    <span
      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-md transition-all ${active ? "left-[18px]" : "left-0.5"}`}
    />
  </button>
);

const SettingsNotificationsSection = ({ isActive = true }) => {
  const [displayStyle, setDisplayStyle] = useState("stack"); // 'count' | 'stack' | 'list'
  const [showPreviews, setShowPreviews] = useState("unlocked"); // 'always' | 'unlocked' | 'never'
  const [scheduledSummary, setScheduledSummary] = useState(false);
  const [sharePlayNotifications, setSharePlayNotifications] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [forwardApp, setForwardApp] = useState(null);

  // App notification configurations
  const [appConfigs, setAppConfigs] = useState({
    safari: {
      name: "Safari",
      icon: "/images/safari.webp",
      isSvg: false,
      allow: true,
      lockScreen: true,
      notificationCenter: true,
      banners: true,
      badge: true,
      sound: true,
    },
    finder: {
      name: "Finder",
      icon: "/images/finder.webp",
      isSvg: false,
      allow: true,
      lockScreen: false,
      notificationCenter: true,
      banners: true,
      badge: true,
      sound: false,
    },
    music: {
      name: "Music",
      icon: null,
      isSvg: true,
      allow: true,
      lockScreen: true,
      notificationCenter: true,
      banners: false,
      badge: true,
      sound: true,
    },
  });

  const toggleAppAlert = (appId, field) => {
    setAppConfigs((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        [field]: !prev[appId][field],
      },
    }));
  };

  const openAppNotifications = (appId) => {
    setSelectedApp(appId);
    setForwardApp(null);
  };

  const closeAppNotifications = () => {
    setForwardApp(selectedApp);
    setSelectedApp(null);
  };

  useEffect(() => {
    const handleNavBack = (e) => {
      if (!isActive) return;
      if (e.detail?.app === "settings" && selectedApp) {
        e.preventDefault();
        setForwardApp(selectedApp);
        setSelectedApp(null);
      }
    };
    const handleNavForward = (e) => {
      if (!isActive) return;
      if (e.detail?.app === "settings" && !selectedApp && forwardApp) {
        e.preventDefault();
        setSelectedApp(forwardApp);
        setForwardApp(null);
      }
    };
    window.addEventListener("app-navigate-back", handleNavBack, true);
    window.addEventListener("app-navigate-forward", handleNavForward, true);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack, true);
      window.removeEventListener("app-navigate-forward", handleNavForward, true);
    };
  }, [forwardApp, isActive, selectedApp]);

  if (selectedApp) {
    const config = appConfigs[selectedApp];
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 animate-in slide-in-from-right-3 duration-250 select-none text-zinc-900 bg-[#f2f2f7] min-h-dvh">
        {/* Navigation Header */}
        <button
          onClick={closeAppNotifications}
          className="flex items-center gap-1 text-[12px] font-bold text-black hover:opacity-75 transition-opacity focus:outline-none mb-5"
        >
          <ArrowLeft size={13} strokeWidth={2.5} />
          <span>Notifications</span>
        </button>

        {/* App Title Header */}
        <div className="flex items-center gap-3.5 mb-6 pl-2">
          {config.isSvg ? (
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-lg shrink-0 shadow-sm">
              🎵
            </div>
          ) : (
            <img
              src={config.icon}
              className="w-10 h-10 object-contain shrink-0"
              alt={config.name}
            />
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{config.name}</h2>
            <p className="text-[11.5px] text-gray-500 font-medium">Notification Settings</p>
          </div>
        </div>

        {/* Allow Notifications Cell Group */}
        <div className="w-full bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm mb-5">
          <div className="flex items-center justify-between p-3.5 px-4">
            <span className="text-[14px] font-bold text-zinc-800">Allow Notifications</span>
            <Toggle active={config.allow} onChange={() => toggleAppAlert(selectedApp, "allow")} />
          </div>
        </div>

        {config.allow && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* ALERTS SECTION */}
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-3 mb-2">
                Alerts
              </h3>
              <div className="grid grid-cols-3 gap-3.5 px-1">
                {/* Lock Screen Alert Card */}
                <button
                  onClick={() => toggleAppAlert(selectedApp, "lockScreen")}
                  className="flex flex-col items-center gap-2 focus:outline-none"
                >
                  <div
                    className={`w-full aspect-[2/3] rounded-xl border-2 flex flex-col items-center justify-between p-2.5 relative transition-all bg-zinc-50 ${config.lockScreen ? "border-blue-500 bg-blue-50/10" : "border-gray-200"}`}
                  >
                    <div className="w-5 h-1 bg-zinc-400 rounded-full mb-2" />
                    <div className="w-full flex-1 flex flex-col gap-1 justify-center">
                      <div className="w-full h-2.5 bg-blue-500/20 border border-blue-500/10 rounded-sm" />
                      <div className="w-3/4 h-1.5 bg-zinc-300 rounded-sm" />
                    </div>
                    <div className="w-5 h-5 rounded-full border border-zinc-200 flex items-center justify-center">
                      <div
                        className={`w-3 h-3 rounded-full ${config.lockScreen ? "bg-blue-500" : "bg-transparent"}`}
                      />
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-gray-600">Lock Screen</span>
                </button>

                {/* Notification Center Alert Card */}
                <button
                  onClick={() => toggleAppAlert(selectedApp, "notificationCenter")}
                  className="flex flex-col items-center gap-2 focus:outline-none"
                >
                  <div
                    className={`w-full aspect-[2/3] rounded-xl border-2 flex flex-col items-center justify-between p-2.5 relative transition-all bg-zinc-50 ${config.notificationCenter ? "border-blue-500 bg-blue-50/10" : "border-gray-200"}`}
                  >
                    <div className="w-full flex-1 flex flex-col gap-1 justify-start pt-2">
                      <div className="w-full h-2.5 bg-zinc-400/20 border border-zinc-400/10 rounded-sm" />
                      <div className="w-full h-2.5 bg-zinc-400/20 border border-zinc-400/10 rounded-sm" />
                    </div>
                    <div className="w-5 h-5 rounded-full border border-zinc-200 flex items-center justify-center">
                      <div
                        className={`w-3 h-3 rounded-full ${config.notificationCenter ? "bg-blue-500" : "bg-transparent"}`}
                      />
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-gray-600">Notification Center</span>
                </button>

                {/* Banners Alert Card */}
                <button
                  onClick={() => toggleAppAlert(selectedApp, "banners")}
                  className="flex flex-col items-center gap-2 focus:outline-none"
                >
                  <div
                    className={`w-full aspect-[2/3] rounded-xl border-2 flex flex-col items-center justify-between p-2.5 relative transition-all bg-zinc-50 ${config.banners ? "border-blue-500 bg-blue-50/10" : "border-gray-200"}`}
                  >
                    <div className="w-full h-2.5 bg-blue-500/20 border border-blue-500/10 rounded-sm" />
                    <div className="flex-1" />
                    <div className="w-5 h-5 rounded-full border border-zinc-200 flex items-center justify-center">
                      <div
                        className={`w-3 h-3 rounded-full ${config.banners ? "bg-blue-500" : "bg-transparent"}`}
                      />
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-gray-600">Banners</span>
                </button>
              </div>
            </div>

            {/* OPTIONS SECTION */}
            <div className="w-full bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm divide-y divide-gray-100">
              <div className="flex items-center justify-between p-3.5 px-4">
                <span className="text-[13.5px] font-bold text-zinc-800">Sounds</span>
                <Toggle
                  active={config.sound}
                  onChange={() => toggleAppAlert(selectedApp, "sound")}
                />
              </div>
              <div className="flex items-center justify-between p-3.5 px-4">
                <span className="text-[13.5px] font-bold text-zinc-800">Badges</span>
                <Toggle
                  active={config.badge}
                  onChange={() => toggleAppAlert(selectedApp, "badge")}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-2 duration-300 select-none text-zinc-900 bg-[#f2f2f7] min-h-dvh">
      {/* Title */}
      <h2 className="text-lg font-bold text-zinc-800 mb-5 pl-1">Notifications</h2>

      {/* DISPLAY AS LOCKSCREEN IMAGES */}
      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-3 mb-2">
        Display As
      </h3>
      <div className="w-full bg-white rounded-xl border border-gray-150 p-4 shadow-sm mb-6 flex justify-around items-center">
        {/* Count Style */}
        <button
          onClick={() => setDisplayStyle("count")}
          className="flex flex-col items-center gap-1.5 focus:outline-none group"
        >
          <div
            className={`w-14 h-20 rounded-lg border-2 flex flex-col justify-end p-1 transition-all ${displayStyle === "count" ? "border-blue-500 bg-blue-50/5" : "border-gray-200 bg-zinc-50"}`}
          >
            <div className="w-full text-[8px] bg-blue-500 text-white rounded-sm text-center py-0.5 font-bold">
              1 Notification
            </div>
          </div>
          <span
            className={`text-[10px] font-bold ${displayStyle === "count" ? "text-blue-500" : "text-gray-500"}`}
          >
            Count
          </span>
        </button>

        {/* Stack Style */}
        <button
          onClick={() => setDisplayStyle("stack")}
          className="flex flex-col items-center gap-1.5 focus:outline-none group"
        >
          <div
            className={`w-14 h-20 rounded-lg border-2 flex flex-col justify-end gap-0.5 p-1 transition-all relative ${displayStyle === "stack" ? "border-blue-500 bg-blue-50/5" : "border-gray-200 bg-zinc-50"}`}
          >
            <div className="w-5/6 mx-auto h-1.5 bg-zinc-300 rounded-sm opacity-50" />
            <div className="w-11/12 mx-auto h-2 bg-zinc-400 rounded-sm opacity-70" />
            <div className="w-full h-3 bg-zinc-500 rounded-sm" />
          </div>
          <span
            className={`text-[10px] font-bold ${displayStyle === "stack" ? "text-blue-500" : "text-gray-500"}`}
          >
            Stack
          </span>
        </button>

        {/* List Style */}
        <button
          onClick={() => setDisplayStyle("list")}
          className="flex flex-col items-center gap-1.5 focus:outline-none group"
        >
          <div
            className={`w-14 h-20 rounded-lg border-2 flex flex-col justify-start gap-1.5 p-1.5 transition-all ${displayStyle === "list" ? "border-blue-500 bg-blue-50/5" : "border-gray-200 bg-zinc-50"}`}
          >
            <div className="w-full h-2 bg-zinc-400 rounded-sm" />
            <div className="w-full h-2 bg-zinc-400 rounded-sm" />
            <div className="w-full h-2 bg-zinc-400 rounded-sm" />
          </div>
          <span
            className={`text-[10px] font-bold ${displayStyle === "list" ? "text-blue-500" : "text-gray-500"}`}
          >
            List
          </span>
        </button>
      </div>

      {/* OPTIONS GROUP */}
      <div className="w-full bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm mb-6 divide-y divide-gray-100">
        {/* Scheduled Summary */}
        <div className="flex items-center justify-between p-3.5 px-4">
          <div>
            <span className="text-[13.5px] font-bold text-zinc-800 block">Scheduled Summary</span>
            <span className="text-[10.5px] text-gray-400 font-semibold mt-0.5 block">
              Bundle notifications at scheduled times
            </span>
          </div>
          <Toggle active={scheduledSummary} onChange={setScheduledSummary} />
        </div>

        {/* Previews Dropdown */}
        <div className="flex items-center justify-between p-3.5 px-4">
          <span className="text-[13.5px] font-bold text-zinc-800">Show Previews</span>
          <select
            value={showPreviews}
            onChange={(e) => setShowPreviews(e.target.value)}
            className="bg-transparent text-[12.5px] text-zinc-500 font-bold focus:outline-none cursor-pointer"
          >
            <option value="always">Always</option>
            <option value="unlocked">When Unlocked</option>
            <option value="never">Never</option>
          </select>
        </div>

        {/* SharePlay Notifications */}
        <div className="flex items-center justify-between p-3.5 px-4">
          <div>
            <span className="text-[13.5px] font-bold text-zinc-800 block">
              SharePlay Screen Sharing
            </span>
            <span className="text-[10.5px] text-gray-400 font-semibold mt-0.5 block">
              Allow notifications when screen mirroring
            </span>
          </div>
          <Toggle active={sharePlayNotifications} onChange={setSharePlayNotifications} />
        </div>
      </div>

      {/* NOTIFICATION STYLES LIST (APP STYLES) */}
      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-3 mb-2">
        Notification Style
      </h3>
      <div className="w-full bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm divide-y divide-gray-100">
        {Object.entries(appConfigs).map(([key, value]) => (
          <div
            key={key}
            onClick={() => openAppNotifications(key)}
            className="flex items-center justify-between p-3 px-4 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {value.isSvg ? (
                <div className="w-7 h-7 bg-gradient-to-tr from-pink-500 to-red-500 rounded-lg flex items-center justify-center text-white text-xs shrink-0">
                  🎵
                </div>
              ) : (
                <img
                  src={value.icon}
                  className="w-7 h-7 object-contain shrink-0"
                  alt={value.name}
                />
              )}
              <span className="text-[13.5px] font-bold text-zinc-800">{value.name}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <span className="text-[12px] font-bold text-zinc-400">
                {value.allow ? "Banners, Sounds, Badges" : "Off"}
              </span>
              <ChevronRight size={14} className="mt-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsNotificationsSection;
