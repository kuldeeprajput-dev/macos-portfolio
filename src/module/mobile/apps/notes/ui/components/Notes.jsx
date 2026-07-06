import { useEffect } from "react";
import windowWrapper from "@hoc/windowWrapper";
import useNotes from "../../hooks/useNotes";
import NotesSection from "../section/NotesSection";

const Notes = () => {
  const allProps = useNotes();
  const { isSidebarOpen, setIsSidebarOpen } = allProps;

  useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app === "notes" && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("app-navigate-back", handleNavBack);
    return () => window.removeEventListener("app-navigate-back", handleNavBack);
  }, [isSidebarOpen, setIsSidebarOpen]);

  return <NotesSection {...allProps} />;
};

const NotesWindow = windowWrapper(Notes, "notes");
export default NotesWindow;
