import { Check, Play, Plus } from "lucide-react";
import { useState, useEffect } from "react";

const MovieCard = ({
  movie,
  isInUpNext = false,
  onPlay,
  onToggleUpNext,
  showToggle = false,
  compactMeta = false,
}) => {
  const [posterUrl, setPosterUrl] = useState(null);

  useEffect(() => {
    if (!movie.tmdbId) return;
    if (!/^\d+$/.test(movie.tmdbId)) return;
    const fetchPoster = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) return;
        const type = movie.type || "movie";
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${movie.tmdbId}?api_key=${apiKey}`,
        );
        const data = await res.json();
        if (data.poster_path) {
          setPosterUrl(`https://image.tmdb.org/t/p/w500${data.poster_path}`);
        } else if (data.backdrop_path) {
          setPosterUrl(`https://image.tmdb.org/t/p/w500${data.backdrop_path}`);
        }
      } catch (err) {
        console.error("Error fetching TMDB poster:", err);
      }
    };
    fetchPoster();
  }, [movie.tmdbId, movie.type]);

  const displayPoster =
    posterUrl ||
    (typeof movie.poster === "string" && movie.poster.startsWith("http") ? movie.poster : null);

  return (
    <div
      className="group cursor-pointer space-y-1.5 active:scale-[0.97] transition-transform"
      onClick={onPlay}
    >
      <div
        className={`aspect-[2/3] w-full rounded-xl ${
          !displayPoster ? movie.poster || "bg-neutral-200" : ""
        } flex items-center justify-center relative overflow-hidden shadow-md border border-black/[0.06]`}
      >
        {displayPoster ? (
          <img
            src={displayPoster}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-[10px] font-bold text-center px-2">
              {movie.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 active:bg-black/20 transition-colors flex items-center justify-center">
          <div className="p-2 bg-black/50 border border-white/20 rounded-full opacity-0 group-active:opacity-100 transition-opacity backdrop-blur-sm">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
        {showToggle && (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggleUpNext(movie.id);
            }}
            className="absolute top-1.5 right-1.5 p-1.5 bg-black/50 border border-white/10 rounded-full backdrop-blur-sm z-20"
            title={isInUpNext ? "Remove from Up Next" : "Add to Up Next"}
          >
            {isInUpNext ? (
              <Check className="w-3 h-3 text-green-400" />
            ) : (
              <Plus className="w-3 h-3 text-white" />
            )}
          </button>
        )}
      </div>
      <div className="px-0.5">
        <h4 className="text-[11px] font-semibold truncate text-gray-900 leading-tight">
          {movie.title}
        </h4>
        <span className="text-[9px] text-gray-400 font-medium">
          {compactMeta ? `${movie.duration} • ${movie.category.split("•")[0]}` : movie.category}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
