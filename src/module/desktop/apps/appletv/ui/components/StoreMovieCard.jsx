import { useState, useEffect } from "react";

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
    } else {
      alert(`Purchasing ${movie.title} is simulated!`);
    }
  };

  return (
    <div className="group cursor-pointer space-y-2" onClick={handlePlay}>
      <div
        className={`aspect-[2/3] w-full rounded-lg bg-gradient-to-b ${movie.posterBg || "from-neutral-800 to-zinc-900"} border border-black/5 flex flex-col items-center justify-center p-4 text-center shadow-lg relative overflow-hidden`}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <span className="text-xs font-extrabold tracking-tight text-white group-hover:scale-105 transition-transform z-10">
            {movie.title}
          </span>
        )}
        <button
          onClick={handlePlay}
          className="absolute bottom-4 left-4 right-4 bg-white text-black py-1.5 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          {movie.tmdbId ? "Stream Free" : movie.price}
        </button>
      </div>
      <div className="px-1 text-center sm:text-left">
        <h4 className="text-xs font-bold truncate text-gray-800 group-hover:text-gray-950">
          {movie.title}
        </h4>
        <span className="text-[10px] text-gray-500 font-semibold">
          {movie.tmdbId ? "Free Stream" : movie.price.split(" ")[1]}
        </span>
      </div>
    </div>
  );
};

export default StoreMovieCard;
