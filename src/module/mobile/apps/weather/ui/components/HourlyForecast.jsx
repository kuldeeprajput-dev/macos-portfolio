import React from "react";
import { Clock } from "lucide-react";
import { renderIcon } from "../../data";

const HourlyForecast = ({ activeCity, unitMode }) => {
  return (
    <section className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-3 border border-white/10 shadow-sm shrink-0 text-white select-none">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/50 leading-none flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" /> Hourly Forecast
      </h3>

      <p className="text-xs font-semibold text-white/90 pb-2 border-b border-white/10">
        {activeCity.condition} conditions will continue. Highs near{" "}
        {unitMode === "f" ? `${activeCity.highF}°` : `${activeCity.highC}°`}.
      </p>

      <div className="flex gap-4 overflow-x-auto thin-scrollbar pb-1 pt-1 text-center justify-between min-w-0">
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
            <div key={i} className="space-y-2 shrink-0 px-2 flex flex-col items-center">
              <span className="text-[10px] font-bold text-white/70">{h.time}</span>
              {renderIcon(h.icon, "w-6 h-6")}
              <div className="flex flex-col items-center leading-none">
                {unitMode === "both" && (
                  <>
                    <span className="text-xs font-bold">{hTempC}°</span>
                    <span className="text-[9px] text-white/60 font-semibold mt-0.5">{hTempF}°</span>
                  </>
                )}
                {unitMode === "c" && <span className="text-xs font-bold">{hTempC}°</span>}
                {unitMode === "f" && <span className="text-xs font-bold">{hTempF}°</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HourlyForecast;
