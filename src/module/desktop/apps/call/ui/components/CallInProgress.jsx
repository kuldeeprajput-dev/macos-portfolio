import { useState, useEffect } from "react";
import { User, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, PhoneOff } from "lucide-react";

const CallInProgress = ({
  activeCall,
  callTimer,
  micMuted,
  cameraMuted,
  speakerMuted,
  onMicToggle,
  onCameraToggle,
  onSpeakerToggle,
  onEndCall,
  formatTimer,
}) => {
  const [videoError, setVideoError] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState("/images/profile.webp");

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

  const isKuldeep = activeCall.name?.toLowerCase().includes("kuldeep");
  const isBhavesh = activeCall.name?.toLowerCase().includes("bhavesh");
  const isMahabub = activeCall.name?.toLowerCase().includes("mahabub");
  const videoUrl = isKuldeep
    ? process.env.NEXT_PUBLIC_VIDEOCALL_KULDEEPRAJPUT
    : isBhavesh
      ? process.env.NEXT_PUBLIC_VIDEOCALL_BHAVESH_KUMAR
      : isMahabub
        ? process.env.NEXT_PUBLIC_VIDEOCALL_MAHABUB
        : "";
  const showVideo = (isKuldeep || isBhavesh || isMahabub) && videoUrl && !videoError;

  return (
    <div className="absolute inset-0 bg-neutral-950 text-white z-40 flex flex-col justify-between overflow-hidden select-none h-full rounded-b-xl group">
      {/* Full-screen Background Stream or Dynamic Gradient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Play video element */}
        {activeCall.status === "connected" && showVideo && (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted={speakerMuted}
            playsInline
            onError={() => setVideoError(true)}
            className={
              activeCall.type === "video" && !cameraMuted
                ? "absolute inset-0 w-full h-full object-cover brightness-[0.8] animate-fade-in"
                : "absolute w-0 h-0 opacity-0 pointer-events-none"
            }
          />
        )}
        {!(
          activeCall.type === "video" &&
          !cameraMuted &&
          activeCall.status === "connected" &&
          showVideo
        ) && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1e] via-[#0d0d0e] to-[#121214]">
            {/* Subtle floating ambient light radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_60%)]" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl" />
          </div>
        )}
      </div>

      {/* Top Header Overlay */}
      <div
        className={`z-10 w-full flex flex-col items-center pt-8 text-center select-none transition-all duration-300 ${
          activeCall.type === "video"
            ? "opacity-0 group-hover:opacity-100 pointer-events-none"
            : "opacity-100 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1.5 bg-black/45 border border-white/10 px-3.5 py-1 rounded-full backdrop-blur-xl shadow-lg pointer-events-auto">
          <span
            className={`w-1.5 h-1.5 rounded-full ${activeCall.status === "ringing" ? "bg-yellow-500 animate-pulse" : "bg-emerald-500 animate-pulse"}`}
          />
          <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase">
            FaceTime {activeCall.type === "video" ? "Video" : "Audio"}
          </span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white mt-3 drop-shadow-md pointer-events-auto">
          {activeCall.name}
        </h2>
        <div className="text-xs font-medium tracking-wide text-white/50 mt-1 pointer-events-auto">
          {activeCall.status === "ringing" ? (
            <span className="animate-pulse">Ringing...</span>
          ) : (
            <span className="tabular-nums bg-white/10 border border-white/10 px-2 py-0.5 rounded-md backdrop-blur-md text-white/80">
              {formatTimer(callTimer)}
            </span>
          )}
        </div>
      </div>

      {/* Center Avatar Content (For audio calls or ringing/inactive cameras in video calls) */}
      {(activeCall.type === "audio" || cameraMuted || activeCall.status === "ringing") && (
        <div className="z-10 flex-1 flex flex-col items-center justify-center">
          <div className="relative group flex items-center justify-center">
            {activeCall.status === "ringing" ? (
              <>
                <div
                  className="absolute w-28 h-28 rounded-full border border-white/25 animate-ping opacity-75"
                  style={{ animationDuration: "2s" }}
                />
                <div
                  className="absolute w-28 h-28 rounded-full border border-white/15 animate-ping opacity-45"
                  style={{ animationDuration: "2.8s", animationDelay: "0.4s" }}
                />
                <div
                  className="absolute w-28 h-28 rounded-full border border-white/5 animate-ping opacity-20"
                  style={{ animationDuration: "3.6s", animationDelay: "0.8s" }}
                />
                <div className="absolute -inset-4 rounded-full bg-white/5 blur-xl animate-pulse" />
              </>
            ) : (
              <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
            )}

            {activeCall.avatar ? (
              <img
                src={activeCall.avatar}
                alt={activeCall.name}
                className="w-28 h-28 rounded-full object-cover shadow-2xl border-2 border-white/20 relative z-10 transition duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 text-white flex items-center justify-center font-bold text-3xl uppercase shadow-2xl border-2 border-white/20 relative z-10">
                {activeCall.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
          </div>
          {cameraMuted && activeCall.type === "video" && (
            <span className="text-[10px] text-red-400 bg-red-950/60 border border-red-500/30 px-3 py-1 rounded-full font-bold mt-4 backdrop-blur-md shadow-lg">
              Camera Paused
            </span>
          )}

          {/* Animated Gray Wave visualizer */}
          {activeCall.status === "connected" && !micMuted && (
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
      {!(activeCall.type === "audio" || cameraMuted || activeCall.status === "ringing") && (
        <div className="flex-1" />
      )}

      {/* Bottom Controls Panel */}
      <div
        className={`z-10 w-full mx-auto bg-neutral-900/65 border border-white/10 backdrop-blur-2xl px-6 py-4 rounded-[32px] shadow-2xl flex items-center justify-between mb-8 shrink-0 transition-all hover:bg-neutral-900/70 transition-opacity duration-300 ${
          activeCall.type === "video"
            ? "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto max-w-[325px]"
            : "opacity-100 max-w-[250px]"
        }`}
      >
        {/* Toggle Mic */}
        <button
          onClick={onMicToggle}
          disabled={activeCall.status !== "connected"}
          className={`p-3.5 rounded-full transition-all duration-200 active:scale-90 disabled:opacity-30 flex items-center justify-center ${
            micMuted
              ? "bg-[#ff3b30] text-white shadow-lg shadow-red-500/20"
              : "bg-white/10 hover:bg-white/20 text-neutral-100"
          }`}
          title={micMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {micMuted ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
        </button>

        {/* Toggle Camera (Only for video calls) */}
        {activeCall.type === "video" && (
          <button
            onClick={onCameraToggle}
            disabled={activeCall.status !== "connected"}
            className={`p-3.5 rounded-full transition-all duration-200 active:scale-90 disabled:opacity-30 flex items-center justify-center ${
              cameraMuted
                ? "bg-[#ff3b30] text-white shadow-lg shadow-red-500/20"
                : "bg-white/10 hover:bg-white/20 text-neutral-100"
            }`}
            title={cameraMuted ? "Start Camera" : "Pause Camera"}
          >
            {cameraMuted ? <VideoOff className="w-4.5 h-4.5" /> : <Video className="w-4.5 h-4.5" />}
          </button>
        )}

        {/* Toggle Speaker */}
        <button
          onClick={onSpeakerToggle}
          className={`p-3.5 rounded-full transition-all duration-200 active:scale-90 flex items-center justify-center ${
            speakerMuted
              ? "bg-[#ff3b30] text-white shadow-lg shadow-red-500/20"
              : "bg-white/10 hover:bg-white/20 text-neutral-100"
          }`}
          title={speakerMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {speakerMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
        </button>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="p-3.5 bg-[#ff3b30] hover:bg-[#e03025] text-white rounded-full transition-all duration-200 active:scale-90 shadow-lg shadow-red-500/20 flex items-center justify-center"
          title="End Call"
        >
          <PhoneOff className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
};

export default CallInProgress;
