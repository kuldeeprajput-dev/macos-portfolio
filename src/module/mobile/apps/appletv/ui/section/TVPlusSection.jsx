import { useState, useEffect } from "react";
import { Play, Plus, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import MovieCard from "../components/MovieCard";

const CAROUSEL_ITEMS = [
  {
    id: "severance",
    title: "Severance",
    category: "Sci-Fi Thriller • Apple TV+",
    description:
      "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
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
      "Small-time American football coach Ted Lasso is hired to coach a professional soccer team in England.",
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
      "Based on Isaac Asimov's novels, Foundation chronicles a band of exiles saving humanity amid the fall of the Galactic Empire.",
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
      "In a ruined and toxic future, a community exists in a giant underground silo hundreds of stories deep.",
    tmdbId: "125988",
    type: "tv",
    season: 1,
    episode: 1,
    bgFallback: "bg-gradient-to-tr from-stone-900 to-amber-950",
  },
];

const TVPlusSection = ({ onPlayFeatured, onPlayMovie, upNext = [], onToggleUpNext }) => {
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

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Apple TV+ content
  useEffect(() => {
    const fetchAppleContent = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      if (!apiKey) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const tvRes = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_networks=2552&sort_by=popularity.desc`,
        );
        const tvData = await tvRes.json();

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
          setPopularSeries(formattedTv.slice(0, 9));
          setSciFiSeries(
            formattedTv
              .filter((s) => s.genres.includes(10765) || s.genres.includes(18))
              .slice(0, 9),
          );
        }

        if (movieData.results) {
          const formattedMovies = movieData.results.map((movie) => ({
            id: `apple_movie_${movie.id}`,
            title: movie.title,
            category: `${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} ★ • Film`,
            duration: "Movie",
            tmdbId: movie.id.toString(),
            type: "movie",
          }));
          setPopularMovies(formattedMovies.slice(0, 9));
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
  ];

  const finalSeries = popularSeries.length > 0 ? popularSeries : fallbackSeries;
  const finalMovies = popularMovies.length > 0 ? popularMovies : [];
  const finalSciFi = sciFiSeries.length > 0 ? sciFiSeries : [];

  return (
    <div className="space-y-6 pb-6">
      {/* Brand Header */}
      <div className="flex items-center gap-3">
        <span className="bg-white text-black font-extrabold px-2.5 py-1 rounded-lg text-[11px] tracking-wider uppercase shadow-sm">
          tv+
        </span>
        <div>
          <h2 className="text-[15px] font-bold text-white leading-tight">Apple TV+ Originals</h2>
          <p className="text-[10px] text-white/40">Groundbreaking stories from creative minds.</p>
        </div>
      </div>

      {/* Hero Carousel */}
      <section
        className={`relative rounded-2xl overflow-hidden border border-white/[0.06] flex flex-col justify-end min-h-[200px] shadow-xl transition-all duration-700 ${
          !heroBackdrop ? currentHero.bgFallback : ""
        }`}
        style={
          heroBackdrop
            ? {
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%), url(${heroBackdrop})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }
            : undefined
        }
      >
        {/* Slide dots */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 z-10">
          {CAROUSEL_ITEMS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeSlide ? "bg-white w-3" : "bg-white/30 w-1.5"
              }`}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="p-4 space-y-2 z-10">
          <span className="text-[8px] font-extrabold tracking-widest text-sky-400 uppercase bg-sky-950/50 border border-sky-500/20 px-1.5 py-0.5 rounded backdrop-blur-sm inline-block">
            {currentHero.category}
          </span>
          <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
            {currentHero.title}
          </h1>
          <p className="text-[10px] text-neutral-300 leading-relaxed line-clamp-2">
            {currentHero.description}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onPlayFeatured(currentHero)}
              className="flex items-center gap-1 bg-white text-black px-3.5 py-1.5 rounded-xl text-[10px] font-bold active:scale-95 transition-all shadow-lg"
            >
              <Play className="w-3 h-3 fill-black" />
              Watch Now
            </button>
            <button
              onClick={() => onToggleUpNext(currentHero.id)}
              className="flex items-center gap-1 bg-white/15 border border-white/10 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold active:scale-95 transition-all backdrop-blur-sm"
            >
              {upNext.includes(currentHero.id) ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  My List
                </>
              )}
            </button>
          </div>
        </div>

        {/* Touch swipe areas */}
        <button
          onClick={() =>
            setActiveSlide((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length)
          }
          className="absolute left-0 top-0 bottom-0 w-12 z-10"
          aria-label="Previous slide"
        />
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length)}
          className="absolute right-0 top-0 bottom-0 w-12 z-10"
          aria-label="Next slide"
        />
      </section>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-white/30" />
        </div>
      )}

      {!isLoading && (
        <>
          {/* Popular Series */}
          <section className="space-y-2.5">
            <h3 className="text-[15px] font-bold text-white px-0.5">Popular Series</h3>
            <div className="grid grid-cols-3 gap-2.5">
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

          {/* Feature Films */}
          {finalMovies.length > 0 && (
            <section className="space-y-2.5">
              <h3 className="text-[15px] font-bold text-white px-0.5">Feature Films</h3>
              <div className="grid grid-cols-3 gap-2.5">
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
          )}

          {/* Acclaimed Drama & Sci-Fi */}
          {finalSciFi.length > 0 && (
            <section className="space-y-2.5">
              <h3 className="text-[15px] font-bold text-white px-0.5">Acclaimed Drama & Sci-Fi</h3>
              <div className="grid grid-cols-3 gap-2.5">
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
          )}
        </>
      )}
    </div>
  );
};

export default TVPlusSection;
