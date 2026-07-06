import CalendarHeaderSection from "./CalendarHeaderSection";
import CalendarGridSection from "./CalendarGridSection";
import CalendarEventModal from "../components/CalendarEventModal";
import CalendarDayPopover from "../components/CalendarDayPopover";
import { CATEGORIES } from "../../data";
import { Trash2, CalendarDays, Plus, Clock } from "lucide-react";
import { useEffect } from "react";

const CalendarSection = (props) => {
  const {
    month,
    year,
    selectedDate,
    isModalOpen,
    eventTitle,
    eventDate,
    eventStart,
    eventEnd,
    eventCategory,
    eventDesc,
    dayEventsPopover,
    gridCells,
    getEventsForDate,
    _setActiveCategories,
    setIsModalOpen,
    setEventTitle,
    setEventDate,
    setEventStart,
    setEventEnd,
    setEventCategory,
    setEventDesc,
    setDayEventsPopover,
    handlePrevMonth,
    handleNextMonth,
    handleGoToToday,
    handleAddEvent,
    handleDeleteEvent,
    triggerAddEventOnDate,
    isToday,
    isSelected,
    setSelectedDate,
  } = props;

  const selectedDayEvents = getEventsForDate(selectedDate);

  useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app !== "calendar") return;

      e.preventDefault();
      if (isModalOpen) {
        setIsModalOpen(false);
      } else if (dayEventsPopover) {
        setDayEventsPopover(null);
      } else {
        handlePrevMonth();
      }
    };

    const handleNavForward = (e) => {
      if (e.detail?.app !== "calendar") return;

      e.preventDefault();
      handleNextMonth();
    };

    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
  }, [
    dayEventsPopover,
    handleNextMonth,
    handlePrevMonth,
    isModalOpen,
    setDayEventsPopover,
    setIsModalOpen,
  ]);

  const getFormattedSelectedDate = () => {
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryStyle = (catId) => {
    switch (catId) {
      case "personal":
        return { bg: "bg-blue-500/10 border-blue-500 text-blue-900", dot: "bg-blue-500" };
      case "work":
        return { bg: "bg-purple-500/10 border-purple-500 text-purple-900", dot: "bg-purple-500" };
      case "birthdays":
        return { bg: "bg-orange-500/10 border-orange-500 text-orange-900", dot: "bg-orange-500" };
      case "holidays":
        return { bg: "bg-green-500/10 border-green-500 text-green-900", dot: "bg-green-500" };
      default:
        return { bg: "bg-gray-500/10 border-gray-500 text-gray-900", dot: "bg-gray-500" };
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-black/10 select-none text-gray-800 relative font-sans">
      <CalendarHeaderSection
        month={month}
        year={year}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleGoToToday}
        onAddEvent={() => {
          setEventDate(selectedDate.toLocaleDateString("en-CA"));
          setIsModalOpen(true);
        }}
      />

      <div className="flex-1 flex flex-col min-h-0 bg-white relative">
        {/* Top: Full-height stretch Month Grid */}
        <div className="flex-1 min-h-0">
          <CalendarGridSection
            gridCells={gridCells}
            getEventsForDate={getEventsForDate}
            isToday={isToday}
            isSelected={isSelected}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            triggerAddEventOnDate={triggerAddEventOnDate}
            setDayEventsPopover={setDayEventsPopover}
          />
        </div>

        {/* Bottom: Agenda events list (fixed height list, scrollable) */}
        <div className="h-[210px] shrink-0 border-t border-zinc-200 flex flex-col bg-zinc-50/50">
          {/* Agenda Header */}
          <div className="flex justify-between items-center px-4 py-2 bg-zinc-50 border-b border-zinc-150 shrink-0 select-none">
            <h3 className="text-[11px] font-extrabold text-gray-900 uppercase tracking-wide">
              {getFormattedSelectedDate()}
            </h3>
            <span className="text-[9.5px] text-gray-400 font-extrabold uppercase tracking-wide">
              {selectedDayEvents.length} event(s)
            </span>
          </div>

          {/* Agenda List Scroll View */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white scrollbar-none">
            {selectedDayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-gray-400 space-y-1.5">
                <CalendarDays size={20} className="opacity-25" />
                <p className="text-[10px] font-semibold text-gray-400">No events scheduled</p>
                <button
                  onClick={() => triggerAddEventOnDate(selectedDate)}
                  className="text-[10px] font-bold text-blue-500 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus size={10} strokeWidth={2.5} /> Add Event
                </button>
              </div>
            ) : (
              selectedDayEvents
                .sort((a, b) => a.start.localeCompare(b.start))
                .map((ev) => {
                  const styles = getCategoryStyle(ev.category);
                  return (
                    <div
                      key={ev.id}
                      className={`p-2.5 rounded-xl bg-white border border-zinc-200/50 shadow-xs flex items-center justify-between gap-3 animate-fade-in`}
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${styles.dot}`} />
                          <h4 className="text-[11.5px] font-extrabold text-gray-800 truncate">
                            {ev.title}
                          </h4>
                        </div>
                        <p className="text-[9.5px] text-gray-400 font-semibold pl-4 flex items-center gap-1">
                          <Clock size={8} /> {ev.start} - {ev.end}
                        </p>
                        {ev.desc && (
                          <p className="text-[9.5px] text-gray-500 pl-4 leading-normal font-medium truncate">
                            {ev.desc}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0 cursor-pointer active:scale-90"
                        title="Delete Event"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      <CalendarEventModal
        isModalOpen={isModalOpen}
        eventTitle={eventTitle}
        setEventTitle={setEventTitle}
        eventDate={eventDate}
        setEventDate={setEventDate}
        eventStart={eventStart}
        setEventStart={setEventStart}
        eventEnd={eventEnd}
        setEventEnd={setEventEnd}
        eventCategory={eventCategory}
        setEventCategory={setEventCategory}
        eventDesc={eventDesc}
        setEventDesc={setEventDesc}
        handleAddEvent={handleAddEvent}
        setIsModalOpen={setIsModalOpen}
      />

      <CalendarDayPopover
        dayEventsPopover={dayEventsPopover}
        setDayEventsPopover={setDayEventsPopover}
        handleDeleteEvent={handleDeleteEvent}
        triggerAddEventOnDate={triggerAddEventOnDate}
      />
    </div>
  );
};

export default CalendarSection;
