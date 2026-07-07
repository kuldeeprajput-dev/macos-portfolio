import React from "react";
import WindowControls from "@components/WindowControls";

const WeatherHeader = ({ _activeCity, unitMode, setUnitMode, viewMode, setViewMode }) => {
  const isDashboard = viewMode === "dashboard";

  return (
    <div id="window-header" className="shrink-0 flex items-center justify-between relative z-20">
      <div className="flex items-center">
        <WindowControls target="weather" />
      </div>

      <div className="flex-1 text-center font-bold text-sm select-none">
        {!isDashboard ? "Weather" : ""}
      </div>

      <div className="flex items-center">
        {isDashboard ? (
          <div className="flex bg-gray-200/80 rounded-lg p-0.5 border border-gray-300/30 text-[10px] font-bold">
            <button
              onClick={() => setUnitMode("both")}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                unitMode === "both"
                  ? "bg-white text-gray-800 shadow-xs"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-300/20"
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setUnitMode("c")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                unitMode === "c"
                  ? "bg-white text-gray-800 shadow-xs"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-300/20"
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnitMode("f")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                unitMode === "f"
                  ? "bg-white text-gray-800 shadow-xs"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-300/20"
              }`}
            >
              °F
            </button>
          </div>
        ) : (
          <button
            onClick={() => setViewMode("dashboard")}
            className="text-blue-500 hover:text-blue-600 font-semibold text-xs cursor-pointer active:scale-95 transition-transform"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default WeatherHeader;
