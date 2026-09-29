import { Search, X } from "lucide-react";
import InfoPanel from "../components/InfoPanel";
import clsx from "clsx";

const MapSidebarSection = ({
  searchQuery,
  onSearchChange,
  _searchResults,
  _onSelectResult,
  isSidebarOpen,
  setIsSidebarOpen,
  isNarrow,
  activeTab,
  setActiveTab,
  activeKey,
  setActiveKey,
  setZoomLevel,
  currentCity,
  customPlace,
  filteredKeys,
  handleSearch,
}) => {
  return (
    <div
      className={clsx(
        "bg-[#f6f6f8] border-r border-zinc-200/80 flex flex-col shrink-0 min-w-0 h-full z-20 transition-all duration-200",
        isNarrow ? "absolute shadow-xl" : "relative",
        !isSidebarOpen
          ? "-translate-x-full w-0 overflow-hidden opacity-0 pointer-events-none"
          : "translate-x-0 w-[292px]",
      )}
    >
      <div className="px-4 pb-3 pt-4">
        <div className="relative flex h-9 items-center rounded-[10px] bg-[#e9e9ed] ring-1 ring-black/5 focus-within:ring-[#4b93f7]">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e8e93]"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search Maps"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-full w-full bg-transparent pl-9 pr-9 text-[13px] text-[#1d1d1f] placeholder:text-[#8e8e93] outline-none select-text"
            aria-label="Search Maps"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#c4c4c8] text-white hover:bg-[#aaaab0] cursor-pointer"
              aria-label="Clear search"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
      <InfoPanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeKey={activeKey}
        setActiveKey={setActiveKey}
        setZoomLevel={setZoomLevel}
        currentCity={currentCity}
        customPlace={customPlace}
        filteredKeys={filteredKeys}
        searchQuery={searchQuery}
        isNarrow={isNarrow}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </div>
  );
};

export default MapSidebarSection;
