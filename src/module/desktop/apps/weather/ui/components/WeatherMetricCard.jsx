import React from "react";
import { Compass, Sunrise, Sunset } from "lucide-react";

const MetricCard = ({ title, children, className = "" }) => (
  <div
    className={`flex min-h-[144px] flex-col justify-between rounded-2xl border border-white/15 bg-black/15 p-4 shadow-sm backdrop-blur-xl ${className}`}
  >
    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-white/75 leading-none">
      {title}
    </h4>
    {children}
  </div>
);

export const UvIndexCard = ({ uv, uvLabel }) => (
  <MetricCard title="UV Index">
    <div className="space-y-1">
      <span className="text-2xl font-semibold">{uv}</span>
      <p className="text-[11px] font-medium">{uvLabel}</p>
    </div>
    <div className="h-1 bg-gradient-to-r from-green-500 via-amber-400 via-orange-500 to-purple-600 rounded-full relative mt-2">
      <div
        className="absolute size-2 rounded-full bg-white border border-black/20 -top-0.5"
        style={{ left: `${(uv / 12) * 100}%` }}
      />
    </div>
  </MetricCard>
);

export const WindCard = ({ windSpeed, windDir, windAngle }) => (
  <MetricCard title="Wind">
    <div className="flex items-center gap-3">
      <div className="space-y-1 min-w-0 flex-1">
        <span className="text-2xl font-semibold tracking-tight">
          {windSpeed} <span className="text-[10px] font-semibold">mph</span>
        </span>
        <p className="text-[9px] font-bold opacity-80">{windDir} Direction</p>
      </div>
      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center relative shrink-0">
        <Compass className="w-7 h-7 stroke-[1.2] opacity-40" />
        <div
          className="absolute w-1 h-8 bg-gradient-to-t from-transparent via-white to-white rounded-full transition-transform duration-500"
          style={{ transform: `rotate(${windAngle}deg)` }}
        />
      </div>
    </div>
  </MetricCard>
);

export const SunriseSunsetCard = ({ sunrise, sunset }) => (
  <MetricCard title="Sunrise & Sunset">
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Sunrise className="w-5 h-5 text-amber-300" />
        <div>
          <span className="text-xs font-bold leading-none">{sunrise}</span>
          <p className="text-[8px] text-white/60 leading-none mt-0.5">Sunrise</p>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-white/10 pt-2">
        <Sunset className="w-5 h-5 text-orange-300" />
        <div>
          <span className="text-xs font-bold leading-none">{sunset}</span>
          <p className="text-[8px] text-white/60 leading-none mt-0.5">Sunset</p>
        </div>
      </div>
    </div>
  </MetricCard>
);

export const AirQualityCard = ({ aqi, aqiLabel }) => (
  <MetricCard title="Air Quality">
    <div className="space-y-1">
      <span className="text-2xl font-semibold">{aqi}</span>
      <p className="text-[11px] font-medium">{aqiLabel}</p>
    </div>
    <div className="h-1 bg-gradient-to-r from-green-500 via-yellow-400 via-orange-500 to-red-600 rounded-full relative mt-2">
      <div
        className="absolute size-2 rounded-full bg-white border border-black/20 -top-0.5"
        style={{ left: `${Math.min((aqi / 150) * 100, 100)}%` }}
      />
    </div>
  </MetricCard>
);
