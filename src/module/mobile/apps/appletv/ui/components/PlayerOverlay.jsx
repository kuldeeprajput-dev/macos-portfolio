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
import { useState } from "react";

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
  const [_selectedSeason, setSelectedSeason] = useState(activeVideo?.season || 1);
  const [_selectedEpisode, setSelectedEpisode] = useState(activeVideo?.episode || 1);
  const [showEpisodePicker, setShowEpisodePicker] = useState(false);
  const [selectedServer, setSelectedServer] = useState("vidsrc_to");

  if (!activeVideo) return null;

  const isStreaming = !!activeVideo.tmdbId && /^\d+$/.test(activeVideo.tmdbId);
  const isTvShow = isStreaming && activeVideo.type === "tv";

  const SERVERS = [
    { id: "vidsrc_to", name: "Vidsrc.to" },
    { id: "vidlink", name: "VidLink" },
  ];

  const getEmbedUrl = () => {
    if (!activeVideo.tmdbId) return "";
    const season = activeVideo.season || 1;
    const episode = activeVideo.episode || 1;

    switch (selectedServer) {
      case "vidlink": {
        const apiBaseUrl = process.env.NEXT_PUBLIC_VIDLINK_API_URL || "https://vidlink.pro";
        return isTvShow
          ? `${apiBaseUrl}/tv/${activeVideo.tmdbId}/${season}/${episode}?autoplay=true&nextbutton=true`
          : `${apiBaseUrl}/movie/${activeVideo.tmdbId}?autoplay=true`;
      }
      case "vidsrc_to":
      default:
        return isTvShow
          ? `https://vidsrc.to/embed/tv/${activeVideo.tmdbId}/${season}/${episode}`
          : `https://vidsrc.to/embed/movie/${activeVideo.tmdbId}`;
    }
  };

  const embedUrl = getEmbedUrl();
  const activeServerName = SERVERS.find((s) => s.id === selectedServer)?.name || "VidLink";

  const handleSeasonChange = (e) => {
    const s = parseInt(e.target.value, 10);
    setSelectedSeason(s);
    setSelectedEpisode(1);
    if (onChangeEpisode) onChangeEpisode(s, 1);
  };

  const handleEpisodeChange = (e) => {
    const ep = parseInt(e.target.value, 10);
    setSelectedEpisode(ep);
    if (onChangeEpisode) onChangeEpisode(activeVideo.season || 1, ep);
  };

  const handlePrevEpisode = () => {
    const currentEp = activeVideo.episode || 1;
    if (currentEp > 1) {
      const nextEp = currentEp - 1;
      setSelectedEpisode(nextEp);
      if (onChangeEpisode) onChangeEpisode(activeVideo.season || 1, nextEp);
    }
  };

  const handleNextEpisode = () => {
    const currentEp = activeVideo.episode || 1;
    const nextEp = currentEp + 1;
    setSelectedEpisode(nextEp);
    if (onChangeEpisode) onChangeEpisode(activeVideo.season || 1, nextEp);
  };

  return (
    <div
      className="fixed inset-0 bg-black z-[100] flex flex-col"
      onTouchStart={onMouseMove}
      onMouseMove={onMouseMove}
    >
      {isStreaming ? (
        <iframe
          src={embedUrl}
          className="w-full h-full border-none"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          title={activeVideo.title}
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
              {isStreaming ? `Streaming via ${activeServerName}` : "Playing"}
            </p>
            <h2 className="text-sm font-bold text-white leading-tight truncate">
              {activeVideo.title}
              {isTvShow && ` • S${activeVideo.season || 1} E${activeVideo.episode || 1}`}
            </h2>
          </div>
          {isStreaming && (
            <button
              onClick={() => setShowEpisodePicker(!showEpisodePicker)}
              className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-lg text-[10px] font-bold text-white backdrop-blur-sm active:scale-95 transition-transform"
            >
              Settings
            </button>
          )}
          {!isStreaming && <div className="w-8" />}
        </div>
      </div>

      {/* Stream Settings/Episode Picker for Mobile */}
      {isStreaming && showEpisodePicker && (
        <div className="absolute top-24 right-3 left-3 bg-neutral-900/95 border border-white/10 rounded-2xl p-4 backdrop-blur-xl z-20 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-neutral-400">
              Stream Settings
            </span>
            <button onClick={() => setShowEpisodePicker(false)} className="p-1">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          <div>
            <label className="text-[9px] text-neutral-500 font-bold uppercase mb-1 block">
              Server
            </label>
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {SERVERS.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.name}
                </option>
              ))}
            </select>
          </div>

          {isTvShow && (
            <div className="border-t border-white/5 pt-3 space-y-3">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-neutral-400 block">
                Episode Selector
              </span>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[9px] text-neutral-500 font-bold uppercase mb-1 block">
                    Season
                  </label>
                  <select
                    value={activeVideo.season || 1}
                    onChange={handleSeasonChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <option key={s} value={s}>
                        Season {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[9px] text-neutral-500 font-bold uppercase mb-1 block">
                    Episode
                  </label>
                  <select
                    value={activeVideo.episode || 1}
                    onChange={handleEpisodeChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((ep) => (
                      <option key={ep} value={ep}>
                        Episode {ep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevEpisode}
                  disabled={(activeVideo.episode || 1) <= 1}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs text-white font-semibold disabled:opacity-30 active:scale-95 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  onClick={handleNextEpisode}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs text-white font-semibold active:scale-95 transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Center play/pause button */}
      {!isStreaming && (
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
      {!isStreaming && (
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
