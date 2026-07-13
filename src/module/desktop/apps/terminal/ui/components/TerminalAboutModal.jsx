import React from "react";

const TerminalAboutModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/15 backdrop-blur-xxs select-none font-sans"
      onClick={onClose}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        className="w-[280px] h-[260px] bg-[#f5f5f7]/95 backdrop-blur-md border border-gray-300 rounded-xl shadow-2xl overflow-hidden flex flex-col items-center p-4 relative text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with traffic light close button */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer active:opacity-75"
            title="Close"
          />
          <div className="w-3 h-3 rounded-full bg-gray-300/60 border border-gray-400/30 opacity-40 cursor-default" />
          <div className="w-3 h-3 rounded-full bg-gray-300/60 border border-gray-400/30 opacity-40 cursor-default" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center mt-3 text-center">
          <img
            src="/images/terminal.webp"
            alt="Terminal Icon"
            className="w-16 h-16 object-contain drop-shadow-md select-none pointer-events-none"
          />
          <h1 className="text-base font-bold text-gray-900 mt-3 select-none">Terminal</h1>
          <p className="text-[10px] text-gray-500 font-medium select-none mt-0.5">
            Version 2.14 (Ventura)
          </p>
        </div>

        {/* Footer/Copyright */}
        <div className="text-center text-[8.5px] text-gray-400/90 leading-tight mb-2 select-none">
          <p>Portfolio UI demo. Not affiliated with Apple Inc.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default TerminalAboutModal;
