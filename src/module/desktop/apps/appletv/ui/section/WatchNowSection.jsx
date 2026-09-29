import { Check, ChevronLeft, ChevronRight, Play, Plus } from "lucide-react";
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
    id: "mythic_quest",
    title: "Mythic Quest",
    category: "Comedy • Apple TV+",
    description:
      "The team behind a hit multiplayer game faces creative clashes, office politics, and the chaos of building new worlds.",
    bgImage: "bg-gradient-to-br from-violet-950 via-slate-950 to-indigo-900",
    tmdbId: "94951",
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
  relatedShows,
  isCompact,
}) => {
  const [activeSlide, setActiveSlide] = useState(1);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [carouselBackdrops, setCarouselBackdrops] = useState({});

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) return;
    const controller = new AbortController();
    Promise.allSettled(
      FEATURED_CAROUSEL_ITEMS.map(async (item) => {
        const response = await fetch(
          `https://api.themoviedb.org/3/${item.type}/${item.tmdbId}?api_key=${apiKey}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);
        const data = await response.json();
        return data.backdrop_path
          ? [item.id, `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`]
          : null;
      }),
    ).then((results) => {
      if (controller.signal.aborted) return;
      setCarouselBackdrops(
        Object.fromEntries(
          results
            .filter((result) => result.status === "fulfilled" && result.value)
            .map((result) => result.value),
        ),
      );
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % FEATURED_CAROUSEL_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHeroPaused]);

  const currentHero = FEATURED_CAROUSEL_ITEMS[activeSlide];
  const activeBackdrop = carouselBackdrops[currentHero.id];

  return (
    <>
      <section
        className="relative isolate rounded-2xl overflow-hidden border border-black/10 bg-neutral-950 p-6 md:p-9 flex flex-col justify-end min-h-[320px] shadow-xl"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        onFocusCapture={() => setIsHeroPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsHeroPaused(false);
        }}
        style={{
          backgroundImage: activeBackdrop
            ? `linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.68) 46%, rgba(0,0,0,0.14) 100%), url(${activeBackdrop})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
        }}
      >
        {!activeBackdrop && <div className={`absolute inset-0 z-0 ${currentHero.bgImage}`} />}

        {/* Slide Indicators */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-1.5 py-1 backdrop-blur-sm">
          <button
            type="button"
            onClick={() =>
              setActiveSlide(
                (slide) =>
                  (slide - 1 + FEATURED_CAROUSEL_ITEMS.length) % FEATURED_CAROUSEL_ITEMS.length,
              )
            }
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
            aria-label="Previous featured show"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {FEATURED_CAROUSEL_ITEMS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={"Show featured title " + (idx + 1)}
              aria-pressed={idx === activeSlide}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === activeSlide ? "bg-white scale-125 w-3" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
          <button
            type="button"
            onClick={() => setActiveSlide((slide) => (slide + 1) % FEATURED_CAROUSEL_ITEMS.length)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
            aria-label="Next featured show"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute top-4 left-4 bg-black/60 border border-white/10 px-2 py-0.5 rounded text-[10px] tracking-wider font-bold text-white uppercase backdrop-blur-sm z-20">
          Featured
        </div>

        <div className="relative z-10 max-w-[460px] space-y-3 text-left">
          <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase block">
            {currentHero.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {currentHero.title}
          </h1>
          <p className="text-sm text-neutral-200 leading-relaxed line-clamp-3">
            {currentHero.description}
          </p>
          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={() => onPlayFeatured(currentHero)}
              className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-200 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              Play Trailer
            </button>
            <button
              onClick={() => onToggleUpNext(currentHero.id)}
              className="flex items-center gap-2 bg-white/15 border border-white/15 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
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
        <h2 className="text-sm font-bold text-gray-800 px-1">Apple Originals</h2>
        <div className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
          {MOVIES.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              preferBackdrop
              showToggle
              isInUpNext={upNext.includes(movie.id)}
              onPlay={() => onPlayMovie(movie)}
              onToggleUpNext={onToggleUpNext}
            />
          ))}
        </div>
      </section>

      {relatedShows?.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-800 px-1">More Like {FEATURED_SHOW.title}</h2>
          <div className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
            {relatedShows.map((show) => (
              <MovieCard
                key={show.id}
                movie={show}
                showToggle
                isInUpNext={upNext.includes(show.id)}
                onPlay={() => onPlayMovie(show)}
                onToggleUpNext={onToggleUpNext}
              />
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

      {/* Keep the paginated shelf last so newly loaded pages appear at the scroll position. */}
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
    </>
  );
};

export default WatchNowSection;
