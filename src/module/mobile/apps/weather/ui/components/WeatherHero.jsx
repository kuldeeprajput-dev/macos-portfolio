import React from "react";
import { getSafeTemp } from "../../data";

const WeatherHero = ({ activeCity, unitMode }) => {
  const activeTemps = getSafeTemp(activeCity);

  return (
    <div className="text-center space-y-0.5 py-6 shrink-0 text-white select-none">
      <h2 className="text-3xl font-light tracking-wide drop-shadow-sm">{activeCity.name}</h2>

      <div className="flex justify-center items-start pl-4 drop-shadow-md">
        {unitMode === "both" && (
          <div className="flex items-baseline gap-1">
            <span className="text-8xl font-thin tracking-tighter leading-none">
              {activeTemps.tempC}°
            </span>
            <span className="text-2xl font-light opacity-65">/ {activeTemps.tempF}°</span>
          </div>
        )}
        {unitMode === "c" && (
          <span className="text-8xl font-thin tracking-tighter leading-none">
            {activeTemps.tempC}°
          </span>
        )}
        {unitMode === "f" && (
          <span className="text-8xl font-thin tracking-tighter leading-none">
            {activeTemps.tempF}°
          </span>
        )}
      </div>

      <p className="text-base font-medium opacity-90 mt-1 drop-shadow-sm">{activeCity.condition}</p>

      <div className="flex justify-center gap-3 text-xs font-semibold opacity-80 mt-1 drop-shadow-sm">
        {unitMode === "both" && (
          <>
            <span>
              H: {activeTemps.highC}° / {activeTemps.highF}°
            </span>
            <span>
              L: {activeTemps.lowC}° / {activeTemps.lowF}°
            </span>
          </>
        )}
        {unitMode === "c" && (
          <>
            <span>H: {activeTemps.highC}°</span>
            <span>L: {activeTemps.lowC}°</span>
          </>
        )}
        {unitMode === "f" && (
          <>
            <span>H: {activeTemps.highF}°</span>
            <span>L: {activeTemps.lowF}°</span>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherHero;
