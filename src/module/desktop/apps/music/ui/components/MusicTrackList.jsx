import { TracksTable } from "../../data/musicData";

const MusicTrackList = ({
  tracks,
  activeTrackId,
  isPlaying,
  onSelectTrack,
  formatTime,
  isLoading,
  isNarrow,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 flex-col gap-3">
        <div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-500">Searching Jamendo catalog...</span>
      </div>
    );
  }

  return (
    <TracksTable
      tracks={tracks}
      activeTrackId={activeTrackId}
      isPlaying={isPlaying}
      onSelectTrack={onSelectTrack}
      formatTime={formatTime}
      isNarrow={isNarrow}
    />
  );
};

export default MusicTrackList;
