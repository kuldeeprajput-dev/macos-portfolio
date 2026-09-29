import { useState, useEffect, useRef } from "react";
import SidebarNavigation from "../components/SidebarNavigation";
import FavoritesSection from "./FavoritesSection";
import LibrarySection from "./LibrarySection";
import StoreSection from "./StoreSection";
import WatchNowSection from "./WatchNowSection";
import MovieCard from "../components/MovieCard";
import StoreMovieCard from "../components/StoreMovieCard";
import { MOVIES, STORE_MOVIES, FEATURED_SHOW } from "../../data";
import { Loader2, Play } from "lucide-react";

const AppleTVSection = ({
  activeTab,
  searchQuery,
  upNext,
  isSidebarOpen,
  onSearch,
  onSelectTab,
  onCloseSidebar,
  onOpenStore,
  onPlayFeatured,
  onPlayMovie,
  onToggleUpNext,
  isCompact = false,
  githubProfile,
  onProfileClick,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchRequestLock = useRef(false);
  const searchAbortController = useRef(null);
  const trendingRequestLock = useRef(false);
  const mainRef = useRef(null);
  const loadMoreRef = useRef(null);

  const [watchNowMovies, setWatchNowMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [relatedShows, setRelatedShows] = useState([]);
  const [watchNowPage, setWatchNowPage] = useState(1);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [hasMoreTrending, setHasMoreTrending] = useState(true);

  // Fetch the featured show's recommendations and popular shows once.
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) return;
    const controller = new AbortController();
    const fetchPageOne = async (path) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/${path}?api_key=${apiKey}&page=1`,
        {
          signal: controller.signal,
        },
      );
      if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);
      return response.json();
    };
    const formatShows = (items, prefix) =>
      items.map((item) => ({
        id: `${prefix}_${item.id}`,
        title: item.name,
        category: `${Number(item.vote_average || 0).toFixed(1)} ★ • TV Show`,
        duration: "TV Show",
        tmdbId: String(item.id),
        type: "tv",
        posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      }));

    Promise.allSettled([
      fetchPageOne("tv/popular"),
      fetchPageOne(`tv/${FEATURED_SHOW.tmdbId}/recommendations`),
    ]).then(([popularResult, relatedResult]) => {
      if (controller.signal.aborted) return;
      const popular = popularResult.status === "fulfilled" ? popularResult.value.results || [] : [];
      const related = relatedResult.status === "fulfilled" ? relatedResult.value.results || [] : [];
      setPopularShows(
        formatShows(
          popular.filter((item) => item.id !== 87096),
          "show",
        ),
      );

      const alreadyShown = new Set([
        FEATURED_SHOW.tmdbId,
        ...MOVIES.map((movie) => movie.tmdbId),
        ...popular.map((item) => String(item.id)),
      ]);
      setRelatedShows(
        formatShows(
          related.filter((item) => !alreadyShown.has(String(item.id))),
          "related",
        ),
      );
    });

    return () => controller.abort();
  }, []);

  // Trending movies load one page at a time without reloading the show shelves.
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
      setHasMoreTrending(false);
      return;
    }
    const controller = new AbortController();
    trendingRequestLock.current = true;
    setIsTrendingLoading(true);

    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${watchNowPage}`,
      {
        signal: controller.signal,
      },
    )
      .then((response) => {
        if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        const formatted = (data.results || []).map((item) => ({
          id: `trending_${item.id}`,
          title: item.title,
          category: `${Number(item.vote_average || 0).toFixed(1)} ★ • Movie`,
          duration: "Movie",
          tmdbId: String(item.id),
          type: "movie",
          posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        }));
        setWatchNowMovies((previous) => {
          const existingIds = new Set(previous.map((movie) => movie.tmdbId));
          return [...previous, ...formatted.filter((movie) => !existingIds.has(movie.tmdbId))];
        });
        setHasMoreTrending(watchNowPage < Math.min(data.total_pages || 500, 500));
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error("Error fetching trending movies from TMDB:", error);
          setHasMoreTrending(false);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          trendingRequestLock.current = false;
          setIsTrendingLoading(false);
        }
      });

    return () => controller.abort();
  }, [watchNowPage]);

  // Reset page and results when search query changes
  useEffect(() => {
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(false);
    searchRequestLock.current = false;
    searchAbortController.current?.abort();
  }, [searchQuery]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    searchAbortController.current = controller;
    const fetchMovies = async () => {
      searchRequestLock.current = true;
      setIsLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) {
          setHasMore(false);
          return;
        }
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);
        const data = await res.json();
        if (controller.signal.aborted) return;
        const filtered = (data.results || []).filter(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        );
        setSearchResults((previous) => {
          const existingIds = new Set(previous.map((item) => `${item.media_type}:${item.id}`));
          const uniqueResults = filtered.filter(
            (item) => !existingIds.has(`${item.media_type}:${item.id}`),
          );
          return page === 1 ? uniqueResults : [...previous, ...uniqueResults];
        });
        setHasMore(data.page < Math.min(data.total_pages || data.page, 500));
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error fetching movies from TMDB:", err);
          setHasMore(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          searchRequestLock.current = false;
          setIsLoading(false);
        }
      }
    };

    if (page === 1) {
      const debounceTimer = setTimeout(fetchMovies, 350);
      return () => {
        clearTimeout(debounceTimer);
        controller.abort();
      };
    } else {
      fetchMovies();
      return () => controller.abort();
    }
  }, [searchQuery, page]);

  useEffect(() => {
    const root = mainRef.current;
    const target = loadMoreRef.current;
    if (!root || !target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (searchQuery.trim()) {
          if (!searchResults.length || isLoading || !hasMore || searchRequestLock.current) return;
          searchRequestLock.current = true;
          setPage((currentPage) => currentPage + 1);
        } else if (
          activeTab === "watchNow" &&
          !isTrendingLoading &&
          hasMoreTrending &&
          !trendingRequestLock.current
        ) {
          trendingRequestLock.current = true;
          setWatchNowPage((currentPage) => currentPage + 1);
        }
      },
      { root, rootMargin: "360px 0px", threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [
    activeTab,
    hasMore,
    hasMoreTrending,
    isLoading,
    isTrendingLoading,
    searchQuery,
    searchResults.length,
  ]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchedMovies = MOVIES.filter((m) => m.title.toLowerCase().includes(normalizedQuery));
  const matchedStoreMovies = STORE_MOVIES.filter((m) =>
    m.title.toLowerCase().includes(normalizedQuery),
  );
  const featuredMatch = FEATURED_SHOW.title.toLowerCase().includes(normalizedQuery)
    ? FEATURED_SHOW
    : null;

  const hasLocalResults =
    matchedMovies.length > 0 || matchedStoreMovies.length > 0 || featuredMatch;

  return (
    <div className="flex-1 flex min-h-0 relative">
      {isSidebarOpen && isCompact && (
        <div
          onClick={onCloseSidebar}
          className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-20"
        />
      )}
      <SidebarNavigation
        activeTab={activeTab}
        searchQuery={searchQuery}
        isSidebarOpen={isSidebarOpen}
        onSearch={onSearch}
        onSelectTab={onSelectTab}
        isCompact={isCompact}
        githubProfile={githubProfile}
        onProfileClick={onProfileClick}
      />
      <main
        ref={mainRef}
        className="flex-1 bg-white overflow-y-auto thin-scrollbar p-6 space-y-8 select-none text-gray-800 h-full min-h-0"
      >
        {searchQuery.trim() ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-800">Search Results</h2>
                <p className="text-xs text-gray-500 mt-0.5">Results for "{searchQuery}"</p>
              </div>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </div>

            {/* Direct TMDB ID Match (if query is purely digits) */}
            {/^\d+$/.test(normalizedQuery) && (
              <div className="bg-gradient-to-tr from-neutral-900 to-indigo-950 rounded-xl p-6 text-white space-y-4 shadow-xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 font-bold text-7xl select-none">
                  TMDB
                </div>
                <div className="max-w-md space-y-1.5">
                  <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">
                    Custom Stream Launcher
                  </span>
                  <h3 className="text-lg font-bold leading-none">
                    Stream TMDB ID: {normalizedQuery}
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Directly stream this movie or TV show using multiple stream servers.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() =>
                      onPlayMovie({
                        title: `TMDB Movie #${normalizedQuery}`,
                        tmdbId: normalizedQuery,
                        type: "movie",
                      })
                    }
                    className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-neutral-200 active:scale-95 transition-all shadow-md"
                  >
                    Stream as Movie
                  </button>
                  <button
                    onClick={() =>
                      onPlayMovie({
                        title: `TMDB Show #${normalizedQuery}`,
                        tmdbId: normalizedQuery,
                        type: "tv",
                        season: 1,
                        episode: 1,
                      })
                    }
                    className="bg-white/15 border border-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/25 active:scale-95 transition-all"
                  >
                    Stream as TV Show
                  </button>
                </div>
              </div>
            )}

            {/* TMDB Live Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Movies & TV Shows online
                </h3>
                <div
                  className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4 md:grid-cols-5"}`}
                >
                  {searchResults.map((item) => {
                    const title = item.title || item.name;
                    const date = item.release_date || item.first_air_date || "";
                    const year = date ? date.split("-")[0] : "";
                    const posterUrl = item.poster_path
                      ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                      : null;
                    const typeLabel = item.media_type === "tv" ? "TV Show" : "Movie";

                    return (
                      <div
                        key={item.id}
                        onClick={() =>
                          onPlayMovie({
                            title,
                            tmdbId: item.id.toString(),
                            type: item.media_type,
                            season: 1,
                            episode: 1,
                          })
                        }
                        className="group cursor-pointer space-y-2"
                      >
                        <div className="aspect-[2/3] w-full rounded-lg bg-neutral-900 border border-black/5 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
                          {posterUrl ? (
                            <img
                              src={posterUrl}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="p-4 flex flex-col items-center justify-center h-full bg-gradient-to-br from-neutral-800 to-neutral-950 text-white text-xs font-bold w-full">
                              {title}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="p-3 bg-white/20 border border-white/20 backdrop-blur-md rounded-full transform scale-90 group-hover:scale-100 transition-transform">
                              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                            </span>
                          </div>
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase bg-black/70 text-white border border-white/10">
                            {typeLabel}
                          </span>
                        </div>
                        <div className="px-1">
                          <h4 className="text-xs font-bold truncate text-gray-800 group-hover:text-gray-950">
                            {title}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-semibold">
                            {year ? `${year} • ` : ""}
                            {typeLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Local Catalog matches */}
            {hasLocalResults && (
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Local Results
                </h3>

                {featuredMatch && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Featured Match
                    </h3>
                    <div
                      onClick={() => onPlayFeatured(featuredMatch)}
                      className={`relative rounded-xl overflow-hidden border border-black/5 p-5 flex flex-col justify-end min-h-[140px] shadow-lg cursor-pointer ${featuredMatch.bgImage}`}
                    >
                      <h4 className="text-lg font-bold text-white">{featuredMatch.title}</h4>
                      <p className="text-[10px] text-neutral-300 mt-1 max-w-md line-clamp-2">
                        {featuredMatch.description}
                      </p>
                    </div>
                  </div>
                )}

                {matchedMovies.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Library
                    </h3>
                    <div
                      className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}
                    >
                      {matchedMovies.map((movie) => (
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
                  </div>
                )}

                {matchedStoreMovies.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Movie Store
                    </h3>
                    <div
                      className={`grid gap-4 ${isCompact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}
                    >
                      {matchedStoreMovies.map((movie) => (
                        <StoreMovieCard key={movie.title} movie={movie} onPlayMovie={onPlayMovie} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isLoading && searchResults.length === 0 && !hasLocalResults && (
              <div className="py-12 text-center text-xs text-gray-500 italic">
                No titles matching "{searchQuery}" were found. Try searching for a popular movie
                title (e.g. "Oppenheimer" or "Avengers").
              </div>
            )}
          </div>
        ) : (
          <>
            {activeTab === "watchNow" && (
              <WatchNowSection
                upNext={upNext}
                onPlayFeatured={onPlayFeatured}
                onPlayMovie={onPlayMovie}
                onToggleUpNext={onToggleUpNext}
                watchNowMovies={watchNowMovies}
                popularShows={popularShows}
                relatedShows={relatedShows}
                isCompact={isCompact}
              />
            )}
            {activeTab === "store" && (
              <StoreSection onPlayMovie={onPlayMovie} isCompact={isCompact} />
            )}
            {activeTab === "library" && <LibrarySection onOpenStore={onOpenStore} />}
            {activeTab === "favorites" && (
              <FavoritesSection upNext={upNext} onPlayMovie={onPlayMovie} isCompact={isCompact} />
            )}
          </>
        )}
        {(searchQuery.trim()
          ? hasMore && searchResults.length > 0
          : activeTab === "watchNow" && hasMoreTrending) && (
          <div ref={loadMoreRef} className="h-1 w-full" aria-hidden="true" />
        )}
        {(searchQuery.trim() ? isLoading : activeTab === "watchNow" && isTrendingLoading) && (
          <div className="flex justify-center py-2 text-gray-400" aria-live="polite">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </main>
    </div>
  );
};

export default AppleTVSection;
