import React, { useState, useEffect, useRef } from "react";
import CalendarHeaderSection from "./CalendarHeaderSection";
import CalendarSidePanelSection from "./CalendarSidePanelSection";
import CalendarGridSection from "./CalendarGridSection";
import CalendarEventModal from "../components/CalendarEventModal";
import CalendarDayPopover from "../components/CalendarDayPopover";

const CalendarSection = (props) => {
  const {
    month,
    year,
    selectedDate,
    isSidebarOpen,
    activeCategories,
    isModalOpen,
    eventTitle,
    eventDate,
    eventStart,
    eventEnd,
    eventCategory,
    eventDesc,
    dayEventsPopover,
    gridCells,
    filteredEvents,
    _setMonth,
    _setYear,
    setSelectedDate,
    setIsSidebarOpen,
    _setActiveCategories,
    setIsModalOpen,
    setEventTitle,
    setEventDate,
    setEventStart,
    setEventEnd,
    setEventCategory,
    setEventDesc,
    setDayEventsPopover,
    toggleCategory,
    handlePrevMonth,
    handleNextMonth,
    handleGoToToday,
    getEventsForDate,
    handleAddEvent,
    handleDeleteEvent,
    triggerAddEventOnDate,
    isToday,
    isSelected,
  } = props;

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isNarrow = containerWidth < 550;
  const isVeryNarrow = containerWidth < 480;

  useEffect(() => {
    if (isNarrow) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isNarrow, setIsSidebarOpen]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-black/10 select-none text-gray-800 relative font-sans"
    >
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
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isNarrow={isNarrow}
        isVeryNarrow={isVeryNarrow}
      />
      <div className="flex-1 flex min-h-0 relative">
        <CalendarSidePanelSection
          activeCategories={activeCategories}
          toggleCategory={toggleCategory}
          filteredEvents={filteredEvents}
          handleDeleteEvent={handleDeleteEvent}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isNarrow={isNarrow}
        />
        <CalendarGridSection
          gridCells={gridCells}
          getEventsForDate={getEventsForDate}
          isToday={isToday}
          isSelected={isSelected}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          triggerAddEventOnDate={triggerAddEventOnDate}
          setDayEventsPopover={setDayEventsPopover}
          isNarrow={isNarrow}
        />
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
        isNarrow={isNarrow}
        isVeryNarrow={isVeryNarrow}
      />
      <CalendarDayPopover
        dayEventsPopover={dayEventsPopover}
        setDayEventsPopover={setDayEventsPopover}
        handleDeleteEvent={handleDeleteEvent}
        triggerAddEventOnDate={triggerAddEventOnDate}
        isNarrow={isNarrow}
        isVeryNarrow={isVeryNarrow}
      />
    </div>
  );
};

export default CalendarSection;
