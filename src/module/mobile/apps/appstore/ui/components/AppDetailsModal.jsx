import { X, Star, Shield, ArrowDown, User, Heart } from "lucide-react";
import { useState } from "react";
import { AppStoreIcon, ActionButton } from "./AppStoreCard";

const AppDetailsModal = ({ app, isOpen, onClose, installState, onStartDownload, onOpenApp }) => {
  const [expanded, setExpanded] = useState(false);

  if (!isOpen || !app) return null;

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col justify-end animate-fade-in">
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="w-full h-[90%] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border-t border-zinc-200">
        {/* Navigation Bar */}
        <div className="w-full flex justify-between items-center px-5 pt-5 pb-3 bg-zinc-50 border-b border-zinc-100 shrink-0">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
            Details
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-200 hover:bg-zinc-300 text-gray-700 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-none pb-12">
          {/* Top Header Card */}
          <div className="flex gap-4">
            <AppStoreIcon icon={app.icon} name={app.name} fallbackBg="bg-blue-500" />
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 leading-tight truncate">
                  {app.name}
                </h2>
                <p className="text-[11px] text-gray-400 font-medium truncate">{app.category}</p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{app.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5">
                  <ActionButton
                    app={app}
                    installState={installState}
                    onStartDownload={onStartDownload}
                    onOpenApp={onOpenApp}
                  />
                </div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-bold text-gray-700">{app.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 divide-x divide-zinc-100 text-center">
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Ratings
              </span>
              <span className="text-sm font-extrabold text-gray-800 flex items-center justify-center gap-0.5 mt-0.5">
                {app.rating} <Star className="w-3 h-3 fill-current text-amber-500" />
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Age
              </span>
              <span className="text-sm font-extrabold text-gray-800 block mt-0.5">4+</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Developer
              </span>
              <span className="text-sm font-extrabold text-gray-800 block mt-0.5 truncate px-1">
                {app.native ? "Apple" : "Third Party"}
              </span>
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Mock Screenshots Gallery */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-gray-900 px-1">Preview</h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 snap-x">
              <div className="w-[140px] h-[250px] bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex-shrink-0 snap-start shadow-sm border border-black/5 flex flex-col justify-between p-3 text-white">
                <span className="text-[8px] font-bold uppercase tracking-widest bg-white/20 px-1.5 py-0.5 rounded self-start">
                  Overview
                </span>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold">{app.name}</h4>
                  <p className="text-[8px] opacity-80 leading-normal">{app.desc}</p>
                </div>
              </div>
              <div className="w-[140px] h-[250px] bg-gradient-to-tr from-purple-500 to-pink-600 rounded-2xl flex-shrink-0 snap-start shadow-sm border border-black/5 flex flex-col justify-between p-3 text-white">
                <span className="text-[8px] font-bold uppercase tracking-widest bg-white/20 px-1.5 py-0.5 rounded self-start">
                  Features
                </span>
                <span className="text-[8px] font-semibold opacity-90 leading-relaxed">
                  • High Performance
                  <br />
                  • Beautiful User Interface
                  <br />• Seamless Integration
                </span>
              </div>
              <div className="w-[140px] h-[250px] bg-gradient-to-tr from-teal-500 to-emerald-600 rounded-2xl flex-shrink-0 snap-start shadow-sm border border-black/5 flex flex-col justify-between p-3 text-white">
                <span className="text-[8px] font-bold uppercase tracking-widest bg-white/20 px-1.5 py-0.5 rounded self-start">
                  Security
                </span>
                <div className="flex flex-col items-center justify-center flex-1 text-center space-y-1">
                  <Shield size={24} className="opacity-90" />
                  <span className="text-[8px] font-bold">100% Secure</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-gray-900 px-1">Description</h3>
            <div className="px-1 text-xs text-gray-600 leading-relaxed space-y-2">
              <p className={expanded ? "" : "line-clamp-3"}>
                Experience {app.name}, the ultimate utility in the {app.category} category. Built to
                be blazing fast, visually stunning, and highly responsive. Crafted specifically to
                fit within your premium iOS 18 ecosystem workflow.
              </p>
              {!expanded && (
                <button
                  onClick={() => setExpanded(true)}
                  className="text-blue-500 font-bold hover:underline cursor-pointer"
                >
                  more
                </button>
              )}
              {expanded && (
                <p className="animate-fade-in text-[11px] text-gray-500 leading-relaxed">
                  Includes advanced rendering support, rich haptic simulations, fully automated
                  offline caching, state management persistence, and low power mode optimization
                  options.
                </p>
              )}
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Ratings & Reviews */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between px-1">
              <h3 className="text-xs font-extrabold text-gray-900">Ratings & Reviews</h3>
              <span className="text-[10px] text-gray-400 font-semibold">{app.rating} out of 5</span>
            </div>

            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-gray-800">Super clean interface!</span>
                <span className="text-gray-400">2d ago</span>
              </div>
              <div className="flex text-amber-500 gap-0.5">
                <Star size={10} className="fill-current" />
                <Star size={10} className="fill-current" />
                <Star size={10} className="fill-current" />
                <Star size={10} className="fill-current" />
                <Star size={10} className="fill-current" />
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                This app runs incredibly smoothly and matches the premium macOS / iOS portfolio
                environment seamlessly. Highly recommended!
              </p>
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Detailed Info Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-gray-900 px-1">Information</h3>
            <div className="divide-y divide-zinc-100 text-xs px-1">
              <div className="flex justify-between py-2.5">
                <span className="text-gray-400 font-medium">Provider</span>
                <span className="text-gray-800 font-semibold">
                  {app.native ? "Portfolio UI Demo" : "Kuldeep Rajput"}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-400 font-medium">Size</span>
                <span className="text-gray-800 font-semibold">14.8 MB</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-400 font-medium">Category</span>
                <span className="text-gray-800 font-semibold">{app.category}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-400 font-medium">Compatibility</span>
                <span className="text-gray-800 font-semibold">Works on this device</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-400 font-medium">Languages</span>
                <span className="text-gray-800 font-semibold">English</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetailsModal;
