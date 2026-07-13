import NavbarWiFiMenu from "./NavbarWiFiMenu";

const NavbarControlCenter = ({
  isControlOpen,
  settings,
  music,
  controlCenterRef,
  toggleSetting,
  updateSlider,
  setMusicState,
  openWindow,
}) => {
  return (
    <aside
      ref={controlCenterRef}
      className={`control-center-mac ${isControlOpen ? "is-open" : ""}`}
      aria-hidden={!isControlOpen}
    >
      {/* Top Panel Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Left Card: WiFi / Bluetooth / AirDrop */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col gap-3.5">
          {/* WiFi Option */}
          <NavbarWiFiMenu settings={settings} toggleSetting={toggleSetting} />

          {/* Bluetooth Option */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => toggleSetting("bluetooth")}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                settings.bluetooth ? "bg-[#007aff] text-white" : "bg-white/10 text-white/70"
              }`}
            >
              <svg
                className="w-[16px] h-[16px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m7 7 10 10-5 5V2l5 5L7 17" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12.5px] font-semibold text-white/95 leading-tight">
                Bluetooth
              </span>
              <span className="text-[10px] text-white/50 leading-tight truncate">
                {settings.bluetooth ? "On" : "Off"}
              </span>
            </div>
          </div>

          {/* AirDrop Option */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => toggleSetting("airdrop")}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                settings.airdrop ? "bg-[#007aff] text-white" : "bg-white/10 text-white/70"
              }`}
            >
              <svg
                className="w-[16px] h-[16px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12.5px] font-semibold text-white/95 leading-tight">
                AirDrop
              </span>
              <span className="text-[10px] text-white/50 leading-tight truncate">
                {settings.airdrop ? "Contacts Only" : "Off"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column Grid */}
        <div className="flex flex-col gap-3">
          {/* Do Not Disturb Option */}
          <div
            className={`bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-3 cursor-pointer select-none transition-all ${
              settings.focusMode ? "bg-white/12" : ""
            }`}
            onClick={() => toggleSetting("focusMode")}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                settings.focusMode ? "bg-[#ffcc00] text-black" : "bg-white/10 text-white/70"
              }`}
            >
              <svg
                className="w-[16px] h-[16px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[12.5px] font-semibold text-white/95 leading-tight">
                Do Not Disturb
              </span>
              <span className="text-[10px] text-white/50 leading-tight">
                {settings.focusMode ? "On" : "Off"}
              </span>
            </div>
          </div>

          {/* Keyboard Brightness & AirPlay Row */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Night Shift */}
            <div
              className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col justify-between cursor-pointer hover:bg-white/8 select-none"
              onClick={() => toggleSetting("nightLight")}
            >
              <div
                className={`w-[26px] h-[26px] rounded-full flex items-center justify-center transition-all ${
                  settings.nightLight ? "bg-[#ff9500] text-white" : "bg-white/10 text-white/70"
                }`}
              >
                <svg
                  className="w-[14px] h-[14px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>
              <span className="text-[10.5px] font-medium text-white/90 leading-tight mt-2">
                Night
                <br />
                Light
              </span>
            </div>

            {/* System Settings launcher */}
            <div
              className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col justify-between cursor-pointer hover:bg-white/8 select-none"
              onClick={() => openWindow("settings")}
            >
              <div className="w-[26px] h-[26px] rounded-full bg-white/10 flex items-center justify-center text-white/70">
                <svg
                  className="w-[14px] h-[14px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.54 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <span className="text-[10.5px] font-medium text-white/90 leading-tight mt-2">
                System
                <br />
                Settings
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Display Slider Block */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 mb-3 flex flex-col gap-1.5">
        <span className="text-[12.5px] font-semibold text-white/95 leading-tight">Display</span>
        <div className="flex items-center gap-3 w-full relative">
          <input
            type="range"
            min="10"
            max="100"
            value={settings.brightness}
            onChange={(e) => updateSlider("brightness", e.target.value)}
            className="mac-slider flex-1"
            style={{ "--val": `${settings.brightness}%` }}
          />
          <div className="absolute left-3.5 pointer-events-none flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-black/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          </div>
        </div>
      </div>

      {/* Sound Slider Block */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 mb-3 flex flex-col gap-1.5">
        <span className="text-[12.5px] font-semibold text-white/95 leading-tight">Sound</span>
        <div className="flex items-center gap-3 w-full relative">
          <input
            type="range"
            min="0"
            max="100"
            value={music.isMuted ? 0 : music.volume}
            onChange={(e) => {
              const val = Number(e.target.value);
              setMusicState({ volume: val, isMuted: val === 0 });
            }}
            className="mac-slider flex-1"
            style={{ "--val": `${music.isMuted ? 0 : music.volume}%` }}
          />
          <div className="absolute left-3.5 pointer-events-none flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-black/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5 6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </div>
          <div
            className="flex items-center shrink-0 cursor-pointer"
            onClick={() => setMusicState({ isMuted: !music.isMuted })}
          >
            {music.isMuted ? (
              <svg
                className="w-[18px] h-[18px] text-red-500 hover:text-red-650"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="22" y1="9" x2="16" y2="15" />
                <line x1="16" y1="9" x2="22" y2="15" />
              </svg>
            ) : (
              <svg
                className="w-[18px] h-[18px] text-white/80 hover:text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Card: Now Playing / Media Player */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {music.activeTrack.coverUrl ? (
            <img
              src={music.activeTrack.coverUrl}
              alt="Track Art"
              className="w-11 h-11 rounded-lg object-cover bg-white/10 border border-white/10 shrink-0"
            />
          ) : (
            <div
              className={`w-11 h-11 rounded-lg bg-gradient-to-tr ${music.activeTrack.coverColor || "from-zinc-500 to-zinc-700"} flex items-center justify-center text-lg shadow-md shrink-0 text-white`}
            >
              {music.activeTrack.coverText || "🎵"}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-[12.5px] font-semibold text-white/95 truncate leading-tight">
              {music.activeTrack.title || "Select a Song"}
            </span>
            <span className="text-[10px] text-white/50 truncate leading-tight mt-0.5">
              {music.activeTrack.artist || "Jamendo Music"}
            </span>
          </div>
        </div>

        {/* Media Controls */}
        <div className="flex items-center gap-3.5 pr-2">
          <button
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => setMusicState({ isPlaying: !music.isPlaying })}
          >
            {music.isPlaying ? (
              <svg className="w-3.5 h-3.5 fill-white text-white" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 fill-white text-white" viewBox="0 0 24 24">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </button>
          <button
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => window.dispatchEvent(new CustomEvent("macos-portfolio-next-track"))}
          >
            <svg className="w-3.5 h-3.5 fill-white text-white" viewBox="0 0 24 24">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="3" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default NavbarControlCenter;
