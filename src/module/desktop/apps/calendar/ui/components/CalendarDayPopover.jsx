import { X, Info, Trash2 } from "lucide-react";
import { CATEGORIES } from "../../data/calendarData";

const CalendarDayPopover = ({
  dayEventsPopover,
  setDayEventsPopover,
  handleDeleteEvent,
  triggerAddEventOnDate,
  isNarrow,
  isVeryNarrow,
}) => {
  if (!dayEventsPopover) return null;

  return (
    <div
      className={`absolute inset-0 bg-black/20 backdrop-blur-[0.5px] z-40 flex items-center justify-center ${isVeryNarrow ? "p-2" : "p-4"}`}
    >
      <div
        className={`w-full max-w-[340px] max-h-[92%] bg-white rounded-2xl shadow-2xl border border-black/10 flex flex-col animate-fade-in relative ${isVeryNarrow ? "p-3.5 gap-2.5" : "p-5 gap-4"}`}
      >
        <button
          onClick={() => setDayEventsPopover(null)}
          className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 rounded p-0.5 cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            Schedule for{" "}
            {dayEventsPopover.date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
        </div>

        <div className="flex-1 min-h-[80px] max-h-[220px] overflow-y-auto thin-scrollbar space-y-2.5 divide-y divide-gray-100">
          {dayEventsPopover.events.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-2">No events scheduled on this day.</p>
          ) : (
            dayEventsPopover.events.map((ev) => {
              const cat = CATEGORIES.find((c) => c.id === ev.category);
              return (
                <div
                  key={ev.id}
                  className="pt-2.5 first:pt-0 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat ? cat.color.replace("bg-", "") : "#ccc" }}
                      />
                      <h4 className="text-xs font-bold text-gray-800 truncate">{ev.title}</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold pl-4">
                      {ev.start} - {ev.end} ({cat?.label})
                    </p>
                    {ev.desc && (
                      <p className="text-[10px] text-gray-500 pl-4 leading-normal font-medium">
                        {ev.desc}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors shrink-0 cursor-pointer self-start"
                    title="Delete event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={() => {
            triggerAddEventOnDate(dayEventsPopover.date);
            setDayEventsPopover(null);
          }}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all active:scale-98 shadow-md"
        >
          Add New Event
        </button>
      </div>
    </div>
  );
};

export default CalendarDayPopover;
