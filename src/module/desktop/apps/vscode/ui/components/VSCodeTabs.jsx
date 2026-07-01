import { X, Eye, EyeOff } from "lucide-react";
import VSCodeFileIcon from "./VSCodeFileIcon";

const VSCodeTabs = ({
  openTabs,
  activeFile,
  onSelectFile,
  onCloseTab,
  showPreview,
  onTogglePreview,
}) => {
  return (
    <div className="h-[35px] bg-[#f3f3f3] flex items-center justify-between border-b border-[#e5e5e5] shrink-0 select-none">
      {/* Tabs List */}
      <div className="flex-1 flex items-center h-full overflow-x-auto scrollbar-none">
        {openTabs.map((tab) => {
          const isActive = activeFile === tab;
          const fileName = tab.split("/").pop();
          return (
            <div
              key={tab}
              onClick={() => onSelectFile(tab)}
              className={`h-full flex items-center gap-2 px-3 border-r border-[#e5e5e5] cursor-pointer text-[12px] relative shrink-0 transition-all group ${
                isActive
                  ? "bg-white text-[#333333] font-semibold"
                  : "bg-[#ececec] text-[#616161] hover:bg-[#e8e8e8] hover:text-[#333333]"
              }`}
            >
              {isActive && <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#007acc]" />}
              <VSCodeFileIcon filename={fileName} size={14} />
              <span>{fileName}</span>
              <button
                onClick={(e) => onCloseTab(tab, e)}
                className={`p-0.5 rounded hover:bg-[#d5d5d5] text-[#616161] hover:text-[#333333] transition-colors ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 px-3 shrink-0 h-full border-l border-[#e5e5e5]">
        <button
          onClick={onTogglePreview}
          className={`h-[24px] px-2.5 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border ${
            showPreview
              ? "bg-[#007acc] text-white hover:bg-[#0062b3] border-transparent"
              : "bg-white text-[#333333] hover:bg-[#e8e8e8] border-[#cecece]"
          }`}
          title="Toggle Side Live Preview"
        >
          {showPreview ? <EyeOff size={11} /> : <Eye size={11} />}
          <span>Live Preview</span>
        </button>
      </div>
    </div>
  );
};

export default VSCodeTabs;
