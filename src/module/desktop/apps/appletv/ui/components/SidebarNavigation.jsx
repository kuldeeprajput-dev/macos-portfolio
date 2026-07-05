import { Film, FolderHeart, Play, Search, ShoppingBag, Tv } from "lucide-react";
import { GITHUB_USERNAME } from "@constants";

const appleTvItems = [
  { id: "watchNow", label: "Watch Now", icon: Play, color: "text-orange-500 fill-orange-500" },
  { id: "tvPlus", label: "Apple TV+", icon: Tv, color: "text-gray-800" },
  { id: "store", label: "Store", icon: ShoppingBag, color: "text-blue-500" },
];

const libraryItems = [
  { id: "library", label: "Movies", icon: Film, color: "text-emerald-500" },
  { id: "favorites", label: "Up Next", icon: FolderHeart, color: "text-rose-500 fill-rose-500" },
];

const NavigationGroup = ({ title, items, activeTab, onSelect }) => (
  <div className="space-y-1">
    <h3 className="text-[10px] font-bold text-gray-400/90 uppercase tracking-wider px-3 mb-1">
      {title}
    </h3>
    <nav className="space-y-0.5">
      {items.map(({ id, label, icon: Icon, color }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-all ${
            activeTab === id
              ? "bg-gray-200/90 text-gray-900 shadow-sm font-semibold"
              : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
          }`}
        >
          <Icon
            className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${color}`}
          />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  </div>
);

const SidebarNavigation = ({
  activeTab,
  searchQuery,
  isSidebarOpen,
  onSearch,
  onSelectTab,
  isCompact,
  githubProfile,
  onProfileClick,
}) => (
  <aside
    className={`
      appletv-sidebar-aside ${isCompact ? "absolute" : "relative"} inset-y-0 left-0 w-48 bg-gray-50/90 backdrop-blur-md border-r border-gray-300/40 p-4 gap-6 flex flex-col z-30 transition-transform duration-300 h-full
      ${isSidebarOpen || !isCompact ? "translate-x-0" : "-translate-x-full"}
    `}
  >
    <style>{`
      .appletv-sidebar-scroll::-webkit-scrollbar {
        width: 5px;
      }
      .appletv-sidebar-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .appletv-sidebar-scroll::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.22);
        border-radius: 99px;
      }
      .appletv-sidebar-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.35);
      }
      @container (max-height: 480px) {
        .appletv-profile-switcher {
          display: none !important;
        }
        .appletv-sidebar-aside {
          padding-bottom: 8px !important;
          gap: 12px !important;
        }
      }
    `}</style>
    {/* macOS Search bar styling */}
    <div className="relative flex items-center bg-gray-200/50 border border-gray-300/20 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:bg-white transition-all shadow-inner">
      <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(event) => onSearch(event.target.value)}
        className="w-full bg-transparent text-xs focus:outline-none border-none outline-none text-gray-800 placeholder-gray-400 font-medium"
      />
    </div>

    <div className="space-y-5 flex-1 overflow-y-auto select-none pr-1 appletv-sidebar-scroll">
      <NavigationGroup
        title="Apple TV"
        items={appleTvItems}
        activeTab={activeTab}
        onSelect={onSelectTab}
      />
      <NavigationGroup
        title="Library"
        items={libraryItems}
        activeTab={activeTab}
        onSelect={onSelectTab}
      />
    </div>

    {/* Profile switcher at the bottom */}
    <div
      onClick={onProfileClick}
      className="appletv-profile-switcher mt-auto pt-4 border-t border-[#d4d4d8]/40 flex items-center gap-2.5 px-1 select-none cursor-pointer group/profile hover:bg-[#e5e5eb]/40 p-1.5 rounded-xl transition-all active:scale-95"
    >
      <div className="w-7 h-7 rounded-full overflow-hidden bg-transparent flex items-center justify-center text-zinc-600 text-[10px] font-black shrink-0 border border-[#d4d4d8]/40">
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
        <p className="text-[11px] font-bold text-zinc-700 group-hover/profile:text-zinc-950 truncate leading-none">
          {githubProfile?.name || "Kuldeep Rajput"}
        </p>
        <span className="text-[9px] font-bold text-zinc-400 block mt-0.5">
          @{githubProfile?.login || GITHUB_USERNAME}
        </span>
      </div>
    </div>
  </aside>
);

export default SidebarNavigation;
