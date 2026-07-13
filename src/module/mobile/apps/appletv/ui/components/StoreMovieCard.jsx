import { useState, useEffect } from "react";
import { Play } from "lucide-react";

const StoreMovieCard = ({ movie, onPlayMovie }) => {
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
        }
      } catch (err) {
        console.error("Error fetching TMDB store poster:", err);
      }
    };
    fetchPoster();
  }, [movie.tmdbId, movie.type]);

  const handlePlay = (e) => {
    e.stopPropagation();
    if (movie.tmdbId && onPlayMovie) {
      onPlayMovie(movie);
    }
  };

  return (
    <div
      className="group cursor-pointer space-y-1.5 active:scale-[0.97] transition-transform"
      onClick={handlePlay}
    >
      <div
        className={`aspect-[2/3] w-full rounded-xl bg-gradient-to-b ${
          movie.posterBg || "from-neutral-200 to-gray-300"
        } border border-black/[0.06] flex flex-col items-center justify-center p-3 text-center shadow-md relative overflow-hidden`}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-[10px] font-bold text-white/80 z-10">{movie.title}</span>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 z-10">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-white/90">
              {movie.tmdbId ? "Stream Free" : movie.price}
            </span>
            <div className="p-1 bg-white/20 rounded-full backdrop-blur-sm">
              <Play className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-0.5">
        <h4 className="text-[11px] font-semibold truncate text-gray-900">{movie.title}</h4>
        <span className="text-[9px] text-gray-400 font-medium">
          {movie.tmdbId ? "Free Stream" : movie.price.split(" ")[1]}
        </span>
      </div>
    </div>
  );
};

export default StoreMovieCard;
