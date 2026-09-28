import { useState, useRef, useEffect } from "react";

const FolderRenameInput = ({ initialValue, onSave, onCancel }) => {
  const [val, setVal] = useState(initialValue || "");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleCommit = () => {
    const trimmed = val.trim();
    if (trimmed) {
      onSave(trimmed);
    } else {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={val}
      maxLength={50}
      onChange={(e) => setVal(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleCommit();
        } else if (e.key === "Escape") {
          e.preventDefault();
          onCancel();
        }
      }}
      onBlur={handleCommit}
      style={{
        fieldSizing: "content",
        width: `${Math.min(Math.max((val?.length || 1) + 1.5, 4), 11)}ch`,
      }}
      className="mt-1 min-w-[50px] max-w-[96px] rounded-[4px] px-1.5 py-0.5 text-center text-[12px] font-normal leading-tight text-white bg-[#1e1e1e]/90 border border-[#0071e3] ring-1 ring-[#0071e3]/60 outline-none shadow-[0_2px_8px_rgba(0,0,0,0.5)] selection:bg-[#0071e3] selection:text-white"
    />
  );
};

export default FolderRenameInput;
