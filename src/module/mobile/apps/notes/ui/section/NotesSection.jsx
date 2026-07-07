import { useState } from "react";
import WindowControls from "@components/WindowControls";
import {
  Plus,
  ChevronLeft,
  Search,
  Trash2,
  Camera,
  CheckSquare,
  Edit,
  Edit3,
  Share,
  MoreHorizontal,
  Calendar,
  Eraser,
  Check,
} from "lucide-react";
import NoteEditor from "../components/NoteEditor";

const NotesSection = ({
  activeNote,
  _activeNoteId,
  searchQuery,
  isSidebarOpen,
  setActiveNoteId,
  setSearchQuery,
  setIsSidebarOpen,
  handleUpdateNote,
  handleCreateNote,
  handleDeleteNote,
  filteredNotes,
  formatDate,
}) => {
  // isSidebarOpen = true means show notes list, false means show active note editor

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSelectNote = (id) => {
    setActiveNoteId(id);
    setIsSidebarOpen(false);
  };

  const handleNewNoteClick = () => {
    handleCreateNote();
    setIsSidebarOpen(false);
  };

  // Functional Toolbar Actions
  const _handleAddChecklist = () => {
    if (!activeNote) return;
    const currentBody = activeNote.body || "";
    const newBody =
      currentBody.endsWith("\n") || currentBody === ""
        ? `${currentBody}- [ ] `
        : `${currentBody}\n- [ ] `;
    handleUpdateNote("body", newBody);
    triggerToast("Checklist checkbox added!");
  };

  const _handleAddPhoto = () => {
    if (!activeNote) return;
    const currentBody = activeNote.body || "";
    const sampleImg =
      "\n![Attached Image](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400)\n";
    const newBody =
      currentBody.endsWith("\n") || currentBody === ""
        ? `${currentBody}${sampleImg}`
        : `${currentBody}\n${sampleImg}`;
    handleUpdateNote("body", newBody);
    triggerToast("Mock Photo attachment added!");
  };

  const handleShare = () => {
    if (!activeNote) return;
    const textToCopy = activeNote.body || "";

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          triggerToast("Note copied to clipboard!");
        })
        .catch(() => {
          triggerToast("Failed to copy note!");
        });
    } else {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          triggerToast("Note copied to clipboard!");
        } else {
          triggerToast("Failed to copy note!");
        }
      } catch (err) {
        triggerToast("Failed to copy note!");
      }
    }
  };

  const handleInsertDate = () => {
    if (!activeNote) return;
    const currentBody = activeNote.body || "";
    const stamp = `\n[${new Date().toLocaleString()}]\n`;
    const newBody =
      currentBody.endsWith("\n") || currentBody === ""
        ? `${currentBody}${stamp}`
        : `${currentBody}\n${stamp}`;
    handleUpdateNote("body", newBody);
    setShowActionSheet(false);
    triggerToast("Date & Time stamp inserted!");
  };

  const handleClearNote = () => {
    if (!activeNote) return;
    handleUpdateNote("body", "");
    setShowActionSheet(false);
    triggerToast("Note text cleared!");
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f2f2f7] select-none text-zinc-900 font-sans relative overflow-hidden">
      {/* Window Header (For OS Shell integrity) */}
      <div id="window-header" className="shrink-0 flex items-center justify-between relative z-10">
        <WindowControls target="notes" />
      </div>

      {isSidebarOpen ? (
        /* NOTES LIST VIEW */
        <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-200">
          <div className="px-5 pt-4 pb-2">
            <h1 className="text-[34px] font-extrabold tracking-tight text-black">Notes</h1>
          </div>

          {/* Search Bar */}
          <div className="px-5 pb-4">
            <div className="relative flex items-center bg-zinc-200/60 rounded-xl px-3 py-1.5 h-9 shrink-0">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none border-none outline-none text-gray-800 font-medium"
              />
            </div>
          </div>

          {/* Notes List Cards */}
          <div className="flex-1 overflow-y-auto px-5 pb-20">
            {filteredNotes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-black/5 p-8 text-center text-gray-400 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                No Notes
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y divide-zinc-100">
                {filteredNotes.map((note) => {
                  const title = note.title || "New Note";
                  const preview = note.preview || "No additional text";
                  return (
                    <div
                      key={note.id}
                      onClick={() => handleSelectNote(note.id)}
                      className="p-4 cursor-pointer active:bg-zinc-50 transition-colors"
                    >
                      <h4 className="font-bold text-[16px] text-zinc-900 truncate">{title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[13px] text-zinc-500">
                        <span className="shrink-0 font-medium text-zinc-400">
                          {formatDate(note.updatedAt)}
                        </span>
                        <span className="truncate text-zinc-400 font-normal">{preview}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Toolbar for List View */}
          <div className="absolute bottom-0 inset-x-0 h-14 bg-[#f2f2f7]/90 backdrop-blur-md border-t border-zinc-200/40 flex items-center justify-between px-6 z-10">
            <div className="w-8" /> {/* spacer */}
            <span className="text-[12px] font-semibold text-zinc-500">
              {filteredNotes.length} {filteredNotes.length === 1 ? "Note" : "Notes"}
            </span>
            <button
              onClick={handleNewNoteClick}
              className="text-[#ff9f0a] hover:opacity-75 transition-opacity focus:outline-none bg-transparent border-none cursor-pointer p-1"
            >
              <Edit3 size={22} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      ) : (
        /* NOTE EDITOR VIEW */
        <div className="flex-1 flex flex-col min-h-0 bg-white animate-in slide-in-from-right-2 duration-200">
          {/* Editor Header Navigation */}
          <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-zinc-100 bg-white">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-0.5 text-[#ff9f0a] font-bold text-[15px] focus:outline-none bg-transparent border-none cursor-pointer p-0"
            >
              <ChevronLeft size={20} strokeWidth={2.5} className="relative -left-0.5" />
              <span>Notes</span>
            </button>
            <div className="flex items-center gap-4 text-[#ff9f0a]">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="font-bold text-[15px] hover:opacity-75 transition-opacity focus:outline-none bg-transparent border-none cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>

          {/* Editor Content Area */}
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            <NoteEditor
              activeNote={activeNote}
              onUpdateNote={handleUpdateNote}
              onCreateNote={handleCreateNote}
            />
          </div>

          {/* Bottom Toolbar for Editor View */}
          <div className="shrink-0 h-14 bg-zinc-50 border-t border-zinc-200/40 flex items-center justify-between px-6 pb-2 z-10">
            {/* Trash icon on far left */}
            <button
              onClick={() => activeNote && handleDeleteNote(activeNote.id)}
              disabled={!activeNote}
              className="p-1.5 focus:outline-none hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer text-red-500 disabled:opacity-30"
              title="Delete Note"
            >
              <Trash2 size={20} strokeWidth={2} />
            </button>

            {/* Share in the middle left */}
            <button
              onClick={handleShare}
              className="p-1.5 focus:outline-none hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer text-[#ff9f0a]"
              title="Copy to Clipboard"
            >
              <Share size={20} strokeWidth={2} />
            </button>

            {/* More / Options in middle right */}
            <button
              onClick={() => setShowActionSheet(true)}
              className="p-1.5 focus:outline-none hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer text-[#ff9f0a]"
              title="Options"
            >
              <MoreHorizontal size={20} strokeWidth={2} />
            </button>

            {/* Compose/New Note on far right */}
            <button
              onClick={handleNewNoteClick}
              className="p-1.5 focus:outline-none hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer text-[#ff9f0a]"
              title="New Note"
            >
              <Edit3 size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {/* iOS Action Sheet for Note Options */}
      {showActionSheet && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-xs z-50 flex flex-col justify-end animate-in fade-in duration-200">
          {/* Overlay Click Dismissal */}
          <div className="flex-1" onClick={() => setShowActionSheet(false)} />

          <div className="px-3 pb-6 max-w-md mx-auto w-full animate-in slide-in-from-bottom-5 duration-200">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl divide-y divide-zinc-200">
              <button
                onClick={handleInsertDate}
                className="w-full py-3.5 text-center text-[16px] font-semibold text-[#ff9f0a] hover:bg-zinc-100 flex items-center justify-center gap-2 bg-transparent border-none cursor-pointer"
              >
                <Calendar size={16} />
                <span>Insert Date & Time</span>
              </button>
              <button
                onClick={handleClearNote}
                className="w-full py-3.5 text-center text-[16px] font-semibold text-red-500 hover:bg-zinc-100 flex items-center justify-center gap-2 bg-transparent border-none cursor-pointer"
              >
                <Eraser size={16} />
                <span>Clear All Text</span>
              </button>
            </div>

            <button
              onClick={() => setShowActionSheet(false)}
              className="w-full mt-2 py-3.5 bg-white rounded-2xl text-[16px] font-bold text-[#ff9f0a] hover:brightness-95 shadow-xl border-none cursor-pointer flex items-center justify-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* iOS Notification Toast */}
      {showToast && (
        <div className="fixed top-16 inset-x-0 flex items-center justify-center z-50 pointer-events-none animate-in fade-in slide-in-from-top-3 duration-250">
          <div className="bg-zinc-900/90 backdrop-blur-md text-white rounded-full px-5 py-2.5 shadow-xl text-xs font-semibold flex items-center gap-1.5">
            <Check size={14} className="text-[#ff9f0a]" strokeWidth={3} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesSection;
