import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
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
  onChangeEpisode,
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
      className="fixed inset-0 bg-black z-[100] flex flex-col"
      onTouchStart={onMouseMove}
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
          playsInline
          onPlay={onPlay}
          onPause={onPause}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          className="w-full h-full object-contain"
          onClick={onTogglePlay}
        />
      )}

      {/* Top controls bar */}
      <div
        className={`absolute top-0 left-0 right-0 pt-12 px-4 pb-3 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 z-10 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 -ml-1 rounded-full active:scale-90 transition-transform"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1 text-center px-4">
            <p className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">
              {trailerUrl ? "Official Trailer" : "Playing"}
            </p>
            <h2 className="text-sm font-bold text-white leading-tight truncate">
              {activeVideo.title}
            </h2>
          </div>
          <div className="w-8" />
        </div>
      </div>

      {/* Center play/pause button */}
      {!trailerUrl && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-[5] ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={onTogglePlay}
            className="p-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-full active:scale-90 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white fill-white" />
            ) : (
              <Play className="w-8 h-8 text-white fill-white ml-0.5" />
            )}
          </button>
        </div>
      )}

      {/* Bottom controls for local video playback */}
      {!trailerUrl && (
        <div
          className={`absolute bottom-0 left-0 right-0 pb-8 px-4 pt-12 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 z-10 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-neutral-400 font-medium tabular-nums min-w-[32px]">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative h-[3px] bg-white/20 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-white rounded-full"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium tabular-nums min-w-[32px] text-right">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => onSkip(-15)}
                className="text-white/70 active:text-white active:scale-90 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={onTogglePlay}
                className="text-white active:scale-90 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white" />
                )}
              </button>
              <button
                onClick={() => onSkip(15)}
                className="text-white/70 active:text-white active:scale-90 transition-all"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onToggleMute} className="text-white/70 active:text-white">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  if (videoRef.current?.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                  }
                }}
                className="text-white/70 active:text-white"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerOverlay;
