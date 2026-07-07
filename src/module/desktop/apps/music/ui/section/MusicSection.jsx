import React, { useState, useEffect, useRef } from "react";
import MusicHeaderSection from "./MusicHeaderSection";
import MusicSidebarSection from "./MusicSidebarSection";
import MusicTrackSection from "./MusicTrackSection";
import MusicPlayerSection from "./MusicPlayerSection";

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
    activeCategory,
    setActiveCategory,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
    isLoading,
    audioRef,
    searchInputRef,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleAudioEnded,
    handleSelectTrack,
    handlePlayPause,
    handleNext,
    handlePrev,
    formatTime,
    handleProgressChange,
    focusWindow,
    setMusicState,
  } = props;

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isNarrow = containerWidth < 650;

  useEffect(() => {
    if (isNarrow) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isNarrow]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full bg-white text-gray-800 rounded-xl overflow-hidden shadow-2xl border border-zinc-200 select-none"
    >
      <MusicHeaderSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        isNarrow={isNarrow}
        searchInputRef={searchInputRef}
        onFocusWindow={focusWindow}
      />

      <div className="flex-1 flex min-h-0 relative bg-white">
        {isNarrow && isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/15 z-10 transition-opacity duration-300 cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <MusicSidebarSection
          activeCategory={activeCategory}
          setActiveCategory={(cat) => {
            setActiveCategory(cat);
            if (isNarrow) {
              setIsSidebarOpen(false);
            }
          }}
          isSidebarOpen={isSidebarOpen}
          isPlaying={isPlaying}
          isNarrow={isNarrow}
        />

        <MusicTrackSection
          tracks={tracks}
          activeTrack={activeTrack}
          isPlaying={isPlaying}
          onSelectTrack={handleSelectTrack}
          formatTime={formatTime}
          isLoading={isLoading}
          activeCategory={activeCategory}
          isNarrow={isNarrow}
        />
      </div>

      <MusicPlayerSection
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
        isNarrow={isNarrow}
      />

      <style>{`
        @keyframes bounceVisualizer {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default MusicSection;
