import { useEffect, useRef, useState } from "react";
import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import PlayerOverlay from "../components/PlayerOverlay";
import ProfileOverlay from "../components/ProfileOverlay";
import AppleTVAboutModal from "../components/AppleTVAboutModal";
import { FEATURED_SHOW } from "../../data";
import AppleTVHeaderSection from "../section/AppleTVHeaderSection";
import AppleTVSection from "../section/AppleTVSection";
import { GITHUB_USERNAME } from "@constants";

const AppleTVView = () => {
  const { windows, setWindowData } = useWindowsStore();
  const [showAbout, setShowAbout] = useState(false);
  const [activeTab, setActiveTab] = useState("watchNow");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [upNext, setUpNext] = useState(["ted_lasso", "foundation", "severance"]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [githubProfile, setGithubProfile] = useState(null);

  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    if (windows.appletv?.data?.openAbout) {
      setShowAbout(true);
      setWindowData("appletv", { ...windows.appletv.data, openAbout: false });
    }
  }, [windows.appletv?.data?.openAbout, windows.appletv?.data, setWindowData]);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          setGithubProfile(data);
        }
      })
      .catch((err) => console.error("Error fetching avatar in desktop AppleTVView:", err));

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const openVideo = (video) => setActiveVideo(video);

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
      return {
        ...prev,
        season,
        episode,
      };
    });
  };

  const closePlayer = () => {
    if (videoRef.current) videoRef.current.pause();
    setActiveVideo(null);
    setIsPlaying(false);
  };

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

  const containerRef = useRef(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setIsCompact(entry.contentRect.width < 685);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const selectTab = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setIsSidebarOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-black/10 select-none text-gray-800 relative"
      style={{ containerType: "size" }}
    >
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
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        isCompact={isCompact}
      />
      <AppleTVSection
        activeTab={activeTab}
        searchQuery={searchQuery}
        upNext={upNext}
        isSidebarOpen={isSidebarOpen}
        onSearch={setSearchQuery}
        onSelectTab={selectTab}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onOpenStore={() => setActiveTab("store")}
        onPlayFeatured={playFeatured}
        onPlayMovie={playMovie}
        onToggleUpNext={toggleUpNext}
        isCompact={isCompact}
        githubProfile={githubProfile}
        onProfileClick={() => setShowProfile(true)}
      />
      <AppleTVAboutModal show={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
};

const AppleTVWindow = windowWrapper(AppleTVView, "appletv");

export default AppleTVWindow;
