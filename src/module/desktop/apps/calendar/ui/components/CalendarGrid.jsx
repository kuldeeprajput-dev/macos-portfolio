import { Plus } from "lucide-react";
import { CATEGORIES, DAYS_SHORT } from "../../data/calendarData";

const CalendarGrid = ({
  gridCells,
  getEventsForDate,
  isToday,
  isSelected,
  _selectedDate,
  setSelectedDate,
  triggerAddEventOnDate,
  setDayEventsPopover,
  isNarrow,
}) => (
  <main className="flex-1 flex flex-col bg-white overflow-hidden h-full min-w-0">
    <div className="grid grid-cols-7 border-b border-gray-100 py-2 shrink-0 bg-gray-50/50">
      {DAYS_SHORT.map((day) => (
        <div
          key={day}
          className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider"
        >
          {isNarrow ? day.charAt(0) : day}
        </div>
      ))}
    </div>

    <div className="flex-1 grid grid-cols-7 grid-rows-5 border-l border-gray-100 bg-gray-100 gap-[1px]">
      {gridCells.map((cell, idx) => {
        const cellEvents = getEventsForDate(cell.date);
        const cellIsToday = isToday(cell.date);
        const cellIsSelected = isSelected(cell.date);

        return (
          <div
            key={idx}
            onClick={() => setSelectedDate(cell.date)}
            onDoubleClick={() => triggerAddEventOnDate(cell.date)}
            className={`
              p-1.5 flex flex-col bg-white min-w-0 h-full relative cursor-pointer group hover:bg-gray-50/70 transition-all select-none
              ${!cell.isCurrentMonth ? "opacity-40" : ""}
              ${cellIsSelected ? "bg-blue-50/30" : ""}
            `}
          >
            <div className="flex items-center justify-between mb-1 shrink-0">
              <span
                className={`
                  w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full
                  ${cellIsToday ? "bg-[#ff3b30] text-white" : "text-gray-800"}
                  ${cellIsSelected && !cellIsToday ? "border border-blue-500 text-blue-600 font-extrabold" : ""}
                `}
              >
                {cell.dayNumber}
              </span>
              {!isNarrow && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerAddEventOnDate(cell.date);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-blue-600 hover:bg-blue-50 rounded p-0.5 transition-opacity duration-150 cursor-pointer"
                  title="Add Event"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto thin-scrollbar space-y-1 mt-0.5">
              {!isNarrow ? (
                <div className="space-y-0.5">
                  {cellEvents.map((ev) => {
                    const cat = CATEGORIES.find((c) => c.id === ev.category);
                    return (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(cell.date);
                          setDayEventsPopover({ date: cell.date, events: cellEvents });
                        }}
                        className={`
                          px-1.5 py-0.5 text-[9px] font-bold rounded truncate border-l-2 leading-tight flex items-center gap-1
                          ${cat?.color ? `${cat.color}/10 ${cat.text} ${cat.border}` : "bg-gray-100 text-gray-700 border-gray-300"}
                        `}
                        title={`${ev.title} (${ev.start} - ${ev.end})`}
                      >
                        <span className="truncate">{ev.title}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-0.5 justify-center mt-1">
                  {cellEvents.map((ev) => {
                    const cat = CATEGORIES.find((c) => c.id === ev.category);
                    return (
                      <span
                        key={ev.id}
                        className={`w-1.5 h-1.5 rounded-full ${cat?.color || "bg-gray-400"}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </main>
);

export default CalendarGrid;
