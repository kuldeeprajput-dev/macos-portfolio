import React, { useState, useEffect, useRef } from "react";
import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import { Compass, PanelLeft, MapPin } from "lucide-react";
import useMap from "../../hooks/useMap";
import MapSection from "../section/MapSection";
import MapAboutModal from "./MapAboutModal";

const Map = () => {
  const { windows, setWindowData } = useWindowsStore();
  const [showAbout, setShowAbout] = useState(false);
  const props = useMap();

  const containerRef = useRef(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const [isVeryNarrow, setIsVeryNarrow] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setIsNarrow(width < 680);
        setIsVeryNarrow(width < 500);
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
          className="shrink-0 bg-[#f3f3f3] border-b border-zinc-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600 relative z-40 select-none cursor-default"
        >
          <div className="flex items-center gap-2">
            <WindowControls target="map" />
            {isNarrow && (
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="p-1 rounded hover:bg-zinc-200 transition-colors ml-1 cursor-pointer text-gray-700 flex items-center justify-center active:scale-95"
                title="Toggle Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}
            {!isNarrow && (
              <div className="font-semibold pl-4 flex items-center gap-1.5 select-none">
                <Compass size={14} className="text-blue-500 shrink-0" />
                <span>Maps</span>
              </div>
            )}
          </div>

          <button
            onClick={() => props.handleLocateMe()}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-zinc-200/60 transition-colors cursor-pointer"
            title="Find My Location"
          >
            <MapPin size={14} className="text-red-500 shrink-0 fill-red-500/20" />
            <span className="font-bold text-gray-700 text-xs">
              {props.currentCity?.name || "Current Location"}
            </span>
          </button>

          <div className="w-16 flex justify-end">
            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded font-bold">
              MAPS
            </span>
          </div>
        </div>

        <div className="flex-1 flex min-h-0 relative">
          <MapSection
            {...props}
            isNarrow={isNarrow}
            isVeryNarrow={isVeryNarrow}
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
