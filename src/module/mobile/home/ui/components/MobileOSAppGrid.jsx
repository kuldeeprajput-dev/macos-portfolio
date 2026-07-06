import { useState, useRef, useEffect } from "react";
import {
  Search,
  Smartphone,
  Watch,
  Headphones,
  Laptop,
  Wind,
  Droplets,
  Sun,
  Calendar,
  CheckCircle2,
  Mic,
} from "lucide-react";
import useWeather from "@module/desktop/apps/weather/hooks/useWeather";
import OptimizedImage from "@module/shared/ui/components/OptimizedImage";
import { dockApps as allDockApps } from "@constants";
import useTimeStore from "@store/time";

// --- WIDGET COMPONENTS ---

const RealtimeBatteryWidget = ({ onClick }) => {
  const [level, setLevel] = useState(88);
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    let batteryObj;

    const handleLevelChange = () => {
      if (batteryObj) {
        setLevel(Math.round(batteryObj.level * 100));
        setCharging(batteryObj.charging);
      }
    };

    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => {
        batteryObj = battery;
        handleLevelChange();
        battery.addEventListener("levelchange", handleLevelChange);
        battery.addEventListener("chargingchange", handleLevelChange);
      });
    }

    return () => {
      if (batteryObj) {
        batteryObj.removeEventListener("levelchange", handleLevelChange);
        batteryObj.removeEventListener("chargingchange", handleLevelChange);
      }
    };
  }, []);

  const color = charging || level > 20 ? "#30d158" : "#ff3b30";
  const offset = 2 * Math.PI * 13.5 * (1 - level / 100);

  return (
    <div
      onClick={onClick}
      className="bg-black/25 backdrop-blur-3xl rounded-[22px] p-[1.5vh] flex flex-col justify-between shadow-[inset_0_0_30px_rgba(255,255,255,0.05),0_6px_20px_rgba(0,0,0,0.15)] border border-white/10 text-white relative overflow-hidden cursor-pointer active:scale-[0.96] transition-transform duration-200 select-none"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <span className="text-[1vh] font-bold text-white/50 tracking-wider uppercase relative z-10">
        Batteries
      </span>
      <div className="grid grid-cols-2 gap-y-[1vh] gap-x-1.5 my-auto relative z-10">
        <div className="flex items-center gap-1.5 pl-0.5 min-w-0">
          <div className="relative w-[4vh] h-[4vh] flex items-center justify-center flex-shrink-0">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="13.5"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="16"
                cy="16"
                r="13.5"
                stroke={color}
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 13.5}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 3px ${color})` }}
              />
            </svg>
            <Smartphone className="text-white/80 w-[1.5vh] h-[1.5vh]" />
          </div>
          <div className="min-w-0">
            <p className="text-[1.2vh] font-bold leading-none text-white">{level}%</p>
            <p className="text-[0.9vh] text-white/50 font-medium truncate mt-0.5">
              {charging ? "Charging" : "iPhone"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 min-w-0">
          <div className="relative w-[4vh] h-[4vh] flex items-center justify-center flex-shrink-0">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="13.5"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="16"
                cy="16"
                r="13.5"
                stroke="#30d158"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 13.5}
                strokeDashoffset={2 * Math.PI * 13.5 * (1 - 0.94)}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 3px #30d158)` }}
              />
            </svg>
            <Watch className="text-white/80 w-[1.5vh] h-[1.5vh]" />
          </div>
          <div className="min-w-0">
            <p className="text-[1.2vh] font-bold leading-none text-white">94%</p>
            <p className="text-[0.9vh] text-white/50 font-medium truncate mt-0.5">Watch</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pl-0.5 min-w-0">
          <div className="relative w-[4vh] h-[4vh] flex items-center justify-center flex-shrink-0">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="13.5"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="16"
                cy="16"
                r="13.5"
                stroke="#30d158"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 13.5}
                strokeDashoffset={2 * Math.PI * 13.5 * (1 - 1.0)}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 3px #30d158)` }}
              />
            </svg>
            <Headphones className="text-white/80 w-[1.5vh] h-[1.5vh]" />
          </div>
          <div className="min-w-0">
            <p className="text-[1.2vh] font-bold leading-none text-white">100%</p>
            <p className="text-[0.9vh] text-white/50 font-medium truncate mt-0.5">AirPods</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 min-w-0">
          <div className="relative w-[4vh] h-[4vh] flex items-center justify-center flex-shrink-0">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="13.5"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="16"
                cy="16"
                r="13.5"
                stroke="#ff9500"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 13.5}
                strokeDashoffset={2 * Math.PI * 13.5 * (1 - 0.65)}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 3px #ff9500)` }}
              />
            </svg>
            <Laptop className="text-white/80 w-[1.5vh] h-[1.5vh]" />
          </div>
          <div className="min-w-0">
            <p className="text-[1.2vh] font-bold leading-none text-white">65%</p>
            <p className="text-[0.9vh] text-white/50 font-medium truncate mt-0.5">MacBook</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LockScreenTimeWidget = () => {
  const time = useTimeStore((state) => state.time);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[time.getDay()];
  const monthName = months[time.getMonth()];
  const dateNum = time.getDate();

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center text-white w-full shrink pt-[4vh]">
      <h3 className="text-[1.8vh] font-medium tracking-wide drop-shadow-md leading-tight">
        {dayName}, {monthName} {dateNum}
      </h3>
      <h1 className="text-[9.5vh] font-bold tracking-tight leading-none drop-shadow-lg -mt-[0.8vh]">
        {hours}:{minutes}
      </h1>
    </div>
  );
};

