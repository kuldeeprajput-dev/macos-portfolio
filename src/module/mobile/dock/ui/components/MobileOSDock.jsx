import OptimizedImage from "@module/shared/ui/components/OptimizedImage";

const scaleMap = {
  finder: "scale-[0.90]",
  launchpad: "scale-[0.90]",
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
  calendar: "scale-[0.76]",
  weather: "scale-[0.79]",
  vscode: "scale-[0.95]",
  postman: "scale-[0.95]",
  map: "scale-[0.73]",
  font: "scale-[2.7]",
  telegram: "scale-[0.90]",
  music: "scale-[0.90]",
  folder: "scale-[0.80]",
  trash: "scale-[0.80]",
};

const MobileOSDock = ({ dockApps, openWindow }) => (
  <footer className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-around w-[92%] h-[88px] bg-white/22 backdrop-blur-[40px] backdrop-saturate-[1.8] rounded-[32px] border border-white/18 shadow-[0_8px_40px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] px-[10px]">
    {dockApps.map((app) => (
      <button
        key={app.id}
        onClick={() => openWindow(app.id)}
        className="active:scale-[0.82] transition-transform duration-150 w-[58px] h-[58px] rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
      >
        <OptimizedImage
          src={`/images/${app.icon}`}
          alt={app.name}
          width={64}
          height={64}
          className={`w-full h-full object-cover rounded-[14px] ${scaleMap[app.id] || ""}`}
        />
      </button>
    ))}
  </footer>
);

export default MobileOSDock;
