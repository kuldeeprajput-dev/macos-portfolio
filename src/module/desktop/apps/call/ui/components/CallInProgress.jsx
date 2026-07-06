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
  return (
    <div className="absolute inset-0 bg-neutral-950 text-white z-40 flex flex-col justify-between overflow-hidden select-none h-full rounded-b-xl">
      {/* Full-screen Background Stream or Dynamic Gradient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {activeCall.type === "video" && !cameraMuted && activeCall.status === "connected" ? (
          <img
            src={activeCall.callPreview || "/images/facetime_call_preview.webp"}
            alt="Active Video Call Stream"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.8] animate-fade-in"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-linear-to-tr ${activeCall.avatarColor || "from-neutral-900 via-zinc-900 to-indigo-950"}`}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl" />
          </div>
        )}
      </div>

      {/* Top Header Overlay */}
      <div className="z-10 w-full flex flex-col items-center pt-8 text-center select-none pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1 rounded-full backdrop-blur-xl shadow-lg">
          <span
            className={`w-1.5 h-1.5 rounded-full ${activeCall.status === "ringing" ? "bg-yellow-400 animate-ping" : "bg-emerald-500 animate-pulse"}`}
          />
          <span className="text-[10px] font-bold tracking-widest text-white/75 uppercase">
            FaceTime {activeCall.type === "video" ? "Video" : "Audio"}
          </span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white mt-3 drop-shadow-md">
          {activeCall.name}
        </h2>
        <div className="text-xs font-semibold tracking-wide text-white/60 mt-1">
          {activeCall.status === "ringing" ? (
            <span className="animate-pulse">Ringing...</span>
          ) : (
            <span className="tabular-nums bg-white/10 border border-white/10 px-2 py-0.5 rounded-md backdrop-blur-md">
              {formatTimer(callTimer)}
            </span>
          )}
        </div>
      </div>

      {/* Center Avatar Content (For audio calls or inactive cameras) */}
      {(activeCall.type === "audio" || cameraMuted || activeCall.status === "ringing") && (
        <div className="z-10 flex-1 flex flex-col items-center justify-center">
          <div className="relative group">
            <div className="absolute -inset-4 rounded-full bg-blue-500/20 blur-xl group-hover:bg-blue-500/30 transition duration-1000 animate-pulse animate-duration-1000" />
            {activeCall.avatar ? (
              <img
                src={activeCall.avatar}
                alt={activeCall.name}
                className="w-28 h-28 rounded-full object-cover shadow-2xl border-2 border-white/20 relative z-10 transition duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-linear-to-tr from-slate-700 to-slate-800 text-white flex items-center justify-center font-bold text-3xl uppercase shadow-2xl border-2 border-white/20 relative z-10">
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

          {/* Animated Wave visualizer */}
          {activeCall.status === "connected" && !micMuted && (
            <div className="flex items-center gap-2 h-10 mt-6">
              {[1, 2, 3, 4, 5, 6, 7].map((idx) => (
                <span
                  key={idx}
                  className="w-2 rounded-full bg-linear-to-t from-blue-500 to-cyan-400 animate-pulse"
                  style={{
                    height: `${Math.sin(idx) * 16 + 24}px`,
                    animationDelay: `${idx * 150}ms`,
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

      {/* Picture-in-Picture Local Camera Preview (PIP) */}
      {activeCall.status === "connected" && activeCall.type === "video" && (
        <div className="absolute bottom-28 right-6 w-24 h-36 bg-neutral-900/60 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 flex flex-col items-center justify-center backdrop-blur-md hover:scale-105 hover:border-white/20 transition-all duration-300">
          {cameraMuted ? (
            <VideoOff className="w-5 h-5 text-neutral-500" />
          ) : (
            <div className="w-full h-full relative">
              <img
                src="/images/profile.webp"
                alt="Self Camera Preview"
                className="w-full h-full object-cover brightness-[0.95]"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white/95 uppercase font-black tracking-wider select-none pointer-events-none">
                Me
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Controls Panel */}
      <div className="z-10 w-full max-w-[360px] mx-auto bg-neutral-900/65 border border-white/10 backdrop-blur-2xl px-6 py-4 rounded-[32px] shadow-2xl flex items-center justify-between mb-8 shrink-0 transition-all hover:bg-neutral-900/70">
        {/* Toggle Mic */}
        <button
          onClick={onMicToggle}
          disabled={activeCall.status !== "connected"}
          className={`p-3.5 rounded-full transition-all duration-200 active:scale-90 disabled:opacity-30 flex items-center justify-center ${
            micMuted
              ? "bg-red-650 text-white shadow-lg shadow-red-650/20"
              : "bg-white/10 hover:bg-white/20 text-neutral-100"
          }`}
          title={micMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {micMuted ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
        </button>

        {/* Toggle Camera */}
        <button
          onClick={onCameraToggle}
          disabled={activeCall.type !== "video" || activeCall.status !== "connected"}
          className={`p-3.5 rounded-full transition-all duration-200 active:scale-90 disabled:opacity-30 flex items-center justify-center ${
            cameraMuted
              ? "bg-red-650 text-white shadow-lg shadow-red-650/20"
              : "bg-white/10 hover:bg-white/20 text-neutral-100"
          }`}
          title={cameraMuted ? "Start Camera" : "Pause Camera"}
        >
          {cameraMuted ? <VideoOff className="w-4.5 h-4.5" /> : <Video className="w-4.5 h-4.5" />}
        </button>

        {/* Toggle Speaker */}
        <button
          onClick={onSpeakerToggle}
          className={`p-3.5 rounded-full transition-all duration-200 active:scale-90 flex items-center justify-center ${
            speakerMuted
              ? "bg-red-650 text-white shadow-lg shadow-red-650/20"
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
