import { Calendar as CalendarIcon, X, Clock, Tag, AlignLeft } from "lucide-react";
import { CATEGORIES } from "../../data";

const CalendarEventModal = ({
  isModalOpen,
  eventTitle,
  setEventTitle,
  eventDate,
  setEventDate,
  eventStart,
  setEventStart,
  eventEnd,
  setEventEnd,
  eventCategory,
  setEventCategory,
  eventDesc,
  setEventDesc,
  handleAddEvent,
  setIsModalOpen,
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleAddEvent}
        className="w-full max-w-[380px] bg-white rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden animate-fade-in"
      >
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            New Event
          </h3>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 rounded p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white p-4 space-y-3 flex-1 overflow-y-auto text-xs">
          <div className="space-y-1">
            <label className="font-bold text-gray-700">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Google Interview"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-700">Date</label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> Start Time
              </label>
              <input
                type="time"
                required
                value={eventStart}
                onChange={(e) => setEventStart(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-gray-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> End Time
              </label>
              <input
                type="time"
                required
                value={eventEnd}
                onChange={(e) => setEventEnd(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-700 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-gray-400" /> Category
            </label>
            <select
              value={eventCategory}
              onChange={(e) => setEventCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-700 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-gray-400" /> Description
            </label>
            <textarea
              placeholder="Event details..."
              rows={3}
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 font-medium placeholder-gray-400 resize-none"
            />
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-150 px-4 py-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-all active:scale-95 shadow-md cursor-pointer"
          >
            Save Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CalendarEventModal;
