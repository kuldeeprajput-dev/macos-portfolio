import { useEffect, useState } from "react";
import windowWrapper from "@hoc/windowWrapper";
import useNotes from "../../hooks/useNotes";
import NotesSection from "../section/NotesSection";

const Notes = () => {
  const allProps = useNotes();
  const { activeNote, isSidebarOpen, setIsSidebarOpen } = allProps;
  const [canNavigateForward, setCanNavigateForward] = useState(false);

  useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app === "notes" && !isSidebarOpen) {
        e.preventDefault();
        setCanNavigateForward(true);
        setIsSidebarOpen(true);
      }
    };
    const handleNavForward = (e) => {
      if (e.detail?.app === "notes" && isSidebarOpen && canNavigateForward && activeNote) {
        e.preventDefault();
        setIsSidebarOpen(false);
        setCanNavigateForward(false);
      }
    };
    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
  }, [activeNote, canNavigateForward, isSidebarOpen, setIsSidebarOpen]);

  return <NotesSection {...allProps} />;
};

const NotesWindow = windowWrapper(Notes, "notes");
export default NotesWindow;
