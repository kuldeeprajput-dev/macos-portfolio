import { MapPin, CloudSun, Route } from "lucide-react";
import PRESET_PLACES from "../../data/mapData";

const InfoPanel = ({
  activeTab,
  setActiveTab,
  activeKey,
  setActiveKey,
  setZoomLevel,
  currentCity,
  customPlace,
  _filteredKeys,
  _searchQuery,
  isNarrow,
  setIsSidebarOpen,
}) => (
  <div className="flex-1 flex flex-col min-h-0 min-w-0">
    <div className="flex border-b border-zinc-200 bg-gray-100/50 text-xs font-semibold text-gray-500 shrink-0 select-none">
      <button
        onClick={() => setActiveTab("explore")}
        className={`flex-1 py-2 text-center border-b-2 transition-all ${
          activeTab === "explore"
            ? "border-blue-500 text-blue-600 font-bold"
            : "border-transparent hover:text-gray-800"
        }`}
      >
        Explore
      </button>
      <button
        onClick={() => setActiveTab("directions")}
        className={`flex-1 py-2 text-center border-b-2 transition-all ${
          activeTab === "directions"
            ? "border-blue-500 text-blue-600 font-bold"
            : "border-transparent hover:text-gray-800"
        }`}
      >
        Directions
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-3 space-y-4">
      {activeTab === "explore" && (
        <>
          {activeKey === "custom" && customPlace && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1.5 font-sans">
                Search Result
              </span>
              <div
                onClick={() => {
                  if (isNarrow && setIsSidebarOpen) {
                    setIsSidebarOpen(false);
                  }
                }}
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all text-white font-semibold shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin size={13} className="text-white" />
                  <span className="truncate">{customPlace.name}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1.5">
              Favorites
            </span>
            {Object.keys(PRESET_PLACES).map((key) => {
              const place = PRESET_PLACES[key];
              const isActive = activeKey === key;
              return (
                <div
                  key={key}
                  onClick={() => {
                    setActiveKey(key);
                    setZoomLevel(1);
                    if (isNarrow && setIsSidebarOpen) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg cursor-pointer text-xs transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin size={13} className={isActive ? "text-white" : "text-blue-500"} />
                    <span className="truncate">{place.name}</span>
                  </div>
                  <span className={`text-[9px] ${isActive ? "text-blue-100" : "text-gray-400"}`}>
                    {place.region.split(", ").pop()}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border border-zinc-200 bg-white rounded-xl p-3 space-y-2.5 shadow-sm">
            <div>
              <h3 className="font-bold text-sm text-gray-900 leading-tight truncate">
                {currentCity.name}
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5 truncate">{currentCity.region}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 border border-zinc-200/80 px-2 py-1 rounded">
              <CloudSun size={14} className="text-amber-500" />
              <span>{currentCity.weather}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-600">{currentCity.desc}</p>

            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-sans">
                Landmarks
              </span>
              <ul className="text-xs text-gray-700 space-y-0.5 pl-1">
                {currentCity.landmarks.map((landmark, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 truncate">
                    <span className="text-[10px] text-blue-500">❖</span>
                    <span className="truncate">{landmark}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {activeTab === "directions" && (
        <div className="space-y-3">
          <div className="border border-zinc-200 bg-white rounded-xl p-3 shadow-sm space-y-2">
            <div className="flex items-center gap-2 border-b pb-2 border-zinc-200/80">
              <Route size={16} className="text-blue-500" />
              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase leading-none block font-sans">
                  Route Planner
                </span>
                <span className="text-xs font-bold text-gray-800">To {currentCity.name}</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Simulated directions and waypoints from start location to target city:
            </p>
          </div>

          <div className="relative pl-4 border-l border-blue-500/30 ml-2 space-y-4 py-1 text-xs">
            {currentCity.steps.map((step, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-5.5 top-0.5 bg-blue-500 border border-white text-white rounded-full w-3 h-3 flex items-center justify-center text-[7px]" />
                <div className="space-y-0.5 pl-1.5">
                  <span className="font-semibold text-gray-500">Step {idx + 1}</span>
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default InfoPanel;
