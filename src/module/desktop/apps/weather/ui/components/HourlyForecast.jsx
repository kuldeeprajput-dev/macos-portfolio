import React from "react";
import { Clock } from "lucide-react";
import { renderIcon } from "../../data/weatherUtils";

const HourlyForecast = ({ activeCity, unitMode }) => {
  return (
    <section className="weather-hourly-forecast shrink-0 space-y-3 overflow-hidden rounded-2xl border border-white/15 bg-black/15 px-4 pb-2 pt-4 shadow-sm backdrop-blur-xl">
      <h3 className="flex items-center gap-1.5 border-b border-white/15 pb-2.5 text-[10px] font-semibold uppercase tracking-wider text-white/75 leading-none">
        <Clock className="w-3.5 h-3.5" /> Hourly Forecast
      </h3>
      <div
        className="weather-hourly-scroll -mx-4 flex min-w-0 justify-between gap-3 overflow-x-auto px-4 pb-1 text-center select-none"
        tabIndex={0}
        aria-label="Hourly forecast"
      >
        {activeCity.hourly?.map((h, i) => {
          const hTempC =
            h.tempC !== undefined
              ? h.tempC
              : h.temp !== undefined
                ? h.temp <= 45
                  ? h.temp
                  : Math.round(((h.temp - 32) * 5) / 9)
                : "--";
          const hTempF =
            h.tempF !== undefined
              ? h.tempF
              : h.temp !== undefined
                ? h.temp > 45
                  ? h.temp
                  : Math.round((h.temp * 9) / 5 + 32)
                : "--";
          return (
            <div key={i} className="flex shrink-0 flex-col items-center space-y-2 px-1.5">
              <span className="text-[10px] font-semibold text-white/80">{h.time}</span>
              {renderIcon(h.icon, "w-6 h-6")}
              <div className="flex flex-col items-center leading-none">
                {unitMode === "both" && (
                  <>
                    <span className="text-xs font-semibold">{hTempC}°C</span>
                    <span className="mt-0.5 text-[9px] font-medium text-white/70">{hTempF}°F</span>
                  </>
                )}
                {unitMode === "c" && <span className="text-xs font-semibold">{hTempC}°C</span>}
                {unitMode === "f" && <span className="text-xs font-semibold">{hTempF}°F</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HourlyForecast;
