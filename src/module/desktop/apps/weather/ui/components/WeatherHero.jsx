import React from "react";
import { getSafeTemp } from "../../data/weatherUtils";

const WeatherHero = ({ activeCity, unitMode }) => {
  const activeTemps = getSafeTemp(activeCity);

  return (
    <div className="shrink-0 space-y-0.5 py-4 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
      <h2 className="text-[28px] font-medium tracking-tight">{activeCity.name}</h2>
      <div className="flex items-baseline justify-center gap-2">
        {unitMode === "both" && (
          <>
            <span className="text-[78px] font-thin leading-none tracking-tighter">
              {activeTemps.tempC}°
            </span>
            <span className="text-lg font-light text-white/80">C</span>
          </>
        )}
        {unitMode === "c" && (
          <span className="text-[78px] font-thin leading-none tracking-tighter">
            {activeTemps.tempC}°
          </span>
        )}
        {unitMode === "f" && (
          <span className="text-[78px] font-thin leading-none tracking-tighter">
            {activeTemps.tempF}°
          </span>
        )}
      </div>
      <p className="text-sm font-medium">{activeCity.condition}</p>
      {unitMode === "both" && <p className="text-xs text-white/80">{activeTemps.tempF}°F</p>}
      <div className="flex justify-center gap-3 pt-1 text-xs font-medium text-white/85">
        {unitMode === "both" && (
          <>
            <span>
              H: {activeTemps.highC}°C / {activeTemps.highF}°F
            </span>
            <span>
              L: {activeTemps.lowC}°C / {activeTemps.lowF}°F
            </span>
          </>
        )}
        {unitMode === "c" && (
          <>
            <span>H: {activeTemps.highC}°C</span>
            <span>L: {activeTemps.lowC}°C</span>
          </>
        )}
        {unitMode === "f" && (
          <>
            <span>H: {activeTemps.highF}°F</span>
            <span>L: {activeTemps.lowF}°F</span>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherHero;
