import React from "react";
import { Sun, Cloud, CloudRain, CloudFog } from "lucide-react";

export const getSafeTemp = (cityObj) => {
  if (!cityObj)
    return { tempC: "--", tempF: "--", highC: "--", highF: "--", lowC: "--", lowF: "--" };

  const tempC =
    cityObj.tempC !== undefined
      ? cityObj.tempC
      : cityObj.temp !== undefined
        ? cityObj.temp <= 45
          ? cityObj.temp
          : Math.round(((cityObj.temp - 32) * 5) / 9)
        : "--";

  const tempF =
    cityObj.tempF !== undefined
      ? cityObj.tempF
      : cityObj.temp !== undefined
        ? cityObj.temp > 45
          ? cityObj.temp
          : Math.round((cityObj.temp * 9) / 5 + 32)
        : "--";

  const highC =
    cityObj.highC !== undefined
      ? cityObj.highC
      : cityObj.high !== undefined
        ? cityObj.high <= 45
          ? cityObj.high
          : Math.round(((cityObj.high - 32) * 5) / 9)
        : "--";

  const highF =
    cityObj.highF !== undefined
      ? cityObj.highF
      : cityObj.high !== undefined
        ? cityObj.high > 45
          ? cityObj.high
          : Math.round((cityObj.high * 9) / 5 + 32)
        : "--";

  const lowC =
    cityObj.lowC !== undefined
      ? cityObj.lowC
      : cityObj.low !== undefined
        ? cityObj.low <= 45
          ? cityObj.low
          : Math.round(((cityObj.low - 32) * 5) / 9)
        : "--";

  const lowF =
    cityObj.lowF !== undefined
      ? cityObj.lowF
      : cityObj.low !== undefined
        ? cityObj.low > 45
          ? cityObj.low
          : Math.round((cityObj.low * 9) / 5 + 32)
        : "--";

  return { tempC, tempF, highC, highF, lowC, lowF };
};

export const parseWttrResponse = (text) => {
  const trimmed = text.trim();
  const match = trimmed.match(/^(.*?)\s+([+-]?\d+°[CF])$/i);
  let condition;
  let tempStr = "65°F";
  if (match) {
    condition = match[1].trim();
    tempStr = match[2].trim();
  } else {
    const lastSpaceIdx = trimmed.lastIndexOf(" ");
    if (lastSpaceIdx !== -1) {
      condition = trimmed.substring(0, lastSpaceIdx).trim();
      tempStr = trimmed.substring(lastSpaceIdx + 1).trim();
    } else {
      condition = trimmed || "Sunny";
    }
  }
  if (tempStr.startsWith("+")) {
    tempStr = tempStr.substring(1);
  }
  return { condition, tempStr };
};

