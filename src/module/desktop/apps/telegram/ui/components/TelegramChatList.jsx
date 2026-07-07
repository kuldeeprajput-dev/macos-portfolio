import React, { useState } from "react";
import { Search, Menu } from "lucide-react";

const TelegramChatList = ({
  filteredChats,
  activeChatId,
  setActiveChatId,
  searchQuery,
  setSearchQuery,
  nightMode,
  isSidebarOpen,
  setIsSidebarOpen,
  isDrawerOpen,
  setIsDrawerOpen,
  setDrawerSection,
  containerWidth = 800,
}) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const categoryFilteredChats = filteredChats.filter((chat) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Personal") return chat.type === "user" || chat.type === "bot";
    if (activeFilter === "Groups") return chat.type === "group";
    if (activeFilter === "Channels") return chat.type === "channel";
    return true;
  });

  const isNarrow = containerWidth < 550;

  return (
    <div
      className={`
      inset-y-0 left-0 w-64 border-r flex flex-col z-20 transition-all duration-300 h-full
      ${nightMode ? "bg-zinc-900 border-zinc-800" : "bg-[#f4f4f5] border-zinc-200"}
      ${isNarrow ? "absolute" : "relative"}
      ${isNarrow && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"}
    `}
    >
      <div className="p-3 pb-1.5 flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setDrawerSection("menu");
              setIsDrawerOpen(!isDrawerOpen);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              nightMode ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-zinc-200 text-gray-600"
            }`}
            title="Menu Drawer"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
          <div
            className={`relative flex items-center flex-1 rounded-lg px-2.5 py-1.5 ${
              nightMode ? "bg-zinc-800" : "bg-zinc-200/80"
            }`}
          >
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent text-xs focus:outline-none border-none outline-none placeholder-gray-400 select-text ${
                nightMode ? "text-white" : "text-gray-800"
              }`}
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          className={`flex items-center gap-1.5 py-1 text-[10px] font-bold text-gray-400 select-none overflow-x-auto whitespace-nowrap scrollbar-none border-b ${
            nightMode ? "border-zinc-800/60" : "border-zinc-250/10"
          }`}
        >
          {["All", "Personal", "Groups", "Channels"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-2.5 py-1 rounded-full transition-all text-[10px] font-semibold cursor-pointer ${
                activeFilter === tab
                  ? "bg-[#3390ec] text-white"
                  : nightMode
                    ? "hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200"
                    : "hover:bg-zinc-200 text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5 px-2">
        {categoryFilteredChats.map((chat) => {
          const isSelected = activeChatId === chat.id;
          const lastMsg = chat.messages[chat.messages.length - 1];

          return (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                if (isNarrow) {
                  setIsSidebarOpen(false);
                }
              }}
              className={`p-2.5 flex items-center gap-3 cursor-pointer rounded-lg transition-colors ${
                isSelected
                  ? "bg-[#3390ec] text-white"
                  : nightMode
                    ? "hover:bg-zinc-800/80 text-zinc-300"
                    : "hover:bg-zinc-200/60 text-gray-800"
              }`}
            >
              {chat.avatar ? (
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm select-none pointer-events-none"
                />
              ) : (
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm ${chat.avatarColor}`}
                >
                  {chat.initials}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-semibold text-xs truncate ${isSelected ? "text-white" : nightMode ? "text-zinc-100" : "text-gray-900"}`}
                  >
                    {chat.name}
                  </h4>
                  <span
                    className={`text-[10px] shrink-0 font-medium ${isSelected ? "text-sky-100" : "text-gray-400"}`}
                  >
                    {lastMsg?.time}
                  </span>
                </div>
                <p
                  className={`text-[11px] truncate mt-0.5 ${
                    isSelected ? "text-sky-100" : nightMode ? "text-zinc-400" : "text-gray-500"
                  }`}
                >
                  {chat.type === "channel" ? "📢 " : ""}
                  {lastMsg?.senderName ? `${lastMsg.senderName}: ` : ""}
                  {lastMsg?.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TelegramChatList;
