import OptimizedImage from "@module/shared/ui/components/OptimizedImage";
import useWindowsStore from "@store/window";

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
    <div className="w-[92.2%] h-[92.2%] bg-white rounded-[22.5%] shadow-[0_1px_3px_rgba(0,0,0,0.18)] border border-black/10 overflow-hidden flex flex-col items-center select-none relative aspect-square pointer-events-none">
      <div className="w-full bg-[#ff3b30] text-white text-[8px] sm:text-[9px] font-extrabold py-0.5 text-center leading-none tracking-wider uppercase">
        {days[today.getDay()]}
      </div>
      <div className="flex-1 flex items-center justify-center text-[#1d1d1f] font-bold text-lg sm:text-2xl leading-none font-sans -mt-0.5">
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
              src={`/apps/${icon}`}
              alt={name}
              width={64}
              height={64}
              loading="lazy"
              className={`${canOpen ? "" : "opacity-60"} pointer-events-none`}
            />
          )}
        </span>
        {isOpen && <span className="dock-running-dot" aria-hidden="true" />}
      </button>
    </div>
  );
};

export default DockIcon;
