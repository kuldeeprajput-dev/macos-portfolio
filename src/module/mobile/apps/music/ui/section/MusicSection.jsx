import { useState } from "react";
import { Play, Disc, Music2, Search } from "lucide-react";
import WindowControls from "@components/WindowControls";
import AppleMusicPlayer from "../components/AppleMusicPlayer";
import AppleMusicMiniPlayer from "../components/AppleMusicMiniPlayer";
import AppleMusicTabs from "../components/AppleMusicTabs";

const MusicSection = (props) => {
  const {
    tracks,
    activeTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    searchQuery,
    setSearchQuery,
    _activeCategory,
    setActiveCategory,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
    isLoading,
    isFetchingMore,
    handleLoadMore,
    audioRef,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleAudioEnded,
    handleSelectTrack,
    handlePlayPause,
    handleNext,
    handlePrev,
    formatTime,
    handleProgressChange,
    setMusicState,
  } = props;

  const [activeTab, setActiveTab] = useState("Listen Now");
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  const tabsConfig = [
    {
      name: "Listen Now",
      icon: <Play size={18} fill={activeTab === "Listen Now" ? "currentColor" : "none"} />,
    },
    { name: "Browse", icon: <Disc size={18} /> },
    { name: "Library", icon: <Music2 size={18} /> },
    { name: "Search", icon: <Search size={18} /> },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-white text-gray-800 select-none relative font-sans">
      {/* iOS style Top Header / Status bar spacer with Window Exit Controls */}
      <div
        id="window-header"
        className="shrink-0 flex items-center justify-between bg-zinc-50/90 backdrop-blur-md px-4 py-2 border-b border-zinc-200/50 z-40 relative"
      >
        <div className="flex items-center gap-2">
          <WindowControls target="music" />
        </div>
        <span className="text-[13px] font-bold text-gray-800 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          Music
        </span>
        <div className="w-10" />
      </div>

      {/* Dynamic Tab Body content */}
      <div className="flex-1 flex flex-col min-h-0 pb-[130px] bg-white overflow-hidden">
        <AppleMusicTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tracks={tracks}
          activeTrack={activeTrack}
          isPlaying={isPlaying}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectTrack={handleSelectTrack}
          isLoading={isLoading}
          isFetchingMore={isFetchingMore}
          handleLoadMore={handleLoadMore}
          formatTime={formatTime}
          setActiveCategory={setActiveCategory}
        />
      </div>

      {/* Mini Player */}
      {activeTrack && !isPlayerExpanded && (
        <AppleMusicMiniPlayer
          activeTrack={activeTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onExpand={() => setIsPlayerExpanded(true)}
        />
      )}

      {/* Full-Screen Apple Music iOS FaceTime Player Panel */}
      {isPlayerExpanded && (
        <AppleMusicPlayer
          activeTrack={activeTrack}
          currentTime={currentTime}
          isPlaying={isPlaying}
          volume={volume}
          isMuted={isMuted}
          isShuffle={isShuffle}
          isRepeat={isRepeat}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
          onShuffleToggle={() => setIsShuffle(!isShuffle)}
          onRepeatToggle={() => setIsRepeat(!isRepeat)}
          onProgressChange={handleProgressChange}
          onMuteToggle={() => setMusicState({ isMuted: !isMuted })}
          onVolumeChange={(e) => {
            const val = parseInt(e.target.value);
            setMusicState({ volume: val, isMuted: val === 0 });
          }}
          formatTime={formatTime}
          onClose={() => setIsPlayerExpanded(false)}
        />
      )}

      {/* iOS style Bottom Navigation Tab Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[65px] border-t border-zinc-200/50 bg-zinc-50/90 backdrop-blur-md flex items-center justify-around z-40 px-3 pb-safe">
        {tabsConfig.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                setIsPlayerExpanded(false);
              }}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors bg-transparent border-none outline-none cursor-pointer ${
                isActive ? "text-red-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Custom sliding transition support and style rules */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MusicSection;
