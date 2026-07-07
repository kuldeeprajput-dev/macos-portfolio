import React, { useState } from "react";

const SettingsAppearancePane = () => {
  const [selectedMode, setSelectedMode] = useState("light");

  return (
    <div className="max-w-2xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-4">
        Appearance
      </h3>
      <div className="flex gap-8 mb-6">
        {/* Light Mode */}
        <div
          onClick={() => setSelectedMode("light")}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <div
            className={`w-24 h-16 rounded-md bg-gray-100 border-2 shadow-sm overflow-hidden flex flex-col transition-all ${
              selectedMode === "light"
                ? "border-blue-500"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <div className="h-4 bg-white border-b border-gray-200"></div>
            <div className="flex-1 bg-gray-100 p-1">
              <div className="w-full h-full bg-white rounded-sm shadow-sm"></div>
            </div>
          </div>
          <span
            className={`text-[12px] font-medium transition-colors ${
              selectedMode === "light" ? "text-gray-900 font-semibold" : "text-gray-500"
            }`}
          >
            Light
          </span>
        </div>

        {/* Dark Mode */}
        <div
          onClick={() => setSelectedMode("dark")}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <div
            className={`w-24 h-16 rounded-md bg-gray-800 border-2 shadow-sm overflow-hidden flex flex-col transition-all ${
              selectedMode === "dark"
                ? "border-blue-500"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <div className="h-4 bg-[#2c2c2e] border-b border-black"></div>
            <div className="flex-1 bg-[#1e1e1e] p-1">
              <div className="w-full h-full bg-[#2c2c2e] rounded-sm shadow-sm"></div>
            </div>
          </div>
          <span
            className={`text-[12px] font-medium transition-colors ${
              selectedMode === "dark" ? "text-gray-900 font-semibold" : "text-gray-500"
            }`}
          >
            Dark
          </span>
        </div>

        {/* Auto Mode */}
        <div
          onClick={() => setSelectedMode("auto")}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <div
            className={`w-24 h-16 rounded-md bg-gradient-to-r from-gray-100 to-gray-800 border-2 shadow-sm overflow-hidden flex flex-col transition-all ${
              selectedMode === "auto"
                ? "border-blue-500"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <div className="h-4 flex">
              <div className="flex-1 bg-white border-b border-gray-200"></div>
              <div className="flex-1 bg-[#2c2c2e] border-b border-black"></div>
            </div>
            <div className="flex-1 flex">
              <div className="flex-1 bg-gray-100 p-1">
                <div className="w-full h-full bg-white rounded-sm shadow-sm"></div>
              </div>
              <div className="flex-1 bg-[#1e1e1e] p-1">
                <div className="w-full h-full bg-[#2c2c2e] rounded-sm shadow-sm"></div>
              </div>
            </div>
          </div>
          <span
            className={`text-[12px] font-medium transition-colors ${
              selectedMode === "auto" ? "text-gray-900 font-semibold" : "text-gray-500"
            }`}
          >
            Auto
          </span>
        </div>
      </div>

      {(selectedMode === "dark" || selectedMode === "auto") && (
        <div className="w-full max-w-[350px] p-3 px-4 bg-amber-50 border border-amber-200/60 rounded-xl flex items-center gap-2.5 text-[12px] text-amber-800 font-medium animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
          <svg
            className="w-4 h-4 text-amber-600 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Dark mode is coming soon</span>
        </div>
      )}
    </div>
  );
};

export default SettingsAppearancePane;
