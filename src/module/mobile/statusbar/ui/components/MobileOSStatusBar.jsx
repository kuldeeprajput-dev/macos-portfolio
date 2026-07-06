import React, { useState, useEffect } from "react";
import useWindowsStore from "@store/window";

const IOSSignalIcon = ({ className = "text-white" }) => (
  <svg width="14" height="9" viewBox="0 0 17 11" fill="none" className={`${className} shrink-0`}>
    <rect x="0.5" y="8" width="2.5" height="3" rx="0.75" fill="currentColor" />
    <rect x="4.5" y="6" width="2.5" height="5" rx="0.75" fill="currentColor" />
    <rect x="8.5" y="3.5" width="2.5" height="7.5" rx="0.75" fill="currentColor" />
    <rect x="12.5" y="0.5" width="2.5" height="10.5" rx="0.75" fill="currentColor" />
  </svg>
);

const IOSWifiIcon = () => (
  <svg
    width="13"
    height="10"
    viewBox="0 0 16 12"
    fill="currentColor"
    className="text-white shrink-0"
  >
    <path d="M8 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3.693-3.693a5.215 5.215 0 0 1 7.386 0 1 1 0 1 0 1.414-1.414 7.215 7.215 0 0 0-10.214 0 1 1 0 1 0 1.414 1.414zm-2.828-2.828a9.212 9.212 0 0 1 13.042 0 1 1 0 1 0 1.415-1.415 11.212 11.212 0 0 0-15.872 0 1 1 0 1 0 1.415 1.415z" />
  </svg>
);

const IOSAirplaneIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-white transform rotate-45 shrink-0"
  >
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const IOSBatteryIcon = ({ level, isCharging, lowPower, showPercentage }) => (
  <div className="flex items-center gap-[3.5px] select-none shrink-0">
    {showPercentage && <span className="text-[10px] font-semibold tracking-tight">{level}%</span>}
    <div className="w-[21px] h-[10.5px] rounded-[2.5px] border border-white/70 p-[1.2px] relative flex items-center bg-transparent">
      <div
        className="h-full rounded-[0.8px] transition-all duration-300"
        style={{
          width: `${level}%`,
          backgroundColor: isCharging
            ? "#30d158"
            : lowPower
              ? "#f59e0b"
              : level <= 20
                ? "#ff453a"
                : "#ffffff",
        }}
      />
      {isCharging && (
        <div className="absolute inset-0 flex items-center justify-center shadow-sm">
          <svg width="4" height="7" viewBox="0 0 6 9" fill="currentColor" className="text-white">
            <path d="M3.5 0L0 5h2.5v4L6 4H3.5V0z" />
          </svg>
        </div>
      )}
      <div className="absolute right-[-2.5px] top-1/2 -translate-y-1/2 w-[1.2px] h-[3px] rounded-r-[0.6px] bg-white/70" />
    </div>
  </div>
);

const MobileOSStatusBar = ({ now, anyWindowOpen, setIsControlOpen, settings }) => {
  const { systemSettings, music } = useWindowsStore();
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.getBattery) {
      navigator.getBattery().then((bat) => {
        const updateBattery = () => {
          setBatteryLevel(Math.round(bat.level * 100));
          setIsCharging(bat.charging);
        };
        updateBattery();
        bat.addEventListener("levelchange", updateBattery);
        bat.addEventListener("chargingchange", updateBattery);
      });
    }
  }, []);

  return (
    <header
      className="absolute top-0 left-0 w-full z-[70] flex justify-between items-center h-[38px] pl-[18px] pr-[18px] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.15)_70%,transparent_100%)] select-none"
      onClick={() => !anyWindowOpen && setIsControlOpen((p) => !p)}
    >
      <time className="text-[11.5px] font-semibold tracking-tight text-white mt-1">
        {now.format("h:mm")}
      </time>
      <div className="flex items-center gap-[6px] text-white mt-1">
        {settings?.airplane ? (
          <IOSAirplaneIcon />
        ) : (
          <>
            <IOSSignalIcon className={settings?.cellular ? "text-white" : "text-white/20"} />
            {settings?.wifi && <IOSWifiIcon />}
          </>
        )}
        <IOSBatteryIcon
          level={batteryLevel}
          isCharging={isCharging}
          lowPower={systemSettings.lowPowerMode === "Always"}
          showPercentage={systemSettings.showBatteryPercentage && !music.isPlaying}
        />
      </div>
    </header>
  );
};

export default MobileOSStatusBar;
