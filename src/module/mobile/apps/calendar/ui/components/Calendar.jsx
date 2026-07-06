import React from "react";
import windowWrapper from "@hoc/windowWrapper";
import useCalendar from "../../hooks/useCalendar";
import CalendarSection from "../section/CalendarSection";

const Calendar = () => {
  const allProps = useCalendar();
  return <CalendarSection {...allProps} />;
};

const CalendarWindow = windowWrapper(Calendar, "calendar");
export default CalendarWindow;
