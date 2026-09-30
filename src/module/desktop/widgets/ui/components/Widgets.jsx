import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useWindowsStore from "@store/window";
import useWidgetsStore from "@store/widgets";
import useTimeStore from "@store/time";
import AnalogClockFace from "./AnalogClockFace";
import WEATHER_DATA from "@module/desktop/apps/weather/data/weatherData";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";

const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  return [...Array(firstDay).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];
};

const ClockCalendarWidget = ({ time }) => {
  const monthName = time.toLocaleDateString("en-US", { month: "long" });
  const dateHeader = time
    .toLocaleDateString("en-US", { month: "long", day: "numeric", weekday: "long" })
    .toUpperCase();
  const days = getCalendarDays(time.getFullYear(), time.getMonth());
  const timeString = `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="flex h-full w-full flex-col items-center text-center font-sans text-white">
      <div className="text-[12px] font-semibold tracking-wider text-white/80">{dateHeader}</div>
      <div className="mt-1 text-[56px] font-extralight leading-none tracking-tight">
        {timeString}
      </div>
      <div className="mt-4 text-[12px] font-bold uppercase tracking-wider text-white/50">
        {monthName}
      </div>
      <div className="mt-2.5 grid w-full grid-cols-7 gap-x-2.5 gap-y-2 text-[11px] font-semibold text-white/40">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={`${day}-${index}`} className="w-7 text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-2 grid w-full grid-cols-7 gap-x-2.5 gap-y-2 text-[13px]">
        {days.map((day, index) => (
          <div key={index} className="relative flex h-7 w-7 items-center justify-center">
            {day && (
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-semibold ${
                  day === time.getDate()
                    ? "scale-105 bg-white text-zinc-900 shadow-md"
                    : "text-white/80"
                }`}
              >
                {day}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ClockWidget = ({ time }) => (
  <div className="flex h-full flex-col items-center justify-center text-white">
    <div className="text-[48px] font-extralight tracking-tight">
      {String(time.getHours()).padStart(2, "0")}:{String(time.getMinutes()).padStart(2, "0")}
    </div>
    <div className="text-xs font-medium text-white/65">
      {time.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
    </div>
  </div>
);

const AnalogClockWidget = ({ time }) => (
  <div className="flex h-full w-full items-center justify-center">
    <AnalogClockFace
      time={time}
      className="h-full max-h-[184px] w-full max-w-[184px] drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]"
    />
  </div>
);

const WeatherWidget = () => {
  const weather = WEATHER_DATA.delhi;
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/20 bg-gradient-to-br from-sky-500/35 to-blue-800/45 p-4 text-white shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between text-xs font-medium text-white/75">
        <span>{weather.name}</span>
        <span>Today</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-5xl font-light">{weather.tempC}°</div>
          <div className="mt-1 text-sm text-white/80">{weather.condition}</div>
        </div>
        <img src="/weather/sunny-sky.webp" alt="" className="h-16 w-16 rounded-full object-cover" />
      </div>
      <div className="text-xs text-white/70">
        H:{weather.highC}° &nbsp; L:{weather.lowC}°
      </div>
    </div>
  );
};

