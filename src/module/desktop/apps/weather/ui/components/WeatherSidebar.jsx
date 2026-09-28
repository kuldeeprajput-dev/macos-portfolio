import React from "react";
import { Search } from "lucide-react";
import { getSafeTemp } from "../../data/weatherUtils";

const WeatherSidebar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  filteredCityKeys,
  citiesData,
  activeCityId,
  setActiveCityId,
  setIsSidebarOpen,
  isSidebarOpen,
  isNarrow,
  unitMode,
}) => {
  return (
    <aside
      className={`
      absolute inset-y-0 left-0 bg-[#ececef] flex flex-col z-20 shrink-0 h-full
      ${isNarrow ? "absolute shadow-lg" : "relative"}
      ${
        isSidebarOpen
          ? "w-56 min-w-[224px] max-w-[224px] px-3 pb-3 pt-14 border-r border-black/10 translate-x-0 opacity-100"
          : "w-0 min-w-0 max-w-0 p-0 border-r-0 -translate-x-full opacity-0 overflow-hidden pointer-events-none"
      }
    `}
    >
      <div className="relative mb-3 flex shrink-0 items-center rounded-lg border border-black/5 bg-white/70 px-2.5 py-1.5 shadow-xs">
        <button
          onClick={() => searchQuery.trim() && handleSearch(searchQuery)}
          className="mr-2 flex items-center justify-center text-gray-400 transition-colors hover:text-blue-500 cursor-pointer focus:outline-none"
          aria-label="Search"
        >
          <Search className="w-4 h-4 shrink-0" />
        </button>
        <input
          type="text"
          placeholder="Search cities"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              handleSearch(searchQuery);
            }
          }}
          className="w-full bg-transparent text-xs focus:outline-none border-none outline-none text-gray-800 placeholder-gray-400"
        />
      </div>

      <div className="-mr-3 flex-1 space-y-1 overflow-y-auto pr-3 thin-scrollbar">
        {filteredCityKeys.map((key) => {
          const city = citiesData[key];
          const isActive = activeCityId === key;
          const temps = getSafeTemp(city);

          return (
            <button
              key={key}
              onClick={() => {
                setActiveCityId(key);
                if (isNarrow) {
                  setIsSidebarOpen(false);
                }
              }}
              className={`relative flex w-full items-start justify-between gap-2 rounded-xl px-2.5 py-2.5 text-left text-[#1d1d1f] transition-colors cursor-pointer ${
                isActive ? "bg-white/85 shadow-sm" : "hover:bg-white/50"
              }`}
            >
              <div className="min-w-0 space-y-0.5">
                <h4 className="truncate text-xs font-semibold leading-tight">{city.name}</h4>
                <p className="truncate text-[10px] leading-tight text-[#6e6e73]">
                  {city.condition}
                </p>
                <p className="whitespace-nowrap pt-0.5 text-[9px] text-[#8e8e93]">
                  H:{unitMode === "f" ? temps.highF : temps.highC}° L:
                  {unitMode === "f" ? temps.lowF : temps.lowC}°
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end">
                <span className="text-[27px] font-light leading-none tracking-tight">
                  {unitMode === "f" ? temps.tempF : temps.tempC}°
                </span>
                {unitMode === "both" && (
                  <span className="mt-1 text-[10px] text-[#6e6e73]">{temps.tempF}°F</span>
                )}
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
