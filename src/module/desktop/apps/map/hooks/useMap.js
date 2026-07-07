import { useState } from "react";
import PRESET_PLACES from "../data/mapData";

const useMap = () => {
  const nominatimApiBase =
    process.env.NEXT_PUBLIC_NOMINATIM_API_URL || "https://nominatim.openstreetmap.org";

  const [activeTab, setActiveTab] = useState("explore");
  const [activeKey, setActiveKey] = useState("mumbai");
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(13);
  const [mapStyle, setMapStyle] = useState("standard");
  const [customPlace, setCustomPlace] = useState(null);

  const currentCity =
    activeKey === "custom" && customPlace
      ? customPlace
      : PRESET_PLACES[activeKey] || PRESET_PLACES.mumbai;

  const handleZoom = (direction) => {
    if (direction === "in") {
      setZoomLevel((prev) => Math.min(20, prev + 1));
    } else {
      setZoomLevel((prev) => Math.max(1, prev - 1));
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
        setZoomLevel(13);
      } else {
        alert("Location not found. Try another search.");
      }
    } catch (err) {
      console.error(err);
      alert("Error querying maps search API. Please try again.");
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `${nominatimApiBase}/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();

          let name = "Current Location";
          if (data && data.address) {
            name =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.county ||
              name;
          }

          const newPlace = {
            name: name,
            region: data?.address?.state || "Local",
            desc: data?.display_name || "Your precise location.",
            lat: latitude,
            lon: longitude,
            bboxWidth: 0.1,
            weather: `${Math.floor(Math.random() * 15) + 15}°C • Current Location`,
            landmarks: ["Your Location", "Device GPS"],
            steps: [
              `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}.`,
              "You are here.",
            ],
          };

          setCustomPlace(newPlace);
          setActiveKey("custom");
          setZoomLevel(15);
        } catch (err) {
          console.error(err);
          // Fallback if reverse geocoding fails
          setCustomPlace({
            name: "Current Location",
            region: "Unknown",
            desc: "Your precise location.",
            lat: latitude,
            lon: longitude,
            bboxWidth: 0.1,
            weather: `20°C • Current Location`,
            landmarks: ["Device GPS"],
            steps: ["You are here."],
          });
          setActiveKey("custom");
          setZoomLevel(15);
        }
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location. Please check browser permissions.");
      },
    );
  };

  const mapType = mapStyle === "satellite" ? "k" : "m";
  const iframeSrc = `https://maps.google.com/maps?q=${currentCity.lat},${currentCity.lon}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

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
    handleLocateMe,
  };
};

export default useMap;