const BatteryWidget = () => {
  const [battery, setBattery] = useState({ level: null, charging: false, supported: false });

  useEffect(() => {
    let manager;
    let mounted = true;
    const updateBattery = () => {
      if (!manager || !mounted) return;
      setBattery({
        level: Math.round(manager.level * 100),
        charging: manager.charging,
        supported: true,
      });
    };

    if (!navigator.getBattery) return undefined;

    navigator
      .getBattery()
      .then((batteryManager) => {
        if (!mounted) return;
        manager = batteryManager;
        updateBattery();
        manager.addEventListener("levelchange", updateBattery);
        manager.addEventListener("chargingchange", updateBattery);
      })
      .catch(() => {});

    return () => {
      mounted = false;
      if (manager) {
        manager.removeEventListener("levelchange", updateBattery);
        manager.removeEventListener("chargingchange", updateBattery);
      }
    };
  }, []);

  return (
    <div className="flex h-full flex-col justify-between p-3 text-white">
      <div className="flex items-center justify-between text-xs font-medium text-white/65">
        <span>Battery</span>
        {battery.charging && <span className="text-green-300">Charging</span>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-[58px] rounded-[7px] border-2 border-white/80 p-[3px]">
          <span
            className="block h-full rounded-[3px] bg-green-400 transition-[width]"
            style={{ width: `${battery.level ?? 0}%` }}
          />
          <span className="absolute -right-[5px] top-2 h-3 w-[3px] rounded-r-sm bg-white/80" />
        </div>
        <span className="text-2xl font-light">
          {battery.supported && battery.level !== null ? `${battery.level}%` : "--%"}
        </span>
      </div>
      <span className="text-[10px] text-white/55">
        {battery.supported
          ? battery.charging
            ? "Power adapter"
            : "On battery"
          : "Battery status unavailable"}
      </span>
    </div>
  );
};

const NotesWidget = () => {
  const openWindow = useWindowsStore((state) => state.openWindow);
  const [note, setNote] = useState({
    title: "Quick Note",
    preview: "Open Notes to capture an idea.",
  });

  useEffect(() => {
    try {
      const savedNotes = JSON.parse(localStorage.getItem("macos_portfolio_notes") || "[]");
      const recentNote = savedNotes[0];
      if (recentNote) {
        setNote({
          title: recentNote.title || "Quick Note",
          preview: recentNote.preview || recentNote.title || "Open Notes to capture an idea.",
        });
      }
    } catch {
      // Keep the Notes widget available if saved note data is invalid.
    }
  }, []);

  return (
    <button
      type="button"
      onClick={() => openWindow("notes")}
      className="flex h-full w-full flex-col items-start rounded-2xl border border-amber-100/60 bg-[#f9e7a6]/95 p-3 text-left text-zinc-800 shadow-md"
    >
      <span className="text-xs font-semibold">{note.title}</span>
      <span className="mt-2 line-clamp-4 text-[11px] leading-relaxed text-zinc-600">
        {note.preview}
      </span>
    </button>
  );
};

const WIDGET_SIZES = {
  "clock-calendar": { width: 264, height: 310 },
  clock: { width: 190, height: 130 },
  "analog-clock": { width: 200, height: 200 },
  weather: { width: 220, height: 170 },
  battery: { width: 190, height: 130 },
  notes: { width: 220, height: 150 },
};

const WIDGET_SIZE_OPTIONS = {
  "clock-calendar": {
    medium: { width: 264, height: 310 },
    large: { width: 300, height: 350 },
  },
  clock: {
    small: { width: 150, height: 100 },
    medium: { width: 190, height: 130 },
    large: { width: 240, height: 160 },
  },
  "analog-clock": {
    small: { width: 150, height: 150 },
    medium: { width: 200, height: 200 },
    large: { width: 260, height: 260 },
  },
  weather: {
    small: { width: 180, height: 140 },
    medium: { width: 220, height: 170 },
    large: { width: 280, height: 210 },
  },
  battery: {
    small: { width: 150, height: 100 },
    medium: { width: 190, height: 130 },
    large: { width: 230, height: 155 },
  },
  notes: {
    small: { width: 160, height: 120 },
    medium: { width: 220, height: 150 },
    large: { width: 280, height: 200 },
  },
};

const WIDGET_LABELS = {
  "clock-calendar": "Time & Calendar",
  clock: "Clock",
  "analog-clock": "Analog Clock",
  weather: "Weather",
  battery: "Battery",
  notes: "Notes",
};

const WIDGET_LINKS = {
  "clock-calendar": { label: "Open Calendar", app: "calendar" },
  weather: { label: "Open Weather", app: "weather" },
  notes: { label: "Open Notes", app: "notes" },
};

const WidgetContextMenu = ({ menu, onClose, onRemove, onResize, onOpen, size }) => {
  const menuRef = useRef(null);
  const type = menu?.type;
  const sizeOptions = WIDGET_SIZE_OPTIONS[type] || {};
  const link = WIDGET_LINKS[type];

  useEffect(() => {
    if (!menu) return undefined;
    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) onClose();
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", onClose);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", onClose);
    };
  }, [menu, onClose]);

  if (!menu || typeof document === "undefined") return null;

  const width = 208;
  const height = 90 + Object.keys(sizeOptions).length * 27 + (link ? 36 : 0);
  const left = Math.max(8, Math.min(menu.x, window.innerWidth - width - 8));
  const top = Math.max(8, Math.min(menu.y, window.innerHeight - height - 8));

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[100001] w-[208px] select-none rounded-[10px] border border-white/15 p-1 font-sans text-[13px] leading-tight text-white shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
      style={{
        left,
        top,
        background: "rgba(30, 30, 30, 0.82)",
        backdropFilter: "blur(32px) saturate(180%)",
        WebkitBackdropFilter: "blur(32px) saturate(180%)",
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div className="px-2.5 py-1.5 text-[11px] font-medium text-white/55">
        {WIDGET_LABELS[type]}
      </div>
      {link && (
        <button
          type="button"
          className="widget-menu-item"
          onClick={() => {
            onOpen(link.app);
            onClose();
          }}
        >
          {link.label}
        </button>
      )}
      <div className="my-1 h-px bg-white/15" />
      <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
        Size
      </div>
      {Object.entries(sizeOptions).map(([option, dimensions]) => (
        <button
          key={option}
          type="button"
          className="widget-menu-item justify-between"
          aria-pressed={size === option}
          onClick={() => {
            onResize(type, option, dimensions);
            onClose();
          }}
        >
          <span className="capitalize">{option}</span>
          {size === option && <span aria-hidden="true">✓</span>}
        </button>
      ))}
      <div className="my-1 h-px bg-white/15" />
      <button
        type="button"
        className="widget-menu-item"
        onClick={() => {
          onRemove(type);
          onClose();
        }}
      >
        Remove Widget
      </button>
    </div>,
    document.body,
  );
};

