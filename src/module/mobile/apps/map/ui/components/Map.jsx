import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import { Compass } from "lucide-react";
import useMap from "../../hooks/useMap";
import MapSection from "../section/MapSection";

const Map = () => {
  const props = useMap();

  return (
    <div className="flex flex-col h-full w-full bg-[#f6f6f6] text-gray-800 font-sans select-none rounded-xl overflow-hidden shadow-2xl border border-zinc-200/80">
      <div
        id="window-header"
        className="shrink-0 bg-[#f3f3f3] border-b border-zinc-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600"
      >
        <div className="flex items-center gap-2">
          <WindowControls target="map" />
          <div className="font-semibold pl-4 hidden md:flex items-center gap-1.5 select-none">
            <Compass size={14} className="text-blue-500 shrink-0" />
            <span>Maps</span>
          </div>
        </div>

        <div className="w-16 flex justify-end">
          <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded font-bold">
            MAPS
          </span>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 relative">
        <MapSection {...props} />
      </div>
    </div>
  );
};

const MapWindow = windowWrapper(Map, "map");
export default MapWindow;
