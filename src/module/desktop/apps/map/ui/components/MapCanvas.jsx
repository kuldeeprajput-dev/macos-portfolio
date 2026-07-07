import { memo } from "react";
import { Compass } from "lucide-react";
import useWindowsStore from "@store/window";

const MapCanvas = ({ currentCity, mapStyle, iframeSrc }) => {
  const isOpen = useWindowsStore((state) => state.windows.map?.isOpen);

  if (!isOpen) {
    return <div className="w-full h-full bg-white" />;
  }

  return (
    <div className="w-full h-full overflow-hidden relative bg-[#f4f3f0] flex items-center justify-center">
      {/* Beautiful map grid background behind the iframe */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />
      <div className="flex flex-col items-center gap-3 text-zinc-400 select-none">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold font-sans tracking-wide">Syncing Telemetry...</span>
      </div>

      <iframe
        src={iframeSrc}
        title={`Map showing ${currentCity.name}`}
        className="absolute inset-0 w-full h-full border-none bg-white z-0"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
};

export default memo(MapCanvas);
