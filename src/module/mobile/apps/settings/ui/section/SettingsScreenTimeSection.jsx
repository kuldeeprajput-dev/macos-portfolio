import React, { useState } from "react";
import {
  Hourglass,
  Lock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Calendar,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

const SettingsScreenTimeSection = () => {
  const [activeSubPage, setActiveSubPage] = useState(null); // 'downtime', 'limits', 'privacy', null
  const [selectedDay, setSelectedDay] = useState("Thu");

  // Downtime state
  const [downtimeEnabled, setDowntimeEnabled] = useState(false);
  const [downtimeSchedule, setDowntimeSchedule] = useState("Daily");

  // App limits state
  const [developerLimit, setDeveloperLimit] = useState(4); // hours
  const [socialLimit, setSocialLimit] = useState(2); // hours
  const [limitsEnabled, setLimitsEnabled] = useState(true);

  // Content & Privacy state
  const [privacyEnabled, setPrivacyEnabled] = useState(false);

  // Weekly data mapping
  const weeklyData = {
    Mon: { total: "4h 12m", dev: 180, prod: 60, other: 12 },
    Tue: { total: "5h 48m", dev: 220, prod: 110, other: 18 },
    Wed: { total: "7h 15m", dev: 300, prod: 90, other: 45 },
    Thu: { total: "6h 24m", dev: 250, prod: 110, other: 24 }, // Today
    Fri: { total: "3h 30m", dev: 120, prod: 70, other: 20 },
    Sat: { total: "2h 15m", dev: 40, prod: 45, other: 50 },
    Sun: { total: "1h 45m", dev: 20, prod: 35, other: 50 },
  };

  const currentDayData = weeklyData[selectedDay];

  const appUsage = [
    { name: "VS Code", category: "Development", time: "4h 10m", percentage: 65, icon: "💻" },
    {
      name: "Safari",
      category: "Productivity",
      time: "1h 50m",
      percentage: 28,
      icon: "🌐",
    },
    { name: "Spotify", category: "Other", time: "24m", percentage: 7, icon: "🎵" },
  ];

  if (activeSubPage === "downtime") {
    return (
      <div className="w-full px-4 py-6 space-y-6 select-none animate-in fade-in slide-in-from-left-2 duration-200">
        <button
          onClick={() => setActiveSubPage(null)}
          className="flex items-center gap-1 text-[13px] font-bold text-blue-500 hover:text-blue-600 transition-colors focus:outline-none bg-transparent border-none cursor-pointer p-0"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          <span>Screen Time</span>
        </button>

        <div className="flex items-center gap-3.5 pb-2">
          <div className="w-9 h-9 bg-indigo-500 text-white rounded-lg flex items-center justify-center shrink-0">
            <Monitor size={18} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-gray-900 leading-tight">Downtime</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Schedule screen downtime</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-4 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div>
            <span className="font-bold text-gray-800 text-[15px] block leading-tight">
              Enable Downtime
            </span>
            <span className="text-[11px] text-gray-400 font-medium block mt-1 leading-normal">
              Only allowed apps will be available during downtime
            </span>
          </div>
          <button
            onClick={() => setDowntimeEnabled(!downtimeEnabled)}
            className={`w-[51px] h-[31px] rounded-full transition-colors relative flex items-center px-0.5 border-none outline-none cursor-pointer shrink-0 ${
              downtimeEnabled ? "bg-blue-500" : "bg-zinc-200"
            }`}
          >
            <div
              className={`w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform duration-200 ${
                downtimeEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {downtimeEnabled && (
          <div className="bg-white rounded-2xl border border-black/5 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 text-xs text-gray-700 animate-in fade-in duration-200 divide-y divide-zinc-100">
            <div className="flex items-center justify-between pb-3">
              <span className="font-bold text-gray-800 text-sm">Schedule Type</span>
              <select
                value={downtimeSchedule}
                onChange={(e) => setDowntimeSchedule(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1 text-gray-700 font-semibold focus:outline-none"
              >
                <option value="Daily">Every Day</option>
                <option value="Weekends">Weekends Only</option>
              </select>
            </div>
            <div className="flex items-center justify-between pt-3">
              <span className="font-bold text-gray-800 text-sm">Time Range</span>
              <span className="font-mono text-gray-700 font-semibold bg-zinc-50 px-2.5 py-1 rounded-xl border border-zinc-250/20">
                22:00 - 07:00
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeSubPage === "limits") {
    return (
      <div className="w-full px-4 py-6 space-y-6 select-none animate-in fade-in slide-in-from-left-2 duration-200">
        <button
          onClick={() => setActiveSubPage(null)}
          className="flex items-center gap-1 text-[13px] font-bold text-blue-500 hover:text-blue-600 transition-colors focus:outline-none bg-transparent border-none cursor-pointer p-0"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          <span>Screen Time</span>
        </button>

        <div className="flex items-center gap-3.5 pb-2">
          <div className="w-9 h-9 bg-orange-500 text-white rounded-lg flex items-center justify-center shrink-0">
            <Hourglass size={18} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-gray-900 leading-tight">App Limits</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Set daily app usage caps</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-4 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div>
            <span className="font-bold text-gray-800 text-[15px] block leading-tight">
              Enforce Limits
            </span>
            <span className="text-[11px] text-gray-400 font-medium block mt-1 leading-normal">
              Lock app usage once limit is reached
            </span>
          </div>
          <button
            onClick={() => setLimitsEnabled(!limitsEnabled)}
            className={`w-[51px] h-[31px] rounded-full transition-colors relative flex items-center px-0.5 border-none outline-none cursor-pointer shrink-0 ${
              limitsEnabled ? "bg-blue-500" : "bg-zinc-200"
            }`}
          >
            <div
              className={`w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform duration-200 ${
                limitsEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {limitsEnabled && (
          <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5 animate-in fade-in duration-200 divide-y divide-zinc-100">
            <div className="space-y-3 pb-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700">Development Limit</span>
                <span className="font-mono text-gray-700 font-bold">{developerLimit} Hours</span>
              </div>
              <div className="relative w-full h-1.5 bg-zinc-150 rounded-full">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                  style={{ width: `${(developerLimit / 8) * 100}%` }}
                />
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={developerLimit}
                  onChange={(e) => setDeveloperLimit(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700">Productivity & Social Limit</span>
                <span className="font-mono text-gray-700 font-bold">{socialLimit} Hours</span>
              </div>
              <div className="relative w-full h-1.5 bg-zinc-150 rounded-full">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                  style={{ width: `${(socialLimit / 8) * 100}%` }}
                />
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={socialLimit}
                  onChange={(e) => setSocialLimit(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeSubPage === "privacy") {
    return (
      <div className="w-full px-4 py-6 space-y-6 select-none animate-in fade-in slide-in-from-left-2 duration-200">
        <button
          onClick={() => setActiveSubPage(null)}
          className="flex items-center gap-1 text-[13px] font-bold text-blue-500 hover:text-blue-600 transition-colors focus:outline-none bg-transparent border-none cursor-pointer p-0"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          <span>Screen Time</span>
        </button>

        <div className="flex items-center gap-3.5 pb-2">
          <div className="w-9 h-9 bg-red-500 text-white rounded-lg flex items-center justify-center shrink-0">
            <Lock size={18} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-gray-900 leading-tight">Content & Privacy</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Manage adult filter constraints</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-4 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div>
            <span className="font-bold text-gray-800 text-[15px] block leading-tight">
              Content & Privacy
            </span>
            <span className="text-[11px] text-gray-400 font-medium block mt-1 leading-normal">
              Restrict explicit adult web content
            </span>
          </div>
          <button
            onClick={() => setPrivacyEnabled(!privacyEnabled)}
            className={`w-[51px] h-[31px] rounded-full transition-colors relative flex items-center px-0.5 border-none outline-none cursor-pointer shrink-0 ${
              privacyEnabled ? "bg-blue-500" : "bg-zinc-200"
            }`}
          >
            <div
              className={`w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform duration-200 ${
                privacyEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {privacyEnabled ? (
          <div className="bg-green-50/40 border border-green-200 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-green-700 animate-in fade-in duration-200">
            <ShieldCheck size={16} className="shrink-0 mt-0.5 text-green-600" />
            <div>
              <span className="font-bold block">Restrictions Enabled</span>
              <span className="font-medium block mt-0.5">
                Adult content filtering, private window limitations, and secure layout modifications
                are actively enforced.
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50/40 border border-yellow-250/50 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-yellow-750 animate-in fade-in duration-200">
            <ShieldAlert size={16} className="shrink-0 mt-0.5 text-yellow-600" />
            <div>
              <span className="font-bold block">No Restrictions Active</span>
              <span className="font-medium block mt-0.5">
                Content limits and privacy locks are bypassed.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 space-y-6 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Graph Summary Card */}
      <div className="w-full bg-white rounded-2xl border border-black/5 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-tight">
              {currentDayData.total}
            </h2>
            <p className="text-[11px] text-gray-450 mt-0.5">
              {selectedDay === "Thu" ? "Today, " : ""}Selected: {selectedDay} (Average: 5h 15m)
            </p>
          </div>
          <Calendar size={18} className="text-gray-400" />
        </div>

        {/* Vertical Chart */}
        <div className="h-28 flex items-end justify-between gap-2.5 mb-5 px-1 pt-4 border-b border-zinc-100">
          {Object.entries(weeklyData).map(([day, val]) => {
            const isSelected = selectedDay === day;
            const dayMinutes = val.dev + val.prod + val.other;
            const maxVal = 435; // Wed total minutes
            const scalePct = (dayMinutes / maxVal) * 100;

            const devPct = (val.dev / dayMinutes) * 100;
            const prodPct = (val.prod / dayMinutes) * 100;
            const otherPct = (val.other / dayMinutes) * 100;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className="flex flex-col items-center justify-end h-full flex-1 cursor-pointer"
              >
                <div
                  className={`w-full rounded-t-sm overflow-hidden flex flex-col justify-end transition-all duration-150 ${
                    isSelected ? "ring-2 ring-blue-500/50 scale-x-105" : "hover:brightness-95"
                  }`}
                  style={{ height: `${scalePct}%`, minHeight: "4px" }}
                >
                  <div style={{ height: `${otherPct}%` }} className="bg-cyan-400 w-full" />
                  <div style={{ height: `${prodPct}%` }} className="bg-indigo-400 w-full" />
                  <div style={{ height: `${devPct}%` }} className="bg-blue-500 w-full" />
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-bold ${
                    isSelected ? "text-blue-500 font-extrabold" : "text-gray-400"
                  }`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase border-t border-zinc-100 pt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-700">Dev</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-gray-700">Prod</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-gray-700">Other</span>
          </div>
        </div>
      </div>

      {/* Screen Time Group List */}
      <div>
        <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-3 mb-2">
          Controls
        </h3>
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y divide-zinc-100">
          {/* Downtime */}
          <div
            onClick={() => setActiveSubPage("downtime")}
            className="flex justify-between items-center p-3.5 pl-4 hover:bg-zinc-50 cursor-pointer active:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-indigo-500 text-white rounded-md flex items-center justify-center shrink-0">
                <Monitor size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-gray-800 leading-tight">
                  Downtime
                </span>
                <span className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                  {downtimeEnabled ? "Enabled (Daily)" : "Off"}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 shrink-0" />
          </div>

          {/* App Limits */}
          <div
            onClick={() => setActiveSubPage("limits")}
            className="flex justify-between items-center p-3.5 pl-4 hover:bg-zinc-50 cursor-pointer active:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-orange-500 text-white rounded-md flex items-center justify-center shrink-0">
                <Hourglass size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-gray-800 leading-tight">
                  App Limits
                </span>
                <span className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                  {limitsEnabled ? "Active limits set" : "Off"}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 shrink-0" />
          </div>

          {/* Content & Privacy */}
          <div
            onClick={() => setActiveSubPage("privacy")}
            className="flex justify-between items-center p-3.5 pl-4 hover:bg-zinc-50 cursor-pointer active:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-red-500 text-white rounded-md flex items-center justify-center shrink-0">
                <Lock size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-gray-800 leading-tight">
                  Content & Privacy
                </span>
                <span className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                  {privacyEnabled ? "Enabled" : "Off"}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 shrink-0" />
          </div>
        </div>
      </div>

      {/* App Usage Details */}
      <div>
        <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-3 mb-2">
          Most Used Apps
        </h3>
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y divide-zinc-100">
          {appUsage.map((app) => (
            <div key={app.name} className="flex justify-between items-center p-3.5 pl-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-zinc-50 rounded-md flex items-center justify-center text-sm border border-zinc-150 shrink-0">
                  {app.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-gray-800 leading-tight">
                    {app.name}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                    {app.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div style={{ width: `${app.percentage}%` }} className="h-full bg-blue-500" />
                </div>
                <span className="text-[13px] font-mono font-bold text-gray-500 text-right w-12">
                  {app.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreenTimeSection;
