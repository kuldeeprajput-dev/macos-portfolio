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
        className="relative flex h-11 shrink-0 items-center border-b border-zinc-200/80 bg-[#f6f6f7] px-4 text-[#1d1d1f]"
      >
        <WindowControls target="map" />
        <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center gap-1.5 text-[13px] font-semibold">
          <Compass size={15} className="text-[#2678ee]" />
          <span>Maps</span>
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
