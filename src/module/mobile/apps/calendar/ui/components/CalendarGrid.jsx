import { CATEGORIES, DAYS_SHORT } from "../../data";

const CalendarGrid = ({
  gridCells,
  getEventsForDate,
  isToday,
  isSelected,
  setSelectedDate,
  setDayEventsPopover,
}) => {
  const rowsCount = Math.ceil(gridCells.length / 7);

  return (
    <main className="w-full flex-1 flex flex-col bg-white overflow-hidden select-none h-full min-h-0">
      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-zinc-100 py-2 shrink-0 bg-zinc-50/50">
        {DAYS_SHORT.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-extrabold text-gray-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div
        className="flex-1 grid grid-cols-7 bg-zinc-200 gap-[1px]"
        style={{ gridTemplateRows: `repeat(${rowsCount}, minmax(0, 1fr))` }}
      >
        {gridCells.map((cell, idx) => {
          const cellEvents = getEventsForDate(cell.date);
          const cellIsToday = isToday(cell.date);
          const cellIsSelected = isSelected(cell.date);

          // Max events to show inside the cell is 2
          const visibleEvents = cellEvents.slice(0, 2);
          const hiddenCount = cellEvents.length - visibleEvents.length;

          return (
            <div
              onClick={() => {
                setSelectedDate(cell.date);
                if (cellEvents.length > 0) {
                  setDayEventsPopover({ date: cell.date, events: cellEvents });
                }
              }}
              key={idx}
              className={`
                flex flex-col p-1 bg-white relative cursor-pointer active:bg-zinc-50 transition-colors select-none h-full min-h-0
                ${!cell.isCurrentMonth ? "opacity-35" : ""}
                ${cellIsSelected ? "bg-blue-50/15" : ""}
              `}
            >
              {/* Day indicator row */}
              <div className="flex justify-center shrink-0 mb-2 mt-0.5">
                <div
                  className={`
                    w-6 h-6 flex items-center justify-center text-[11px] font-bold rounded-full transition-all
                    ${cellIsToday ? "bg-[#ff3b30] text-white shadow-sm font-extrabold" : "text-gray-800"}
                    ${cellIsSelected && !cellIsToday ? "border border-blue-500 text-blue-600 font-extrabold" : ""}
                  `}
                >
                  {cell.dayNumber}
                </div>
              </div>

              {/* Event Text Chips list */}
              <div className="flex-1 overflow-y-auto scrollbar-none space-y-0.5 min-h-0">
                {visibleEvents.map((ev) => {
                  const cat = CATEGORIES.find((c) => c.id === ev.category);
                  const catBg = cat ? cat.color : "bg-gray-150";
                  const catText = cat ? cat.text : "text-gray-700";
                  const catBorder = cat ? cat.border : "border-gray-300";

                  return (
                    <div
                      key={ev.id}
                      className={`px-1 py-0.5 text-[8.5px] font-bold rounded border-l-2 leading-none truncate ${catBg}/10 ${catText} ${catBorder}`}
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  );
                })}
                {hiddenCount > 0 && (
                  <div className="px-1 text-[8px] font-bold text-gray-400">+{hiddenCount} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default CalendarGrid;
