import { Check, Play, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { FEATURED_SHOW, MOVIES } from "../../data";

const WatchNowSection = ({
  upNext,
  onPlayFeatured,
  onPlayMovie,
  onToggleUpNext,
  watchNowMovies = [],
}) => {
  const queuedMovies = MOVIES.filter((movie) => upNext.includes(movie.id));
  const [backdropUrl, setBackdropUrl] = useState(null);

  useEffect(() => {
    if (!FEATURED_SHOW.tmdbId) return;
    const fetchBackdrop = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) return;
        const type = FEATURED_SHOW.type || "tv";
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${FEATURED_SHOW.tmdbId}?api_key=${apiKey}`,
        );
        const data = await res.json();
        if (data.backdrop_path) {
          setBackdropUrl(`https://image.tmdb.org/t/p/original${data.backdrop_path}`);
        }
      } catch (err) {
        console.error("Error fetching featured backdrop:", err);
      }
    };
    fetchBackdrop();
  }, []);

  return (
    <>
      {/* Featured Hero Card */}
      <section
        className={`relative rounded-2xl overflow-hidden border border-white/[0.06] flex flex-col justify-end min-h-[220px] shadow-xl ${
          !backdropUrl ? FEATURED_SHOW.bgImage : ""
        }`}
        style={
          backdropUrl
            ? {
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%), url(${backdropUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }
            : undefined
        }
      >
        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[8px] tracking-wider font-extrabold text-white uppercase">
          Featured
        </div>
        <div className="p-4 space-y-2 z-10">
          <span className="text-[9px] font-bold tracking-widest text-blue-400 uppercase">
            {FEATURED_SHOW.category}
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-white leading-none">
            {FEATURED_SHOW.title}
          </h1>
          <p className="text-[11px] text-neutral-300 leading-relaxed line-clamp-2">
            {FEATURED_SHOW.description}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onPlayFeatured()}
              className="flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-xl text-[11px] font-bold active:scale-95 transition-all shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              Play
            </button>
            <button
              onClick={() => onToggleUpNext("ted_lasso")}
              className="flex items-center gap-1.5 bg-white/15 border border-white/10 text-white px-3.5 py-2 rounded-xl text-[11px] font-bold active:scale-95 transition-all backdrop-blur-sm"
            >
              {upNext.includes("ted_lasso") ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  My List
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Up Next */}
      <section className="space-y-2.5">
        <h2 className="text-[15px] font-bold text-white px-0.5">Up Next</h2>
        {queuedMovies.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {queuedMovies.map((movie) => (
              <div key={movie.id} className="w-[110px] flex-shrink-0">
                <MovieCard movie={movie} compactMeta onPlay={() => onPlayMovie(movie)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-[11px] text-white/30 italic">
            Your Up Next list is empty. Add shows to watch them later.
          </div>
        )}
      </section>

      {/* Apple Originals */}
      <section className="space-y-2.5">
        <h2 className="text-[15px] font-bold text-white px-0.5">Apple Originals</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {MOVIES.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              showToggle
              isInUpNext={upNext.includes(movie.id)}
              onPlay={() => onPlayMovie(movie)}
              onToggleUpNext={onToggleUpNext}
            />
          ))}
        </div>
      </section>

      {/* Trending Movies (infinite loaded) */}
      {watchNowMovies && watchNowMovies.length > 0 && (
        <section className="space-y-2.5">
          <h2 className="text-[15px] font-bold text-white px-0.5">Trending Now</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {watchNowMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onPlay={() => onPlayMovie(movie)} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default WatchNowSection;
