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
    <div className="absolute inset-0 bg-zinc-50 text-zinc-800 z-40 flex flex-col justify-between p-5 pb-8 animate-fade-in h-full overflow-hidden select-none">
      {/* 1. Full-screen Video Background Simulating Remote Stream */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {activeCall.type === "video" && !cameraMuted && activeCall.status === "connected" ? (
          <img
            src="/images/facetime_call_preview.webp"
            alt="Active Video Call Stream"
            className="w-full h-full object-cover brightness-[0.95]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100 via-zinc-50 to-emerald-50" />
        )}
      </div>

      {/* 2. Top Header Info Overlay */}
      <div className="z-10 w-full flex flex-col items-center pt-6 text-center space-y-1">
        <div className="flex items-center gap-1.5 bg-white/65 backdrop-blur-xl border border-zinc-200/50 px-3 py-1 rounded-full shadow-sm">
          <span className="w-1.5 h-1.5 bg-[#30d158] rounded-full animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest text-zinc-650 uppercase">
            FaceTime {activeCall.type === "video" ? "Video" : "Audio"}
          </span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 mt-2 drop-shadow-sm">
          {activeCall.name}
        </h2>
        <div className="text-xs text-zinc-500 font-medium tracking-wide">
          {activeCall.status === "ringing" ? (
            <span className="animate-pulse">Ringing...</span>
          ) : (
            <span className="tabular-nums font-bold text-zinc-700 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">
              {formatTimer(callTimer)}
            </span>
          )}
        </div>
      </div>

      {/* 3. Floating User PIP (Picture in Picture) Mock */}
      {activeCall.status === "connected" && activeCall.type === "video" && (
        <div className="absolute top-24 right-5 w-20 h-28 bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden z-20 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95">
          {cameraMuted ? (
            <VideoOff className="w-5 h-5 text-zinc-400" />
          ) : (
            <div className="w-full h-full relative">
              <img
                src="/images/profile.webp"
                alt="Self Camera Preview"
                className="w-full h-full object-cover brightness-[0.9]"
              />
              <span className="text-[8px] text-white bg-black/60 px-1 py-0.5 rounded font-extrabold tracking-wider absolute bottom-2 left-2 select-none">
                Me
              </span>
            </div>
          )}
        </div>
      )}

      {/* Center avatar/indicator for audio calls or paused cameras */}
      {(activeCall.type === "audio" || cameraMuted || activeCall.status === "ringing") && (
        <div className="z-10 flex-1 flex flex-col items-center justify-center">
          {activeCall.avatar ? (
            <img
              src={activeCall.avatar}
              alt={activeCall.name}
              className="w-24 h-24 rounded-full object-cover shadow-2xl border border-white"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-100 text-zinc-700 flex items-center justify-center font-extrabold text-2xl uppercase shadow-xl border border-zinc-200">
              {activeCall.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
          {cameraMuted && activeCall.type === "video" && (
            <span className="text-[10px] text-red-500 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full font-bold mt-4 shadow-sm">
              Camera Off
            </span>
          )}
        </div>
      )}

      {/* Spacer to align layout when center content is not active */}
      {!(activeCall.type === "audio" || cameraMuted || activeCall.status === "ringing") && (
        <div className="flex-1" />
      )}

      {/* 4. Bottom Controls Bar Overlay */}
      <div className="z-10 w-full max-w-[340px] mx-auto bg-white/70 border border-zinc-200 backdrop-blur-2xl px-5 py-4 rounded-[28px] shadow-xl flex items-center justify-between shrink-0">
        {/* Toggle Mic */}
        <button
          onClick={onMicToggle}
          disabled={activeCall.status !== "connected"}
          className={`p-3.5 rounded-full transition-all active:scale-90 disabled:opacity-30 flex items-center justify-center ${
            micMuted ? "bg-zinc-200 text-zinc-950" : "bg-zinc-100 hover:bg-zinc-150 text-zinc-700"
          }`}
          title={micMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {micMuted ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
        </button>

        {/* Toggle Camera */}
        <button
          onClick={onCameraToggle}
          disabled={activeCall.type !== "video" || activeCall.status !== "connected"}
          className={`p-3.5 rounded-full transition-all active:scale-90 disabled:opacity-30 flex items-center justify-center ${
            cameraMuted
              ? "bg-zinc-200 text-zinc-950"
              : "bg-zinc-100 hover:bg-zinc-150 text-zinc-700"
          }`}
          title={cameraMuted ? "Start Camera" : "Pause Camera"}
        >
          {cameraMuted ? <VideoOff className="w-4.5 h-4.5" /> : <Video className="w-4.5 h-4.5" />}
        </button>

        {/* Toggle Speaker */}
        <button
          onClick={onSpeakerToggle}
          className={`p-3.5 rounded-full transition-all active:scale-90 flex items-center justify-center ${
            speakerMuted
              ? "bg-zinc-200 text-zinc-950"
              : "bg-zinc-100 hover:bg-zinc-150 text-zinc-700"
          }`}
          title={speakerMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {speakerMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
        </button>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="p-3.5 bg-[#ff3b30] hover:bg-[#e03025] text-white rounded-full transition-all active:scale-90 shadow-lg shadow-red-500/20 flex items-center justify-center"
          title="End Call"
        >
          <PhoneOff className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
};

export default CallInProgress;
