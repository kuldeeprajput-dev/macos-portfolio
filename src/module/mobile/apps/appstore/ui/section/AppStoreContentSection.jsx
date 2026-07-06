import { RefreshCw, Search as SearchIcon, ArrowRight, Sparkles, Trophy, Star } from "lucide-react";
import { STORE_APPS, FEATURED_APPS } from "../../data";
import { AppStoreCard, UpdateItem } from "../components/AppStoreCard";
import { useState, useRef } from "react";

const UPDATES_LIST = [
  {
    id: "instagram",
    name: "Instagram",
    ver: "v312.0.1",
    details:
      "Improves photo loading speeds, introduces interactive camera filters, and resolves reels playback glitches.",
  },
  {
    id: "tiktok",
    name: "TikTok",
    ver: "v32.4.0",
    details:
      "Adds video compiler accelerators, optimizes scroll feed performance, and enhances live stream quality.",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    ver: "v2.24.5",
    details:
      "Enhances end-to-end encryption speed pipelines and optimizes typing status animations.",
  },
];

const AppStoreContentSection = ({
  activeTab,
  searchQuery,
  onSearch,
  installStates,
  onStartDownload,
  onOpenApp,
  handleUpdateAll,
  handleSingleUpdate,
  updateProgresses,
  updatingAll,
  onSelectApp,
  onScrollDirection,
}) => {
  const lastScrollTopRef = useRef(0);

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (onScrollDirection) {
      if (scrollTop <= 10) {
        onScrollDirection("up");
      } else if (scrollTop > lastScrollTopRef.current) {
        onScrollDirection("down");
      } else if (scrollTop < lastScrollTopRef.current) {
        onScrollDirection("up");
      }
    }
    lastScrollTopRef.current = scrollTop;
  };
  const [trendingQueries] = useState([
    "Minecraft",
    "Figma",
    "Telegram",
    "Safari",
    "FaceTime",
    "Weather",
  ]);

  const filteredApps = STORE_APPS.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const games = STORE_APPS.filter((app) => app.isGame);
  const regularApps = STORE_APPS.filter((app) => !app.isGame);

  const getTodayDateString = () => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    return new Date().toLocaleDateString("en-US", options);
  };

  return (
    <main
      onScroll={handleScroll}
      className="flex-1 bg-white overflow-y-auto scrollbar-none select-none text-gray-800 h-full min-h-0 pt-[44px]"
    >
      {/* 1. TODAY TAB */}
      {activeTab === "today" && (
        <div className="p-5 space-y-6">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              {getTodayDateString()}
            </span>
            <h1 className="text-[32px] font-extrabold text-black tracking-tight leading-none">
              Today
            </h1>
          </div>

          {/* Featured Large Banners */}
          <div className="space-y-5">
            {FEATURED_APPS.map((item) => {
              const fullApp = STORE_APPS.find((app) => app.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectApp(fullApp)}
                  className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${item.bg} text-white p-6 flex flex-col justify-between min-h-[340px] shadow-lg border border-black/5 cursor-pointer active:scale-[0.99] transition-transform`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                      {item.subtitle}
                    </span>
                    <h3 className="text-2xl font-extrabold tracking-tight leading-none mt-1">
                      {item.title}
                    </h3>
                  </div>

                  <div className="space-y-3 bg-black/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mt-12">
                    <p className="text-xs text-white/90 leading-relaxed font-medium">{item.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/50">
                        Featured App
                      </span>
                      <span className="text-xs font-bold text-blue-300 flex items-center gap-1">
                        View Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Editors Choice row */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Editor's Choice</h2>
            <div className="space-y-1">
              {regularApps.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  onClick={() => onSelectApp(app)}
                  className="cursor-pointer active:bg-zinc-50 rounded-xl"
                >
                  <AppStoreCard
                    app={app}
                    installState={installStates[app.id]}
                    onStartDownload={onStartDownload}
                    onOpenApp={onOpenApp}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. GAMES TAB */}
      {activeTab === "games" && (
        <div className="p-5 space-y-6">
          <div>
            <h1 className="text-[32px] font-extrabold text-black tracking-tight">Games</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Explore immersive play and arcade classics.
            </p>
          </div>

          {/* Featured Game Card */}
          <div className="bg-gradient-to-tr from-amber-500 to-orange-600 rounded-3xl p-6 text-white space-y-8 shadow-md">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/70">
                New Release
              </span>
              <h3 className="text-xl font-extrabold tracking-tight">Asphalt 9: Legends</h3>
              <p className="text-[11px] text-white/80 max-w-xs">
                Experience ultimate arcade racing adventure in high speed.
              </p>
            </div>
            <button
              onClick={() => onSelectApp(STORE_APPS.find((a) => a.id === "asphalt"))}
              className="px-5 py-2 bg-white text-orange-600 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-transform"
            >
              Get Game
            </button>
          </div>

          {/* Games list */}
          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Top Games</h2>
            <div className="space-y-1">
              {games.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onSelectApp(app)}
                  className="cursor-pointer active:bg-zinc-50 rounded-xl"
                >
                  <AppStoreCard
                    app={app}
                    installState={installStates[app.id]}
                    onStartDownload={onStartDownload}
                    onOpenApp={onOpenApp}
                    variant="game"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. APPS TAB */}
      {activeTab === "apps" && (
        <div className="p-5 space-y-6">
          <div>
            <h1 className="text-[32px] font-extrabold text-black tracking-tight">Apps</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Productivity, utilities, and developer essentials.
            </p>
          </div>

          {/* Spotlight item */}
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-3xl p-6 text-white space-y-8 shadow-md">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/70">
                Spotlight App
              </span>
              <h3 className="text-xl font-extrabold tracking-tight">Safari</h3>
              <p className="text-[11px] text-white/80 max-w-xs">
                Browse the web with Apple's fast, secure, and energy-efficient browser.
              </p>
            </div>
            <button
              onClick={() => onSelectApp(STORE_APPS.find((a) => a.id === "safari"))}
              className="px-5 py-2 bg-white text-blue-600 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-transform"
            >
              Learn More
            </button>
          </div>

          {/* Regular Apps list */}
          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Popular Utilities
            </h2>
            <div className="space-y-1">
              {regularApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onSelectApp(app)}
                  className="cursor-pointer active:bg-zinc-50 rounded-xl"
                >
                  <AppStoreCard
                    app={app}
                    installState={installStates[app.id]}
                    onStartDownload={onStartDownload}
                    onOpenApp={onOpenApp}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. UPDATES TAB */}
      {activeTab === "updates" && (
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h1 className="text-[32px] font-extrabold text-black tracking-tight">Updates</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Keep apps updated for optimal stability.
              </p>
            </div>
            <button
              onClick={handleUpdateAll}
              disabled={updatingAll}
              className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:pointer-events-none text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${updatingAll ? "animate-spin" : ""}`} />
              Update All
            </button>
          </div>

          <div className="space-y-4">
            {UPDATES_LIST.map((update) => (
              <UpdateItem
                key={update.id}
                update={update}
                progressVal={updateProgresses[update.id]}
                onUpdate={handleSingleUpdate}
                updatingAll={updatingAll}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. SEARCH TAB */}
      {activeTab === "search" && (
        <div className="p-5 space-y-6">
          <div>
            <h1 className="text-[32px] font-extrabold text-black tracking-tight">Search</h1>
          </div>

          {/* Search bar */}
          <div className="relative flex items-center bg-zinc-100 rounded-2xl px-3.5 py-2.5 h-11 shrink-0 border border-zinc-200/50">
            <SearchIcon className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="App Store, Games, Developers"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none border-none text-gray-800 font-semibold placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearch("")}
                className="text-xs font-bold text-blue-500 pl-2 shrink-0 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Trending Suggestions */}
          {!searchQuery && (
            <div className="space-y-3.5">
              <h2 className="text-lg font-extrabold text-gray-900 tracking-tight px-0.5">
                Trending
              </h2>
              <div className="flex flex-wrap gap-2">
                {trendingQueries.map((term) => (
                  <button
                    key={term}
                    onClick={() => onSearch(term)}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-gray-700 rounded-2xl transition-colors cursor-pointer border border-zinc-200/20"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {searchQuery && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Results
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {filteredApps.length} match(es)
                </span>
              </div>
              {filteredApps.length > 0 ? (
                <div className="space-y-1">
                  {filteredApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => onSelectApp(app)}
                      className="cursor-pointer active:bg-zinc-50 rounded-xl"
                    >
                      <AppStoreCard
                        app={app}
                        installState={installStates[app.id]}
                        onStartDownload={onStartDownload}
                        onOpenApp={onOpenApp}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-2">
                  <span className="block text-4xl">🔍</span>
                  <p className="text-sm font-bold text-gray-700">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-xs text-gray-400">
                    Check spelling or search for another keyword.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default AppStoreContentSection;
