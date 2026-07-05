const LaunchpadGrid = ({ apps, onLaunch, searchQuery }) => (
  <div
    onClick={(e) => e.stopPropagation()}
    className="w-full max-w-4.5xl flex-1 overflow-y-auto px-4"
  >
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-y-12 gap-x-8 justify-items-center justify-center">
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onLaunch(app.id)}
          className="flex flex-col items-center gap-2.5 group focus:outline-none cursor-pointer w-20"
        >
          <div className="w-[80px] h-[80px] rounded-[18px] bg-transparent transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95 flex items-center justify-center relative select-none">
            {app.id === "calendar" ? (
              <div className="w-full h-full bg-white rounded-[18px] border border-black/10 shadow-md overflow-hidden flex flex-col items-center select-none aspect-square scale-[0.76]">
                <div className="w-full bg-[#ff3b30] text-white text-[10px] font-extrabold py-0.5 md:py-1 text-center leading-none tracking-wider uppercase">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()]}
                </div>
                <div className="flex-1 flex items-center justify-center text-gray-800 font-bold text-3xl leading-none font-sans -mt-0.5">
                  {new Date().getDate()}
                </div>
              </div>
            ) : (
              <img
                src={`/images/${app.icon}`}
                alt={app.name}
                className={`w-full h-full object-contain filter drop-shadow-sm ${
                  {
                    finder: "scale-[0.90]",
                    safari: "scale-[0.90]",
                    photos: "scale-[0.90]",
                    contact: "scale-[0.90]",
                    terminal: "scale-[0.90]",
                    settings: "scale-[0.83]",
                    calculator: "scale-[0.83]",
                    notes: "scale-[0.90]",
                    messages: "scale-[0.90]",
                    appletv: "scale-[0.80]",
                    call: "scale-[0.71]",
                    appstore: "scale-[0.90]",
                    weather: "scale-[0.81]",
                    vscode: "scale-[0.95]",
                    postman: "scale-[0.95]",
                    map: "scale-[0.72]",
                    font: "scale-[2.8]",
                    telegram: "scale-[0.90]",
                    music: "scale-[0.90]",
                  }[app.id] || ""
                }`}
              />
            )}
          </div>
          <span className="text-white text-[11px] font-normal tracking-wide text-center text-shadow-sm select-none truncate w-full mt-1">
            {app.name}
          </span>
        </button>
      ))}
    </div>

    {apps.length === 0 && (
      <div className="text-white/40 text-center py-20 text-sm">
        No Applications found matching "{searchQuery}"
      </div>
    )}
  </div>
);

export default LaunchpadGrid;
