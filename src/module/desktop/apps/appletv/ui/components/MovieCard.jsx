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

  return (
    <div className="group cursor-pointer space-y-2" onClick={onPlay}>
      <div
        className={`aspect-[16/10] w-full rounded-lg ${movie.poster || "bg-neutral-800"} flex items-center justify-center relative overflow-hidden shadow-md border border-black/5`}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
        )}
        <button
          onClick={(event) => {
            event.stopPropagation();
            onPlay();
          }}
          className="absolute z-10 p-2.5 bg-black/40 border border-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 active:scale-95"
        >
          <Play className="w-4 h-4 text-white fill-white" />
        </button>
        {showToggle && (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggleUpNext(movie.id);
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/40 border border-white/10 rounded-full hover:bg-black/60 transition-colors z-20"
            title={isInUpNext ? "Remove from Up Next" : "Add to Up Next"}
          >
            {isInUpNext ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Plus className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        )}
      </div>
      <div className="px-1">
        <h4 className="text-xs font-bold truncate text-gray-800 group-hover:text-gray-950">
          {movie.title}
        </h4>
        <span className="text-[10px] text-gray-500 font-semibold">
          {compactMeta ? `${movie.duration} • ${movie.category.split("•")[0]}` : movie.category}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
