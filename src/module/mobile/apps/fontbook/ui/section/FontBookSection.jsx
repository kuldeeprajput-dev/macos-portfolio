import { Type, Search, ChevronLeft, ChevronRight, Sliders, Info } from "lucide-react";
import WindowControls from "@components/WindowControls";
import useWindowsStore from "@store/window";

const CATEGORIES = [
  "All Fonts",
  "Sans-Serif",
  "Serif",
  "Monospaced",
  "Handwriting",
  "Retro/Display",
  "Google Fonts",
];

const FontBookSection = ({
  currentView,
  setCurrentView,
  fonts,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  googleFontInput,
  setGoogleFontInput,
  handleInstallFont,
  filteredFonts,
  activeFont,
  setActiveFont,
  fontSize,
  setFontSize,
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  specimenText,
  setSpecimenText,
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-[#f2f2f7] text-gray-800 font-sans select-none md:rounded-xl overflow-hidden md:shadow-2xl md:border md:border-zinc-200/80">
      {/* Window Header (For macOS portfolio container integrity) */}
      <div id="window-header" className="shrink-0 flex items-center justify-between relative z-10">
        <WindowControls target="font" />
        <span className="text-xs font-bold text-gray-400">Font Book</span>
        <div className="w-12" /> {/* spacer */}
      </div>

      {currentView === "collections" && (
        /* 1. COLLECTIONS HOME SCREEN */
        <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-200">
          {/* Header Title */}
          <div className="px-5 pt-4 pb-2">
            <h1 className="text-[34px] font-extrabold tracking-tight text-black">Font Book</h1>
          </div>

          {/* Search Bar */}
          <div className="px-5 pb-4">
            <div className="relative flex items-center bg-zinc-200/60 rounded-xl px-3 py-1.5 h-9 shrink-0">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search fonts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  useWindowsStore.getState().focusWindow("font");
                  e.currentTarget.focus();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  useWindowsStore.getState().focusWindow("font");
                  e.currentTarget.focus();
                }}
                className="w-full bg-transparent text-sm focus:outline-none border-none outline-none text-gray-800 font-medium select-text"
              />
            </div>
          </div>

          {/* Scrollable Collections List */}
          <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1">
                Collections
              </span>
              <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y divide-zinc-100">
                {CATEGORIES.map((cat) => {
                  const count =
                    cat === "All Fonts"
                      ? fonts.length
                      : fonts.filter((f) => f.category === cat).length;
                  return (
                    <div
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setCurrentView("list");
                      }}
                      className="flex items-center justify-between p-4 cursor-pointer active:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Type size={16} />
                        </div>
                        <span className="font-bold text-[15px] text-zinc-900">{cat}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-zinc-400">{count}</span>
                        <ChevronRight size={14} className="text-zinc-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Install Google Font Card */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1">
                Google Fonts
              </span>
              <div className="bg-white rounded-2xl border border-black/5 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-zinc-800">Install New Font</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Load any web font family directly into your collection.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Montserrat"
                    value={googleFontInput}
                    onChange={(e) => setGoogleFontInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleInstallFont();
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      useWindowsStore.getState().focusWindow("font");
                      e.currentTarget.focus();
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      useWindowsStore.getState().focusWindow("font");
                      e.currentTarget.focus();
                    }}
                    className="flex-1 min-w-0 bg-zinc-100 border border-zinc-200/50 rounded-xl px-3.5 py-2 text-xs text-gray-800 outline-none focus:bg-white focus:border-indigo-500 font-semibold select-text"
                  />
                  <button
                    onClick={handleInstallFont}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer border-none"
                  >
                    Install
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === "list" && (
        /* 2. FONTS LIST SCREEN */
        <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-right-2 duration-200">
          {/* Header Navigation */}
          <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-zinc-200/50 bg-[#f2f2f7]">
            <button
              onClick={() => setCurrentView("collections")}
              className="flex items-center gap-0.5 text-indigo-600 font-bold text-[15px] focus:outline-none bg-transparent border-none cursor-pointer p-0"
            >
              <ChevronLeft size={20} strokeWidth={2.5} className="relative -left-0.5" />
              <span>Collections</span>
            </button>
            <span className="font-bold text-[15px] text-zinc-900 truncate max-w-[180px]">
              {activeCategory}
            </span>
            <span className="text-xs font-semibold text-zinc-400">
              {filteredFonts.length} Fonts
            </span>
          </div>

          {/* Search bar inside list (optional, but good for filtering) */}
          <div className="px-5 pt-4 pb-2">
            <div className="relative flex items-center bg-zinc-200/60 rounded-xl px-3 py-1.5 h-9 shrink-0">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder={`Search in ${activeCategory}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  useWindowsStore.getState().focusWindow("font");
                  e.currentTarget.focus();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  useWindowsStore.getState().focusWindow("font");
                  e.currentTarget.focus();
                }}
                className="w-full bg-transparent text-sm focus:outline-none border-none outline-none text-gray-800 font-medium select-text"
              />
            </div>
          </div>

          {/* Fonts List Container */}
          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24">
            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y divide-zinc-100">
              {filteredFonts.map((font) => (
                <div
                  key={font.name}
                  onClick={() => {
                    setActiveFont(font);
                    setCurrentView("preview");
                  }}
                  className="flex justify-between items-center p-4 cursor-pointer active:bg-zinc-50 transition-colors"
                >
                  <span
                    className="font-medium text-[16px] text-zinc-900 truncate"
                    style={{ fontFamily: font.name }}
                  >
                    {font.name}
                  </span>
                  <ChevronRight size={14} className="text-zinc-300" />
                </div>
              ))}
              {filteredFonts.length === 0 && (
                <div className="text-xs text-gray-400 italic text-center py-8">
                  No fonts in this category
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentView === "preview" && (
        /* 3. FONT PREVIEW SCREEN */
        <div className="flex-1 flex flex-col min-h-0 bg-white animate-in slide-in-from-right-2 duration-200">
          {/* Header Navigation */}
          <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-zinc-200/50 bg-[#f2f2f7]">
            <button
              onClick={() => setCurrentView("list")}
              className="flex items-center gap-0.5 text-indigo-600 font-bold text-[15px] focus:outline-none bg-transparent border-none cursor-pointer p-0"
            >
              <ChevronLeft size={20} strokeWidth={2.5} className="relative -left-0.5" />
              <span>Fonts</span>
            </button>
            <span className="font-bold text-[15px] text-zinc-900 truncate max-w-[180px]">
              {activeFont?.name}
            </span>
            <div className="w-12" /> {/* spacer */}
          </div>

          {/* Styling Toolbar Controls */}
          <div className="p-4 border-b border-zinc-100 flex flex-col gap-3.5 bg-gray-50/50 shrink-0">
            <div className="flex items-center justify-between gap-4 text-xs font-semibold text-zinc-700">
              <div className="flex bg-zinc-200 p-0.5 rounded-xl">
                <button
                  onClick={() => setIsBold(!isBold)}
                  className={`w-10 py-1 rounded-lg transition-all cursor-pointer border-none ${
                    isBold
                      ? "bg-white text-gray-900 shadow-sm font-bold"
                      : "hover:text-gray-900 bg-transparent"
                  }`}
                >
                  B
                </button>
                <button
                  onClick={() => setIsItalic(!isItalic)}
                  className={`w-10 py-1 rounded-lg transition-all italic cursor-pointer border-none ${
                    isItalic
                      ? "bg-white text-gray-900 shadow-sm font-bold"
                      : "hover:text-gray-900 bg-transparent"
                  }`}
                >
                  I
                </button>
              </div>

              <div className="flex-1 flex items-center gap-2">
                <Sliders size={13} className="text-gray-400 shrink-0" />
                <input
                  type="range"
                  min="12"
                  max="80"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="w-10 text-right font-mono text-[11px] text-gray-500">
                  {fontSize}px
                </span>
              </div>
            </div>
          </div>

          {/* Preview Text Specimen Canvas */}
          <div className="flex-1 p-5 overflow-y-auto bg-white">
            <textarea
              value={specimenText}
              onChange={(e) => setSpecimenText(e.target.value)}
              placeholder="Type custom text here to preview..."
              onMouseDown={(e) => {
                e.stopPropagation();
                useWindowsStore.getState().focusWindow("font");
                e.currentTarget.focus();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                useWindowsStore.getState().focusWindow("font");
                e.currentTarget.focus();
              }}
              className="w-full h-full bg-transparent border-none outline-none resize-none select-text leading-relaxed placeholder-gray-300 font-medium"
              style={{
                fontFamily: activeFont?.name || "inherit",
                fontSize: `${fontSize}px`,
                fontWeight: isBold ? "bold" : "normal",
                fontStyle: isItalic ? "italic" : "normal",
              }}
              spellCheck="false"
            />
          </div>

          {/* About Metadata Block */}
          {activeFont && (
            <div className="p-4 pb-16 md:pb-4 border-t border-zinc-200 bg-zinc-50 text-[11px] text-gray-600 flex items-start gap-2.5 shrink-0 select-none">
              <Info size={14} className="text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-700 block">About {activeFont.name}</span>
                <p className="leading-relaxed mt-0.5 text-zinc-500 font-medium">
                  {activeFont.desc}
                </p>
                <p className="text-[10px] text-zinc-400 mt-1 font-semibold">
                  Designer: {activeFont.designer} • {activeFont.category}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FontBookSection;
