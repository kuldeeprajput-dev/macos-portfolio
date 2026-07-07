import React, { useState } from "react";
import { BookOpen, Glasses, Clock, Search, Trash2, Link } from "lucide-react";
import { GITHUB_PROFILE } from "@constants";

const SafariSidebar = ({
  bookmarks,
  setBookmarks,
  historyList,
  setHistoryList,
  sidebarTab,
  setSidebarTab,
  navigateTabTo,
  projects,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredHistory = historyList.filter(
    (h) =>
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.url.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const clearHistory = () => {
    setHistoryList([]);
  };

  const removeBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f5f6f8] text-gray-800 border-r border-[#c8cbd0] select-none">
      {/* Top Segmented Control (Pill switcher) */}
      <div className="p-3 border-b border-[#c8cbd0]/60 flex items-center justify-between">
        <div className="flex bg-[#e3e4e6] p-0.5 rounded-lg w-full">
          <button
            onClick={() => setSidebarTab("bookmarks")}
            className={`flex-1 flex justify-center py-1 rounded-md transition-all ${
              sidebarTab === "bookmarks"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:text-gray-800"
            }`}
            title="Bookmarks"
          >
            <BookOpen size={14} />
          </button>
          <button
            onClick={() => setSidebarTab("readingList")}
            className={`flex-1 flex justify-center py-1 rounded-md transition-all ${
              sidebarTab === "readingList"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:text-gray-800"
            }`}
            title="Reading List"
          >
            <Glasses size={14} />
          </button>
          <button
            onClick={() => setSidebarTab("history")}
            className={`flex-1 flex justify-center py-1 rounded-md transition-all ${
              sidebarTab === "history"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:text-gray-800"
            }`}
            title="History"
          >
            <Clock size={14} />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-3 py-2 border-b border-[#c8cbd0]/40">
        <div className="flex items-center gap-1.5 bg-white border border-[#c8cbd0]/80 rounded-md px-2 py-1 text-xs">
          <Search size={12} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-800"
          />
        </div>
      </div>

      {/* Switchable lists content */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {sidebarTab === "bookmarks" && (
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
              Bookmarks
            </h4>
            {filteredBookmarks.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center py-4">No bookmarks found</p>
            ) : (
              filteredBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  onClick={() => navigateTabTo(bookmark.url)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {bookmark.img ? (
                      <img src={bookmark.img} className="w-4 h-4 object-contain rounded" alt="" />
                    ) : (
                      <Link size={12} className="text-gray-400" />
                    )}
                    <span className="text-xs truncate font-medium text-gray-700">
                      {bookmark.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => removeBookmark(bookmark.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {sidebarTab === "readingList" && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
              Reading List
            </h4>
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigateTabTo(project.link || GITHUB_PROFILE)}
                className="p-2 rounded-lg hover:bg-black/5 cursor-pointer transition-colors flex gap-2.5 items-start"
              >
                <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 shrink-0">
                  <img src={project.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-700 truncate">{project.title}</p>
                  <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {sidebarTab === "history" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 mb-2">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                History Log
              </h4>
              {historyList.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-[9px] font-semibold text-red-500 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            {filteredHistory.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center py-4">No history records</p>
            ) : (
              filteredHistory.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigateTabTo(item.url)}
                  className="p-2 rounded-lg hover:bg-black/5 cursor-pointer transition-colors flex flex-col gap-0.5"
                >
                  <span className="text-xs font-medium text-gray-700 truncate leading-tight">
                    {item.title}
                  </span>
                  <div className="flex items-center justify-between text-[9px] text-gray-400">
                    <span className="truncate max-w-[140px]">{item.url}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SafariSidebar;
