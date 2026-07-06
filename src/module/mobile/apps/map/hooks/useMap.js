import { useState } from "react";
import PRESET_PLACES from "../data";

const useMap = () => {
  const nominatimApiBase =
    process.env.NEXT_PUBLIC_NOMINATIM_API_URL || "https://nominatim.openstreetmap.org";
  const openStreetMapBase =
    process.env.NEXT_PUBLIC_OPENSTREETMAP_URL || "https://www.openstreetmap.org";

  const [activeTab, setActiveTab] = useState("explore");
  const [activeKey, setActiveKey] = useState("mumbai");
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapStyle, setMapStyle] = useState("standard");
  const [customPlace, setCustomPlace] = useState(null);

  const currentCity =
    activeKey === "custom" && customPlace
      ? customPlace
      : PRESET_PLACES[activeKey] || PRESET_PLACES.mumbai;

  const handleZoom = (direction) => {
    if (direction === "in") {
      setZoomLevel((prev) => Math.max(0.1, prev - 0.15));
    } else {
      setZoomLevel((prev) => Math.min(4, prev + 0.15));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `${nominatimApiBase}/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        const bbox = result.boundingbox;
        const display = result.display_name;

        const newPlace = {
          name: display.split(",")[0],
          region: display.split(",").slice(1, 3).join(",").trim(),
          desc: display,
          lat: lat,
          lon: lon,
          bboxWidth: Math.max(0.01, Math.abs(parseFloat(bbox[3]) - parseFloat(bbox[2]))),
          weather: `${Math.floor(Math.random() * 15) + 15}°C • Searched Location`,
          landmarks: ["Local Destination", "Searched Coordinates"],
          steps: [
            `Navigate toward coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}.`,
            "Follow arterial routes to final waypoint.",
            `Arrive in ${display.split(",")[0]}.`,
          ],
        };

        setCustomPlace(newPlace);
        setActiveKey("custom");
        setZoomLevel(1);
      } else {
        alert("Location not found. Try another search.");
      }
    } catch (err) {
      console.error(err);
      alert("Error querying maps search API. Please try again.");
    }
  };

  const bboxWidth = currentCity.bboxWidth * zoomLevel;
  const minLon = currentCity.lon - bboxWidth;
  const maxLon = currentCity.lon + bboxWidth;
  const minLat = currentCity.lat - bboxWidth * 0.6;
  const maxLat = currentCity.lat + bboxWidth * 0.6;

  const iframeSrc = `${openStreetMapBase}/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${currentCity.lat}%2C${currentCity.lon}`;

  const filteredKeys = Object.keys(PRESET_PLACES).filter((key) => {
    const city = PRESET_PLACES[key];
    return (
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.region.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return {
    activeTab,
    activeKey,
    searchQuery,
    zoomLevel,
    mapStyle,
    customPlace,
    currentCity,
    iframeSrc,
    filteredKeys,
    PRESET_PLACES,
    setActiveTab,
    setActiveKey,
    setSearchQuery,
    setZoomLevel,
    setMapStyle,
    setCustomPlace,
    handleZoom,
    handleSearch,
  };
};

export default useMap;
