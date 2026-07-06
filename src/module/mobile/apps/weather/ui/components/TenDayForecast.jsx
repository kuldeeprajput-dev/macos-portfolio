import React from "react";
import { Calendar } from "lucide-react";
import { renderIcon } from "../../data";

const TenDayForecast = ({ activeCity, unitMode }) => {
  const forecasts = activeCity.forecast || [];

  // Parse all min/max temperatures to numbers
  const parsedForecast = forecasts.map((f) => {
    const minC =
      f.tempMinC !== undefined
        ? f.tempMinC
        : f.tempMin !== undefined
          ? f.tempMin <= 45
            ? f.tempMin
            : Math.round(((f.tempMin - 32) * 5) / 9)
          : 0;
    const minF =
      f.tempMinF !== undefined
        ? f.tempMinF
        : f.tempMin !== undefined
          ? f.tempMin > 45
            ? f.tempMin
            : Math.round((f.tempMin * 9) / 5 + 32)
          : 0;
    const maxC =
      f.tempMaxC !== undefined
        ? f.tempMaxC
        : f.tempMax !== undefined
          ? f.tempMax <= 45
            ? f.tempMax
            : Math.round(((f.tempMax - 32) * 5) / 9)
          : 0;
    const maxF =
      f.tempMaxF !== undefined
        ? f.tempMaxF
        : f.tempMax !== undefined
          ? f.tempMax > 45
            ? f.tempMax
            : Math.round((f.tempMax * 9) / 5 + 32)
          : 0;

    const valMin = unitMode === "f" ? minF : minC;
    const valMax = unitMode === "f" ? maxF : maxC;

    return { ...f, minC, minF, maxC, maxF, valMin, valMax };
  });

  // Calculate absolute extremes for progress bar mapping
  const allMinVals = parsedForecast.map((x) => x.valMin);
  const allMaxVals = parsedForecast.map((x) => x.valMax);
  const absMin = allMinVals.length ? Math.min(...allMinVals) : 0;
  const absMax = allMaxVals.length ? Math.max(...allMaxVals) : 100;
  const absRange = absMax - absMin || 1;

  return (
    <section className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-3.5 border border-white/10 shadow-sm text-white select-none">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/50 leading-none flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" /> 10-Day Forecast
      </h3>
      <div className="space-y-3.5 text-xs">
        {parsedForecast.map((f, i) => {
          const leftPercent = ((f.valMin - absMin) / absRange) * 100;
          const rightPercent = 100 - ((f.valMax - absMin) / absRange) * 100;

          return (
            <div key={i} className="flex items-center justify-between gap-1.5 font-semibold">
              <span className="text-left opacity-90" style={{ width: "40px", minWidth: "40px" }}>
                {f.day}
              </span>
              <div className="flex justify-center" style={{ width: "24px", minWidth: "24px" }}>
                {renderIcon(f.icon, "w-4 h-4")}
              </div>

              <div
                className="flex-1 flex items-center justify-between gap-2"
                style={{ maxWidth: "110px", minWidth: "80px" }}
              >
                <div
                  className="flex flex-col items-end leading-none text-[10px] opacity-70"
                  style={{ width: "32px", minWidth: "32px" }}
                >
                  {unitMode === "both" && (
                    <>
                      <span>{f.minC}°</span>
                      <span className="text-[8px] text-white/60 mt-0.5">{f.minF}°</span>
                    </>
                  )}
                  {unitMode === "c" && <span>{f.minC}°</span>}
                  {unitMode === "f" && <span>{f.minF}°</span>}
                </div>

                <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full bg-gradient-to-r from-green-300 via-yellow-300 to-orange-400 rounded-full"
                    style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}
                  />
                </div>

                <div
                  className="flex flex-col items-end leading-none text-[10px]"
                  style={{ width: "32px", minWidth: "32px" }}
                >
                  {unitMode === "both" && (
                    <>
                      <span>{f.maxC}°</span>
                      <span className="text-[8px] text-white/60 mt-0.5">{f.maxF}°</span>
                    </>
                  )}
                  {unitMode === "c" && <span>{f.maxC}°</span>}
                  {unitMode === "f" && <span>{f.maxF}°</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TenDayForecast;
