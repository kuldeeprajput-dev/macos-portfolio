import { Bold, Italic, Underline, Trash2, Type, List, ListOrdered } from "lucide-react";
import NoteEditor from "../components/NoteEditor";

const NotesEditorSection = ({
  activeNote,
  onUpdateNote,
  onDeleteNote,
  wordCount,
  onCreateNote,
  isLowWidth,
}) => {
  const handleFormat = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#fbfaf8] @container">
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-[#d1d1d1] bg-gray-50/70">
        {/* formatting buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleFormat("bold")}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 active:bg-gray-300 transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("italic")}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 active:bg-gray-300 transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("underline")}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 active:bg-gray-300 transition-colors"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="mx-1.5 w-px h-5 bg-gray-300" />

          <button
            onClick={() => handleFormat("insertUnorderedList")}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 active:bg-gray-300 transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("insertOrderedList")}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 active:bg-gray-300 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {!isLowWidth && (
            <>
              <div className="mx-2 w-px h-5 bg-gray-300" />
              <span className="text-xs text-gray-400 flex items-center gap-1 font-semibold whitespace-nowrap">
                <Type className="w-3.5 h-3.5 text-[#e4a52e] shrink-0" />
                <span>{wordCount}</span>
                <span className="hidden @sm:inline">{wordCount === 1 ? "word" : "words"}</span>
              </span>
            </>
          )}
        </div>

        <button
          onClick={() => activeNote && onDeleteNote(activeNote.id)}
          disabled={!activeNote}
          className="p-1.5 rounded hover:bg-red-50 hover:text-red-600 text-gray-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Delete Note"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <NoteEditor activeNote={activeNote} onUpdateNote={onUpdateNote} onCreateNote={onCreateNote} />
    </div>
  );
};

export default NotesEditorSection;
