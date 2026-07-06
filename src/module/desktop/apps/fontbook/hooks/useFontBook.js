import { useState, useEffect } from "react";
import useWindowsStore from "@store/window";
import INITIAL_FONTS from "../data/fontData";

const useFontBook = () => {
  const { windows, setWindowData } = useWindowsStore();
  const [showAbout, setShowAbout] = useState(false);
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
  const [alertConfig, setAlertConfig] = useState(null);

  useEffect(() => {
    if (windows.font?.data?.openAbout) {
      setShowAbout(true);
      setWindowData("font", { ...windows.font.data, openAbout: false });
    }
  }, [windows.font?.data?.openAbout, windows.font?.data, setWindowData]);

  const handleInstallFont = () => {
    const name = googleFontInput.trim();
    if (!name) return;

    if (fonts.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
      setAlertConfig({
        title: "Font Already Loaded",
        message: "This font is already loaded in Font Book!",
      });
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
      setAlertConfig({
        title: "Font Download Failed",
        message: `Could not load font "${formattedName}" from Google Fonts. Please verify the family name.`,
      });
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
  };

  const filteredFonts = fonts.filter((font) => {
    const matchesSearch = font.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchesCategory = searchQuery.trim()
      ? true
      : activeCategory === "All Fonts" || font.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return {
    showAbout,
    setShowAbout,
    activeCategory,
    setActiveCategory,
    fonts,
    setFonts,
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
    alertConfig,
    setAlertConfig,
  };
};

export default useFontBook;