// --- END WIDGET COMPONENTS ---

const scaleMap = {
  finder: "scale-[0.90]",
  launchpad: "scale-[0.90]",
  safari: "scale-[0.90]",
  photos: "scale-[0.90]",
  contact: "scale-[0.90]",
  terminal: "scale-[0.90]",
  settings: "scale-[0.83]",
  calculator: "scale-[0.83]",
  notes: "scale-[0.90]",
  messages: "scale-[0.90]",
  appletv: "scale-[0.80]",
  call: "scale-[0.71]",
  appstore: "scale-[0.90]",
  calendar: "scale-[0.76]",
  weather: "scale-[0.79]",
  vscode: "scale-[0.95]",
  postman: "scale-[0.95]",
  map: "scale-[0.73]",
  font: "scale-[1.6]",
  telegram: "scale-[0.90]",
  music: "scale-[0.90]",
  folder: "scale-[0.80]",
  trash: "scale-[0.80]",
};

const MobileOSAppGrid = ({ dockApps, openWindow }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const { activeCity } = useWeather();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPage === 0) {
      setCurrentPage(1);
    } else if (isRightSwipe && currentPage === 1) {
      setCurrentPage(0);
    }
    touchStart.current = 0;
    touchEnd.current = 0;
  };

  // Partition apps explicitly based on user preference
  const page1Ids = ["finder", "photos", "contact", "terminal"];
  const page1Apps = page1Ids.map((id) => dockApps.find((app) => app.id === id)).filter(Boolean);
  const page2Apps = dockApps.filter((app) => !page1Ids.includes(app.id));

  // Weather styling helper based on condition
  const getWeatherConditionEmoji = (cond) => {
    const c = cond.toLowerCase();
    if (c.includes("rain") || c.includes("drizzle") || c.includes("shower")) return "🌧️";
    if (c.includes("cloud") || c.includes("overcast")) return "☁️";
    if (c.includes("snow") || c.includes("ice") || c.includes("flurry")) return "❄️";
    if (c.includes("thunder") || c.includes("storm")) return "⛈️";
    if (c.includes("wind") || c.includes("breeze")) return "💨";
    if (c.includes("fog") || c.includes("mist") || c.includes("haze")) return "🌫️";
    return "☀️";
  };

  return (
    <section
      className="absolute inset-0 pt-[68px] pb-[125px] flex flex-col justify-between overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Container */}
      <div
        className="flex-1 flex transition-transform duration-350 ease-out"
        style={{ transform: `translateX(-${currentPage * 100}%)` }}
      >
        {/* PAGE 1: Widgets and Apps */}
        <div className="w-full flex-shrink-0 px-5 flex flex-col justify-between h-full pb-[2vh]">
          <LockScreenTimeWidget />

          <div className="flex flex-col justify-end mt-auto min-h-0 shrink w-full">
            {/* Enhanced Widgets Container */}
            <div className="flex flex-col gap-[1.5vh] min-h-0 shrink">
              {/* Top row widgets (2x2 each) */}
              <div className="grid grid-cols-2 gap-[1.5vh] mt-[0.5vh] min-h-0 shrink">
                {/* iOS 18 Liquid Glass Weather Widget */}
                <div
                  onClick={() => openWindow("weather")}
                  className="bg-black/20 backdrop-blur-3xl rounded-[22px] p-3 flex flex-col justify-between shadow-[inset_0_0_30px_rgba(58,134,245,0.15),0_6px_20px_rgba(0,0,0,0.15)] border border-white/10 text-white relative overflow-hidden cursor-pointer active:scale-[0.96] transition-transform duration-200 select-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-[11px] font-bold tracking-tight opacity-90">
                        {activeCity.name}
                      </p>
                      <h3 className="text-3xl font-light tracking-tighter mt-1 leading-none">
                        {activeCity.tempC}°
                      </h3>
                    </div>
                    <div className="bg-white/12 p-1 rounded-full backdrop-blur-md">
                      <span className="text-[16px] leading-none">
                        {getWeatherConditionEmoji(activeCity.condition)}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <p className="text-[10px] font-semibold tracking-wide">
                      {activeCity.condition}
                    </p>
                    <p className="text-[8.5px] text-white/70 mt-0.5">
                      H: {activeCity.highC}° L: {activeCity.lowC}°
                    </p>

                    {/* Weather Stats Grid */}
                    <div className="grid grid-cols-2 gap-x-1 gap-y-1 mt-1.5 pt-1.5 border-t border-white/10 text-[8px] text-white/80 font-medium">
                      <div className="flex items-center gap-1">
                        <Wind size={8} className="opacity-75" />
                        <span>{activeCity.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets size={8} className="opacity-75" />
                        <span>{activeCity.humidity}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <RealtimeBatteryWidget onClick={() => openWindow("settings", { tab: "Battery" })} />
              </div>

              {/* iOS 18 Liquid Glass Calendar & Reminders Stack Widget */}
              <div
                onClick={() => openWindow("calendar")}
                className="w-full bg-black/25 backdrop-blur-3xl border border-white/10 rounded-[22px] p-3 flex shadow-[inset_0_0_30px_rgba(255,255,255,0.05),0_6px_20px_rgba(0,0,0,0.15)] text-white gap-3 items-center relative overflow-hidden cursor-pointer active:scale-[0.96] transition-transform duration-200 select-none"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                {/* Date Card (Left Side) */}
                <div className="w-[30%] border-r border-white/10 pr-2.5 flex flex-col items-center justify-center text-center relative z-10">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider drop-shadow-md">
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()]}
                  </span>
                  <span className="text-3xl font-bold leading-none mt-0.5 tracking-tight text-white drop-shadow-lg">
                    {new Date().getDate()}
                  </span>
                </div>

                {/* Upcoming Event / Reminders (Right Side) */}
                <div className="flex-1 flex flex-col justify-center min-w-0 pl-0.5 relative z-10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Calendar size={11} className="text-white/50" />
                    <span className="text-[9px] font-bold text-white/50 tracking-wide uppercase">
                      Up Next
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-7 rounded-full bg-blue-400 mt-0.5 flex-shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white leading-tight truncate">
                        Portfolio Presentation
                      </p>
                      <p className="text-[9px] text-white/60 mt-0.5">2:30 PM - 3:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-4 gap-y-[2.5vh] gap-x-2.5 mt-[3vh] shrink-0">
              {page1Apps.map((app) => (
                <button
                  key={app.id}
                  disabled={!app.canOpen}
                  onClick={() => app.canOpen && openWindow(app.id)}
                  className="flex flex-col items-center gap-[5px] active:scale-[0.85] transition-transform duration-150"
                >
                  <div
                    className="overflow-hidden w-[56px] h-[56px] xs:w-[60px] xs:h-[60px] rounded-[16px] shadow-[0_3px_10px_rgba(0,0,0,0.22),0_0_0_0.5px_rgba(255,255,255,0.12)]"
                    style={{
                      opacity: app.canOpen ? 1 : 0.4,
                      background: app.canOpen ? "transparent" : "rgba(255,255,255,0.1)",
                    }}
                  >
                    {app.id === "calendar" ? (
                      <div
                        className={`w-full h-full bg-white flex flex-col items-center select-none rounded-[16px] overflow-hidden ${scaleMap[app.id] || ""}`}
                      >
                        {/* Top Day Header Area with Red Background */}
                        <div className="w-full bg-[#ff3b30] py-1 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[8px] font-bold uppercase tracking-wide leading-none">
                            {
                              [
                                "Sunday",
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                              ][new Date().getDay()]
                            }
                          </span>
                        </div>
                        {/* Bottom Date Area */}
                        <div className="flex-1 flex items-center justify-center -mt-0.5">
                          <span className="text-gray-900 font-semibold text-[22px] leading-none font-sans">
                            {new Date().getDate()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <OptimizedImage
                        src={`/images/${app.icon}`}
                        alt={app.name}
                        width={64}
                        height={64}
                        className={`w-full h-full object-cover rounded-[16px] pointer-events-none ${scaleMap[app.id] || ""}`}
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-center text-white leading-tight max-w-[68px] drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PAGE 2: Secondary App Grid (Top-aligned) */}
        <div className="w-full flex-shrink-0 px-5 flex flex-col justify-start h-full pb-4">
          <div className="grid grid-cols-4 gap-y-5 gap-x-2.5">
            {page2Apps.map((app) => (
              <button
                key={app.id}
                disabled={!app.canOpen}
                onClick={() => app.canOpen && openWindow(app.id)}
                className="flex flex-col items-center gap-[5px] active:scale-[0.85] transition-transform duration-150"
              >
                <div
                  className="overflow-hidden w-[56px] h-[56px] xs:w-[60px] xs:h-[60px] rounded-[16px] shadow-[0_3px_10px_rgba(0,0,0,0.22),0_0_0_0.5px_rgba(255,255,255,0.12)]"
                  style={{
                    opacity: app.canOpen ? 1 : 0.4,
                    background: app.canOpen ? "transparent" : "rgba(255,255,255,0.1)",
                  }}
                >
                  {app.id === "calendar" ? (
                    <div
                      className={`w-full h-full bg-white flex flex-col items-center select-none rounded-[16px] overflow-hidden ${scaleMap[app.id] || ""}`}
                    >
                      {/* Top Day Header Area with Red Background */}
                      <div className="w-full bg-[#ff3b30] py-1 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[8px] font-bold uppercase tracking-wide leading-none">
                          {
                            [
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                            ][new Date().getDay()]
                          }
                        </span>
                      </div>
                      {/* Bottom Date Area */}
                      <div className="flex-1 flex items-center justify-center -mt-0.5">
                        <span className="text-gray-900 font-semibold text-[22px] leading-none font-sans">
                          {new Date().getDate()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <OptimizedImage
                      src={`/images/${app.icon}`}
                      alt={app.name}
                      width={64}
                      height={64}
                      className={`w-full h-full object-cover rounded-[16px] pointer-events-none ${scaleMap[app.id] || ""}`}
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium text-center text-white leading-tight max-w-[68px] drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Dot / iOS Search Indicator Bar */}
      <div className="flex flex-col items-center gap-2 mb-1 select-none w-full">
        {/* Page dots indicator */}
        <div className="flex justify-center gap-1.5">
          {[0, 1].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className="h-1.5 rounded-full transition-all duration-200"
              style={{
                width: idx === currentPage ? 14 : 6,
                background: idx === currentPage ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        {/* iOS 16/17/18 style home screen Search Pill */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-center gap-1.5 px-[14px] h-[28px] rounded-full bg-white/12 hover:bg-white/18 active:scale-95 transition-all text-white/95 text-[11.5px] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.15)] border border-white/10 backdrop-blur-md"
        >
          <Search size={11.5} strokeWidth={2.8} className="text-white/85" />
          <span className="tracking-tight">Search</span>
        </button>
      </div>

      {/* Spotlight Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-[#0d0d0e]/60 backdrop-blur-[45px] backdrop-saturate-[1.6] z-50 flex flex-col pt-[55px] px-5 transition-all duration-300">
          {/* Search Header Input row */}
          <div className="flex items-center gap-3 w-full mb-6">
            <div className="flex-grow flex items-center gap-2 px-3.5 h-[42px] rounded-[14px] bg-white/[0.08] border border-white/[0.08] backdrop-blur-md shadow-inner text-white focus-within:border-white/20 focus-within:bg-white/[0.12] transition-all font-sans">
              <Search size={16} className="text-white/40" />
              <input
                type="text"
                autoFocus
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[15px] placeholder-white/35 text-white font-medium"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="w-5 h-5 rounded-full bg-white/12 flex items-center justify-center text-[10px] text-white/85 active:bg-white/20"
                >
                  ✕
                </button>
              ) : (
                <Mic size={15} className="text-white/40" />
              )}
            </div>
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="text-[16px] font-semibold text-[#007aff] hover:text-[#3399ff] transition-colors duration-150 pr-1 active:opacity-70 font-sans"
            >
              Cancel
            </button>
          </div>

          {/* Search Results / Suggestions Area */}
          <div className="flex-1 overflow-y-auto pb-6 scrollbar-none">
            {searchQuery.trim() === "" ? (
              // Suggestions View
              <div>
                <p className="text-[11px] font-bold text-white/40 tracking-wider mb-2.5 px-1 uppercase font-sans">
                  Siri Suggestions
                </p>
                <div className="bg-[#1c1c1e]/70 backdrop-blur-md border border-white/[0.06] rounded-[22px] p-4.5 shadow-lg grid grid-cols-4 gap-y-5 gap-x-2.5">
                  {/* Show top 8 commonly used apps */}
                  {allDockApps
                    .filter(
                      (app) =>
                        app.id !== "launchpad" &&
                        app.id !== "trash" &&
                        app.id !== "vscode" &&
                        app.id !== "postman",
                    )
                    .slice(0, 8)
                    .map((app) => (
                      <button
                        key={app.id}
                        onClick={() => {
                          if (app.canOpen) {
                            openWindow(app.id);
                            setIsSearchOpen(false);
                          }
                        }}
                        className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
                      >
                        <div className="w-12 h-12 rounded-[12px] overflow-hidden shadow-md bg-white/5 flex items-center justify-center">
                          {app.id === "calendar" ? (
                            <div className="w-full h-full bg-white flex flex-col items-center select-none rounded-[12px] overflow-hidden scale-[0.76]">
                              <div className="w-full bg-[#ff3b30] py-0.5 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-[7px] font-bold uppercase leading-none font-sans">
                                  {
                                    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                                      new Date().getDay()
                                    ]
                                  }
                                </span>
                              </div>
                              <div className="flex-1 flex items-center justify-center -mt-0.5">
                                <span className="text-gray-900 font-semibold text-[16px] leading-none font-sans">
                                  {new Date().getDate()}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <OptimizedImage
                              src={`/images/${app.icon}`}
                              alt={app.name}
                              width={48}
                              height={48}
                              className={`w-full h-full object-cover rounded-[12px] ${scaleMap[app.id] || ""}`}
                            />
                          )}
                        </div>
                        <span className="text-[10.5px] text-white/70 text-center truncate w-full px-1 font-medium font-sans">
                          {app.name}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              // Search Results List
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-bold text-white/40 tracking-wider mb-1.5 px-1 uppercase font-sans">
                  Top Hits
                </p>
                {/* Search in all launchable apps */}
                <div className="bg-[#1c1c1e]/70 backdrop-blur-md border border-white/[0.06] rounded-[22px] overflow-hidden divide-y divide-white/[0.06] shadow-lg">
                  {allDockApps
                    .filter(
                      (app) =>
                        app.id !== "launchpad" &&
                        app.id !== "trash" &&
                        app.id !== "vscode" &&
                        app.id !== "postman" &&
                        (app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.id.toLowerCase().includes(searchQuery.toLowerCase())),
                    )
                    .map((app) => (
                      <button
                        key={app.id}
                        onClick={() => {
                          if (app.canOpen) {
                            openWindow(app.id);
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }
                        }}
                        className="flex items-center gap-3.5 px-4 py-3 hover:bg-white/[0.06] active:bg-white/[0.1] transition-all text-left w-full"
                      >
                        <div className="w-10 h-10 rounded-[10px] overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                          {app.id === "calendar" ? (
                            <div className="w-full h-full bg-white flex flex-col items-center select-none rounded-[10px] overflow-hidden scale-[0.76]">
                              <div className="w-full bg-[#ff3b30] py-0.5 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-[7px] font-bold uppercase leading-none font-sans">
                                  {
                                    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                                      new Date().getDay()
                                    ]
                                  }
                                </span>
                              </div>
                              <div className="flex-1 flex items-center justify-center -mt-0.5">
                                <span className="text-gray-900 font-semibold text-[16px] leading-none font-sans">
                                  {new Date().getDate()}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <OptimizedImage
                              src={`/images/${app.icon}`}
                              alt={app.name}
                              width={40}
                              height={40}
                              className={`w-full h-full object-cover rounded-[10px] ${scaleMap[app.id] || ""}`}
                            />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="text-[15px] font-semibold text-white leading-tight font-sans">
                            {app.name}
                          </p>
                          <p className="text-[10.5px] text-white/40 mt-0.5 font-medium font-sans">
                            {app.canOpen ? "Open App" : "Locked"}
                          </p>
                        </div>
                        <span className="text-white/20 text-[14px] pr-1">➔</span>
                      </button>
                    ))}
                </div>
                {/* If no matches found */}
                {allDockApps.filter(
                  (app) =>
                    app.id !== "launchpad" &&
                    app.id !== "trash" &&
                    app.id !== "vscode" &&
                    app.id !== "postman" &&
                    (app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      app.id.toLowerCase().includes(searchQuery.toLowerCase())),
                ).length === 0 && (
                  <div className="text-center py-8 text-white/50 text-[13.5px] font-sans">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default MobileOSAppGrid;
