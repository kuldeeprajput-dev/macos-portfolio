import { useState, useEffect, useCallback } from "react";
import { WEATHER_DATA, parseWttrResponse, generateWeatherData } from "../data";

const useWeather = () => {
  const apiBase =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_WEATHER_API_URL) ||
    "https://wttr.in";
  const [citiesData, setCitiesData] = useState(WEATHER_DATA);
  const [activeCityId, setActiveCityId] = useState("delhi");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unitMode, setUnitMode] = useState("both");

  const activeCity = citiesData[activeCityId] || citiesData.delhi || WEATHER_DATA.delhi;

  const fetchCityWeather = useCallback(
    async (cityName, isNewCity = false) => {
      try {
        const formattedCity = cityName.trim();
        if (!formattedCity) return;
        const response = await fetch(
          `${apiBase}/${encodeURIComponent(formattedCity)}?format=%C+%t`,
        );
        if (!response.ok) throw new Error("Failed to fetch weather data");
        let text = await response.text();
        if (!text || text.includes("Unknown location") || text.includes("Sorry")) {
          throw new Error(`Could not find weather for "${cityName}"`);
        }

        let condition = "Clear";
        let tempStr = "65°F";

        if (text.trim().startsWith("<")) {
          const jsonResponse = await fetch(
            `${apiBase}/${encodeURIComponent(formattedCity)}?format=j1`,
          );
          if (!jsonResponse.ok) throw new Error("Failed to fetch weather JSON");
          const jsonData = await jsonResponse.json();
          const current = jsonData.current_condition?.[0];
          if (!current) throw new Error("Invalid weather data format");

          condition = current.weatherDesc?.[0]?.value || "Clear";
          const tempC = current.temp_C || "20";
          const tempF = current.temp_F || "68";
          const isUS = navigator.language === "en-US" || navigator.languages?.includes("en-US");
          tempStr = isUS ? `+${tempF}°F` : `+${tempC}°C`;
        } else {
          const parsed = parseWttrResponse(text);
          condition = parsed.condition;
          tempStr = parsed.tempStr;
        }

        const generated = generateWeatherData(formattedCity, condition, tempStr);
        const key = formattedCity.toLowerCase().replace(/\s+/g, "");
        setCitiesData((prev) => ({
          ...prev,
          [key]: generated,
        }));
        if (isNewCity) {
          setActiveCityId(key);
        }
      } catch (err) {
        console.error(err);
        if (isNewCity) {
          setError(err.message || "Failed to fetch weather");
          setTimeout(() => setError(null), 5000);
        }
      }
    },
    [apiBase],
  );

  const handleSearch = async (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    const key = trimmedQuery.toLowerCase().replace(/\s+/g, "");
    if (citiesData[key]) {
      setActiveCityId(key);
      setSearchQuery("");
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBase}/${encodeURIComponent(trimmedQuery)}?format=%C+%t`);
      if (!response.ok) throw new Error("Failed to fetch weather data");
      let text = await response.text();
      if (!text || text.includes("Unknown location") || text.includes("Sorry")) {
        throw new Error(`Could not find weather for "${trimmedQuery}"`);
      }

      let condition = "Clear";
      let tempStr = "65°F";

      if (text.trim().startsWith("<")) {
        const jsonResponse = await fetch(
          `${apiBase}/${encodeURIComponent(trimmedQuery)}?format=j1`,
        );
        if (!jsonResponse.ok) throw new Error("Failed to fetch weather JSON");
        const jsonData = await jsonResponse.json();
        const current = jsonData.current_condition?.[0];
        if (!current) throw new Error("Invalid weather data format");

        condition = current.weatherDesc?.[0]?.value || "Clear";
        const tempC = current.temp_C || "20";
        const tempF = current.temp_F || "68";
        const isUS = navigator.language === "en-US" || navigator.languages?.includes("en-US");
        tempStr = isUS ? `+${tempF}°F` : `+${tempC}°C`;
      } else {
        const parsed = parseWttrResponse(text);
        condition = parsed.condition;
        tempStr = parsed.tempStr;
      }

      const generated = generateWeatherData(trimmedQuery, condition, tempStr);
      setCitiesData((prev) => ({
        ...prev,
        [key]: generated,
      }));
      setActiveCityId(key);
      setSearchQuery("");
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "City not found or network error.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialCities = ["Delhi", "Uttar Pradesh", "Jaipur"];
    initialCities.forEach((city) => {
      fetchCityWeather(city);
    });
  }, [fetchCityWeather]);

  const filteredCityKeys = Object.keys(citiesData).filter((key) => {
    const city = citiesData[key];
    if (!city) return false;
    return (
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.condition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return {
    citiesData,
    activeCityId,
    setActiveCityId,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    setIsSidebarOpen,
    loading,
    error,
    unitMode,
    setUnitMode,
    activeCity,
    filteredCityKeys,
    handleSearch,
  };
};

export default useWeather;
