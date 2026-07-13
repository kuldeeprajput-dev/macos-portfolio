"use client";

import { useEffect, useRef, useCallback } from "react";
import useWindowsStore from "@store/window";

const colors = [
  "from-indigo-600 to-pink-500",
  "from-yellow-400 to-amber-600",
  "from-red-600 to-rose-900",
  "from-zinc-500 to-slate-700",
  "from-neutral-900 to-zinc-950",
  "from-blue-600 to-indigo-950",
  "from-orange-500 to-amber-500",
  "from-emerald-500 to-teal-700",
];

const emojis = ["🌌", "🤖", "🕶️", "☁️", "✖️", "✨", "🪕", "🪈", "🥁", "🎵", "🎸", "🎹", "🎶"];

const getCoverColor = (index) => colors[index % colors.length];

const getCoverEmoji = (name) => {
  const code = (name && name.charCodeAt(0)) || 0;
  return emojis[code % emojis.length];
};

export default function GlobalAudio() {
  const { music, setMusicState } = useWindowsStore();
  const { activeTrack, isPlaying, volume, isMuted, tracks, isShuffle, isRepeat } = music;
  const audioRef = useRef(null);
  const prevUrlRef = useRef("");

  // Fetch initial tracks on load if none exist
  useEffect(() => {
    const fetchInitialTracks = async () => {
      try {
        const clientId = process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID;
        const res = await fetch(
          `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=25&tags=pop&order=popularity_total_desc`,
        );
        const data = await res.json();

        if (data.headers && data.headers.status === "success" && data.results) {
          const formattedTracks = data.results.map((track, index) => {
            let coverUrl = track.album_image || track.image || "";
            if (coverUrl && coverUrl.startsWith("http://")) {
              coverUrl = coverUrl.replace("http://", "https://");
            }
            return {
              id: track.id,
              title: track.name,
              artist: track.artist_name || "Unknown Artist",
              album: track.album_name || "Single",
              duration: track.duration,
              coverColor: getCoverColor(index),
              coverText: getCoverEmoji(track.name),
              coverUrl: coverUrl,
              url: track.audio,
              language: "English",
            };
          });

          if (formattedTracks.length > 0) {
            setMusicState({
              tracks: formattedTracks,
            });
            // Also set the first track as active if none is selected
            if (activeTrack.id === 0) {
              setMusicState({
                activeTrack: formattedTracks[0],
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch initial tracks:", err);
      }
    };

    if (!tracks || tracks.length === 0) {
      fetchInitialTracks();
    }
  }, [setMusicState, tracks, activeTrack.id]);

  // Sync play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrack.url) return;

    if (prevUrlRef.current !== activeTrack.url) {
      prevUrlRef.current = activeTrack.url;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== "AbortError") {
            console.log("Audio playback blocked or interrupted:", err);
            setMusicState({ isPlaying: false });
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, activeTrack.url, setMusicState]);

  // Sync volume and mute state
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Handle track end
  const handleEnded = () => {
    const audio = audioRef.current;
    if (isRepeat) {
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((err) => console.log(err));
      }
    } else {
      handleNext();
    }
  };

  const handleNext = useCallback(() => {
    if (!tracks || tracks.length === 0) return;
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
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
    }
  }, [tracks, activeTrack, isShuffle, setMusicState]);

  const handlePrev = useCallback(() => {
    if (!tracks || tracks.length === 0) return;
    const currentIdx = tracks.findIndex((t) => t.id === activeTrack.id);
    const prevIdx =
      currentIdx === -1 ? tracks.length - 1 : (currentIdx - 1 + tracks.length) % tracks.length;
    setMusicState({ activeTrack: tracks[prevIdx], isPlaying: true });
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
    }
  }, [tracks, activeTrack, setMusicState]);

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      const duration = Math.round(audio.duration);
      if (duration && !isNaN(duration) && duration !== activeTrack.duration) {
        setMusicState({ activeTrack: { ...activeTrack, duration } });
      }
    }
  };

  // Wire up window custom event listeners for global controls
  useEffect(() => {
    const onNext = () => handleNext();
    const onPrev = () => handlePrev();
    window.addEventListener("macos-portfolio-next-track", onNext);
    window.addEventListener("macos-portfolio-prev-track", onPrev);
    return () => {
      window.removeEventListener("macos-portfolio-next-track", onNext);
      window.removeEventListener("macos-portfolio-prev-track", onPrev);
    };
  }, [handleNext, handlePrev]);

  return (
    <audio
      ref={audioRef}
      id="global-music-player"
      src={activeTrack?.url || null}
      onEnded={handleEnded}
      onLoadedMetadata={handleLoadedMetadata}
      preload="auto"
      style={{ display: "none" }}
    />
  );
}
