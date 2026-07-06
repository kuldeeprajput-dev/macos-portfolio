import React, { useState } from "react";
import { X, Phone, Video, Bell, BellOff, ExternalLink } from "lucide-react";

const ContactInfoPanel = ({ activeChat, mutedChats, onToggleMute, onTriggerCall, onClose }) => {
  const [showRedirectPrompt, setShowRedirectPrompt] = useState(false);

  return (
    <div className="absolute md:relative inset-y-0 right-0 w-64 bg-gray-50 border-l border-gray-200 p-5 overflow-y-auto flex flex-col items-center text-center shrink-0 z-30 transition-transform duration-300">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 md:hidden"
        aria-label="Close details"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>

      <div className="w-16 h-16 rounded-full shadow-md mt-4 overflow-hidden relative flex items-center justify-center bg-gray-50 border border-gray-100">
        {activeChat.avatar ? (
          <img
            src={activeChat.avatar}
            alt={activeChat.name}
            className={`w-full h-full object-cover ${activeChat.id === "apple" ? "p-3.5 bg-gray-100 object-contain" : ""}`}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-white font-bold text-2xl ${activeChat.avatarColor}`}
          >
            {activeChat.initials}
          </div>
        )}
      </div>

      <h3 className="font-bold text-gray-900 text-base mt-3 leading-tight">{activeChat.name}</h3>
      <span className="text-xs text-gray-500 mt-1 truncate w-full">
        {activeChat.email || "No email info"}
      </span>

      <div className="flex justify-center gap-4 my-5 w-full">
        <button
          onClick={() => onTriggerCall("audio")}
          className="flex flex-col items-center gap-1 select-none"
        >
          <div className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 text-blue-600 flex items-center justify-center active:scale-95 transition-all">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-gray-500 font-medium">call</span>
        </button>
        <button
          onClick={() => onTriggerCall("video")}
          className="flex flex-col items-center gap-1 select-none"
        >
          <div className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 text-blue-600 flex items-center justify-center active:scale-95 transition-all">
            <Video className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-gray-500 font-medium">video</span>
        </button>
      </div>

      <hr className="w-full border-gray-200 my-1" />

      <div className="w-full py-2 space-y-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-left">
            {mutedChats[activeChat.id] ? (
              <BellOff className="w-4 h-4 text-gray-400" />
            ) : (
              <Bell className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-xs font-semibold text-gray-700">Hide Alerts</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!mutedChats[activeChat.id]}
              onChange={() => onToggleMute(activeChat.id)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
      </div>

      <hr className="w-full border-gray-200 my-1" />

      <div className="w-full py-3 text-left">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Links</h4>
        {activeChat.github ? (
          <a
            href={activeChat.github}
            onClick={(e) => {
              e.preventDefault();
              setShowRedirectPrompt(true);
            }}
            className="flex items-center justify-between p-2 bg-gray-100 hover:bg-gray-200 rounded text-xs text-blue-600 transition-colors w-full font-medium"
          >
            <span className="truncate max-w-[150px]">
              {activeChat.github.replace("https://", "")}
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-xs text-gray-400 italic">No links shared</span>
        )}
      </div>

      {showRedirectPrompt && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-[100] p-6 text-center animate-in fade-in duration-150">
          <div className="space-y-4 max-w-xs transform animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-neutral-100 text-neutral-800 rounded-full flex items-center justify-center mx-auto shadow-inner border border-zinc-200">
              <img
                src="/images/github.webp"
                alt="GitHub"
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  e.target.src = "/images/safari.webp";
                }}
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800">Open in New Tab</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Do you want to open the link{" "}
                <span className="font-semibold text-gray-700">
                  {activeChat.github.replace("https://", "")}
                </span>{" "}
                in a new tab?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowRedirectPrompt(false)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-zinc-200"
              >
                Cancel
              </button>
              <a
                href={activeChat.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowRedirectPrompt(false)}
                className="flex-1 py-2 bg-[#24292e] hover:bg-[#1f2327] active:bg-[#1a1e21] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer text-center"
              >
                Open Link
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfoPanel;
