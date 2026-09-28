import React from "react";
import WeatherHero from "./WeatherHero";
import HourlyForecast from "./HourlyForecast";
import TenDayForecast from "./TenDayForecast";
import { UvIndexCard, WindCard, SunriseSunsetCard, AirQualityCard } from "./WeatherMetricCard";

const WeatherDashboard = ({ activeCity, unitMode, loading, error, setError, isNarrow }) => {
  const condition = activeCity.condition?.toLowerCase() ?? "";
  const isHazy = /haze|fog|mist|smoke/.test(condition);
  const isCloudy = /cloud|rain|drizzle|shower|snow|storm|overcast/.test(condition);
  const sky = isHazy
    ? "/weather/haze-sky.webp"
    : isCloudy
      ? "/weather/cloudy-sky.webp"
      : "/weather/sunny-sky.webp";
  const tint = isHazy
    ? "linear-gradient(to bottom, rgba(55, 57, 63, 0.2), rgba(104, 58, 51, 0.5))"
    : isCloudy
      ? "linear-gradient(to bottom, rgba(29, 49, 75, 0.25), rgba(31, 60, 87, 0.55))"
      : "linear-gradient(to bottom, rgba(14, 78, 153, 0.18), rgba(12, 80, 159, 0.48))";

  return (
    <main
      className={`relative flex h-full min-h-0 flex-1 flex-col justify-start space-y-5 overflow-y-auto text-white thin-scrollbar ${isNarrow ? "px-4 pb-5 pt-16" : "px-6 pb-6 pt-16"}`}
      style={{
        backgroundImage: `${tint}, url("${sky}")`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundColor: isHazy ? "#a97865" : isCloudy ? "#48637e" : "#2375b7",
      }}
    >
      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-30 transition-all duration-300">
          <div className="flex flex-col items-center gap-3 bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-white tracking-wider">
              Fetching live weather...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur-md text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-red-400/20 z-30 flex items-center gap-2 animate-bounce">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 font-bold hover:text-gray-200 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      <WeatherHero activeCity={activeCity} unitMode={unitMode} />
      <HourlyForecast activeCity={activeCity} unitMode={unitMode} />

      <div className={`grid flex-1 gap-4 ${isNarrow ? "grid-cols-1" : "grid-cols-2"}`}>
        <TenDayForecast activeCity={activeCity} unitMode={unitMode} />

        <div className="grid grid-cols-2 gap-4">
          <UvIndexCard uv={activeCity.uv} uvLabel={activeCity.uvLabel} />
          <WindCard
            windSpeed={activeCity.windSpeed}
            windDir={activeCity.windDir}
            windAngle={activeCity.windAngle}
          />
          <SunriseSunsetCard sunrise={activeCity.sunrise} sunset={activeCity.sunset} />
          <AirQualityCard aqi={activeCity.aqi} aqiLabel={activeCity.aqiLabel} />
        </div>
      </div>
    </main>
  );
};

export default WeatherDashboard;
