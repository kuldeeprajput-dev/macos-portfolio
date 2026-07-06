const CATEGORIES = [
  {
    id: "personal",
    label: "Personal",
    color: "bg-blue-500",
    border: "border-blue-500",
    text: "text-blue-600",
    dot: "🔴",
  },
  {
    id: "work",
    label: "Work",
    color: "bg-green-500",
    border: "border-green-500",
    text: "text-green-600",
    dot: "🟢",
  },
  {
    id: "birthdays",
    label: "Birthdays",
    color: "bg-amber-500",
    border: "border-amber-500",
    text: "text-amber-600",
    dot: "🟡",
  },
  {
    id: "holidays",
    label: "Holidays",
    color: "bg-purple-500",
    border: "border-purple-500",
    text: "text-purple-600",
    dot: "🟣",
  },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export { CATEGORIES, MONTHS, DAYS_SHORT };
