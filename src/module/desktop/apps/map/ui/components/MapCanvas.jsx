import { memo } from "react";
import { ExternalLink } from "lucide-react";
import useWindowsStore from "@store/window";

const MapCanvas = ({ currentCity, iframeSrc }) => {
  const isOpen = useWindowsStore((state) => state.windows.map?.isOpen);

  if (!isOpen) {
    return <div className="w-full h-full bg-white" />;
  }

  return (
    <div className="w-full h-full overflow-hidden relative bg-[#f4f3f0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-zinc-500 select-none">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2678ee] border-t-transparent" />
        <span className="text-[12px]">Loading map...</span>
      </div>

      <iframe
        src={iframeSrc}
        title={`Map showing ${currentCity.name}`}
        className="absolute inset-x-0 bottom-0 z-0 w-full border-none bg-white"
        style={{ top: "-44px", height: "calc(100% + 44px)" }}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${currentCity.lat},${currentCity.lon}`}
        target="_blank"
        rel="noreferrer"
        className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white/95 px-3 py-2 text-[12px] font-medium text-[#2678ee] shadow-md backdrop-blur-md hover:bg-white"
      >
        Open in Maps <ExternalLink size={13} />
      </a>
    </div>
  );
};

export default memo(MapCanvas);
