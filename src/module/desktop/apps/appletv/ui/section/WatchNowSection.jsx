import { Check, Play, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { FEATURED_SHOW, MOVIES } from "../../data";

const FEATURED_CAROUSEL_ITEMS = [
  {
    id: "severance",
    title: "Severance",
    category: "Sci-Fi Thriller • Apple TV+",
    description:
      "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.",
    bgImage: "bg-gradient-to-br from-neutral-900 via-slate-950 to-zinc-900",
    tmdbId: "95396",
    type: "tv",
    season: 1,
    episode: 1,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    id: "ted_lasso",
    title: "Ted Lasso",
    category: "Comedy • Apple TV+",
    description:
      "Small-time American football coach Ted Lasso is hired to coach a professional soccer team in England, despite having no experience coaching soccer.",
    bgImage: "bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900",
    tmdbId: "97546",
    type: "tv",
    season: 1,
    episode: 1,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "foundation",
    title: "Foundation",
    category: "Sci-Fi • Apple TV+",
    description:
      "Based on the award-winning novels by Isaac Asimov, Foundation chronicles a band of exiles on their monumental journey to save humanity and rebuild civilization amid the fall of the Galactic Empire.",
    bgImage: "bg-gradient-to-br from-red-950 via-slate-950 to-zinc-900",
    tmdbId: "91363",
    type: "tv",
    season: 1,
    episode: 1,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
];

const WatchNowSection = ({
  upNext,
  onPlayFeatured,
  onPlayMovie,
  onToggleUpNext,
  watchNowMovies,
  popularShows,
  isCompact,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselBackdrops, setCarouselBackdrops] = useState({});

  useEffect(() => {
    const fetchBackdrops = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      if (!apiKey) return;
      const backdrops = {};
      for (const item of FEATURED_CAROUSEL_ITEMS) {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/${item.type}/${item.tmdbId}?api_key=${apiKey}`,
          );
          const data = await res.json();
          if (data.backdrop_path) {
            backdrops[item.id] = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;
          }
        } catch (err) {
          console.error(`Error fetching backdrop for ${item.title}:`, err);
        }
      }
      setCarouselBackdrops(backdrops);
    };
    fetchBackdrops();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % FEATURED_CAROUSEL_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  // Union of static and dynamic items to compute Up Next rows
  const allAvailableMovies = [
    ...MOVIES,
    ...(watchNowMovies || []),
    ...(popularShows || []),
    ...FEATURED_CAROUSEL_ITEMS,
  ];
  const uniqueMoviesMap = new Map();
  allAvailableMovies.forEach((m) => {
    if (m && m.id) {
      uniqueMoviesMap.set(m.id, m);
    }
  });
  const queuedMovies = Array.from(uniqueMoviesMap.values()).filter((movie) =>
    upNext.includes(movie.id),
  );

  const currentHero = FEATURED_CAROUSEL_ITEMS[activeSlide];
  const activeBackdrop = carouselBackdrops[currentHero.id];

  return (
    <>
      <section
        className="relative rounded-xl overflow-hidden border border-black/5 p-6 md:p-8 flex flex-col justify-end min-h-[260px] shadow-lg transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: activeBackdrop
            ? `linear-gradient(to right, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.2) 80%), url(${activeBackdrop})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!activeBackdrop && <div className={`absolute inset-0 -z-10 ${currentHero.bgImage}`} />}

        {/* Slide Indicators */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 z-20">
          {FEATURED_CAROUSEL_ITEMS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === activeSlide ? "bg-white scale-125 w-3" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <div className="absolute top-4 left-4 bg-black/60 border border-white/10 px-2 py-0.5 rounded text-[10px] tracking-wider font-bold text-white uppercase backdrop-blur-sm z-20">
          Featured
        </div>

        <div className="max-w-md space-y-2 z-10 text-left">
          <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase block">
            {currentHero.category}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-none">
            {currentHero.title}
          </h1>
          <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
            {currentHero.description}
          </p>
          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={() => onPlayFeatured(currentHero)}
              className="flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-neutral-200 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              Play Trailer
            </button>
            <button
              onClick={() => onToggleUpNext(currentHero.id)}
              className="flex items-center gap-1.5 bg-white/15 border border-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
            >
              {upNext.includes(currentHero.id) ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  In Up Next
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Up Next
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-gray-800 px-1">Up Next</h2>
        <div className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
          {queuedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} compactMeta onPlay={() => onPlayMovie(movie)} />
          ))}
          {queuedMovies.length === 0 && (
            <div className="col-span-full py-6 text-center text-xs text-gray-500 italic">
              Your Up Next list is empty. Add shows to watch them later.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-gray-800 px-1">Apple Originals</h2>
        <div className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
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

      {/* Dynamic Infinite Loaded Trending Movies */}
      {watchNowMovies && watchNowMovies.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 px-1">Trending Movies</h2>
          <div className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
            {watchNowMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onPlay={() => onPlayMovie(movie)} />
            ))}
          </div>
        </section>
      )}

      {/* Popular TV Shows Section */}
      {popularShows && popularShows.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 px-1">Popular Shows</h2>
          <div className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
            {popularShows.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onPlay={() => onPlayMovie(movie)} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default WatchNowSection;
