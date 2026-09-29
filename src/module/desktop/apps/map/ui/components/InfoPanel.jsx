import { MapPin, CloudSun, Route, ChevronRight } from "lucide-react";
import PRESET_PLACES from "../../data/mapData";

const InfoPanel = ({
  activeTab,
  setActiveTab,
  activeKey,
  setActiveKey,
  setZoomLevel,
  currentCity,
  customPlace,
  filteredKeys,
  searchQuery,
  isNarrow,
  setIsSidebarOpen,
}) => {
  const indianKeys = Object.keys(PRESET_PLACES).filter((key) =>
    PRESET_PLACES[key].region.endsWith("India"),
  );
  const visibleKeys = searchQuery.trim()
    ? filteredKeys.filter((key) => indianKeys.includes(key))
    : indianKeys;

  const selectPlace = (key) => {
    setActiveKey(key);
    setZoomLevel(13);
    if (isNarrow) setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col text-[#1d1d1f]">
      <div className="px-4 pb-3">
        <div className="flex rounded-lg bg-[#e9e9ed] p-0.5 text-[12px] font-medium">
          {[
            ["explore", "Explore"],
            ["directions", "Directions"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-pressed={activeTab === tab}
              className={`flex-1 rounded-[6px] py-1.5 transition-colors cursor-pointer ${activeTab === tab ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#6e6e73] hover:text-[#1d1d1f]"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5">
        {activeTab === "explore" ? (
          <div className="space-y-5">
            {customPlace && (
              <section>
                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#8e8e93]">
                  Recent Search
                </h2>
                <button
                  type="button"
                  onClick={() => selectPlace("custom")}
                  className={`flex w-full items-center gap-3 rounded-[10px] px-2.5 py-2 text-left cursor-pointer ${activeKey === "custom" ? "bg-[#e6efff]" : "hover:bg-black/5"}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e2e9f5] text-[#2678ee]">
                    <MapPin size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">
                      {customPlace.name}
                    </span>
                    <span className="block truncate text-[11px] text-[#8e8e93]">
                      {customPlace.region}
                    </span>
                  </span>
                  <ChevronRight size={15} className="text-[#aeaeb2]" />
                </button>
              </section>
            )}
            <section>
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#8e8e93]">
                Favorites
              </h2>
              <div className="space-y-0.5">
                {visibleKeys.map((key) => {
                  const place = PRESET_PLACES[key];
                  const selected = activeKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selectPlace(key)}
                      className={`flex w-full items-center gap-3 rounded-[10px] px-2.5 py-2 text-left transition-colors cursor-pointer ${selected ? "bg-[#e6efff]" : "hover:bg-black/5"}`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-[#2678ee] text-white" : "bg-white text-[#2678ee] shadow-sm"}`}
                      >
                        <MapPin size={17} strokeWidth={2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-[13px] ${selected ? "font-semibold" : "font-medium"}`}
                        >
                          {place.name}
                        </span>
                        <span className="block truncate text-[11px] text-[#8e8e93]">
                          {place.region}
                        </span>
                      </span>
                      <ChevronRight size={15} className="text-[#aeaeb2]" />
                    </button>
                  );
                })}
                {visibleKeys.length === 0 && (
                  <p className="px-2.5 py-2 text-[12px] text-[#8e8e93]">
                    Press Enter to search for a place.
                  </p>
                )}
              </div>
            </section>
            <section className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-[17px] font-semibold leading-tight">
                    {currentCity.name}
                  </h2>
                  <p className="mt-1 truncate text-[12px] text-[#8e8e93]">{currentCity.region}</p>
                </div>
                <MapPin size={18} className="shrink-0 text-[#ee4d4d]" />
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-black/5 pt-3 text-[12px] text-[#6e6e73]">
                <CloudSun size={16} className="text-[#e49a27]" />
                {currentCity.weather}
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-[#5c5c63]">{currentCity.desc}</p>
              <button
                type="button"
                onClick={() => setActiveTab("directions")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2678ee] py-2 text-[12px] font-semibold text-white hover:bg-[#1268df] cursor-pointer"
              >
                <Route size={15} />
                Directions
              </button>
              <div className="mt-4 border-t border-black/5 pt-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#8e8e93]">
                  Landmarks
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {currentCity.landmarks.map((landmark) => (
                    <li
                      key={landmark}
                      className="flex items-start gap-2 text-[12px] text-[#5c5c63]"
                    >
                      <MapPin size={13} className="mt-0.5 shrink-0 text-[#2678ee]" />
                      {landmark}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        ) : (
          <section className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 border-b border-black/5 pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e6efff] text-[#2678ee]">
                <Route size={19} />
              </span>
              <div className="min-w-0">
                <h2 className="text-[16px] font-semibold">Directions</h2>
                <p className="truncate text-[12px] text-[#8e8e93]">To {currentCity.name}</p>
              </div>
            </div>
            <ol className="mt-4 space-y-4 border-l-2 border-[#d8e7ff] pl-4">
              {currentCity.steps.map((step, index) => (
                <li key={index} className="relative text-[12px] leading-relaxed text-[#5c5c63]">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-[#2678ee] ring-2 ring-white" />
                  <span className="mb-0.5 block font-semibold text-[#1d1d1f]">
                    Step {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
