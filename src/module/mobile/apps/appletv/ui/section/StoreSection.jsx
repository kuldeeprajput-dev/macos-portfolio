import StoreMovieCard from "../components/StoreMovieCard";
import { STORE_MOVIES } from "../../data";

const StoreSection = ({ onPlayMovie }) => (
  <div className="space-y-5">
    <div>
      <h2 className="text-[15px] font-bold text-white">Movie Store</h2>
      <p className="text-[11px] text-white/40 mt-0.5">Stream newly released movies for free.</p>
    </div>

    <div className="grid grid-cols-3 gap-2.5">
      {STORE_MOVIES.map((movie) => (
        <StoreMovieCard key={movie.title} movie={movie} onPlayMovie={onPlayMovie} />
      ))}
    </div>
  </div>
);

export default StoreSection;
