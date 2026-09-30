import { create } from "zustand";

export const WIDGET_OPTIONS = [
  {
    type: "clock-calendar",
    label: "Time & Calendar",
  },
  {
    type: "clock",
    label: "Clock",
  },
  {
    type: "analog-clock",
    label: "Analog Clock",
  },
  {
    type: "weather",
    label: "Weather",
  },
  {
    type: "battery",
    label: "Battery",
  },
  {
    type: "notes",
    label: "Notes",
  },
];

const useWidgetsStore = create((set) => ({
  widgets: ["clock-calendar"],
  toggleWidget: (type) =>
    set((state) => ({
      widgets: state.widgets.includes(type)
        ? state.widgets.filter((widget) => widget !== type)
        : [...state.widgets, type],
    })),
  replaceWidget: (oldType, newType) =>
    set((state) => ({
      widgets: state.widgets.includes(newType)
        ? state.widgets.filter((widget) => widget !== oldType)
        : state.widgets.map((widget) => (widget === oldType ? newType : widget)),
    })),
}));

export default useWidgetsStore;
