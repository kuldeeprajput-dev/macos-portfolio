import MusicPlayerBar from "../components/MusicPlayerBar";

const MusicPlayerSection = ({
  activeTrack,
  currentTime,
  isPlaying,
  volume,
  isMuted,
  isShuffle,
  isRepeat,
  onPlayPause,
  onNext,
  onPrev,
  onShuffleToggle,
  onRepeatToggle,
  onProgressChange,
  onMuteToggle,
  onVolumeChange,
  formatTime,
  isNarrow,
}) => {
  return (
    <MusicPlayerBar
      activeTrack={activeTrack}
      currentTime={currentTime}
      isPlaying={isPlaying}
      volume={volume}
      isMuted={isMuted}
      isShuffle={isShuffle}
      isRepeat={isRepeat}
      onPlayPause={onPlayPause}
      onPrev={onPrev}
      onNext={onNext}
      onShuffleToggle={onShuffleToggle}
      onRepeatToggle={onRepeatToggle}
      onProgressChange={onProgressChange}
      onMuteToggle={onMuteToggle}
      onVolumeChange={onVolumeChange}
      formatTime={formatTime}
      isNarrow={isNarrow}
    />
  );
};

export default MusicPlayerSection;
