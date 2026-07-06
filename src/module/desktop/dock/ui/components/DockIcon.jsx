import OptimizedImage from "@module/shared/ui/components/OptimizedImage";
import useWindowsStore from "@store/window";

const scaleMap = {
  finder: "scale-[0.90]",
  launchpad: "scale-[0.90]",
  safari: "scale-[0.90]",
  photos: "scale-[0.90]",
  contact: "scale-[0.90]",
  terminal: "scale-[0.90]",
  settings: "scale-[0.83]",
  calculator: "scale-[0.83]",
  notes: "scale-[0.90]",
  messages: "scale-[0.90]",
  appletv: "scale-[0.80]",
  call: "scale-[0.71]",
  appstore: "scale-[0.90]",
  weather: "scale-[0.79]",
  vscode: "scale-[0.95]",
  postman: "scale-[0.95]",
  map: "scale-[0.73]",
  font: "scale-[2.7]",
  telegram: "scale-[0.90]",
  music: "scale-[0.90]",
  folder: "scale-[0.80]",
  trash: "scale-[0.80]",
};

const statusLabel = (name, state, canOpen) => {
  if (!canOpen) return name;
  if (state?.isMinimized) return `${name}, minimized`;
  if (state?.isOpen) return `${name}, open`;
  return name;
};

const CalendarIcon = () => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date();
  return (
    <div className="w-full h-full bg-white rounded-[13px] border border-black/10 shadow-sm overflow-hidden flex flex-col items-center select-none scale-[0.76] relative aspect-square transition-all duration-200 hover:scale-[0.82]">
      <div className="w-full bg-[#ff3b30] text-white text-[9px] font-extrabold py-0.5 text-center leading-none tracking-wider uppercase">
        {days[today.getDay()]}
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-855 font-bold text-2xl leading-none font-sans -mt-0.5">
        {today.getDate()}
      </div>
    </div>
  );
};

const DockIcon = ({
  app,
  state,
  isFocused,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
  draggable,
  onDragStart,
  onDragOver,
  onDragEnd,
  style,
}) => {
  const { id, name, icon, canOpen } = app;
  const isOpen = Boolean(state?.isOpen);
  const isMinimized = Boolean(state?.isMinimized);
  const isDockDragging = useWindowsStore((state) => state.isDockDragging);

  return (
    <div
      className={[
        "dock-item relative flex justify-center cursor-grab active:cursor-grabbing select-none",
        isOpen ? "dock-item-open" : "",
        isMinimized ? "dock-item-minimized" : "",
        isFocused ? "dock-item-focused" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      style={style}
    >
      <button
        type="button"
        className="dock-icon relative flex justify-center items-center overflow-visible"
        aria-label={statusLabel(name, state, canOpen)}
        aria-pressed={canOpen ? isOpen : undefined}
        disabled={!canOpen}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {isHovered && !isDockDragging && (
          <span className="dock-tooltip-custom animate-tooltip">{name}</span>
        )}
        <span className="size-full flex items-center justify-center overflow-hidden">
          {id === "calendar" ? (
            <CalendarIcon />
          ) : (
            <OptimizedImage
              src={`/images/${icon}`}
              alt={name}
              width={64}
              height={64}
              loading="lazy"
              className={`${canOpen ? "" : "opacity-60"} ${scaleMap[id] || ""} pointer-events-none`}
            />
          )}
        </span>
        {isOpen && <span className="dock-running-dot" aria-hidden="true" />}
      </button>
    </div>
  );
};

export default DockIcon;
