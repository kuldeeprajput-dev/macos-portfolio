import React from "react";
import WindowControls from "@components/WindowControls";
import { PanelLeft } from "lucide-react";

const WeatherHeader = ({
  activeCity,
  unitMode,
  setUnitMode,
  isSidebarOpen,
  setIsSidebarOpen,
  isNarrow,
}) => {
  return (
    <div
      id="window-header"
      className="window-header shrink-0 flex items-center justify-between bg-gray-50 border-b border-[#d1d1d1] px-4 h-[44px] relative z-40 select-none cursor-default"
    >
      <div className="flex items-center gap-2">
        <WindowControls target="weather" />
        {isNarrow && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Toggle Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1 text-center font-bold text-gray-700 text-sm block truncate px-2">
        Weather — {activeCity.name}
      </div>
      <div className="flex bg-black/5 rounded-lg p-0.5 border border-black/5 text-[10px] font-bold text-gray-600">
        <button
          onClick={() => setUnitMode("both")}
          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${unitMode === "both" ? "bg-white text-gray-800 shadow-sm" : "hover:bg-black/5 text-gray-500 hover:text-gray-800"}`}
        >
          Both
        </button>
        <button
          onClick={() => setUnitMode("c")}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${unitMode === "c" ? "bg-white text-gray-800 shadow-sm" : "hover:bg-black/5 text-gray-500 hover:text-gray-800"}`}
        >
          °C
        </button>
        <button
          onClick={() => setUnitMode("f")}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${unitMode === "f" ? "bg-white text-gray-800 shadow-sm" : "hover:bg-black/5 text-gray-500 hover:text-gray-800"}`}
        >
          °F
        </button>
      </div>
    </div>
  );
};

export default WeatherHeader;
