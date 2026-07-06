import MovieCard from "../components/MovieCard";
import { MOVIES } from "../../data";

const FavoritesSection = ({ upNext, onPlayMovie }) => {
  const queuedMovies = MOVIES.filter((movie) => upNext.includes(movie.id));

  return (
    <div className="space-y-4">
      <h2 className="text-[15px] font-bold text-white">Your Up Next Queue</h2>
      {queuedMovies.length > 0 ? (
        <div className="grid grid-cols-3 gap-2.5">
          {queuedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onPlay={() => onPlayMovie(movie)} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📺</span>
          </div>
          <p className="text-[12px] text-white/50 font-medium">Your queue is empty</p>
          <p className="text-[10px] text-white/30 mt-1">
            Add shows from Watch Now or TV+ to watch later.
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
