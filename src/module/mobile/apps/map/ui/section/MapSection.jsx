import { useEffect, useState } from "react";
import { Search, X, MapPin, CloudSun, Route, ChevronRight } from "lucide-react";
import MapViewSection from "./MapViewSection";
import PRESET_PLACES from "../../data";

const MapSection = (props) => {
  const [drawerHeight, setDrawerHeight] = useState("half");
  const [isSearching, setIsSearching] = useState(false);
  const activeCity = props.currentCity;
  const indianKeys = Object.keys(PRESET_PLACES).filter((key) =>
    PRESET_PLACES[key].region.endsWith("India"),
  );

  useEffect(() => {
    setDrawerHeight("half");
  }, [props.activeKey]);

  const selectPlace = (key) => {
    props.setActiveKey(key);
    props.setZoomLevel(1);
    setIsSearching(false);
    setDrawerHeight("half");
  };

  const submitSearch = () => {
    if (!props.searchQuery.trim()) return;
    props.handleSearch();
    setIsSearching(false);
  };

  const drawerSize =
    drawerHeight === "collapsed" ? "86px" : drawerHeight === "half" ? "320px" : "calc(100% - 12px)";

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e9edf0]">
      <div className="absolute inset-0">
        <MapViewSection
          mapRef={null}
          markers={[{ lat: activeCity.lat, lon: activeCity.lon }]}
          selectedLocation={activeCity}
          onMapClick={() => setDrawerHeight("collapsed")}
          center={{ lat: activeCity.lat, lng: activeCity.lon }}
          zoom={props.zoomLevel}
          mapStyle={props.mapStyle}
          setMapStyle={props.setMapStyle}
          handleZoom={props.handleZoom}
          currentCity={activeCity}
          iframeSrc={props.iframeSrc}
        />
      </div>

      <section
        className="absolute inset-x-0 bottom-0 z-20 flex flex-col overflow-hidden rounded-t-[24px] border-t border-black/10 bg-[#f8f8fa]/95 shadow-[0_-8px_28px_rgba(0,0,0,0.17)] backdrop-blur-xl transition-[height] duration-300 ease-out"
        style={{ height: drawerSize }}
        aria-label="Map places"
      >
        <button
          type="button"
          onClick={() =>
            setDrawerHeight(
              drawerHeight === "collapsed"
                ? "half"
                : drawerHeight === "half"
                  ? "full"
                  : "collapsed",
            )
          }
          className="flex h-6 shrink-0 items-center justify-center cursor-pointer"
          aria-label={drawerHeight === "full" ? "Collapse places" : "Expand places"}
        >
          <span className="h-1 w-9 rounded-full bg-[#c6c6cb]" />
        </button>

        <div className="flex shrink-0 items-center gap-2 px-4 pb-3">
          <div className="flex h-10 min-w-0 flex-1 items-center rounded-xl bg-[#e9e9ed] px-3 ring-1 ring-black/5 focus-within:ring-[#4b93f7]">
            <Search size={17} className="shrink-0 text-[#8e8e93]" />
            <input
              type="text"
              placeholder="Search Maps"
              value={props.searchQuery}
              onChange={(event) => props.setSearchQuery(event.target.value)}
              onFocus={() => {
                setIsSearching(true);
                setDrawerHeight("full");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitSearch();
              }}
              className="h-full min-w-0 flex-1 bg-transparent pl-2.5 text-[14px] text-[#1d1d1f] placeholder:text-[#8e8e93] outline-none select-text"
              aria-label="Search Maps"
            />
            {props.searchQuery && (
              <button
                type="button"
                onClick={() => props.setSearchQuery("")}
                aria-label="Clear search"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c4c4c8] text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
          {isSearching && (
            <button
              type="button"
              onClick={() => {
                setIsSearching(false);
                props.setSearchQuery("");
                setDrawerHeight("half");
              }}
              className="text-[13px] font-medium text-[#2678ee]"
            >
              Cancel
            </button>
          )}
        </div>

        {drawerHeight !== "collapsed" && (
          <>
            {!isSearching && (
              <div className="mx-4 mb-3 flex shrink-0 rounded-lg bg-[#e9e9ed] p-0.5 text-[12px] font-medium">
                {[
                  ["explore", "Explore"],
                  ["directions", "Directions"],
                ].map(([tab, label]) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      props.setActiveTab(tab);
                      if (tab === "directions") setDrawerHeight("full");
                    }}
                    aria-pressed={props.activeTab === tab}
                    className={`flex-1 rounded-[6px] py-1.5 ${props.activeTab === tab ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#6e6e73]"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
              {isSearching ? (
                <div>
                  <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#8e8e93]">
                    {props.searchQuery ? "Search Results" : "Favorites"}
                  </h2>
                  <div className="overflow-hidden rounded-xl bg-white">
                    {props.filteredKeys
                      .filter((key) => indianKeys.includes(key))
                      .map((key) => {
                        const place = PRESET_PLACES[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => selectPlace(key)}
                            className="flex w-full items-center gap-3 border-b border-black/5 px-3 py-2.5 text-left last:border-0 active:bg-[#f2f2f5]"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e6efff] text-[#2678ee]">
                              <MapPin size={16} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-medium">
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
                    {props.filteredKeys.filter((key) => indianKeys.includes(key)).length === 0 &&
                      props.searchQuery.trim() && (
                        <button
                          type="button"
                          onClick={submitSearch}
                          className="w-full px-4 py-3 text-left text-[13px] font-medium text-[#2678ee]"
                        >
                          Search for “{props.searchQuery}”
                        </button>
                      )}
                  </div>
                </div>
              ) : props.activeTab === "explore" ? (
                <div className="space-y-5">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6efff] text-[#2678ee]">
                        <MapPin size={20} />
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate text-[19px] font-semibold leading-tight text-[#1d1d1f]">
                          {activeCity.name}
                        </h2>
                        <p className="mt-1 truncate text-[12px] text-[#8e8e93]">
                          {activeCity.region}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 border-t border-black/5 pt-3 text-[12px] text-[#6e6e73]">
                      <CloudSun size={16} className="text-[#e49a27]" />
                      {activeCity.weather}
                    </div>
                    <p className="mt-3 text-[12px] leading-relaxed text-[#5c5c63]">
                      {activeCity.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        props.setActiveTab("directions");
                        setDrawerHeight("full");
                      }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2678ee] py-2.5 text-[13px] font-semibold text-white active:bg-[#1268df]"
                    >
                      <Route size={16} />
                      Directions
                    </button>
                  </div>

                  <section>
                    <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#8e8e93]">
                      Favorites
                    </h3>
                    <div className="overflow-hidden rounded-xl bg-white">
                      {indianKeys.map((key) => {
                        const place = PRESET_PLACES[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => selectPlace(key)}
                            className="flex w-full items-center gap-3 border-b border-black/5 px-3 py-2.5 text-left last:border-0 active:bg-[#f2f2f5]"
                          >
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${props.activeKey === key ? "bg-[#2678ee] text-white" : "bg-[#e6efff] text-[#2678ee]"}`}
                            >
                              <MapPin size={16} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-medium">
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
                    </div>
                  </section>
                  <section className="rounded-xl bg-white px-4 py-3">
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#8e8e93]">
                      Landmarks
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {activeCity.landmarks.map((landmark) => (
                        <li
                          key={landmark}
                          className="flex items-center gap-2 text-[12px] text-[#5c5c63]"
                        >
                          <MapPin size={13} className="text-[#2678ee]" />
                          {landmark}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6efff] text-[#2678ee]">
                      <Route size={20} />
                    </span>
                    <div>
                      <h2 className="text-[18px] font-semibold">Directions</h2>
                      <p className="text-[12px] text-[#8e8e93]">To {activeCity.name}</p>
                    </div>
                  </div>
                  <ol className="mt-4 space-y-4 border-l-2 border-[#d8e7ff] pl-4">
                    {activeCity.steps.map((step, index) => (
                      <li
                        key={index}
                        className="relative text-[12px] leading-relaxed text-[#5c5c63]"
                      >
                        <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-[#2678ee] ring-2 ring-white" />
                        <span className="mb-0.5 block font-semibold text-[#1d1d1f]">
                          Step {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <button
                    type="button"
                    onClick={() => {
                      props.setActiveTab("explore");
                      setDrawerHeight("half");
                    }}
                    className="mt-5 w-full rounded-xl bg-[#e9e9ed] py-2.5 text-[13px] font-semibold text-[#2678ee]"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default MapSection;
