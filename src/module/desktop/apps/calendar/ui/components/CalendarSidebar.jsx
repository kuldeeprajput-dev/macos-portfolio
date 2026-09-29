import { Trash2 } from "lucide-react";
import { CATEGORIES } from "../../data/calendarData";

const CalendarSidebar = ({
  activeCategories,
  toggleCategory,
  filteredEvents,
  handleDeleteEvent,
  isSidebarOpen,
  setIsSidebarOpen,
  isNarrow,
}) => (
  <>
    {isNarrow && isSidebarOpen && (
      <div
        onClick={() => setIsSidebarOpen(false)}
        className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-10 animate-fade-in cursor-pointer"
      />
    )}
    <aside
      className={`
      absolute inset-y-0 left-0 ${isNarrow ? "w-56" : "w-64"} bg-[#f5f5f7] border-r border-black/[0.08] px-4 py-5 flex flex-col z-20 transition-all duration-300 shrink-0
      ${isNarrow ? "absolute bg-gray-50/95 shadow-lg" : "relative"}
      ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full w-0 opacity-0 overflow-hidden pointer-events-none"}
    `}
    >
      <div className="space-y-5 flex-1 overflow-y-auto thin-scrollbar -mr-4 pr-4">
        <div className="space-y-2.5">
          <h3 className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-[0.08em] px-2">
            Calendars
          </h3>
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <label
                key={cat.id}
                className="flex min-h-9 items-center justify-between px-2.5 rounded-md cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-3 rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.14)]"
                    style={{ backgroundColor: cat.swatchColor }}
                    aria-hidden="true"
                  />
                  <span className="text-[13px] font-medium text-[#303036]">{cat.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeCategories[cat.id]}
                  onChange={() => toggleCategory(cat.id)}
                  aria-label={`Show ${cat.label} calendar`}
                  className="size-4 accent-[#0a84ff] cursor-pointer"
                />
              </label>
            ))}
          </nav>
        </div>

        <div className="space-y-2.5 border-t border-black/[0.08] pt-4">
          <h3 className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-[0.08em] px-2">
            Upcoming Events
          </h3>
          <div className="space-y-0.5">
            {filteredEvents.length === 0 ? (
              <p className="rounded-md px-2 py-2 text-[11px] text-[#8e8e93]">
                No upcoming events scheduled.
              </p>
            ) : (
              filteredEvents
                .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))
                .slice(0, 5)
                .map((ev) => {
                  const category = CATEGORIES.find((c) => c.id === ev.category);
                  const eventDateObj = new Date(ev.date + "T00:00:00");
                  return (
                    <div
                      key={ev.id}
                      className="group relative flex min-h-[58px] items-start gap-2 rounded-md px-2 py-2 hover:bg-white/90 transition-colors"
                    >
                      <span
                        className="mt-1 size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: category?.swatchColor || "#8e8e93" }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1 space-y-1 pr-5">
                        <h4 className="truncate text-[12px] font-medium leading-4 text-[#303036]">
                          {ev.title}
                        </h4>
                        <p className="flex items-center gap-1 text-[10px] font-medium leading-3.5 text-[#8e8e93]">
                          <span>
                            {eventDateObj.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span>
                            {ev.start} - {ev.end}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="absolute right-1 top-1 rounded p-1 text-[#8e8e93] opacity-0 transition-opacity hover:bg-black/5 hover:text-red-500 focus:opacity-100 group-hover:opacity-100 cursor-pointer"
                        title="Delete event"
                        aria-label={`Delete ${ev.title}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </aside>
  </>
);

export default CalendarSidebar;
