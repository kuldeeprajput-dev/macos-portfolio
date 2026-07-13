import { useCallback, useEffect, useRef, useState } from "react";
import windowWrapper from "@hoc/windowWrapper";
import PlayerOverlay from "../components/PlayerOverlay";
import ProfileOverlay from "../components/ProfileOverlay";
import { FEATURED_SHOW } from "../../data";
import AppleTVHeaderSection from "../section/AppleTVHeaderSection";
import AppleTVSection from "../section/AppleTVSection";
import { GITHUB_USERNAME } from "@constants";

const AppleTVView = () => {
  const [activeTab, setActiveTab] = useState("watchNow");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [upNext, setUpNext] = useState(["ted_lasso"]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [profileUrl, setProfileUrl] = useState("/images/profile.webp");
  const [forwardDestination, setForwardDestination] = useState(null);

  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    // Fetch GitHub avatar dynamically
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.avatar_url) {
          setProfileUrl(data.avatar_url);
        }
      })
      .catch((err) => console.error("Error fetching avatar in AppleTVView:", err));

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const openVideo = (video) => {
    setForwardDestination(null);
    setActiveVideo(video);
  };

  const playFeatured = (video = FEATURED_SHOW) => {
    openVideo({
      title: video.title,
      url: video.videoUrl ?? video.url,
      tmdbId: video.tmdbId,
      type: video.type || "movie",
      season: video.season || 1,
      episode: video.episode || 1,
    });
  };

  const playMovie = (movie) => {
    openVideo({
      title: movie.title,
      url: movie.videoUrl,
      tmdbId: movie.tmdbId,
      type: movie.type || "movie",
      season: movie.season || 1,
      episode: movie.episode || 1,
    });
  };

  const changeEpisode = (season, episode) => {
    setActiveVideo((prev) => {
      if (!prev) return null;
      return { ...prev, season, episode };
    });
  };

  const closePlayer = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    setActiveVideo(null);
    setIsPlaying(false);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 0;
    setCurrentTime(current);
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const seekVideo = (value) => {
    if (!videoRef.current || !duration) return;
    const newTime = (value / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(value);
  };

  const skipTime = (seconds) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };

  const toggleUpNext = (id) => {
    setUpNext((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const selectTab = (tab) => {
    setForwardDestination(null);
    setActiveTab(tab);
    if (tab !== "search") setSearchQuery("");
  };

  const [showHeader, setShowHeader] = useState(true);

  const handleScrollDirection = (direction) => {
    if (direction === "down") {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  };

  useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app !== "appletv") return;

      if (activeVideo) {
        e.preventDefault();
        setForwardDestination({ type: "video", video: activeVideo });
        closePlayer();
      } else if (showProfile) {
        e.preventDefault();
        setForwardDestination({ type: "profile" });
        setShowProfile(false);
      } else if (activeTab !== "watchNow") {
        e.preventDefault();
        setForwardDestination({ type: "tab", tab: activeTab });
        setActiveTab("watchNow");
        setSearchQuery("");
      }
    };

    const handleNavForward = (e) => {
      if (e.detail?.app !== "appletv" || !forwardDestination) return;

      e.preventDefault();
      if (forwardDestination.type === "video") {
        setActiveVideo(forwardDestination.video);
      } else if (forwardDestination.type === "profile") {
        setShowProfile(true);
      } else if (forwardDestination.type === "tab") {
        setActiveTab(forwardDestination.tab);
      }
      setForwardDestination(null);
    };

    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
  }, [activeTab, activeVideo, closePlayer, forwardDestination, showProfile]);

  return (
    <div className="flex flex-col h-full w-full bg-[#f5f5f7] rounded-xl overflow-hidden select-none relative">
      <PlayerOverlay
        activeVideo={activeVideo}
        videoRef={videoRef}
        isPlaying={isPlaying}
        isMuted={isMuted}
        progress={progress}
        duration={duration}
        currentTime={currentTime}
        showControls={showControls}
        onClose={closePlayer}
        onMouseMove={handleMouseMove}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onSeek={seekVideo}
        onSkip={skipTime}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onChangeEpisode={changeEpisode}
      />
      <ProfileOverlay isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <AppleTVHeaderSection
        onProfileClick={() => {
          setForwardDestination(null);
          setShowProfile(true);
        }}
        profileUrl={profileUrl}
        showHeader={showHeader}
      />
      <AppleTVSection
        activeTab={activeTab}
        searchQuery={searchQuery}
        upNext={upNext}
        onSearch={setSearchQuery}
        onSelectTab={selectTab}
        onOpenStore={() => setActiveTab("store")}
        onPlayFeatured={playFeatured}
        onPlayMovie={playMovie}
        onToggleUpNext={toggleUpNext}
        onScrollDirection={handleScrollDirection}
      />
    </div>
  );
};

const AppleTVWindow = windowWrapper(AppleTVView, "appletv");

export default AppleTVWindow;
