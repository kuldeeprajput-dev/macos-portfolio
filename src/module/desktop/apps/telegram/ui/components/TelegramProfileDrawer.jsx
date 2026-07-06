import React from "react";
import { ExternalLink } from "lucide-react";
import useWindowsStore from "@store/window";
import { GITHUB_PROFILE } from "@constants";

const TelegramProfileDrawer = ({ activeChat, nightMode }) => {
  const setGithubRedirect = useWindowsStore((state) => state.setGithubRedirect);

  return (
    <div
      className={`w-64 border-l p-5 overflow-y-auto flex flex-col items-center shrink-0 z-10 text-center relative select-none transition-colors ${
        nightMode ? "bg-zinc-900 border-zinc-800" : "bg-[#f4f4f5] border-zinc-200"
      }`}
    >
      {activeChat.avatar ? (
        <img
          src={activeChat.avatar}
          alt={activeChat.name}
          className="w-16 h-16 rounded-full object-cover shrink-0 shadow-md mt-3 select-none pointer-events-none"
        />
      ) : (
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-sm mt-3 ${activeChat.avatarColor}`}
        >
          {activeChat.initials}
        </div>
      )}

      <h3
        className={`font-bold text-sm mt-3 leading-tight ${
          nightMode ? "text-white" : "text-gray-900"
        }`}
      >
        {activeChat.name}
      </h3>
      <span className="text-[10px] text-gray-400 block mt-1">{activeChat.username}</span>

      <hr className={`w-full my-4 ${nightMode ? "border-zinc-800" : "border-zinc-200"}`} />

      <div className="w-full text-left space-y-3">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Bio
          </span>
          <span
            className={`text-xs mt-1 block select-text leading-relaxed ${
              nightMode ? "text-zinc-300" : "text-gray-800"
            }`}
          >
            {activeChat.bio}
          </span>
        </div>

        {activeChat.phone !== "None" && (
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Phone
            </span>
            <span
              className={`text-xs mt-1 block select-text font-mono ${
                nightMode ? "text-zinc-300" : "text-gray-800"
              }`}
            >
              {activeChat.phone}
            </span>
          </div>
        )}

        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Type
          </span>
          <span
            className={`text-xs mt-1 block capitalize font-medium ${
              nightMode ? "text-zinc-300" : "text-gray-800"
            }`}
          >
            {activeChat.type}
          </span>
        </div>
      </div>

      <hr className={`w-full my-4 ${nightMode ? "border-zinc-800" : "border-zinc-200"}`} />

      <div className="w-full text-left">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Shared Information
        </span>
        <div className="space-y-1.5">
          <button
            onClick={() =>
              setGithubRedirect({
                name: "Developer Profile",
                href: GITHUB_PROFILE,
                source: "telegram",
              })
            }
            className={`flex items-center justify-between p-2 border rounded-md text-[11px] text-[#3390ec] transition-colors w-full font-medium cursor-pointer ${
              nightMode
                ? "bg-zinc-850 border-zinc-750 hover:bg-zinc-800"
                : "bg-white border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <span className="truncate">GitHub Profile</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelegramProfileDrawer;
