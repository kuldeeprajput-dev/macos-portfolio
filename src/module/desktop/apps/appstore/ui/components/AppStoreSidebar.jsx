import {
  Search,
  Sparkles,
  Play as PlayIcon,
  Terminal as TerminalIcon,
  ArrowDownCircle,
} from "lucide-react";
import { GITHUB_USERNAME } from "@constants";

const NAV_ITEMS = [
  { id: "discover", label: "Discover", icon: Sparkles },
  { id: "play", label: "Play Games", icon: PlayIcon },
  { id: "develop", label: "Work & Develop", icon: TerminalIcon },
  { id: "updates", label: "Updates", icon: ArrowDownCircle },
];

const AppStoreSidebar = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  onClose,
  githubProfile,
  onProfileClick,
  isNarrow,
  containerHeight = 620,
}) => {
  return (
    <aside className="w-52 bg-gray-50 border-r border-[#d1d1d1] p-4 space-y-6 flex flex-col h-full shrink-0 overflow-y-auto thin-scrollbar">
      <div className="relative flex items-center bg-gray-200/60 border border-gray-300/40 rounded-lg px-2.5 py-1.5 shrink-0">
        <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search Apps"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent text-xs focus:outline-none border-none outline-none text-gray-800 placeholder-gray-400"
        />
      </div>
      <div className="space-y-4 flex-1">
        <nav className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (isNarrow) {
                  onClose();
                }
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                activeTab === item.id
                  ? "bg-gray-200 text-gray-900 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200/60 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile switcher at the bottom */}
      {containerHeight >= 500 && (
        <button
          onClick={onProfileClick}
          className="mt-auto flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer text-gray-600 hover:bg-gray-200/60 hover:text-gray-900 w-full select-none"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 text-[10px] font-black shrink-0">
            {githubProfile?.avatar_url ? (
              <img
                src={githubProfile.avatar_url}
                alt={githubProfile.name || "Kunal"}
                className="w-full h-full object-cover"
              />
            ) : (
              "K"
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-gray-800 leading-none truncate">
              {githubProfile?.name || "Kuldeep Rajput"}
            </p>
            <span className="text-[9px] font-medium text-gray-400 block mt-0.5">
              @{githubProfile?.login || GITHUB_USERNAME}
            </span>
          </div>
        </button>
      )}
    </aside>
  );
};

export default AppStoreSidebar;
