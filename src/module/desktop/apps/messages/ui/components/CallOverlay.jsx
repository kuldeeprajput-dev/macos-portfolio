import { Mic, MicOff, Video, VideoOff, PhoneOff, Smile } from "lucide-react";

const CallOverlay = ({
  callState,
  callDuration,
  activeChat,
  onMicToggle,
  onCameraToggle,
  onEndCall,
  formatCallTime,
}) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1e] via-[#0d0d0e] to-[#121214] text-white z-40 flex flex-col items-center justify-between py-10 px-6 animate-fade-in">
      <div className="text-center mt-4">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
          FaceTime {callState.type === "video" ? "Video" : "Audio"}
        </span>
        <h2 className="text-2xl font-bold mt-1 text-white">{activeChat.name}</h2>
        <p className="text-sm text-neutral-300 mt-1">
          {callState.status === "ringing" ? "Ringing..." : formatCallTime(callDuration)}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full relative">
        {callState.type === "video" ? (
          <div className="w-full h-full max-h-[260px] max-w-[400px] bg-neutral-900 rounded-2xl relative overflow-hidden border border-white/10 shadow-inner flex items-center justify-center">
            {callState.cameraOff ? (
              <div className="text-neutral-500 flex flex-col items-center gap-2">
                <VideoOff className="w-10 h-10" />
                <span className="text-sm">Camera Off</span>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-tr from-neutral-800 via-indigo-950 to-neutral-900 animate-pulse opacity-60" />
                <div
                  className={`w-20 h-20 rounded-full overflow-hidden z-10 shadow-lg relative flex items-center justify-center bg-gray-50 border border-gray-100/20 ${callState.status === "ringing" ? "animate-pulse" : ""}`}
                >
                  {activeChat.avatar ? (
                    <img
                      src={activeChat.avatar}
                      alt={activeChat.name}
                      className={`w-full h-full object-cover ${activeChat.id === "apple" ? "p-4.5 bg-gray-100 object-contain" : ""}`}
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center text-white font-bold text-2xl ${activeChat.avatarColor}`}
                    >
                      {activeChat.initials}
                    </div>
                  )}
                </div>
                {callState.status !== "ringing" && (
                  <div className="w-20 h-20 rounded-full overflow-hidden z-10 shadow-lg relative flex items-center justify-center bg-gray-50 border border-gray-100/20">
                    {activeChat.avatar ? (
                      <img
                        src={activeChat.avatar}
                        alt={activeChat.name}
                        className={`w-full h-full object-cover ${activeChat.id === "apple" ? "p-4.5 bg-gray-100 object-contain" : ""}`}
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center text-white font-bold text-2xl ${activeChat.avatarColor}`}
                      >
                        {activeChat.initials}
                      </div>
                    )}
                  </div>
                )}
                <div className="absolute bottom-3 right-3 w-20 h-28 bg-neutral-800 rounded-lg border border-white/20 shadow-md flex flex-col items-center justify-center overflow-hidden">
                  <span className="text-[10px] text-neutral-400 absolute bottom-1">You</span>
                  <Smile className="w-6 h-6 text-neutral-400 opacity-60" />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="relative col-center flex flex-col items-center justify-center">
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
              <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-xl animate-pulse animate-duration-2000" />
            )}

            <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl relative z-10 flex items-center justify-center bg-gray-50 border border-gray-100/20">
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
            {callState.status === "connected" && (
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
      </div>

      <div className="flex items-center gap-6 mb-4">
        <button
          onClick={onMicToggle}
          className={`p-4 rounded-full border border-white/10 transition-colors ${
            callState.micMuted
              ? "bg-red-600 text-white"
              : "bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200"
          }`}
          title={callState.micMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {callState.micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <button
          onClick={onEndCall}
          className="p-5 bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white rounded-full shadow-lg"
          title="End Call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
        {callState.type === "video" && (
          <button
            onClick={onCameraToggle}
            className={`p-4 rounded-full border border-white/10 transition-colors ${
              callState.cameraOff
                ? "bg-red-600 text-white"
                : "bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200"
            }`}
            title={callState.cameraOff ? "Turn Camera On" : "Turn Camera Off"}
          >
            {callState.cameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CallOverlay;
