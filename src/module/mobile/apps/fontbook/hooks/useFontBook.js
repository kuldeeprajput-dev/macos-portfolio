import { useEffect, useState } from "react";
import INITIAL_FONTS from "../data";

const useFontBook = () => {
  const [currentView, setCurrentView] = useState("collections"); // "collections" | "list" | "preview"
  const [forwardView, setForwardView] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Fonts");
  const [fonts, setFonts] = useState(INITIAL_FONTS);
  const [activeFont, setActiveFont] = useState(INITIAL_FONTS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState(36);
  const [googleFontInput, setGoogleFontInput] = useState("");
  const [specimenText, setSpecimenText] = useState(
    "The quick brown fox jumps over the lazy dog.\nAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz\n1234567890",
  );
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const handleInstallFont = () => {
    const name = googleFontInput.trim();
    if (!name) return;

    if (fonts.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
      alert("This font is already loaded in Font Book!");
      return;
    }

    const formattedName = name
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
    const googleFontUrlName = formattedName.replace(/ /g, "+");

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${googleFontUrlName}&display=swap`;

    link.onerror = () => {
      alert(
        `Could not load font "${formattedName}" from Google Fonts. Please verify the family name.`,
      );
    };

    document.head.appendChild(link);

    const newFont = {
      name: formattedName,
      category: "Google Fonts",
      designer: "Google Fonts Contributor",
      desc: "Dynamically installed web font loaded directly via Google Fonts API.",
    };

    setFonts((prev) => [...prev, newFont]);
    setActiveFont(newFont);
    setGoogleFontInput("");
    setCurrentView("preview"); // Automatically show preview when installed
  };

  const filteredFonts = fonts.filter((font) => {
    const matchesSearch = font.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchesCategory = searchQuery.trim()
      ? true
      : activeCategory === "All Fonts" || font.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app !== "font") return;

      if (currentView === "preview") {
        e.preventDefault();
        setForwardView("preview");
        setCurrentView("list");
      } else if (currentView === "list") {
        e.preventDefault();
        setForwardView("list");
        setCurrentView("collections");
      }
    };

    const handleNavForward = (e) => {
      if (e.detail?.app !== "font" || !forwardView) return;

      if (currentView === "collections" && forwardView === "list") {
        e.preventDefault();
        setCurrentView("list");
        setForwardView(null);
      } else if (currentView === "list" && forwardView === "preview") {
        e.preventDefault();
        setCurrentView("preview");
        setForwardView(null);
      }
    };

    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
  }, [currentView, forwardView]);

  return {
    currentView,
    setCurrentView,
    fonts,
    setFonts,
    activeCategory,
    setActiveCategory,
    activeFont,
    setActiveFont,
    searchQuery,
    setSearchQuery,
    fontSize,
    setFontSize,
    googleFontInput,
    setGoogleFontInput,
    specimenText,
    setSpecimenText,
    isBold,
    setIsBold,
    isItalic,
    setIsItalic,
    handleInstallFont,
    filteredFonts,
  };
};

export default useFontBook;
