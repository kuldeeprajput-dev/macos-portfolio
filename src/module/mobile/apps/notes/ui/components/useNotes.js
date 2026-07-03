import { useState, useEffect } from "react";

const defaultNotes = [
  {
    id: "1",
    title: "Welcome to Notes",
    preview: "This is a macOS-style Notes application integrated into this interactive desktop portfolio.",
    body: "<div><strong>Welcome to Notes</strong></div><div><br></div><div>This is a macOS-style Notes application integrated into this interactive desktop portfolio.</div><div><br></div><div><strong>Features:</strong></div><ul><li>Add new notes using the compose button</li><li>Delete notes when they are no longer needed</li><li>Real-time search to quickly find what you're looking for</li><li>Automated persistence so your thoughts are saved locally!</li></ul>",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Idea Log",
    preview: "Build a fully functioning macOS desktop experience using React & Tailwind (Done!)",
    body: "<div><strong>Idea Log</strong></div><div><br></div><ul><li>Build a fully functioning macOS desktop experience using React &amp; Tailwind (Done!)</li><li>Add interactive apps like Notes, Safari, Calculator, Photos, and Terminal</li><li>Design a gorgeous Control Center and mobile responsive iOS shell</li></ul>",
    updatedAt: new Date().toISOString(),
  },
];

export default function useNotes() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("macos_portfolio_notes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultNotes;
  });

  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("macos_portfolio_notes", JSON.stringify(notes));
  }, [notes]);

  const stripHtml = (html) => {
    if (!html) return "";
    const clean = html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return clean
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  };

  const parseNoteTitleAndBody = (html) => {
    if (!html) return { title: "New Note", preview: "No additional text" };

    let text = html
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]*>/g, "");

    text = text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const title = lines[0] || "New Note";
    const preview = lines.slice(1).join(" ").trim() || "No additional text";
    return { title, preview };
  };

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleUpdateNote = (field, value) => {
    if (!activeNote) return;

    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === activeNote.id) {
          const updated = {
            ...note,
            [field]: value,
            updatedAt: new Date().toISOString(),
          };
          if (field === "body") {
            const { title, preview } = parseNoteTitleAndBody(value);
            updated.title = title;
            updated.preview = preview;
          }
          return updated;
        }
        return note;
      });
    });
  };

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now().toString(),
      folderId: "notes",
      title: "New Note",
      preview: "Start writing...",
      body: "<div><strong>New Note</strong></div><div>Start writing...</div>",
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id) {
      setActiveNoteId(newNotes[0]?.id || "");
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stripHtml(note.body).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (isoStr) => {
    const date = new Date(isoStr);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return {
    notes,
    activeNote,
    activeNoteId,
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
    stripHtml,
  };
}
