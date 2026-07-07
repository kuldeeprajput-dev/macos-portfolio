import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
} from "lucide-react";

const MusicPlayerBar = ({
  activeTrack,
  currentTime,
  isPlaying,
  volume,
  isMuted,
  isShuffle,
  isRepeat,
  onPlayPause,
  onPrev,
  onNext,
  onShuffleToggle,
  onRepeatToggle,
  onProgressChange,
  onMuteToggle,
  onVolumeChange,
  formatTime,
  isNarrow,
}) => {
  return (
    <div className="h-20 border-t border-zinc-200 bg-gray-50/80 backdrop-blur px-6 flex items-center justify-between shrink-0 select-none">
      {!isNarrow && (
        <div className="w-1/3 flex items-center gap-3 min-w-0">
          {activeTrack.coverUrl ? (
            <img
              src={activeTrack.coverUrl}
              alt={activeTrack.title}
              className="w-12 h-12 rounded-lg object-cover shadow-md shrink-0 bg-zinc-100 border border-zinc-200"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-tr ${activeTrack.coverColor} flex items-center justify-center text-xl shadow-md shrink-0`}
            >
              {activeTrack.coverText}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-gray-900 truncate flex items-center gap-1.5">
              {activeTrack.title}
              <Heart size={12} className="text-red-500 cursor-pointer fill-red-500" />
            </h4>
            <p className="text-[10px] text-gray-500 truncate">{activeTrack.artist}</p>
          </div>
        </div>
      )}

      <div className={`${isNarrow ? "flex-1 mx-2" : "w-1/3"} flex flex-col items-center gap-1.5`}>
        <div className={`flex items-center ${isNarrow ? "gap-2" : "gap-4"}`}>
          <button
            onClick={onShuffleToggle}
            className={`p-1 transition-colors ${isShuffle ? "text-red-500" : "text-gray-400 hover:text-gray-600"}`}
            title="Shuffle"
          >
            <Shuffle size={14} />
          </button>
          <button
            onClick={onPrev}
            className="p-1 hover:bg-zinc-200 rounded text-gray-600 transition-transform active:scale-95 cursor-pointer"
            title="Previous"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={onPlayPause}
            className="w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all active:scale-95 shadow-md flex items-center justify-center cursor-pointer shrink-0"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} className="pl-0.5" />}
          </button>
          <button
            onClick={onNext}
            className="p-1 hover:bg-zinc-200 rounded text-gray-600 transition-transform active:scale-95 cursor-pointer"
            title="Next"
          >
            <SkipForward size={16} />
          </button>
          <button
            onClick={onRepeatToggle}
            className={`p-1 transition-colors ${isRepeat ? "text-red-500" : "text-gray-400 hover:text-gray-600"}`}
            title="Repeat"
          >
            <Repeat size={14} />
          </button>
        </div>

        <div className="w-full flex items-center gap-2 text-[10px] text-gray-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={activeTrack.duration || 100}
            value={currentTime}
            onChange={onProgressChange}
            className="flex-1 h-1.5 bg-zinc-200 accent-red-500 rounded-lg cursor-pointer outline-none"
          />
          <span>{formatTime(activeTrack.duration || 100)}</span>
        </div>
      </div>

      <div
        className={`${isNarrow ? "w-[32px] shrink-0" : "w-1/3"} flex items-center justify-end gap-2 text-gray-500`}
      >
        <button
          onClick={onMuteToggle}
          className="hover:text-gray-700 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={15} className="text-red-500" /> : <Volume2 size={15} />}
        </button>
        {!isNarrow && (
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={onVolumeChange}
            className="w-20 h-1 bg-zinc-200 accent-red-500 rounded-lg cursor-pointer outline-none"
          />
        )}
      </div>
    </div>
  );
};

export default MusicPlayerBar;
