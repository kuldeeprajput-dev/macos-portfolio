import React, { useState } from "react";
import {
  Bell,
  Shield,
  Info,
  Check,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  Volume2,
  Monitor,
  MessageSquare,
} from "lucide-react";
import useWindowsStore from "@store/window";

const SettingsNotificationsSection = () => {
  const { _systemSettings, _updateSystemSetting } = useWindowsStore();

  // Selected app for detailed configuration (null means show main list)
  const [selectedApp, setSelectedApp] = useState(null);

  // App notification configurations
  const [appConfigs, setAppConfigs] = useState({
    Safari: { enabled: true, style: "banners", sound: true, badge: true, lockscreen: true },
    Finder: { enabled: true, style: "none", sound: false, badge: true, lockscreen: false },
    System: { enabled: true, style: "alerts", sound: true, badge: true, lockscreen: true },
    Mail: { enabled: true, style: "banners", sound: true, badge: true, lockscreen: false },
    Telegram: { enabled: false, style: "banners", sound: true, badge: false, lockscreen: false },
    "App Store": { enabled: true, style: "banners", sound: false, badge: true, lockscreen: true },
  });

  const toggleAppSetting = (appName, key) => {
    setAppConfigs((prev) => ({
      ...prev,
      [appName]: {
        ...prev[appName],
        [key]: !prev[appName][key],
      },
    }));
  };

  const setAppStyle = (appName, styleName) => {
    setAppConfigs((prev) => ({
      ...prev,
      [appName]: {
        ...prev[appName],
        style: styleName,
      },
    }));
  };

  const apps = [
    { name: "Safari", icon: "/images/safari.webp", isSvg: false },
    { name: "Finder", icon: "/images/finder.webp", isSvg: false },
    { name: "System", icon: "System", isSvg: true },
    { name: "Mail", icon: "✉️", isEmoji: true },
    { name: "Telegram", icon: "✈️", isEmoji: true },
    { name: "App Store", icon: "🌐", isEmoji: true },
  ];

  if (selectedApp) {
    const config = appConfigs[selectedApp];
    const appData = apps.find((a) => a.name === selectedApp);

    return (
      <div className="max-w-2xl mx-auto p-8 animate-in fade-in slide-in-from-left-2 duration-200">
        {/* Header Navigation */}
        <button
          onClick={() => setSelectedApp(null)}
          className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#007aff] transition-colors focus:outline-none mb-6 p-1 rounded hover:bg-gray-150"
        >
          <ArrowLeft size={13} />
          <span>Back to Notifications</span>
        </button>

        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-150">
          {appData.isSvg ? (
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-lg">
              <Bell size={20} />
            </div>
          ) : appData.isEmoji ? (
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl border border-gray-200">
              {appData.icon}
            </div>
          ) : (
            <img src={appData.icon} className="w-10 h-10 object-contain" alt={selectedApp} />
          )}
          <div>
            <h2 className="text-base font-extrabold text-gray-900 leading-tight">{selectedApp}</h2>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
              Customize alerts and banners for this app
            </p>
          </div>
        </div>

        {/* Toggle Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-[13px] font-bold text-gray-900 block">Allow Notifications</span>
            <span className="text-[11px] text-gray-400 font-semibold">
              Enable alerts from this application
            </span>
          </div>
          <button
            onClick={() => toggleAppSetting(selectedApp, "enabled")}
            className="focus:outline-none"
          >
            {config.enabled ? (
              <ToggleRightActive size={36} className="text-[#007aff] cursor-pointer" />
            ) : (
              <ToggleRightInactive size={36} className="text-gray-300 cursor-pointer" />
            )}
          </button>
        </div>

        {config.enabled && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Visual Notification Style Selector */}
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-3">
                Alert Style
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {/* None Style */}
                <div
                  onClick={() => setAppStyle(selectedApp, "none")}
                  className={`border rounded-xl p-3 flex flex-col items-center justify-between cursor-pointer transition-all ${
                    config.style === "none"
                      ? "border-[#007aff] bg-blue-50/20 ring-1 ring-blue-500"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 shadow-inner">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">None</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-800 mt-2">None</span>
                </div>

                {/* Banners Style */}
                <div
                  onClick={() => setAppStyle(selectedApp, "banners")}
                  className={`border rounded-xl p-3 flex flex-col items-center justify-between cursor-pointer transition-all ${
                    config.style === "banners"
                      ? "border-[#007aff] bg-blue-50/20 ring-1 ring-blue-500"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-full h-16 bg-gray-100 rounded-lg relative border border-gray-200 shadow-inner overflow-hidden flex items-start justify-end p-1.5">
                    {/* Mock Banner */}
                    <div className="w-16 h-5 bg-white border border-gray-300 rounded shadow-md flex items-center gap-1 p-0.5 animate-bounce">
                      <div className="w-1.5 h-1.5 bg-[#007aff] rounded-full" />
                      <div className="w-8 h-1 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-800 mt-2">Banners</span>
                </div>

                {/* Alerts Style */}
                <div
                  onClick={() => setAppStyle(selectedApp, "alerts")}
                  className={`border rounded-xl p-3 flex flex-col items-center justify-between cursor-pointer transition-all ${
                    config.style === "alerts"
                      ? "border-[#007aff] bg-blue-50/20 ring-1 ring-blue-500"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-full h-16 bg-gray-100 rounded-lg relative border border-gray-200 shadow-inner overflow-hidden flex items-start justify-end p-1.5">
                    {/* Mock Alert (stuck banner) */}
                    <div className="w-16 h-7 bg-white border border-[#007aff] rounded shadow-lg flex flex-col justify-between p-0.5">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        <div className="w-8 h-0.5 bg-gray-400 rounded" />
                      </div>
                      <div className="w-12 h-1 bg-[#007aff]/30 rounded self-center" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-800 mt-2">Alerts</span>
                </div>
              </div>
            </div>

            {/* Custom checkboxes / toggles */}
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2">
                Options
              </h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100 text-xs text-gray-700">
                <div className="flex items-center justify-between p-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <Volume2 size={15} className="text-gray-500" />
                    <span className="font-semibold">Play sound for notification</span>
                  </div>
                  <button onClick={() => toggleAppSetting(selectedApp, "sound")}>
                    {config.sound ? (
                      <ToggleRightActive size={32} className="text-[#007aff] cursor-pointer" />
                    ) : (
                      <ToggleRightInactive size={32} className="text-gray-300 cursor-pointer" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare size={15} className="text-gray-500" />
                    <span className="font-semibold">Badge app icon</span>
                  </div>
                  <button onClick={() => toggleAppSetting(selectedApp, "badge")}>
                    {config.badge ? (
                      <ToggleRightActive size={32} className="text-[#007aff] cursor-pointer" />
                    ) : (
                      <ToggleRightInactive size={32} className="text-gray-300 cursor-pointer" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <Monitor size={15} className="text-gray-500" />
                    <span className="font-semibold">Show on Lock Screen</span>
                  </div>
                  <button onClick={() => toggleAppSetting(selectedApp, "lockscreen")}>
                    {config.lockscreen ? (
                      <ToggleRightActive size={32} className="text-[#007aff] cursor-pointer" />
                    ) : (
                      <ToggleRightInactive size={32} className="text-gray-300 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Global Config Panel */}
      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2">
        Global Settings
      </h3>
      <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm p-4 mb-6 text-xs text-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-[#007aff]" />
            <span className="font-semibold">Show Previews</span>
          </div>
          <select
            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-2.5 py-1 text-gray-700 font-semibold focus:outline-none"
            defaultValue="always"
          >
            <option value="always">Always</option>
            <option value="unlocked">When Unlocked</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2">
        Notification Style
      </h3>
      <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
        {apps.map((app) => {
          const config = appConfigs[app.name];
          let subText = "Off";
          if (config.enabled) {
            const parts = [];
            if (config.style !== "none")
              parts.push(config.style.charAt(0).toUpperCase() + config.style.slice(1));
            if (config.sound) parts.push("Sounds");
            if (config.badge) parts.push("Badges");
            subText = parts.length > 0 ? parts.join(", ") : "None";
          }

          return (
            <div
              key={app.name}
              onClick={() => setSelectedApp(app.name)}
              className="flex items-center justify-between p-3.5 px-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                {app.isSvg ? (
                  <div className="w-6 h-6 bg-green-500 rounded text-white flex items-center justify-center">
                    <Bell size={12} />
                  </div>
                ) : app.isEmoji ? (
                  <div className="w-6 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs">
                    {app.icon}
                  </div>
                ) : (
                  <img src={app.icon} className="w-6 h-6 object-contain" alt={app.name} />
                )}
                <span className="text-[13px] font-bold text-gray-900">{app.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <span className="text-[12px] font-medium text-gray-500">{subText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ToggleRightActive = () => (
  <div className="w-10 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer bg-[#007aff]">
    <span className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-md transition-all left-[18px]" />
  </div>
);

const ToggleRightInactive = () => (
  <div className="w-10 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer bg-gray-300">
    <span className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-md transition-all left-0.5" />
  </div>
);

export default SettingsNotificationsSection;
