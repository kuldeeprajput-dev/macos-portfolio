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
      className="window-header absolute inset-x-0 top-0 z-40 flex h-12 items-center justify-between !border-0 !bg-transparent !p-0 select-none cursor-default"
    >
      <div
        className={`flex h-full items-center gap-2 px-4 ${isSidebarOpen ? "w-56 border-r border-black/10 bg-[#ececef]" : ""}`}
      >
        <WindowControls target="weather" />
        {isNarrow && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`ml-2 flex h-7 w-7 items-center justify-center rounded-md border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${isSidebarOpen ? "border-black/10 bg-white/70 text-gray-700 hover:bg-white" : "border-white/20 bg-black/20 text-white shadow-sm backdrop-blur-md hover:bg-black/35"}`}
            aria-label="Toggle Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}
      </div>
      <span className="sr-only">Weather — {activeCity.name}</span>
      <div className="mr-4 flex rounded-lg border border-white/20 bg-black/20 p-0.5 text-[10px] font-semibold text-white backdrop-blur-xl">
        <button
          onClick={() => setUnitMode("both")}
          className={`rounded-md px-2 py-1 transition-all cursor-pointer ${unitMode === "both" ? "bg-white/90 text-gray-800 shadow-sm" : "text-white/80 hover:bg-white/15 hover:text-white"}`}
        >
          Both
        </button>
        <button
          onClick={() => setUnitMode("c")}
          className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${unitMode === "c" ? "bg-white/90 text-gray-800 shadow-sm" : "text-white/80 hover:bg-white/15 hover:text-white"}`}
        >
          °C
        </button>
        <button
          onClick={() => setUnitMode("f")}
          className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${unitMode === "f" ? "bg-white/90 text-gray-800 shadow-sm" : "text-white/80 hover:bg-white/15 hover:text-white"}`}
        >
          °F
        </button>
      </div>
    </div>
  );
};

export default WeatherHeader;
