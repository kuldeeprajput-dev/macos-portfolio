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
  onChangeEpisode, // Added callback to change episode/season
}) => {
  const [_selectedSeason, setSelectedSeason] = useState(activeVideo?.season || 1);
  const [_selectedEpisode, setSelectedEpisode] = useState(activeVideo?.episode || 1);
  const [selectedServer, setSelectedServer] = useState("vidlink");

  if (!activeVideo) return null;

  const isStreaming = !!activeVideo.tmdbId && /^\d+$/.test(activeVideo.tmdbId);
  const isTvShow = isStreaming && activeVideo.type === "tv";

  const SERVERS = [
    { id: "vidlink", name: "VidLink" },
    { id: "vidsrc_to", name: "Vidsrc.to" },
  ];

  const getEmbedUrl = () => {
    if (!activeVideo.tmdbId) return "";
    const season = activeVideo.season || 1;
    const episode = activeVideo.episode || 1;

    switch (selectedServer) {
      case "vidsrc_to":
        return isTvShow
          ? `https://vidsrc.to/embed/tv/${activeVideo.tmdbId}/${season}/${episode}`
          : `https://vidsrc.to/embed/movie/${activeVideo.tmdbId}`;
      case "vidlink":
      default: {
        const apiBaseUrl = process.env.NEXT_PUBLIC_VIDLINK_API_URL || "https://vidlink.pro";
        return isTvShow
          ? `${apiBaseUrl}/tv/${activeVideo.tmdbId}/${season}/${episode}?autoplay=true&nextbutton=true`
          : `${apiBaseUrl}/movie/${activeVideo.tmdbId}?autoplay=true`;
      }
    }
  };

  const embedUrl = getEmbedUrl();
  const activeServerName = SERVERS.find((s) => s.id === selectedServer)?.name || "VidLink";

  const handleSeasonChange = (e) => {
    const s = parseInt(e.target.value, 10);
    setSelectedSeason(s);
    setSelectedEpisode(1);
    if (onChangeEpisode) {
      onChangeEpisode(s, 1);
    }
  };

  const handleEpisodeChange = (e) => {
    const ep = parseInt(e.target.value, 10);
    setSelectedEpisode(ep);
    if (onChangeEpisode) {
      onChangeEpisode(activeVideo.season || 1, ep);
    }
  };

  const handlePrevEpisode = () => {
    const currentEp = activeVideo.episode || 1;
    if (currentEp > 1) {
      const nextEp = currentEp - 1;
      setSelectedEpisode(nextEp);
      if (onChangeEpisode) {
        onChangeEpisode(activeVideo.season || 1, nextEp);
      }
    }
  };

  const handleNextEpisode = () => {
    const currentEp = activeVideo.episode || 1;
    const nextEp = currentEp + 1;
    setSelectedEpisode(nextEp);
    if (onChangeEpisode) {
      onChangeEpisode(activeVideo.season || 1, nextEp);
    }
  };

  return (
    <div
      className="absolute inset-0 bg-black z-50 flex flex-col justify-between"
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
              {isStreaming ? `Streaming via ${activeServerName}` : "Local Playback"}
            </span>
            <h2 className="text-lg font-bold text-white leading-tight">
              {activeVideo.title}{" "}
              {isTvShow && `• S${activeVideo.season || 1} E${activeVideo.episode || 1}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-neutral-800/80 hover:bg-neutral-700/80 rounded-full border border-white/10 active:scale-95 transition-all"
            title="Close Player"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Streaming Settings Floating Panel */}
        {isStreaming && (
          <div className="absolute top-20 right-6 bg-black/60 border border-white/10 rounded-lg p-3 backdrop-blur-md space-y-3 pointer-events-auto w-52 text-white shadow-xl">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold tracking-wide uppercase text-neutral-400">
                Stream Settings
              </span>
              <div className="flex items-center justify-between text-xs mt-1">
                <span>Server:</span>
                <select
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-white focus:outline-none max-w-[120px] truncate"
                >
                  {SERVERS.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isTvShow && (
              <div className="border-t border-white/5 pt-2 flex flex-col gap-2">
                <span className="text-[10px] font-extrabold tracking-wide uppercase text-neutral-400">
                  Episode Selector
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span>Season:</span>
                  <select
                    value={activeVideo.season || 1}
                    onChange={handleSeasonChange}
                    className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-white focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <option key={s} value={s}>
                        Season {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Episode:</span>
                  <select
                    value={activeVideo.episode || 1}
                    onChange={handleEpisodeChange}
                    className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-white focus:outline-none"
                  >
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((ep) => (
                      <option key={ep} value={ep}>
                        Episode {ep}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between gap-1 pt-1">
                  <button
                    onClick={handlePrevEpisode}
                    disabled={(activeVideo.episode || 1) <= 1}
                    className="flex-1 flex items-center justify-center p-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs disabled:opacity-40 cursor-pointer"
                    title="Previous Episode"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextEpisode}
                    className="flex-1 flex items-center justify-center p-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs cursor-pointer"
                    title="Next Episode"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controls only for normal video files */}
        {!isStreaming && (
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
