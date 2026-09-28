import React from "react";
import { renderIcon } from "../../data/weatherUtils";

const toCelsius = (valueC, value) => {
  if (Number.isFinite(valueC)) return valueC;
  if (!Number.isFinite(value)) return null;
  return value <= 45 ? value : Math.round(((value - 32) * 5) / 9);
};

const TenDayForecast = ({ activeCity, unitMode }) => {
  const forecast = activeCity.forecast ?? [];
  const temperatures = forecast
    .flatMap((day) => [toCelsius(day.tempMinC, day.tempMin), toCelsius(day.tempMaxC, day.tempMax)])
    .filter(Number.isFinite);
  const chartMin = temperatures.length ? Math.min(...temperatures) : 0;
  const chartSpan = temperatures.length ? Math.max(1, Math.max(...temperatures) - chartMin) : 1;

  return (
    <section className="min-w-0 space-y-2 rounded-2xl border border-white/15 bg-black/15 p-4 shadow-sm backdrop-blur-xl">
      <h3 className="border-b border-white/15 pb-2.5 text-[10px] font-semibold uppercase tracking-wider text-white/75 leading-none">
        10-Day Forecast
      </h3>
      <div className="divide-y divide-white/15 text-xs">
        {forecast.map((f, i) => {
          const minC =
            f.tempMinC !== undefined
              ? f.tempMinC
              : f.tempMin !== undefined
                ? f.tempMin <= 45
                  ? f.tempMin
                  : Math.round(((f.tempMin - 32) * 5) / 9)
                : "--";
          const minF =
            f.tempMinF !== undefined
              ? f.tempMinF
              : f.tempMin !== undefined
                ? f.tempMin > 45
                  ? f.tempMin
                  : Math.round((f.tempMin * 9) / 5 + 32)
                : "--";
          const maxC =
            f.tempMaxC !== undefined
              ? f.tempMaxC
              : f.tempMax !== undefined
                ? f.tempMax <= 45
                  ? f.tempMax
                  : Math.round(((f.tempMax - 32) * 5) / 9)
                : "--";
          const maxF =
            f.tempMaxF !== undefined
              ? f.tempMaxF
              : f.tempMax !== undefined
                ? f.tempMax > 45
                  ? f.tempMax
                  : Math.round((f.tempMax * 9) / 5 + 32)
                : "--";
          const barLow = Number.isFinite(minC) ? minC : chartMin;
          const barHigh = Number.isFinite(maxC) ? maxC : chartMin;
          return (
            <div
              key={i}
              className="flex min-h-9 items-center justify-between gap-2 py-1.5 font-medium"
            >
              <span className="w-11 shrink-0 text-left text-white/90">{f.day}</span>
              <div className="flex w-6 shrink-0 justify-center">
                {renderIcon(f.icon, "w-4 h-4")}
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <div className="flex w-9 shrink-0 flex-col items-end text-[10px] leading-none text-white/70">
                  {unitMode === "both" && (
                    <>
                      <span>{minC}°C</span>
                      <span className="mt-0.5 text-[8px] text-white/55">{minF}°F</span>
                    </>
                  )}
                  {unitMode === "c" && <span>{minC}°C</span>}
                  {unitMode === "f" && <span>{minF}°F</span>}
                </div>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-200 via-yellow-200 to-orange-300"
                    style={{
                      left: `${((barLow - chartMin) / chartSpan) * 100}%`,
                      right: `${100 - ((barHigh - chartMin) / chartSpan) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex w-9 shrink-0 flex-col items-end text-[10px] leading-none">
                  {unitMode === "both" && (
                    <>
                      <span>{maxC}°C</span>
                      <span className="mt-0.5 text-[8px] text-white/60">{maxF}°F</span>
                    </>
                  )}
                  {unitMode === "c" && <span>{maxC}°C</span>}
                  {unitMode === "f" && <span>{maxF}°F</span>}
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
