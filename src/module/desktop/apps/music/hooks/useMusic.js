import { useState, useEffect, useRef, useCallback } from "react";
import useWindowsStore from "@store/window";
import { getCoverColor, getCoverEmoji } from "../data/musicData";

const STUNNING_ALBUM_COVERS = [
  "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1482440308425-276ad0f28b19?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1513829096999-4978602297af?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1446057032654-9d8885b7a391?w=500&auto=format&fit=crop&q=80",
];

const useMusic = () => {
  const { music, setMusicState, focusWindow } = useWindowsStore();
  const activeTrack = music.activeTrack;
  const isPlaying = music.isPlaying;
  const volume = music.volume;
  const isMuted = music.isMuted;

  const tracks = music.tracks || [];
  const setTracks = (newTracks) => setMusicState({ tracks: newTracks });
  const isShuffle = music.isShuffle;
  const setIsShuffle = (val) => setMusicState({ isShuffle: val });
  const isRepeat = music.isRepeat;
  const setIsRepeat = (val) => setMusicState({ isRepeat: val });

  const [currentTime, setCurrentTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Browse");
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sync with global audio element
  useEffect(() => {
    const audio = document.getElementById("global-music-player");
    if (!audio) return;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {
      const duration = Math.round(audio.duration);
      if (duration && !isNaN(duration) && duration !== activeTrack.duration) {
        setMusicState({ activeTrack: { ...activeTrack, duration } });
      }
    };

    setCurrentTime(audio.currentTime);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [activeTrack, setMusicState]);

  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_JIOSAAVN_API_URL ||
          "https://jiosaavn-apix.arcadopredator.workers.dev";

        if (searchQuery.trim() === "" && activeCategory === "Browse") {
          const PRELOADED_SONG_NAMES = [
            "Apna Bana Le Bhediya",
            "Zaalima Raees",
            "Phir Bhi Tumko Chaahunga Half Girlfriend",
            "Tainu Khabar Nahi Munjya",
            "Pal Pal Dil Ke Paas Title Track",
            "Jaan Nisaar Arijit",
            "Dekha Hazaro Dafaa",
            "Tere Bina Arijit",
            "Kalank Title Track",
            "Ve Maahi Kesari",
            "Aaj Se Teri",
            "O Maahi Dunki",
          ];
          const fetchPromises = PRELOADED_SONG_NAMES.map(async (name) => {
            try {
              const res = await fetch(
                `${apiBase}/api/search/songs?query=${encodeURIComponent(name)}&limit=1`,
              );
              const resultData = await res.json();
              if (
                resultData.success &&
                resultData.data &&
                resultData.data.results &&
                resultData.data.results.length > 0
              ) {
                return resultData.data.results[0];
              }
            } catch (e) {
              console.error(e);
            }
            return null;
          });
          const results = await Promise.all(fetchPromises);
          const filteredResults = results.filter(Boolean);

          const formattedTracks = filteredResults.map((track, index) => {
            const downloadUrls = track.downloadUrl || [];
            const audioUrl =
              downloadUrls.length > 0 ? downloadUrls[downloadUrls.length - 1]?.url : "";
            const images = track.image || track.album?.image || [];
            let coverUrl = "";
            if (typeof images === "string") {
              coverUrl = images;
            } else if (Array.isArray(images) && images.length > 0) {
              const lastImg = images[images.length - 1];
              coverUrl =
                typeof lastImg === "string" ? lastImg : lastImg?.url || lastImg?.link || "";
            }
            if (coverUrl && coverUrl.startsWith("http://")) {
              coverUrl = coverUrl.replace("http://", "https://");
            }
            return {
              id: track.id,
              title: track.name,
              artist:
                track.artists?.primary?.map((a) => a.name).join(", ") ||
                track.label ||
                "Unknown Artist",
              album: track.album?.name || "Single",
              duration: track.duration,
              coverColor: getCoverColor(index),
              coverText: getCoverEmoji(track.name),
              coverUrl: coverUrl,
              url: audioUrl,
              language: track.language,
            };
          });
          setTracks(formattedTracks);
          setIsLoading(false);
          return;
        }

        let query = "Bollywood Hits";
        switch (activeCategory) {
          case "Browse":
            query = "Bollywood Hits";
            break;
          case "Listen Now":
            query = "Arijit Singh Hits";
            break;
          case "Hindi Music":
            query = "New Hindi Songs";
            break;
          case "English Music":
            query = "Imagine Dragons";
            break;
          case "Recently Added":
            query = "Latest Hits";
            break;
          case "Artists":
            query = "Top Artists";
            break;
          case "Albums":
            query = "Top Albums";
            break;
          case "Songs":
            query = "Popular Songs";
            break;
          default:
            query = "Bollywood Hits";
        }
        if (searchQuery.trim() !== "") {
          query = searchQuery;
        }

        const res = await fetch(
          `${apiBase}/api/search/songs?query=${encodeURIComponent(query)}&limit=25`,
        );
        const resultData = await res.json();
        if (resultData.success && resultData.data && resultData.data.results) {
          const formattedTracks = resultData.data.results.map((track, index) => {
            const downloadUrls = track.downloadUrl || [];
            const audioUrl =
              downloadUrls.length > 0 ? downloadUrls[downloadUrls.length - 1]?.url : "";
            const images = track.image || track.album?.image || [];
            let coverUrl = "";
            if (typeof images === "string") {
              coverUrl = images;
            } else if (Array.isArray(images) && images.length > 0) {
              const lastImg = images[images.length - 1];
              coverUrl =
                typeof lastImg === "string" ? lastImg : lastImg?.url || lastImg?.link || "";
            }
            if (coverUrl && coverUrl.startsWith("http://")) {
              coverUrl = coverUrl.replace("http://", "https://");
            }
            return {
              id: track.id,
              title: track.name,
              artist:
                track.artists?.primary?.map((a) => a.name).join(", ") ||
                track.label ||
                "Unknown Artist",
              album: track.album?.name || "Single",
              duration: track.duration,
              coverColor: getCoverColor(index),
              coverText: getCoverEmoji(track.name),
              coverUrl: coverUrl,
              url: audioUrl,
              language: track.language,
            };
          });
          setTracks(formattedTracks);
        } else {
          setTracks([]);
        }
      } catch (err) {
        console.error("Failed to fetch JioSaavn tracks:", err);
        setTracks([]);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(() => {
      fetchTracks();
    }, 450);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    if (tracks.length > 0 && activeTrack.id === 0) {
      setMusicState({ activeTrack: tracks[0] });
    }
  }, [tracks, activeTrack, setMusicState]);

  const handleSelectTrack = (track) => {
    setMusicState({ activeTrack: track, isPlaying: true });
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handlePlayPause = () => {
    if (activeTrack.url) {
      setMusicState({ isPlaying: !isPlaying });
    }
  };

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;
    let nextTrack;
    if (isShuffle) {
      const randIdx = Math.floor(Math.random() * tracks.length);
      nextTrack = tracks[randIdx];
    } else {
      const currentIdx = tracks.findIndex((t) => t.id === activeTrack.id);
      if (currentIdx === -1) {
        nextTrack = tracks[0];
      } else {
        nextTrack = tracks[(currentIdx + 1) % tracks.length];
      }
    }
    setMusicState({ activeTrack: nextTrack, isPlaying: true });
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [tracks, activeTrack, isShuffle, setMusicState]);

  const handlePrev = useCallback(() => {
    if (tracks.length === 0) return;
    const currentIdx = tracks.findIndex((t) => t.id === activeTrack.id);
    const prevIdx =
      currentIdx === -1
        ? tracks.length - 1
        : (currentIdx - 1 + tracks.length) % tracks.length;
    setMusicState({ activeTrack: tracks[prevIdx], isPlaying: true });
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [tracks, activeTrack, setMusicState]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleProgressChange = (e) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return {
    tracks,
    setTracks,
    activeTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    setCurrentTime,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
    isLoading,
    audioRef,
    searchInputRef,
    handleTimeUpdate: () => {},
    handleLoadedMetadata: () => {},
    handleAudioEnded: () => {},
    handleSelectTrack,
    handlePlayPause,
    handleNext,
    handlePrev,
    formatTime,
    handleProgressChange,
    focusWindow,
    setMusicState,
  };
};

export default useMusic;
