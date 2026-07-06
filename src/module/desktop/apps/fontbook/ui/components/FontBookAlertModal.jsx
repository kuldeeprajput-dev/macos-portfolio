import React from "react";

const FontBookAlertModal = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/15 backdrop-blur-xxs select-none font-sans"
      onClick={onClose}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        className="w-[270px] bg-[#f5f5f7]/95 backdrop-blur-md border border-gray-300 rounded-xl shadow-2xl p-4 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* App Icon */}
        <img
          src="/images/font.webp"
          alt="Font Book"
          className="w-12 h-12 object-contain drop-shadow-sm select-none pointer-events-none"
        />

        {/* Title */}
        <h3 className="text-[13px] font-bold text-gray-900 mt-2.5 leading-tight select-none">
          {title || "Font Book Warning"}
        </h3>

        {/* Message Description */}
        <p className="text-[11px] text-gray-600 font-medium select-none mt-1 leading-normal px-2">
          {message}
        </p>

        {/* OK Action Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-1.5 bg-[#007aff] hover:bg-[#0068d9] active:bg-[#005bc2] text-white text-[12px] font-semibold rounded-md shadow-sm border border-[#0066d6] transition-colors cursor-pointer select-none"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default FontBookAlertModal;
