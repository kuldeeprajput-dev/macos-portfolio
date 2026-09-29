import React, { useState, useEffect, useRef } from "react";
import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import { Compass, PanelLeft, Navigation, LocateFixed, Layers } from "lucide-react";
import useMap from "../../hooks/useMap";
import MapSection from "../section/MapSection";
import MapAboutModal from "./MapAboutModal";

const Map = () => {
  const { windows, setWindowData } = useWindowsStore();
  const [showAbout, setShowAbout] = useState(false);
  const props = useMap();

  const containerRef = useRef(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setIsNarrow(width < 680);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isNarrow) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isNarrow]);

  useEffect(() => {
    if (windows.map?.data?.openAbout) {
      setShowAbout(true);
      setWindowData("map", { ...windows.map.data, openAbout: false });
    }
  }, [windows.map?.data?.openAbout, windows.map?.data, setWindowData]);

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-col h-full w-full bg-[#f6f6f6] text-gray-800 font-sans select-none rounded-xl overflow-hidden shadow-2xl border border-zinc-200/80 relative @container"
      >
        <div
          id="window-header"
          className="shrink-0 h-12 bg-[#f6f6f7] border-b border-zinc-200/80 px-4 flex items-center justify-between text-xs text-gray-700 relative z-40 select-none cursor-default"
        >
          <div className="flex items-center gap-3">
            <WindowControls target="map" />
            {isNarrow && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="ml-1 flex items-center justify-center rounded-md p-1 text-gray-700 transition-colors hover:bg-zinc-200 cursor-pointer"
                aria-label="Toggle sidebar"
                aria-expanded={isSidebarOpen}
              >
                <PanelLeft size={16} />
              </button>
            )}
            <div className="flex items-center gap-1.5 font-semibold text-[13px]">
              <Compass size={15} className="text-[#2678ee]" strokeWidth={2} />
              <span>Maps</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#2377eb]">
            <button
              type="button"
              onClick={() => {
                props.setActiveTab("directions");
                setIsSidebarOpen(true);
              }}
              className="flex h-8 items-center gap-1.5 rounded-md px-2 hover:bg-zinc-200/70 cursor-pointer"
              aria-label="Show directions"
            >
              <Navigation size={15} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={props.handleLocateMe}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-200/70 cursor-pointer"
              aria-label="Find my location"
            >
              <LocateFixed size={17} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() =>
                props.setMapStyle((style) => (style === "standard" ? "satellite" : "standard"))
              }
              className={`flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-200/70 cursor-pointer ${props.mapStyle === "satellite" ? "bg-blue-100" : ""}`}
              aria-label={
                props.mapStyle === "standard" ? "Show satellite map" : "Show standard map"
              }
            >
              <Layers size={17} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0 relative">
          <MapSection
            {...props}
            isNarrow={isNarrow}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
      </div>
      <MapAboutModal show={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
};

const MapWindow = windowWrapper(Map, "map");
export default MapWindow;
