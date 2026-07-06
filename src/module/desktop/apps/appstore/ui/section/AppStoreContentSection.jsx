import { RefreshCw } from "lucide-react";
import { STORE_APPS, FEATURED_APPS } from "../../data";
import { AppStoreCard, UpdateItem, ActionButton } from "../components/AppStoreCard";

const UPDATES_LIST = [
  {
    id: "figma",
    name: "Figma",
    ver: "v116.4.2",
    details: "Improves responsiveness of layout resizing and resolves vector rendering glitches.",
  },
  {
    id: "vscode",
    name: "VS Code",
    ver: "v1.94.0",
    details: "Adds typescript syntax compiler accelerators and optimizes window redraw load times.",
  },
  {
    id: "slack",
    name: "Slack",
    ver: "v4.38.1",
    details:
      "Enhances video FaceTime call connection pipelines and optimizes message notification badges.",
  },
];

const AppStoreContentSection = ({
  activeTab,
  searchQuery,
  installStates,
  onStartDownload,
  onOpenApp,
  handleUpdateAll,
  handleSingleUpdate,
  updateProgresses,
  updatingAll,
  isNarrow,
}) => {
  const filteredApps = STORE_APPS.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getAppsByTab = () => {
    if (activeTab === "play") {
      return filteredApps.filter((app) => app.isGame);
    }
    if (activeTab === "develop") {
      return filteredApps.filter(
        (app) =>
          (app.category === "Developer Tools" || app.category === "Productivity") &&
          app.id !== "calculator" &&
          app.id !== "resume" &&
          app.id !== "calendar",
      );
    }
    return filteredApps;
  };

  return (
    <main className="flex-1 bg-white overflow-y-auto thin-scrollbar p-6 space-y-8 select-none text-gray-800 h-full min-h-0">
      {activeTab === "discover" && (
        <>
          <section className="space-y-3">
            <h2 className="text-base font-extrabold tracking-tight px-1">Featured</h2>
            <div className={`grid gap-4 ${isNarrow ? "grid-cols-1" : "grid-cols-2"}`}>
              {FEATURED_APPS.map((item) => (
                <div
                  key={item.id}
                  className={`relative rounded-xl overflow-hidden bg-linear-to-br ${item.bg} text-white p-6 flex flex-col justify-between min-h-[180px] shadow-md border border-black/5 group/featured`}
                >
                  {item.image && (
                    <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden pointer-events-none select-none">
                      <img
                        src={`/images/${item.image}`}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-35 group-hover/featured:scale-105 transition-transform duration-500"
                        style={{
                          maskImage:
                            "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                          WebkitMaskImage:
                            "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                        }}
                      />
                    </div>
                  )}
                  <div className="space-y-1 relative z-10">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                      {item.subtitle}
                    </span>
                    <h3 className="text-xl font-extrabold tracking-tight leading-none">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-white/70 max-w-[200px] mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 relative z-10">
                    <span className="text-[10px] font-bold text-white/40">Developer Preview</span>
                    <button
                      onClick={() => onOpenApp(STORE_APPS.find((app) => app.id === item.id))}
                      className="px-4 py-1.5 bg-white/20 hover:bg-white/30 border border-white/20 rounded-full text-xs font-bold text-white transition-all active:scale-95 cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-extrabold tracking-tight px-1">
              Top Utilities & Productivity
            </h2>
            <div className={`grid gap-4 ${isNarrow ? "grid-cols-1" : "grid-cols-2"}`}>
              {filteredApps
                .filter((app) => !app.isGame)
                .slice(0, 6)
                .map((app) => (
                  <AppStoreCard
                    key={app.id}
                    app={app}
                    installState={installStates[app.id]}
                    onStartDownload={onStartDownload}
                    onOpenApp={onOpenApp}
                  />
                ))}
            </div>
          </section>
        </>
      )}

      {activeTab === "play" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-extrabold tracking-tight">Play Games</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Explore immersive arcade and adventure games designed for Mac.
            </p>
          </div>

          {/* Hero Banner for Featured Game */}
          {(() => {
            const asphaltApp = STORE_APPS.find((app) => app.id === "asphalt");
            return asphaltApp ? (
              <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#311042] text-white p-6 md:p-8 flex flex-col justify-between min-h-[200px] shadow-lg border border-white/5 group/game-hero transition-all hover:shadow-xl hover:shadow-indigo-950/20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

                {/* Banner Image overlay */}
                <div className="absolute inset-y-0 right-0 w-1/2 md:w-3/5 overflow-hidden pointer-events-none select-none z-0">
                  <img
                    src="/images/asphalt_banner.webp"
                    alt="Asphalt 9 Banner"
                    className="w-full h-full object-cover opacity-45 group-hover/game-hero:scale-105 transition-transform duration-500"
                    style={{
                      maskImage: "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                    }}
                  />
                </div>
                <div className="space-y-2 relative z-10 max-w-md md:max-w-xl">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#f472b6] bg-[#f472b6]/10 px-2.5 py-1 rounded-full border border-[#f472b6]/20 w-fit block">
                    Featured Game
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-none mt-2">
                    {asphaltApp.name}
                  </h3>
                  <p className="text-[11px] text-zinc-300 leading-relaxed mt-2 font-medium max-w-lg">
                    Tear up the asphalt and take on the world's most fearless racers. Custom build
                    your dream supercar and experience ultimate street racing.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 relative z-10 border-t border-zinc-800 mt-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/asphalt.webp"
                      alt={asphaltApp.name}
                      className="w-10 h-10 object-cover rounded-xl shadow-md border border-white/10"
                    />
                    <div>
                      <p className="text-[11px] font-bold text-white">{asphaltApp.name}</p>
                      <p className="text-[9px] text-zinc-400">{asphaltApp.category}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <ActionButton
                      app={asphaltApp}
                      installState={installStates[asphaltApp.id]}
                      onStartDownload={onStartDownload}
                      onOpenApp={onOpenApp}
                    />
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
              All Games
            </h3>
            <div className={`grid gap-4 ${isNarrow ? "grid-cols-1" : "grid-cols-2"}`}>
              {getAppsByTab().map((app) => (
                <AppStoreCard
                  key={app.id}
                  app={app}
                  installState={installStates[app.id]}
                  onStartDownload={onStartDownload}
                  onOpenApp={onOpenApp}
                  variant="game"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "develop" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-extrabold tracking-tight">Developer & Work Tools</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Build apps, manage workspaces, and collaborate with your team.
            </p>
          </div>
          <div className={`grid gap-4 ${isNarrow ? "grid-cols-1" : "grid-cols-2"}`}>
            {getAppsByTab().map((app) => (
              <AppStoreCard
                key={app.id}
                app={app}
                installState={installStates[app.id]}
                onStartDownload={onStartDownload}
                onOpenApp={onOpenApp}
                variant="develop"
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "updates" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold tracking-tight">App Updates</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Keep your tools updated for the latest system stability enhancements.
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
            {UPDATES_LIST.map((update) => {
              const appItem = STORE_APPS.find((app) => app.id === update.id);
              return (
                <UpdateItem
                  key={update.id}
                  update={update}
                  appIcon={appItem?.icon}
                  progressVal={updateProgresses[update.id]}
                  onUpdate={handleSingleUpdate}
                  updatingAll={updatingAll}
                />
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
};

export default AppStoreContentSection;
