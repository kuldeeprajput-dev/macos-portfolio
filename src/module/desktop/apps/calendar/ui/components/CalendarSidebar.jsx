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
      absolute inset-y-0 left-0 w-56 bg-gray-50 border-r border-[#d1d1d1] p-4 flex flex-col z-20 transition-all duration-300 shrink-0
      ${isNarrow ? "absolute bg-gray-50/95 shadow-lg" : "relative"}
      ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full w-0 opacity-0 overflow-hidden pointer-events-none"}
    `}
    >
      <div className="space-y-4 flex-1 overflow-y-auto thin-scrollbar -mr-4 pr-4">
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
            Calendars
          </h3>
          <nav className="space-y-1">
            {CATEGORIES.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-gray-200/50 cursor-pointer select-none transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs">{cat.dot}</span>
                  <span className="text-xs font-semibold text-gray-700">{cat.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeCategories[cat.id]}
                  onChange={() => toggleCategory(cat.id)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
            ))}
          </nav>
        </div>

        <div className="space-y-2.5 pt-4 border-t border-gray-200">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
            Upcoming Events
          </h3>
          <div className="space-y-2 divide-y divide-gray-150">
            {filteredEvents.length === 0 ? (
              <p className="text-[11px] text-gray-400 italic px-1">No upcoming events scheduled.</p>
            ) : (
              filteredEvents
                .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))
                .slice(0, 5)
                .map((ev) => {
                  const _cat = CATEGORIES.find((c) => c.id === ev.category);
                  const eventDateObj = new Date(ev.date + "T00:00:00");
                  return (
                    <div
                      key={ev.id}
                      className="pt-2 first:pt-0 group relative flex justify-between items-start"
                    >
                      <div className="space-y-0.5 min-w-0 pr-6">
                        <h4 className="text-[11px] font-bold text-gray-800 truncate">{ev.title}</h4>
                        <p className="text-[9px] text-gray-400 flex items-center gap-1 font-semibold">
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
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer absolute right-0 top-0.5"
                        title="Delete event"
                      >
                        <Trash2 className="w-3 h-3" />
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
