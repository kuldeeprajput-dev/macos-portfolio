import { useState, useEffect } from "react";
import { Play, Plus, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import MovieCard from "../components/MovieCard";

const CAROUSEL_ITEMS = [
  {
    id: "severance",
    title: "Severance",
    category: "Sci-Fi Thriller • Apple TV+",
    description:
      "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.",
    tmdbId: "95396",
    type: "tv",
    season: 1,
    episode: 1,
    bgFallback: "bg-gradient-to-tr from-slate-900 to-zinc-950",
  },
  {
    id: "ted_lasso",
    title: "Ted Lasso",
    category: "Comedy • Apple TV+",
    description:
      "Small-time American football coach Ted Lasso is hired to coach a professional soccer team in England, despite having no experience coaching soccer.",
    tmdbId: "97546",
    type: "tv",
    season: 1,
    episode: 1,
    bgFallback: "bg-gradient-to-tr from-sky-950 to-blue-900",
  },
  {
    id: "foundation",
    title: "Foundation",
    category: "Sci-Fi Fantasy • Apple TV+",
    description:
      "Based on the award-winning novels by Isaac Asimov, Foundation chronicles a band of exiles on their monumental journey to save humanity and rebuild civilization amid the fall of the Galactic Empire.",
    tmdbId: "91363",
    type: "tv",
    season: 1,
    episode: 1,
    bgFallback: "bg-gradient-to-tr from-neutral-900 to-indigo-950",
  },
  {
    id: "silo",
    title: "Silo",
    category: "Sci-Fi Drama • Apple TV+",
    description:
      "In a ruined and toxic future, a community exists in a giant underground silo that plunges hundreds of stories deep. There, people live in a society full of regulations they believe are meant to protect them.",
    tmdbId: "125988",
    type: "tv",
    season: 1,
    episode: 1,
    bgFallback: "bg-gradient-to-tr from-stone-900 to-amber-950",
  },
];

const TVPlusSection = ({ onPlayFeatured, onPlayMovie, upNext = [], onToggleUpNext, isCompact }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselBackdrops, setCarouselBackdrops] = useState({});
  const [popularSeries, setPopularSeries] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [sciFiSeries, setSciFiSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Carousel Backdrops
  useEffect(() => {
    const fetchBackdrops = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      if (!apiKey) return;
      const backdrops = {};
      for (const item of CAROUSEL_ITEMS) {
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

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  // Fetch Apple TV+ content categories
  useEffect(() => {
    const fetchAppleContent = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      if (!apiKey) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // Popular Apple TV Shows (Network 2552)
        const tvRes = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_networks=2552&sort_by=popularity.desc`,
        );
        const tvData = await tvRes.json();

        // Popular Apple TV Movies (Watch Provider 350, US region)
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=350&watch_region=US&sort_by=popularity.desc`,
        );
        const movieData = await movieRes.json();

        if (tvData.results) {
          const formattedTv = tvData.results
            .filter((show) => show.id !== 87096)
            .map((show) => ({
              id: `apple_tv_${show.id}`,
              title: show.name,
              category: `${show.vote_average ? show.vote_average.toFixed(1) : "N/A"} ★ • Apple TV+`,
              duration: "Series",
              tmdbId: show.id.toString(),
              type: "tv",
              season: 1,
              episode: 1,
              genres: show.genre_ids || [],
            }));

          setPopularSeries(formattedTv.slice(0, 8));
          // Filter out Sci-Fi genre (878 or 10765 for Sci-Fi & Fantasy)
          setSciFiSeries(
            formattedTv
              .filter((s) => s.genres.includes(10765) || s.genres.includes(18))
              .slice(0, 8),
          );
        }

        if (movieData.results) {
          const formattedMovies = movieData.results.map((movie) => ({
            id: `apple_movie_${movie.id}`,
            title: movie.title,
            category: `${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} ★ • Feature Film`,
            duration: "Movie",
            tmdbId: movie.id.toString(),
            type: "movie",
          }));
          setPopularMovies(formattedMovies.slice(0, 8));
        }
      } catch (err) {
        console.error("Error fetching Apple TV+ TMDB data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppleContent();
  }, []);

  const currentHero = CAROUSEL_ITEMS[activeSlide];
  const heroBackdrop = carouselBackdrops[currentHero.id];

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
  };

  // Fallback static listings in case API load is empty
  const fallbackSeries = [
    {
      id: "ted_lasso",
      title: "Ted Lasso",
      category: "9.0 ★ • Apple TV+",
      duration: "3 Seasons",
      tmdbId: "97546",
      type: "tv",
      season: 1,
      episode: 1,
    },
    {
      id: "silo",
      title: "Silo",
      category: "8.3 ★ • Apple TV+",
      duration: "2 Seasons",
      tmdbId: "125988",
      type: "tv",
      season: 1,
      episode: 1,
    },
    {
      id: "for_all_mankind",
      title: "For All Mankind",
      category: "8.2 ★ • Apple TV+",
      duration: "4 Seasons",
      tmdbId: "87917",
      type: "tv",
      season: 1,
      episode: 1,
    },
    {
      id: "foundation",
      title: "Foundation",
      category: "8.5 ★ • Apple TV+",
      duration: "2 Seasons",
      tmdbId: "91363",
      type: "tv",
      season: 1,
      episode: 1,
    },
  ];

  const fallbackMovies = [
    {
      id: "ghosted",
      title: "Ghosted",
      category: "6.5 ★ • Movie",
      duration: "Movie",
      tmdbId: "868759",
      type: "movie",
    },
    {
      id: "coda",
      title: "CODA",
      category: "8.1 ★ • Movie",
      duration: "Movie",
      tmdbId: "776503",
      type: "movie",
    },
    {
      id: "tetris",
      title: "Tetris",
      category: "7.7 ★ • Movie",
      duration: "Movie",
      tmdbId: "724495",
      type: "movie",
    },
  ];

  const finalSeries = popularSeries.length > 0 ? popularSeries : fallbackSeries;
  const finalMovies = popularMovies.length > 0 ? popularMovies : fallbackMovies;
  const finalSciFi = sciFiSeries.length > 0 ? sciFiSeries : fallbackSeries.reverse();

  return (
    <div className="space-y-8 pb-10">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-1">
        <span className="bg-black text-white font-extrabold px-3 py-1 rounded-md text-sm tracking-widest uppercase shadow-sm">
          tv+
        </span>
        <div>
          <h2 className="text-lg font-bold text-gray-800 leading-tight">Apple TV+ Originals</h2>
          <p className="text-xs text-gray-400">
            Groundbreaking stories from the world's most creative minds.
          </p>
        </div>
      </div>

      {/* Hero Carousel Section */}
      <section
        className={`relative rounded-2xl overflow-hidden border border-black/5 p-6 md:p-10 flex flex-col justify-end min-h-[300px] md:min-h-[360px] shadow-xl transition-all duration-700 ease-in-out ${
          !heroBackdrop ? currentHero.bgFallback : ""
        }`}
        style={
          heroBackdrop
            ? {
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 35%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%), url(${heroBackdrop})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }
            : undefined
        }
      >
        {/* Slide Indicators */}
        <div className="absolute top-4 right-6 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {CAROUSEL_ITEMS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeSlide ? "bg-white scale-125 w-4" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Hero Metadata & CTA */}
        <div className="max-w-xl space-y-3 z-10 text-left">
          <span className="text-[10px] font-extrabold tracking-widest text-sky-400 uppercase bg-sky-950/40 border border-sky-500/20 px-2 py-0.5 rounded backdrop-blur-sm inline-block">
            {currentHero.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
            {currentHero.title}
          </h1>
          <p className="text-xs md:text-sm text-neutral-200 leading-relaxed line-clamp-3">
            {currentHero.description}
          </p>
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={() => onPlayFeatured(currentHero)}
              className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-200 active:scale-95 transition-all shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" />
              Watch Now
            </button>
            <button
              onClick={() => onToggleUpNext(currentHero.id)}
              className="flex items-center gap-2 bg-white/15 border border-white/10 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-white/25 active:scale-95 transition-all backdrop-blur-md"
            >
              {upNext.includes(currentHero.id) ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  In Up Next
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Up Next
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      )}

      {!isLoading && (
        <>
          {/* Popular Series Row */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 px-1">Popular Series</h3>
            <div
              className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}
            >
              {finalSeries.map((show) => (
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

          {/* Popular Movies Row */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 px-1">Feature Films</h3>
            <div
              className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}
            >
              {finalMovies.map((movie) => (
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

          {/* Drama & Sci-Fi Row */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 px-1">Acclaimed Dramas & Sci-Fi</h3>
            <div
              className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}
            >
              {finalSciFi.map((show) => (
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
        </>
      )}
    </div>
  );
};

export default TVPlusSection;
