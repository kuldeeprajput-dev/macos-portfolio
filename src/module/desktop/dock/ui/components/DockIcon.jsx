import OptimizedImage from "@module/shared/ui/components/OptimizedImage";
import useWindowsStore from "@store/window";
import { useRef } from "react";

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
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  style,
}) => {
  const { id, name, icon, canOpen } = app;
  const isOpen = Boolean(state?.isOpen);
  const isMinimized = Boolean(state?.isMinimized);
  const isDockDragging = useWindowsStore((state) => state.isDockDragging);

  const didDragRef = useRef(false);

  const handleClick = (e) => {
    // Suppress opening app if the gesture was a drag
    if (didDragRef.current || isDockDragging || isDragging) {
      e.preventDefault();
      e.stopPropagation();
      didDragRef.current = false;
      return;
    }
    onClick?.(e);
  };

  const handleDragStartInternal = (e) => {
    didDragRef.current = true;
    onDragStart?.(e);
  };

  const handleDragEndInternal = (e) => {
    onDragEnd?.(e);
    // Keep didDrag true for a split-second so the browser's subsequent click event is suppressed
    setTimeout(() => {
      didDragRef.current = false;
    }, 60);
  };

  const handleMouseEnterInternal = (e) => {
    if (isDockDragging || isDragging) return;
    onMouseEnter?.(e);
  };

  return (
    <div
      className={[
        "dock-item relative flex justify-center select-none cursor-pointer",
        isDragging ? "is-dragging cursor-grabbing opacity-30" : "cursor-pointer",
        isOpen ? "dock-item-open" : "",
        isMinimized ? "dock-item-minimized" : "",
        isFocused ? "dock-item-focused" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      draggable={true}
      data-app-id={id}
      onDragStart={handleDragStartInternal}
      onDragOver={onDragOver}
      onDragEnd={handleDragEndInternal}
      onMouseEnter={handleMouseEnterInternal}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        // Handle clicks that hit dock-item outside the button
        if (!e.target.closest(".dock-icon")) {
          handleClick(e);
        }
      }}
      style={style}
    >
      <button
        type="button"
        className="dock-icon relative flex justify-center items-center overflow-visible cursor-pointer"
        aria-label={statusLabel(name, state, canOpen)}
        aria-pressed={canOpen ? isOpen : undefined}
        disabled={!canOpen}
        onClick={handleClick}
      >
        {isHovered && !isDockDragging && !isDragging && (
          <span className="dock-tooltip-custom animate-tooltip">{name}</span>
        )}
        <span className="size-full flex items-center justify-center overflow-hidden">
          {id === "calendar" ? (
            <CalendarIcon />
          ) : (
            <OptimizedImage
              src={icon?.startsWith("/") ? icon : `/apps/${icon}`}
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
