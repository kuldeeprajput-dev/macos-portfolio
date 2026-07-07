import { Sliders, Info } from "lucide-react";

const FontPreview = ({
  activeFont,
  fontSize,
  setFontSize,
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  specimenText,
  setSpecimenText,
}) => (
  <div className="flex-1 flex flex-col bg-white min-w-0">
    <div className="p-4 border-b border-zinc-200 bg-gray-50/50 flex flex-wrap gap-4 items-center justify-between shrink-0">
      <div>
        <h2 className="text-base font-bold text-gray-900 leading-tight">{activeFont?.name}</h2>
        <p className="text-[10px] text-gray-500 mt-0.5">
          Designed by {activeFont?.designer} • {activeFont?.category}
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
        <div className="flex bg-zinc-200 p-0.5 rounded-lg">
          <button
            onClick={() => setIsBold(!isBold)}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${isBold ? "bg-white text-gray-900 shadow-sm font-bold" : "hover:text-gray-900"}`}
          >
            B
          </button>
          <button
            onClick={() => setIsItalic(!isItalic)}
            className={`px-2.5 py-1 rounded-md transition-all italic cursor-pointer ${isItalic ? "bg-white text-gray-900 shadow-sm font-bold" : "hover:text-gray-900"}`}
          >
            I
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Sliders size={13} className="text-gray-400" />
          <input
            type="range"
            min="12"
            max="120"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-24 accent-indigo-600 cursor-pointer"
          />
          <span className="w-8 text-right font-mono text-[11px] text-gray-500">{fontSize}px</span>
        </div>
      </div>
    </div>

    <div className="flex-1 pt-6 pb-6 pl-6 overflow-hidden flex flex-col">
      <textarea
        value={specimenText}
        onChange={(e) => setSpecimenText(e.target.value)}
        placeholder="Type custom text here to preview..."
        className="w-full h-full bg-transparent border-none outline-none resize-none select-text leading-relaxed placeholder-gray-300 overflow-y-auto pr-6"
        style={{
          fontFamily: activeFont?.name || "inherit",
          fontSize: `${fontSize}px`,
          fontWeight: isBold ? "bold" : "normal",
          fontStyle: isItalic ? "italic" : "normal",
        }}
        spellCheck="false"
      />
    </div>

    <div className="py-2.5 px-4 border-t border-zinc-200 bg-gray-50/50 text-[11px] text-gray-600 flex items-center justify-between gap-4 shrink-0 select-none">
      <div className="flex items-start gap-2.5 min-w-0">
        <Info size={14} className="text-indigo-500 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <span className="font-bold text-gray-700 block">About {activeFont?.name}</span>
          <p className="leading-relaxed mt-0.5 truncate">{activeFont?.desc}</p>
        </div>
      </div>
      <div className="shrink-0 self-center">
        <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
          Coming Soon
        </span>
      </div>
    </div>
  </div>
);

export default FontPreview;
