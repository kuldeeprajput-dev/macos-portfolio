import WindowControls from "@components/WindowControls";

const AppleTVHeaderSection = ({ onProfileClick, profileUrl, showHeader = true }) => (
  <div
    id="window-header"
    className={`absolute top-0 left-0 right-0 flex items-center justify-between z-40 transition-all duration-300 ease-in-out ${
      showHeader
        ? "transform translate-y-0 opacity-100"
        : "transform -translate-y-full opacity-0 pointer-events-none"
    }`}
  >
    <div className="flex items-center gap-2">
      <WindowControls target="appletv" />
    </div>

    <span className="text-[15px] font-bold text-gray-900 absolute left-1/2 -translate-x-1/2 select-none pointer-events-none">
      Apple TV
    </span>

    <button
      onClick={onProfileClick}
      className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center border border-zinc-200 shadow-sm active:scale-95 transition-transform cursor-pointer relative z-50"
    >
      <img
        src={profileUrl || "/images/profile.webp"}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://avatars.githubusercontent.com/u/105151528?v=4";
        }}
      />
    </button>
  </div>
);

export default AppleTVHeaderSection;
