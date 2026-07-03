import { Search } from "lucide-react";

const NoteList = ({
  notes,
  activeNoteId,
  searchQuery,
  isSidebarOpen,
  onSelectNote,
  onSearchChange,
  formatDate,
}) => (
  <div
    className={`
    absolute md:relative inset-y-0 left-0 w-64 md:w-60 lg:w-64 bg-gray-50 border-r border-[#d1d1d1] flex flex-col z-20 transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
  >
    <div className="p-2.5">
      <div className="relative flex items-center bg-gray-200/60 rounded-md px-2 py-1.5">
        <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none border-none outline-none text-gray-800"
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-200">
      {notes.length === 0 ? (
        <div className="p-4 text-center text-sm text-gray-400">No Notes</div>
      ) : (
        notes.map((note) => {
          const isSelected = activeNoteId === note.id;
          const preview = note.preview || "No additional text";

          return (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`p-3.5 cursor-pointer select-none transition-colors ${
                isSelected
                  ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <h4 className="font-semibold text-sm truncate text-gray-900">{note.title}</h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span className="shrink-0 font-medium text-blue-600">
                  {formatDate(note.updatedAt)}
                </span>
                <span className="truncate text-gray-500">{preview}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);

export default NoteList;
