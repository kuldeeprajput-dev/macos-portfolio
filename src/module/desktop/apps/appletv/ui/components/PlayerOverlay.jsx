import {
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const formatTime = (timeInSecs) => {
  if (Number.isNaN(timeInSecs)) return "00:00";
  const minutes = Math.floor(timeInSecs / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(timeInSecs % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const PlayerOverlay = ({
  activeVideo,
  videoRef,
  isPlaying,
  isMuted,
  progress,
  duration,
  currentTime,
  showControls,
  onClose,
  onMouseMove,
  onTogglePlay,
  onToggleMute,
  onSeek,
  onSkip,
  onPlay,
  onPause,
  onTimeUpdate,
  onLoadedMetadata,
  onChangeEpisode, // Added callback to change episode/season
}) => {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  useEffect(() => {
    if (!activeVideo) {
      setTrailerUrl("");
      return;
    }

    const fallbackUrl = "https://www.youtube.com/embed/xEQP4VVuyrY?autoplay=1&rel=0";

    if (!activeVideo.tmdbId) {
      setTrailerUrl(fallbackUrl);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
      setTrailerUrl(fallbackUrl);
      return;
    }
    const type = activeVideo.type || "movie";
    setLoadingTrailer(true);

    fetch(`https://api.themoviedb.org/3/${type}/${activeVideo.tmdbId}/videos?api_key=${apiKey}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("TMDB Response not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.results && data.results.length > 0) {
          const youtubeVideos = data.results.filter(
            (v) => v.site?.toLowerCase() === "youtube" && v.key,
          );
          const trailer =
            youtubeVideos.find((v) => v.type?.toLowerCase() === "trailer") ||
            youtubeVideos.find((v) => v.type?.toLowerCase() === "teaser") ||
            youtubeVideos[0];
          if (trailer) {
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`);
          } else {
            setTrailerUrl(fallbackUrl);
          }
        } else {
          setTrailerUrl(fallbackUrl);
        }
      })
      .catch((err) => {
        console.error("Error fetching trailer:", err);
        setTrailerUrl(fallbackUrl);
      })
      .finally(() => {
        setLoadingTrailer(false);
      });
  }, [activeVideo]);

  if (!activeVideo) return null;

  return (
    <div
      className="absolute inset-0 bg-black z-50 flex flex-col justify-between"
      onMouseMove={onMouseMove}
    >
      {loadingTrailer ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white space-y-3">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-wider uppercase text-neutral-400">
            Loading Trailer...
          </span>
        </div>
      ) : trailerUrl ? (
        <iframe
          src={trailerUrl}
          className="w-full h-full border-none"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          title={`${activeVideo.title} Trailer`}
        />
      ) : (
        <video
          ref={videoRef}
          src={activeVideo.url || null}
          autoPlay
          onPlay={onPlay}
          onPause={onPause}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          className="w-full h-full object-contain"
          onClick={onTogglePlay}
        />
      )}

      {/* Control overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity duration-300 pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-between pointer-events-auto">
          <div>
            <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">
              {trailerUrl ? "Official Trailer" : "Local Playback"}
            </span>
            <h2 className="text-lg font-bold text-white leading-tight">{activeVideo.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-neutral-800/80 hover:bg-neutral-700/80 rounded-full border border-white/10 active:scale-95 transition-all"
            title="Close Player"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Controls only for normal video files */}
        {!trailerUrl && (
          <div className="w-full space-y-4 pointer-events-auto">
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400 font-medium tabular-nums">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(event) => onSeek(Number(event.target.value))}
                className="flex-1 h-1.5 rounded-full bg-neutral-700 appearance-none cursor-pointer accent-white"
              />
              <span className="text-xs text-neutral-400 font-medium tabular-nums">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => onSkip(-15)}
                  className="text-neutral-300 hover:text-white"
                  title="Skip Back 15s"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button onClick={onTogglePlay} className="text-neutral-300 hover:text-white">
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-neutral-300" />
                  ) : (
                    <Play className="w-5 h-5 fill-neutral-300" />
                  )}
                </button>
                <button
                  onClick={() => onSkip(15)}
                  className="text-neutral-300 hover:text-white"
                  title="Skip Forward 15s"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={onToggleMute} className="text-neutral-300 hover:text-white">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    if (videoRef.current?.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    }
                  }}
                  className="text-neutral-300 hover:text-white"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerOverlay;
