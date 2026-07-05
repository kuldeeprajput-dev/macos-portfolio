import React, { useState, useEffect } from "react";
import useWindowsStore from "@store/window";
import {
  Monitor,
  RefreshCw,
  HardDrive,
  Clock,
  ArrowLeft,
  ChevronRight,
  Loader2,
  Info,
} from "lucide-react";

const SettingsGeneralPane = () => {
  const { windows, setWindowData } = useWindowsStore();
  const windowData = windows.settings?.data;
  const [subPage, setSubPage] = useState(() => windowData?.subPage || null);

  useEffect(() => {
    if (windowData?.subPage !== undefined) {
      setSubPage(windowData.subPage);
    }
  }, [windowData?.subPage]);

  // Software update state
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("Your Mac is up to date.");

  // Date & Time state
  const [autoTime, setAutoTime] = useState(true);
  const [timeZone, _setTimeZone] = useState("India Standard Time (IST)");

  const checkUpdates = () => {
    if (checkingUpdate) return;
    setCheckingUpdate(true);
    setTimeout(() => {
      setCheckingUpdate(false);
      setUpdateStatus("macOS Ventura 13.5.2 is currently the latest version available.");
    }, 1500);
  };

  if (subPage === "about") {
    return (
      <div className="animate-in fade-in slide-in-from-left-2 duration-200">
        <button
          onClick={() => {
            setSubPage(null);
            setWindowData("settings", { ...windowData, subPage: null });
          }}
          className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#007aff] transition-colors focus:outline-none mb-6 p-1 rounded hover:bg-gray-100"
        >
          <ArrowLeft size={13} />
          <span>Back to General</span>
        </button>

        <div className="flex flex-col items-center mb-8 pb-4 border-b border-gray-150">
          <Monitor size={64} className="text-[#007aff] mb-4 drop-shadow-md" />
          <h2 className="text-[24px] font-extrabold text-gray-900 tracking-tight leading-tight">
            macOS Ventura
          </h2>
          <p className="text-[12px] text-gray-400 font-semibold mt-1">Version 13.5.2</p>
        </div>

        <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
          <div className="flex items-center justify-between p-3.5 px-4">
            <span className="text-[13px] font-medium text-gray-500">MacBook Pro</span>
            <span className="text-[13px] font-bold text-gray-800">14-inch, 2023</span>
          </div>
          <div className="flex items-center justify-between p-3.5 px-4">
            <span className="text-[13px] font-medium text-gray-500">Chip</span>
            <span className="text-[13px] font-bold text-gray-800">Apple M2 Pro</span>
          </div>
          <div className="flex items-center justify-between p-3.5 px-4">
            <span className="text-[13px] font-medium text-gray-500">Memory</span>
            <span className="text-[13px] font-bold text-gray-800">16 GB</span>
          </div>
          <div className="flex items-center justify-between p-3.5 px-4">
            <span className="text-[13px] font-medium text-gray-500">Startup Disk</span>
            <span className="text-[13px] font-bold text-gray-800">Macintosh HD</span>
          </div>
          <div className="flex items-center justify-between p-3.5 px-4">
            <span className="text-[13px] font-medium text-gray-500">Serial Number</span>
            <span className="text-[13px] font-bold text-gray-850 font-mono">C02X20YZJHD3</span>
          </div>
        </div>
      </div>
    );
  }

  if (subPage === "update") {
    return (
      <div className="animate-in fade-in slide-in-from-left-2 duration-200">
        <button
          onClick={() => {
            setSubPage(null);
            setWindowData("settings", { ...windowData, subPage: null });
          }}
          className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#007aff] transition-colors focus:outline-none mb-6 p-1 rounded hover:bg-gray-150"
        >
          <ArrowLeft size={13} />
          <span>Back to General</span>
        </button>

        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-150">
          <div className="w-10 h-10 bg-[#007aff]/10 text-[#007aff] rounded-lg flex items-center justify-center">
            <RefreshCw size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-900 leading-tight font-sans">
              Software Update
            </h2>
            <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5">
              Check and deploy system revisions
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
          <Monitor size={48} className="text-[#007aff] opacity-20" />

          {checkingUpdate ? (
            <div className="flex flex-col items-center gap-1.5">
              <Loader2 size={24} className="animate-spin text-[#007aff]" />
              <span className="text-[13px] font-bold text-gray-700">Checking for updates...</span>
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className="text-[13px] font-bold text-gray-800">{updateStatus}</h3>
              <p className="text-[11px] text-gray-400 font-semibold">
                Last Checked: Today at 21:50
              </p>
            </div>
          )}

          <button
            onClick={checkUpdates}
            disabled={checkingUpdate}
            className="px-4 py-1.5 rounded-md bg-[#007aff] text-white hover:bg-[#0062cc] disabled:bg-gray-300 disabled:cursor-not-allowed text-[12px] font-bold transition-colors"
          >
            Check for Updates
          </button>
        </div>
      </div>
    );
  }

  if (subPage === "storage") {
    return (
      <div className="animate-in fade-in slide-in-from-left-2 duration-200">
        <button
          onClick={() => {
            setSubPage(null);
            setWindowData("settings", { ...windowData, subPage: null });
          }}
          className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#007aff] transition-colors focus:outline-none mb-6 p-1 rounded hover:bg-gray-150"
        >
          <ArrowLeft size={13} />
          <span>Back to General</span>
        </button>

        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-150">
          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-lg flex items-center justify-center">
            <HardDrive size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-900 leading-tight">Storage</h2>
            <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5">
              Macintosh HD disk space status
            </p>
          </div>
        </div>

        {/* Disk space card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[13px] font-extrabold text-gray-800">Macintosh HD</span>
            <span className="text-xs font-semibold text-gray-400">245 GB of 512 GB Used</span>
          </div>

          {/* Stained bar chart representing storage spaces */}
          <div className="w-full flex h-5 bg-gray-150 rounded-md overflow-hidden">
            <div className="h-full bg-blue-500 w-[35%]" title="Apps" />
            <div className="h-full bg-indigo-400 w-[20%]" title="Developer" />
            <div className="h-full bg-yellow-500 w-[15%]" title="System Data" />
            <div className="h-full bg-cyan-400 w-[10%]" title="Other" />
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 text-[11.5px] font-bold text-gray-500 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded bg-blue-500" />
              <span className="text-gray-700">Apps (92 GB)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded bg-indigo-400" />
              <span className="text-gray-700">Developer (52 GB)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded bg-yellow-500" />
              <span className="text-gray-700">macOS System Data (38 GB)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded bg-cyan-400" />
              <span className="text-gray-700">Other (26 GB)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (subPage === "datetime") {
    return (
      <div className="animate-in fade-in slide-in-from-left-2 duration-200">
        <button
          onClick={() => {
            setSubPage(null);
            setWindowData("settings", { ...windowData, subPage: null });
          }}
          className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#007aff] transition-colors focus:outline-none mb-6 p-1 rounded hover:bg-gray-150"
        >
          <ArrowLeft size={13} />
          <span>Back to General</span>
        </button>

        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-150">
          <div className="w-10 h-10 bg-teal-500/10 text-teal-600 rounded-lg flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-900 leading-tight font-sans">
              Date & Time
            </h2>
            <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5">
              Sync system clock and locations
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 shadow-sm flex justify-between items-center text-xs text-gray-700">
          <div>
            <span className="font-bold text-gray-900 block">Set date and time automatically</span>
            <span className="text-[10.5px] text-gray-400 font-semibold block mt-0.5">
              Use Apple network time servers (time.apple.com)
            </span>
          </div>
          <button onClick={() => setAutoTime(!autoTime)} className="focus:outline-none">
            {autoTime ? (
              <ToggleRightActive size={32} className="text-[#007aff] cursor-pointer" />
            ) : (
              <ToggleRightInactive size={32} className="text-gray-300 cursor-pointer" />
            )}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-xs text-gray-600 space-y-2.5">
          <div className="flex justify-between">
            <span className="text-gray-400 font-bold">Time Zone</span>
            <span className="text-gray-700 font-semibold">{timeZone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 font-bold">Source server</span>
            <span className="font-mono text-gray-700">time.apple.com</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-6 pb-4 border-b border-gray-150/80">
        <Monitor size={56} className="text-[#007aff] mb-3 drop-shadow-sm animate-pulse" />
        <h2 className="text-[20px] font-black text-gray-900 tracking-tight leading-tight">
          General settings
        </h2>
      </div>

      <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
        {/* About */}
        <div
          onClick={() => setSubPage("about")}
          className="flex justify-between items-center p-3.5 px-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-500 text-white rounded-lg flex items-center justify-center">
              <Monitor size={14} />
            </div>
            <span className="text-[13px] font-bold text-gray-800">About</span>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </div>

        {/* Software Update */}
        <div
          onClick={() => setSubPage("update")}
          className="flex justify-between items-center p-3.5 px-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-teal-500 text-white rounded-lg flex items-center justify-center">
              <RefreshCw size={14} />
            </div>
            <span className="text-[13px] font-bold text-gray-800">Software Update</span>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </div>

        {/* Storage */}
        <div
          onClick={() => setSubPage("storage")}
          className="flex justify-between items-center p-3.5 px-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-indigo-500 text-white rounded-lg flex items-center justify-center">
              <HardDrive size={14} />
            </div>
            <span className="text-[13px] font-bold text-gray-800">Storage</span>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </div>

        {/* Date & Time */}
        <div
          onClick={() => setSubPage("datetime")}
          className="flex justify-between items-center p-3.5 px-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center">
              <Clock size={14} />
            </div>
            <span className="text-[13px] font-bold text-gray-800">Date & Time</span>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </div>
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

export default SettingsGeneralPane;