const WIDGET_COMPONENTS = {
  "clock-calendar": ClockCalendarWidget,
  clock: ClockWidget,
  "analog-clock": AnalogClockWidget,
  weather: WeatherWidget,
  battery: BatteryWidget,
  notes: NotesWidget,
};

const DesktopWidgets = () => {
  const widgets = useWidgetsStore((state) => state.widgets);
  const toggleWidget = useWidgetsStore((state) => state.toggleWidget);
  const replaceWidget = useWidgetsStore((state) => state.replaceWidget);
  const time = useTimeStore((state) => state.time);
  const windows = useWindowsStore((state) => state.windows);
  const openWindow = useWindowsStore((state) => state.openWindow);
  const widgetsLayerRef = useRef(null);
  const [widgetMenu, setWidgetMenu] = useState(null);
  const [widgetSizes, setWidgetSizes] = useState({});
  const widgetIds = widgets.join(",");

  useEffect(() => {
    if (widgets.includes("calendar")) replaceWidget("calendar", "analog-clock");
    else if (widgets.includes("projects")) replaceWidget("projects", "analog-clock");
  }, [widgets, replaceWidget]);
  const isAnyWindowOpen = useMemo(
    () => Object.values(windows).some((win) => win.isOpen && !win.isMinimized),
    [windows],
  );

  useGSAP(() => {
    const elements = widgetsLayerRef.current?.querySelectorAll(".desktop-widget");
    if (!elements?.length) return;

    const instances = Draggable.create(elements, {
      bounds: "#desktop-area",
      allowContextMenu: true,
      dragClickables: true,
      cursor: "default",
      activeCursor: "grabbing",
      onDragStart: () => document.body.classList.add("widget-dragging"),
      onDragEnd: () => document.body.classList.remove("widget-dragging"),
      onRelease: () => document.body.classList.remove("widget-dragging"),
    });
    return () => {
      document.body.classList.remove("widget-dragging");
      instances.forEach((instance) => instance.kill());
    };
  }, [widgetIds]);

  const columns = Math.max(
    1,
    Math.floor(((typeof window === "undefined" ? 1440 : window.innerWidth) - 80) / 280),
  );

  return (
    <div
      ref={widgetsLayerRef}
      className={`pointer-events-none absolute inset-0 z-[2] ${isAnyWindowOpen ? "desktop-dimmed" : ""}`}
    >
      {widgets.map((type, index) => {
        const Widget = WIDGET_COMPONENTS[type];
        const size = widgetSizes[type]?.dimensions || WIDGET_SIZES[type];
        if (!Widget || !size) return null;
        const row = Math.floor(index / columns);
        const column = index % columns;
        return (
          <div
            key={type}
            className="widget-container desktop-widget pointer-events-auto"
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setWidgetMenu({ type, x: event.clientX, y: event.clientY });
            }}
            style={{
              width: `${size.width}px`,
              height: `${size.height}px`,
              top: `${135 + row * 330}px`,
              right: `${40 + column * 280}px`,
            }}
          >
            {type === "clock" || type === "analog-clock" || type === "clock-calendar" ? (
              <Widget time={time} />
            ) : (
              <Widget />
            )}
          </div>
        );
      })}
      <WidgetContextMenu
        menu={widgetMenu}
        size={widgetSizes[widgetMenu?.type]?.option || "medium"}
        onClose={() => setWidgetMenu(null)}
        onRemove={toggleWidget}
        onResize={(type, option, dimensions) => {
          setWidgetSizes((current) => ({
            ...current,
            [type]: { option, dimensions },
          }));
        }}
        onOpen={openWindow}
      />
    </div>
  );
};

export default DesktopWidgets;
export { DesktopWidgets };
