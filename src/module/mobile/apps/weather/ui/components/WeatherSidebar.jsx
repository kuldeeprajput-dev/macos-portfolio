import React from "react";
import { Search } from "lucide-react";
import { getSafeTemp } from "../../data";

const WeatherSidebar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  filteredCityKeys,
  citiesData,
  activeCityId,
  setActiveCityId,
  setIsSidebarOpen,
  _unitMode,
}) => {
  return (
    <aside className="absolute sm:relative inset-0 w-full bg-[#f2f2f7] p-4 space-y-4 flex flex-col z-20 transition-transform duration-300 shrink-0 h-full select-none text-gray-800">
      {/* iOS search input bar */}
      <div className="relative flex items-center bg-gray-200/80 border border-gray-300/10 rounded-xl px-3 py-2 shrink-0">
        <Search className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search for a city"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              handleSearch(searchQuery);
            }
          }}
          className="w-full bg-transparent text-sm focus:outline-none border-none outline-none text-gray-800 placeholder-gray-500"
        />
      </div>

      {/* City list cards */}
      <div className="flex-1 overflow-y-auto thin-scrollbar space-y-3 pb-8">
        {filteredCityKeys.map((key) => {
          const city = citiesData[key];
          const isActive = activeCityId === key;
          const temps = getSafeTemp(city);

          return (
            <button
              key={key}
              onClick={() => {
                setActiveCityId(key);
                setIsSidebarOpen(false); // setViewMode("dashboard")
              }}
              className={`w-full p-4 rounded-2xl text-left transition-all duration-200 relative flex flex-col justify-between text-white overflow-hidden shadow-sm hover:shadow-md cursor-pointer min-h-[90px] ${
                isActive ? "ring-2 ring-white/60" : ""
              }`}
            >
              {/* Dynamic weather gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${city.bgClass || "from-sky-400 to-blue-600"} z-0`}
              />

              <div className="relative z-10 flex justify-between items-start w-full">
                <div>
                  <h4 className="font-bold text-lg tracking-tight leading-none">{city.name}</h4>
                  <p className="text-[10px] opacity-75 font-semibold mt-1">
                    {key === "delhi" ? "My Location" : "Local Weather"}
                  </p>
                </div>
                <span className="text-3xl font-light tracking-tighter leading-none">
                  {temps.tempC}°
                </span>
              </div>

              <div className="relative z-10 flex justify-between items-end w-full mt-3">
                <p className="text-xs font-semibold opacity-90">{city.condition}</p>
                <div className="flex gap-2 text-xs font-semibold opacity-85">
                  <span>H: {temps.highC}°</span>
                  <span>L: {temps.lowC}°</span>
                </div>
              </div>
            </button>
          );
        })}
        {filteredCityKeys.length === 0 && (
          <p className="text-xs text-gray-400 italic text-center pt-4">No cities match query.</p>
        )}
      </div>
    </aside>
  );
};

export default WeatherSidebar;
