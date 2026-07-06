import React, { useState, useEffect } from "react";
import {
  MapPin,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Route,
  CloudSun,
  Navigation,
  Share2,
  Search,
  X,
  ChevronRight,
  Check,
} from "lucide-react";
import MapViewSection from "./MapViewSection";
import PRESET_PLACES from "../../data";

const MapSection = (props) => {
  const [drawerHeight, setDrawerHeight] = useState("half"); // "collapsed", "half", "full"
  const [isSearching, setIsSearching] = useState(false);
  const theme = "light";

  // Auto expand drawer when a new place is searched or preset changes
  useEffect(() => {
    setDrawerHeight("half");
  }, [props.activeKey]);

  const activeCity = props.currentCity;

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-150">
      {/* 1. Immersive Map Canvas */}
      <div className="absolute inset-0 z-0 h-full w-full">
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

      {/* 2. Floating iOS Map Controls (Right Side) */}
      <div className="absolute top-4 right-3 z-10 flex flex-col gap-2.5">
        {/* Zoom Controls Stack */}
        <div className="flex flex-col rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 shadow-lg divide-y divide-zinc-200">
          <button
            onClick={() => props.handleZoom("in")}
            className="w-9.5 h-9.5 flex items-center justify-center text-zinc-700 hover:bg-neutral-100 active:scale-90 transition-all rounded-t-full"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => props.handleZoom("out")}
            className="w-9.5 h-9.5 flex items-center justify-center text-zinc-700 hover:bg-neutral-100 active:scale-90 transition-all rounded-b-full"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
        </div>
      </div>

      {/* 3. Apple Maps iOS Slide-up Drawer Sheet */}
      <div
        className={`absolute left-0 right-0 bottom-0 bg-[#fcfcfc] border-t border-zinc-200/50 rounded-t-[25px] shadow-[0_-12px_36px_rgba(0,0,0,0.18)] flex flex-col transition-all duration-300 ease-out z-20`}
        style={{
          transform:
            drawerHeight === "collapsed"
              ? "translateY(calc(100% - 68px))"
              : drawerHeight === "half"
                ? "translateY(calc(100% - 290px))"
                : "translateY(55px)",
          height: "calc(100% - 55px)",
        }}
      >
        {/* Drag handle pill */}
        <div
          className="w-9 h-1 bg-zinc-300 rounded-full mx-auto my-2.5 cursor-pointer flex-shrink-0 active:opacity-60"
          onClick={() =>
            setDrawerHeight(
              drawerHeight === "collapsed"
                ? "half"
                : drawerHeight === "half"
                  ? "full"
                  : "collapsed",
            )
          }
        />

        {/* Search Input Container */}
        <div className="px-4 pb-2.5 flex items-center gap-2 flex-shrink-0">
          <div
            className={`flex-1 relative flex items-center rounded-2xl border px-3 py-2 text-xs transition-all ${
              theme === "dark"
                ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                : "bg-[#f2f2f7] border-zinc-200/50 text-gray-800"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search for a city or place..."
              value={props.searchQuery}
              onChange={(e) => props.setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsSearching(true);
                setDrawerHeight("full");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  props.handleSearch();
                  setIsSearching(false);
                }
              }}
              className="w-full bg-transparent border-none outline-none text-[12px] placeholder-gray-400 font-semibold"
            />
            {props.searchQuery && (
              <button
                onClick={() => props.setSearchQuery("")}
                className="p-0.5 rounded-full hover:bg-zinc-200 cursor-pointer"
              >
                <X size={12} className="text-gray-400" />
              </button>
            )}
          </div>
          {isSearching && (
            <button
              onClick={() => {
                setIsSearching(false);
                props.setSearchQuery("");
                setDrawerHeight("half");
              }}
              className="text-xs font-bold text-blue-500 active:opacity-60 bg-transparent border-none outline-none"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Tab switch bar (Explore vs Directions) - hidden when collapsed */}
        {drawerHeight !== "collapsed" && (
          <div className="flex border-b border-zinc-200/40 text-[11px] font-bold text-gray-500 shrink-0 select-none px-4">
            <button
              onClick={() => props.setActiveTab("explore")}
              className={`pb-2.5 pt-1.5 px-4 text-center border-b-2 transition-all ${
                props.activeTab === "explore"
                  ? "border-blue-500 text-blue-600 font-extrabold"
                  : "border-transparent hover:text-gray-800"
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => {
                props.setActiveTab("directions");
                setDrawerHeight("full");
              }}
              className={`pb-2.5 pt-1.5 px-4 text-center border-b-2 transition-all ${
                props.activeTab === "directions"
                  ? "border-blue-500 text-blue-600 font-extrabold"
                  : "border-transparent hover:text-gray-800"
              }`}
            >
              Directions
            </button>
          </div>
        )}

        {/* Scrollable Drawer Content */}
        {drawerHeight !== "collapsed" && (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-16">
            {/* SEARCHING SUGGESTIONS OVERLAY LIST */}
            {isSearching && props.searchQuery && (
              <div className="space-y-2">
                <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest pl-1">
                  Search Suggestions
                </span>
                <div
                  className={`border rounded-2xl divide-y overflow-hidden ${
                    theme === "dark"
                      ? "bg-zinc-850 border-zinc-800 divide-zinc-800"
                      : "bg-white border-zinc-200/60 divide-zinc-100"
                  }`}
                >
                  {props.filteredKeys.map((key) => {
                    const place = PRESET_PLACES[key];
                    return (
                      <div
                        key={key}
                        onClick={() => {
                          props.setActiveKey(key);
                          props.setZoomLevel(1);
                          setIsSearching(false);
                          setDrawerHeight("half");
                        }}
                        className="flex items-center justify-between p-3.5 hover:bg-neutral-50 transition-colors cursor-pointer text-xs font-semibold"
                      >
                        <div className="flex items-center gap-3.5">
                          <MapPin size={14} className="text-blue-500" />
                          <div>
                            <span className="block font-bold">{place.name}</span>
                            <span className="text-[10px] text-gray-400 font-normal">
                              {place.region}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-300" />
                      </div>
                    );
                  })}
                  {props.filteredKeys.length === 0 && (
                    <div
                      onClick={() => {
                        props.handleSearch();
                        setIsSearching(false);
                      }}
                      className="p-4 text-center text-xs text-blue-500 font-bold hover:bg-neutral-50 cursor-pointer"
                    >
                      Press Enter to search "{props.searchQuery}" globally
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 1: EXPLORE DETAILS */}
            {!isSearching && props.activeTab === "explore" && (
              <div className="space-y-4">
                {/* Selected Location Card Banner */}
                <div
                  className={`p-4.5 rounded-2xl border space-y-3.5 relative overflow-hidden ${
                    theme === "dark"
                      ? "bg-zinc-850 border-zinc-800 text-zinc-200"
                      : "bg-white border-zinc-200/70 shadow-sm"
                  }`}
                >
                  <div>
                    <span className="text-[8px] font-extrabold bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">
                      {props.activeKey === "custom" ? "Search coordinates" : "Favorite Location"}
                    </span>
                    <h2 className="text-xl font-black text-black leading-tight mt-1.5">
                      {activeCity.name}
                    </h2>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      {activeCity.region}
                    </p>
                  </div>

                  {/* Weather Info Row */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-neutral-550/5 px-3 py-1.5 rounded-xl border border-zinc-200/30 w-fit">
                    <CloudSun size={15} className="text-amber-500 animate-pulse" />
                    <span>{activeCity.weather}</span>
                  </div>

                  <p className="text-xs leading-relaxed text-gray-600 font-medium">
                    {activeCity.desc}
                  </p>

                  {/* Action Buttons Stack (Directions, Zoom, Share) */}
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <button
                      onClick={() => {
                        props.setActiveTab("directions");
                        setDrawerHeight("full");
                      }}
                      className="flex flex-col items-center justify-center p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all active:scale-95 text-xs font-bold gap-1 cursor-pointer"
                    >
                      <Route size={15} />
                      <span>Directions</span>
                    </button>
                    <button
                      onClick={() => props.handleZoom("in")}
                      className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-all active:scale-95 text-xs font-bold gap-1 cursor-pointer ${
                        theme === "dark"
                          ? "border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 hover:text-white text-zinc-300"
                          : "border-zinc-200 bg-neutral-50 hover:bg-neutral-100 text-gray-700"
                      }`}
                    >
                      <ZoomIn size={15} />
                      <span>Zoom In</span>
                    </button>
                    <button
                      onClick={() =>
                        alert(`Coordinates copied: ${activeCity.lat}, ${activeCity.lon}`)
                      }
                      className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-all active:scale-95 text-xs font-bold gap-1 cursor-pointer ${
                        theme === "dark"
                          ? "border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 hover:text-white text-zinc-300"
                          : "border-zinc-200 bg-neutral-50 hover:bg-neutral-100 text-gray-700"
                      }`}
                    >
                      <Share2 size={15} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Landmarks Info List */}
                <div
                  className={`p-4 rounded-2xl border space-y-3 ${
                    theme === "dark"
                      ? "bg-zinc-850 border-zinc-800 text-zinc-200"
                      : "bg-white border-zinc-200/70 shadow-sm"
                  }`}
                >
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Key Landmarks
                  </h3>
                  <div className="space-y-2">
                    {activeCity.landmarks.map((landmark, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs font-semibold">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                          <MapPin size={12} />
                        </div>
                        <span className="truncate">{landmark}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Favorite Preset Cities Carousel/List */}
                <div className="space-y-2.5">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                    Explore Other Places
                  </h3>
                  <div
                    className={`border rounded-2xl divide-y overflow-hidden ${
                      theme === "dark"
                        ? "bg-zinc-850 border-zinc-800 divide-zinc-800"
                        : "bg-white border-zinc-200/60 divide-zinc-100"
                    }`}
                  >
                    {Object.keys(PRESET_PLACES).map((key) => {
                      const place = PRESET_PLACES[key];
                      const isActive = props.activeKey === key;
                      return (
                        <div
                          key={key}
                          onClick={() => {
                            props.setActiveKey(key);
                            props.setZoomLevel(1);
                          }}
                          className="flex items-center justify-between p-3.5 hover:bg-neutral-50 transition-colors cursor-pointer text-xs font-semibold"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                isActive ? "bg-blue-600 text-white" : "bg-blue-500/10 text-blue-500"
                              }`}
                            >
                              {isActive ? <Check size={13} /> : place.name.charAt(0)}
                            </div>
                            <div>
                              <span className="block font-bold">{place.name}</span>
                              <span className="text-[9.5px] text-gray-400 font-normal">
                                {place.region}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-gray-300" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DIRECTIONS */}
            {!isSearching && props.activeTab === "directions" && (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    theme === "dark"
                      ? "bg-zinc-850 border-zinc-800 text-zinc-200"
                      : "bg-white border-zinc-200/70 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-zinc-200/40">
                    <Navigation size={15} className="text-blue-500 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold">Route Planner Active</h4>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                        Simulating navigation to {activeCity.name}
                      </p>
                    </div>
                  </div>

                  {/* Step by Step Route steps */}
                  <div className="relative pl-3 ml-2 border-l-2 border-blue-500/30 space-y-4 py-1.5">
                    {activeCity.steps.map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot Bullet */}
                        <span className="absolute -left-4.5 top-1 w-2.5 h-2.5 rounded-full border border-white bg-blue-600 shadow-sm" />
                        <div className="space-y-0.5 pl-2">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wide">
                            Waypoint {idx + 1}
                          </span>
                          <p className="text-xs font-medium text-gray-700 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* End Route Action Button */}
                  <button
                    onClick={() => {
                      props.setActiveTab("explore");
                      setDrawerHeight("half");
                    }}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer mt-2"
                  >
                    End Navigation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSection;
