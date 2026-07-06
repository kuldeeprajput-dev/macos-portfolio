import React from "react";
import windowWrapper from "@hoc/windowWrapper";
import useFontBook from "../../hooks/useFontBook";
import FontBookSection from "../section/FontBookSection";
import FontBookAboutModal from "./FontBookAboutModal";
import FontBookAlertModal from "./FontBookAlertModal";

const FontBook = () => {
  const {
    showAbout,
    setShowAbout,
    activeCategory,
    setActiveCategory,
    fonts,
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
  } = useFontBook();

  return (
    <>
      <FontBookSection
        fonts={fonts}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        googleFontInput={googleFontInput}
        setGoogleFontInput={setGoogleFontInput}
        handleInstallFont={handleInstallFont}
        filteredFonts={filteredFonts}
        activeFont={activeFont}
        setActiveFont={setActiveFont}
        fontSize={fontSize}
        setFontSize={setFontSize}
        isBold={isBold}
        setIsBold={setIsBold}
        isItalic={isItalic}
        setIsItalic={setIsItalic}
        specimenText={specimenText}
        setSpecimenText={setSpecimenText}
      />
      <FontBookAboutModal show={showAbout} onClose={() => setShowAbout(false)} />
      <FontBookAlertModal
        show={!!alertConfig}
        title={alertConfig?.title}
        message={alertConfig?.message}
        onClose={() => setAlertConfig(null)}
      />
    </>
  );
};

const FontBookWindow = windowWrapper(FontBook, "font");
export default FontBookWindow;
