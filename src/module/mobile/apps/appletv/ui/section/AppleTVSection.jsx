import { useState, useEffect, useRef } from "react";
import FavoritesSection from "./FavoritesSection";
import LibrarySection from "./LibrarySection";
import StoreSection from "./StoreSection";
import TVPlusSection from "./TVPlusSection";
import WatchNowSection from "./WatchNowSection";
import { Play, Tv, ShoppingBag, Film, Search, Loader2, X } from "lucide-react";

const TAB_ITEMS = [
  { id: "watchNow", label: "Home", icon: Play },
  { id: "tvPlus", label: "TV+", icon: Tv },
  { id: "store", label: "Store", icon: ShoppingBag },
  { id: "library", label: "Library", icon: Film },
  { id: "search", label: "Search", icon: Search },
];

const AppleTVSection = ({
  activeTab,
  searchQuery,
  upNext,
  onSearch,
  onSelectTab,
  onOpenStore,
  onPlayFeatured,
  onPlayMovie,
  onToggleUpNext,
  onScrollDirection,
}) => {
  const lastScrollTopRef = useRef(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [watchNowMovies, setWatchNowMovies] = useState([]);
  const [watchNowPage, setWatchNowPage] = useState(1);

  // Fetch trending movies for Watch Now
  useEffect(() => {
    const fetchWatchNowMovies = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) return;
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${watchNowPage}`,
        );
        const data = await res.json();
        if (data.results) {
          const formatted = data.results.map((item) => ({
            id: `trending_${item.id}`,
            title: item.title,
            category: `${item.vote_average.toFixed(1)} ★ • Movie`,
            duration: "Movie",
            tmdbId: item.id.toString(),
            type: "movie",
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
          }));
          setWatchNowMovies((prev) => {
            const existingIds = new Set(prev.map((p) => p.tmdbId));
            const uniques = formatted.filter((f) => !existingIds.has(f.tmdbId));
            return [...prev, ...uniques];
          });
        }
      } catch (err) {
        console.error("Error fetching watch now movies:", err);
      }
    };
    fetchWatchNowMovies();
  }, [watchNowPage]);

  // Reset search
  useEffect(() => {
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);

  // TMDB search
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) return;
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
            query,
          )}&page=${page}`,
        );
        const data = await res.json();
        if (data.results) {
          const filtered = data.results.filter(
            (item) => item.media_type === "movie" || item.media_type === "tv",
          );
          if (page === 1) {
            setSearchResults(filtered);
          } else {
            setSearchResults((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const uniques = filtered.filter((f) => !existingIds.has(f.id));
              return [...prev, ...uniques];
            });
          }
          if (data.page >= data.total_pages) setHasMore(false);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error searching TMDB:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (page === 1) {
      const delayDebounceFn = setTimeout(fetchMovies, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      fetchMovies();
    }
  }, [searchQuery, page]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // Detect scroll direction and notify parent
    if (onScrollDirection) {
      if (scrollTop <= 10) {
        onScrollDirection("up");
      } else if (scrollTop > lastScrollTopRef.current) {
        onScrollDirection("down");
      } else if (scrollTop < lastScrollTopRef.current) {
        onScrollDirection("up");
      }
    }
    lastScrollTopRef.current = scrollTop;

    if (scrollHeight - scrollTop - clientHeight < 150) {
      if (searchQuery.trim()) {
        if (!isLoading && hasMore) setPage((prev) => prev + 1);
      } else if (activeTab === "watchNow") {
        setWatchNowPage((prev) => prev + 1);
      }
    }
  };

  const isSearchActive = activeTab === "search";

  return (
    <div className="flex-1 flex flex-col min-h-0 relative bg-[#f5f5f7]">
      {/* Scrollable content area */}
      <main
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 pt-[44px] pb-4 space-y-5 min-h-0"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Search Tab */}
        {isSearchActive && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Movies, Shows, and More"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                autoFocus
                className="w-full bg-gray-200/70 border border-gray-300/50 rounded-xl pl-9 pr-9 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* TMDB ID direct launcher */}
            {/^\d+$/.test(searchQuery.trim()) && (
              <div className="bg-gradient-to-br from-neutral-900 to-indigo-950 rounded-2xl p-4 space-y-3 border border-black/5 shadow-lg">
                <div>
                  <span className="text-[8px] font-bold text-indigo-400 tracking-widest uppercase">
                    Direct Stream
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    TMDB ID: {searchQuery.trim()}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      onPlayMovie({
                        title: `Movie #${searchQuery.trim()}`,
                        tmdbId: searchQuery.trim(),
                        type: "movie",
                      })
                    }
                    className="flex-1 bg-white text-black py-2 rounded-xl text-[10px] font-bold active:scale-95 transition-all"
                  >
                    Stream Movie
                  </button>
                  <button
                    onClick={() =>
                      onPlayMovie({
                        title: `Show #${searchQuery.trim()}`,
                        tmdbId: searchQuery.trim(),
                        type: "tv",
                        season: 1,
                        episode: 1,
                      })
                    }
                    className="flex-1 bg-white/15 border border-white/10 text-white py-2 rounded-xl text-[10px] font-bold active:scale-95 transition-all"
                  >
                    Stream TV Show
                  </button>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Results
                  </h3>
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />}
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {searchResults.map((item) => {
                    const title = item.title || item.name;
                    const posterUrl = item.poster_path
                      ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                      : null;
                    const typeLabel = item.media_type === "tv" ? "TV Show" : "Movie";
                    const date = item.release_date || item.first_air_date || "";
                    const year = date ? date.split("-")[0] : "";

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
                        className="cursor-pointer space-y-1.5 active:scale-[0.97] transition-transform"
                      >
                        <div className="aspect-[2/3] w-full rounded-xl bg-gray-100 border border-black/[0.06] relative overflow-hidden shadow-md">
                          {posterUrl ? (
                            <img
                              src={posterUrl}
                              alt={title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 p-2">
                              <span className="text-[9px] text-gray-400 font-bold text-center">
                                {title}
                              </span>
                            </div>
                          )}
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider uppercase bg-black/60 text-white border border-white/10 backdrop-blur-sm">
                            {typeLabel}
                          </span>
                        </div>
                        <div className="px-0.5">
                          <h4 className="text-[10px] font-semibold text-gray-900 truncate leading-tight">
                            {title}
                          </h4>
                          <span className="text-[8px] text-gray-400">
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

            {!isLoading && searchQuery.trim() && searchResults.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-[11px] text-gray-400 italic">No results for "{searchQuery}"</p>
              </div>
            )}

            {/* Trending suggestions when no query */}
            {!searchQuery.trim() && (
              <div className="space-y-3 pt-2">
                <h3 className="text-[15px] font-bold text-gray-900">Trending Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Severance",
                    "Ted Lasso",
                    "Dune",
                    "Oppenheimer",
                    "Foundation",
                    "Silo",
                    "Interstellar",
                    "Avengers",
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => onSearch(term)}
                      className="px-3 py-1.5 bg-gray-200/80 border border-gray-300/50 rounded-full text-[11px] text-gray-600 font-medium active:scale-95 active:bg-gray-300 transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Non-search tabs */}
        {!isSearchActive && (
          <>
            {activeTab === "watchNow" && (
              <WatchNowSection
                upNext={upNext}
                onPlayFeatured={onPlayFeatured}
                onPlayMovie={onPlayMovie}
                onToggleUpNext={onToggleUpNext}
                watchNowMovies={watchNowMovies}
              />
            )}
            {activeTab === "tvPlus" && (
              <TVPlusSection
                onPlayFeatured={onPlayFeatured}
                onPlayMovie={onPlayMovie}
                upNext={upNext}
                onToggleUpNext={onToggleUpNext}
              />
            )}
            {activeTab === "store" && <StoreSection onPlayMovie={onPlayMovie} />}
            {activeTab === "library" && <LibrarySection onOpenStore={onOpenStore} />}
            {activeTab === "favorites" && (
              <FavoritesSection upNext={upNext} onPlayMovie={onPlayMovie} />
            )}
          </>
        )}
      </main>

      {/* iOS-style Bottom Tab Bar - Light Theme */}
      <nav className="shrink-0 bg-[#f5f5f7]/90 backdrop-blur-xl border-t border-gray-200 px-2 pt-1.5 pb-5 flex items-center justify-around">
        {TAB_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onSelectTab(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
                isActive ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <Icon
                className={`w-[22px] h-[22px] transition-colors ${
                  id === "watchNow" && isActive ? "fill-blue-600" : ""
                }`}
                strokeWidth={isActive ? 2.2 : 1.5}
              />
              <span
                className={`text-[9px] font-semibold transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AppleTVSection;
