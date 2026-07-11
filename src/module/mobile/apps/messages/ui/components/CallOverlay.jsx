import { useState, useEffect } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

const CallOverlay = ({
  callState,
  callDuration,
  activeChat,
  onMicToggle,
  onCameraToggle,
  onEndCall,
  formatCallTime,
}) => {
  const [profileAvatar, setProfileAvatar] = useState("/images/profile.webp");
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const githubProfileUrl = process.env.NEXT_PUBLIC_GITHUB_PROFILE || "";
    const username = githubProfileUrl
      ? githubProfileUrl.replace(/\/+$/, "").split("/").pop()
      : "kuldeeprajput-dev";

    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.avatar_url) {
          setProfileAvatar(data.avatar_url);
        }
      })
      .catch((err) => console.error("Error fetching profile avatar:", err));
  }, []);

  const isKuldeep = activeChat.name?.toLowerCase().includes("kuldeep");
  const isBhavesh = activeChat.name?.toLowerCase().includes("bhavesh");
  const isMahabub = activeChat.name?.toLowerCase().includes("mahabub");

  const videoUrl = isKuldeep
    ? process.env.NEXT_PUBLIC_VIDEOCALL_KULDEEPRAJPUT
    : isBhavesh
      ? process.env.NEXT_PUBLIC_VIDEOCALL_BHAVESH_KUMAR
      : isMahabub
        ? process.env.NEXT_PUBLIC_VIDEOCALL_MAHABUB
        : "";

  const showVideo = (isKuldeep || isBhavesh || isMahabub) && videoUrl && !videoError;
  return (
    <div className="absolute inset-0 bg-[#0d0d0e] text-white z-40 flex flex-col items-center justify-between py-10 px-6 animate-fade-in overflow-hidden select-none rounded-b-xl group">
      {/* Full-screen Background Stream or Dynamic Gradient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Play video element */}
        {callState.status === "connected" && showVideo && (
          <video
            src={videoUrl}
            autoPlay
            loop
            playsInline
            onError={() => setVideoError(true)}
            className={
              callState.type === "video" && !callState.cameraOff
                ? "absolute inset-0 w-full h-full object-cover brightness-[0.85] animate-fade-in"
                : "absolute w-0 h-0 opacity-0 pointer-events-none"
            }
          />
        )}
        {!(
          callState.type === "video" &&
          !callState.cameraOff &&
          callState.status === "connected" &&
          showVideo
        ) && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1e] via-[#0d0d0e] to-[#121214]" />
        )}
      </div>

      {/* Top Header Overlay */}
      <div className="z-10 w-full flex flex-col items-center pt-4 text-center select-none opacity-100 pointer-events-auto">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold drop-shadow pointer-events-auto">
          FaceTime {callState.type === "video" ? "Video" : "Audio"}
        </span>
        <h2 className="text-2xl font-bold mt-1 text-white drop-shadow-md pointer-events-auto">
          {activeChat.name}
        </h2>
        <p className="text-sm text-neutral-300 mt-1 drop-shadow pointer-events-auto">
          {callState.status === "ringing" ? "Ringing..." : formatCallTime(callDuration)}
        </p>
      </div>

      {/* Center content (for audio calls or ringing/inactive camera in video calls) */}
      {(callState.type === "audio" || callState.cameraOff || callState.status === "ringing") && (
        <div className="z-10 flex-1 flex flex-col items-center justify-center">
          <div className="relative group flex items-center justify-center">
            {callState.status === "ringing" ? (
              <>
                <div
                  className="absolute w-28 h-28 rounded-full border border-white/25 animate-ping opacity-75"
                  style={{ animationDuration: "2s" }}
                />
                <div
                  className="absolute w-28 h-28 rounded-full border border-white/15 animate-ping opacity-45"
                  style={{ animationDuration: "2.8s", animationDelay: "0.4s" }}
                />
                <div className="absolute -inset-4 rounded-full bg-white/5 blur-xl animate-pulse" />
              </>
            ) : (
              <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
            )}

            <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl border-2 border-white/20 relative z-10 flex items-center justify-center bg-gray-50">
              {activeChat.avatar ? (
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className={`w-full h-full object-cover ${activeChat.id === "apple" ? "p-6 bg-gray-100 object-contain" : ""}`}
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center text-white font-bold text-3xl ${activeChat.avatarColor}`}
                >
                  {activeChat.initials}
                </div>
              )}
            </div>
          </div>
          {callState.cameraOff && callState.type === "video" && (
            <span className="text-[10px] text-red-400 bg-red-950/60 border border-red-500/30 px-3 py-1 rounded-full font-bold mt-4 backdrop-blur-md shadow-lg">
              Camera Paused
            </span>
          )}

          {/* Animated Wave visualizer */}
          {callState.status === "connected" && !callState.micMuted && (
            <div className="flex items-end gap-1.5 h-8 mt-8 justify-center select-none">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <span
                  key={idx}
                  className="w-[3px] h-6 bg-zinc-400 rounded-full origin-bottom"
                  style={{
                    animation: "bounceVisualizer 1.2s ease-in-out infinite alternate",
                    animationDelay: `${idx * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Spacer when remote video stream is full-screen */}
      {!(callState.type === "audio" || callState.cameraOff || callState.status === "ringing") && (
        <div className="flex-1" />
      )}

      {/* Controls panel */}
      <div className="z-10 flex items-center gap-6 mb-4 opacity-100 pointer-events-auto">
        {/* Toggle Mic */}
        <button
          onClick={onMicToggle}
          className={`p-4 rounded-full border border-white/10 transition-colors ${
            callState.micMuted
              ? "bg-[#ff3b30] text-white"
              : "bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200"
          }`}
          title={callState.micMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {callState.micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Toggle Camera (Only for video calls) */}
        {callState.type === "video" && (
          <button
            onClick={onCameraToggle}
            className={`p-4 rounded-full border border-white/10 transition-colors ${
              callState.cameraOff
                ? "bg-[#ff3b30] text-white"
                : "bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200"
            }`}
            title={callState.cameraOff ? "Turn Camera On" : "Turn Camera Off"}
          >
            {callState.cameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
        )}

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="p-5 bg-[#ff3b30] hover:bg-[#e03025] active:scale-95 transition-all text-white rounded-full shadow-lg flex items-center justify-center"
          title="End Call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CallOverlay;
