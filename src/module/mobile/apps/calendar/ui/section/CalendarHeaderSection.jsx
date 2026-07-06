import WindowControls from "@components/WindowControls";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS } from "../../data";

const CalendarHeaderSection = ({ month, year, onPrevMonth, onNextMonth, onToday, onAddEvent }) => (
  <div
    id="window-header"
    className="window-header shrink-0 flex items-center justify-between !bg-gray-50 !border-b-[#d1d1d1] px-4 pt-12 pb-2.5 z-20 relative"
  >
    <div className="flex items-center">
      <WindowControls target="calendar" />
    </div>

    {/* Month Selector / Title */}
    <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2 select-none">
      <button
        onClick={onPrevMonth}
        className="p-1 rounded-full hover:bg-gray-200/80 active:scale-90 transition-all text-gray-500 cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-[13px] font-bold text-gray-800 tracking-tight text-center leading-none select-none">
        {MONTHS[month]} {year}
      </span>
      <button
        onClick={onNextMonth}
        className="p-1 rounded-full hover:bg-gray-200/80 active:scale-90 transition-all text-gray-500 cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>

    {/* Header Actions */}
    <div className="flex items-center gap-2">
      <button
        onClick={onToday}
        className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300/60 rounded-md text-[10px] font-bold shadow-xs cursor-pointer text-gray-700 active:scale-95 transition-transform"
      >
        Today
      </button>
      <button
        onClick={onAddEvent}
        className="p-1 rounded-full hover:bg-gray-100 text-blue-600 cursor-pointer active:scale-90 transition-all"
        title="Add Event"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default CalendarHeaderSection;
