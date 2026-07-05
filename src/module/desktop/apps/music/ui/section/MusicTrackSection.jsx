import { Award } from "lucide-react";
import MusicTrackList from "../components/MusicTrackList";

const MusicTrackSection = ({
  tracks,
  activeTrack,
  isPlaying,
  onSelectTrack,
  formatTime,
  isLoading,
  activeCategory,
  isNarrow,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      <div className="p-6 border-b border-zinc-150 bg-gradient-to-br from-red-500/5 to-rose-500/10 shrink-0">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          {activeCategory} <Award size={18} className="text-red-500" />
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Explore high-fidelity tracks, albums, and curated playlists in your library.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <MusicTrackList
          tracks={tracks}
          activeTrackId={activeTrack.id}
          isPlaying={isPlaying}
          onSelectTrack={onSelectTrack}
          formatTime={formatTime}
          isLoading={isLoading}
          isNarrow={isNarrow}
        />
      </div>
    </div>
  );
};

export default MusicTrackSection;
