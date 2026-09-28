import { Video } from "lucide-react";

const CallStandbySection = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 relative overflow-hidden h-full">
    <div className="relative w-64 h-44 md:w-80 md:h-56 rounded-2xl shadow-2xl flex items-center justify-center border border-black/10 overflow-hidden bg-gradient-to-br from-slate-700 via-zinc-800 to-zinc-950">
      <img
        src="/contacts/previews/facetime_standby.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover brightness-[0.7] pointer-events-none"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-500/80 rounded-full animate-ping" />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full" />
      <div className="flex flex-col items-center justify-center space-y-2 z-10">
        <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/15 shadow-lg">
          <Video className="w-6 h-6 text-white fill-white/10" />
        </div>
        <span className="text-[9px] text-white/90 tracking-widest uppercase font-extrabold bg-black/35 px-2.5 py-0.5 rounded-full border border-white/5 backdrop-blur-xs select-none">
          Camera Standby
        </span>
      </div>
    </div>
    <div className="space-y-2 max-w-sm">
      <h3 className="text-sm font-bold text-gray-800">FaceTime</h3>
      <p className="text-xs text-gray-400 leading-relaxed">
        Call developers, assistants, and colleagues using high-fidelity FaceTime audio or video
        directly from your browser.
      </p>
    </div>
    <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1 bg-gray-200/50 px-3 py-1 rounded-full border border-gray-300/20">
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
      System ready for calls
    </div>
  </div>
);

export default CallStandbySection;