export const generateWeatherData = (cityName, condition, tempStr) => {
  const tempMatch = tempStr.match(/([+-]?\d+)(°[CF])/);
  let tempC = 20;
  let tempF = 68;

  if (tempMatch) {
    const val = parseInt(tempMatch[1], 10);
    const unit = tempMatch[2].toUpperCase();
    if (unit.includes("C")) {
      tempC = val;
      tempF = Math.round((val * 9) / 5 + 32);
    } else {
      tempF = val;
      tempC = Math.round(((val - 32) * 5) / 9);
    }
  } else {
    const numMatch = tempStr.match(/([+-]?\d+)/);
    if (numMatch) {
      const val = parseInt(numMatch[1], 10);
      if (val <= 45) {
        tempC = val;
        tempF = Math.round((val * 9) / 5 + 32);
      } else {
        tempF = val;
        tempC = Math.round(((val - 32) * 5) / 9);
      }
    }
  }

  const condLower = condition.toLowerCase();
  let icon = "sunny";
  let bgClass = "from-sky-400 to-blue-600";
  if (condLower.includes("cloud") || condLower.includes("overcast")) {
    icon = "cloudy";
    bgClass = "from-zinc-400 to-zinc-600";
  } else if (
    condLower.includes("rain") ||
    condLower.includes("drizzle") ||
    condLower.includes("shower") ||
    condLower.includes("precip")
  ) {
    icon = "rain";
    bgClass = "from-slate-500 to-slate-700";
  } else if (
    condLower.includes("fog") ||
    condLower.includes("haze") ||
    condLower.includes("mist") ||
    condLower.includes("smoke")
  ) {
    icon = "haze";
    bgClass = "from-amber-600/70 to-orange-700/80";
  } else if (
    condLower.includes("snow") ||
    condLower.includes("ice") ||
    condLower.includes("sleet") ||
    condLower.includes("frost")
  ) {
    icon = "cloudy";
    bgClass = "from-blue-200 to-sky-400";
  } else if (condLower.includes("sunny") || condLower.includes("clear")) {
    icon = "sunny";
    bgClass = "from-sky-400 to-blue-600";
  } else if (condLower.includes("partly") || condLower.includes("mostly")) {
    icon = "mostly-sunny";
  }

  const highOffset = Math.floor(Math.random() * 4) + 2;
  const lowOffset = Math.floor(Math.random() * 4) + 4;
  const highC = tempC + highOffset;
  const highF = tempF + Math.round(highOffset * 1.8);
  const lowC = tempC - lowOffset;
  const lowF = tempF - Math.round(lowOffset * 1.8);

  const aqi = Math.floor(Math.random() * 75) + 15;
  const aqiLabel = aqi < 50 ? "Good" : aqi < 100 ? "Moderate" : "Poor";
  const uv = Math.floor(Math.random() * 9) + 1;
  const uvLabel = uv < 3 ? "Low" : uv < 6 ? "Moderate" : uv < 8 ? "High" : "Very High";
  const windSpeed = Math.floor(Math.random() * 12) + 4;
  const windDir = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)];
  const windAngle = Math.floor(Math.random() * 360);
  const humidity = Math.floor(Math.random() * 35) + 45;
  const visibility = Math.floor(Math.random() * 5) + 6;
  const sunrise = `05:${String(Math.floor(Math.random() * 30) + 20).padStart(2, "0")} AM`;
  const sunset = `08:${String(Math.floor(Math.random() * 30) + 10).padStart(2, "0")} PM`;

  const currentHour = new Date().getHours();
  const hourly = Array.from({ length: 12 }).map((_, i) => {
    const hr = (currentHour + i) % 24;
    const timeLabel = i === 0 ? "Now" : `${hr % 12 || 12} ${hr >= 12 ? "PM" : "AM"}`;
    const offsetC = Math.round(Math.sin(((hr - 6) / 24) * 2 * Math.PI) * 3);
    const offsetF = Math.round(offsetC * 1.8);
    return {
      time: timeLabel,
      tempC: tempC + offsetC,
      tempF: tempF + offsetF,
      icon: offsetC > 1 ? "sunny" : offsetC < -1 ? "cloudy" : icon,
    };
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDayIndex = new Date().getDay();
  const forecast = Array.from({ length: 10 }).map((_, i) => {
    const dayLabel = i === 0 ? "Today" : daysOfWeek[(currentDayIndex + i) % 7];
    const offsetMinC = -Math.floor(Math.random() * 3) - 3;
    const offsetMaxC = Math.floor(Math.random() * 3) + 1;
    return {
      day: dayLabel,
      tempMinC: tempC + offsetMinC,
      tempMinF: tempF + Math.round(offsetMinC * 1.8),
      tempMaxC: tempC + offsetMaxC,
      tempMaxF: tempF + Math.round(offsetMaxC * 1.8),
      icon: i % 3 === 0 ? icon : i % 3 === 1 ? "mostly-sunny" : "cloudy",
      label: condition,
    };
  });

  return {
    name: cityName,
    tempC,
    tempF,
    condition,
    bgClass,
    highC,
    highF,
    lowC,
    lowF,
    aqi,
    aqiLabel,
    uv,
    uvLabel,
    windSpeed,
    windDir,
    windAngle,
    humidity,
    visibility,
    sunrise,
    sunset,
    hourly,
    forecast,
  };
};

export const renderIcon = (type, sizeClass = "w-6 h-6") => {
  switch (type) {
    case "sunny":
      return <Sun className={`${sizeClass} text-amber-400 fill-current animate-pulse`} />;
    case "mostly-sunny":
      return (
        <div className="relative flex items-center justify-center">
          <Sun className={`${sizeClass} text-amber-400 fill-current`} />
          <Cloud className="w-4 h-4 text-white/95 absolute -bottom-1 -right-1 fill-current" />
        </div>
      );
    case "cloudy":
      return <Cloud className={`${sizeClass} text-slate-100 fill-current`} />;
    case "rain":
      return <CloudRain className={`${sizeClass} text-sky-200 fill-current`} />;
    case "haze":
      return <CloudFog className={`${sizeClass} text-amber-200 fill-current`} />;
    default:
      return <Sun className={`${sizeClass} text-amber-400 fill-current`} />;
  }
};
