import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  CreditCard,
  PlayCircle,
  Settings,
  HelpCircle,
  Shield,
  Gamepad2,
  Gift,
  RefreshCw,
} from "lucide-react";
import { GITHUB_USERNAME, GITHUB_PROFILE } from "@constants";

const GithubIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ProfileOverlay = ({ isOpen, onClose, appName = "appletv" }) => {
  const [profile, setProfile] = useState(null);
  const [showRedirectPrompt, setShowRedirectPrompt] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowRedirectPrompt(false);
      return;
    }

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          setProfile(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching github profile in desktop appletv:", err);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const displayName = profile?.name || "Kuldeep Rajput";
  const bio = profile?.bio || "Full Stack Developer | Building premium macOS Web Portfolios";
  const location = profile?.location || "India";
  const avatarUrl = profile?.avatar_url || "/images/profile.webp";

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-[999] flex items-center justify-center p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Centered Modal Card */}
      <div className="w-96 bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden max-h-[90%] transition-transform duration-300 animate-scale-up relative">
        {/* Header bar */}
        <div className="w-full flex justify-between items-center px-4 py-3 bg-zinc-50/80 border-b border-zinc-200/50">
          <h2 className="text-sm font-bold text-zinc-800">Account Preferences</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 thin-scrollbar">
          {/* User main info badge */}
          <div className="flex flex-col items-center text-center p-4 bg-zinc-50 border border-zinc-200/60 rounded-xl">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                onError={(e) => {
                  e.target.src = "/images/profile.webp";
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full shadow-sm">
                <Shield size={10} />
              </div>
            </div>

            <h3 className="text-sm font-bold text-zinc-800 mt-2.5">{displayName}</h3>
            <p className="text-[10px] text-blue-500 font-bold">
              @{profile?.login || GITHUB_USERNAME}
            </p>
            <p className="text-[11px] text-zinc-500 max-w-[240px] mt-1.5 leading-relaxed">{bio}</p>

            {/* Location */}
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-2.5">
              <MapPin size={10} />
              <span>{location}</span>
            </div>
          </div>

          {/* Github stats card */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-zinc-50 border border-zinc-200/60 p-2 rounded-lg">
              <span className="block text-xs font-black text-zinc-800">
                {profile?.public_repos ?? "—"}
              </span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                Repos
              </span>
            </div>
            <div className="bg-zinc-50 border border-zinc-200/60 p-2 rounded-lg">
              <span className="block text-xs font-black text-zinc-800">
                {profile?.followers ?? "—"}
              </span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                Followers
              </span>
            </div>
            <div className="bg-zinc-50 border border-zinc-200/60 p-2 rounded-lg">
              <span className="block text-xs font-black text-zinc-800">
                {profile?.following ?? "—"}
              </span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                Following
              </span>
            </div>
          </div>

          {/* Account settings options list */}
          <div className="space-y-1.5">
            <h4 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest px-1">
              Manage Account
            </h4>
            <div className="bg-white border border-zinc-200/60 rounded-xl overflow-hidden divide-y divide-zinc-200/60">
              <button
                type="button"
                onClick={() => setShowRedirectPrompt(true)}
                className="w-full flex items-center justify-between p-2.5 hover:bg-zinc-50 transition-colors text-left border-none outline-none focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-zinc-100 text-zinc-700 rounded-lg">
                    <GithubIcon size={14} />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-700">GitHub Profile</span>
                </div>
                <span className="text-[10px] text-zinc-400">View →</span>
              </button>

              {appName === "appstore" ? (
                <>
                  <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
                        <Gamepad2 size={14} />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-700">
                        Apple Arcade Subscription
                      </span>
                    </div>
                    <span className="text-[10px] text-green-600 font-bold">Active</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-pink-50 text-pink-600 rounded-lg">
                        <Gift size={14} />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-700">
                        Redeem Gift Card
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Redeem</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                        <CreditCard size={14} />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-700">
                        Account Balance
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-bold">$25.00</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                        <PlayCircle size={14} />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-700">
                        Apple TV+ Subscription
                      </span>
                    </div>
                    <span className="text-[10px] text-green-600 font-bold">Active</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                        <CreditCard size={14} />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-700">
                        Payment & Billing
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Manage</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Preferences list */}
          <div className="space-y-1.5">
            <h4 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest px-1">
              App Preferences
            </h4>
            <div className="bg-white border border-zinc-200/60 rounded-xl overflow-hidden divide-y divide-zinc-200/60">
              {appName === "appstore" ? (
                <>
                  <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                        <RefreshCw size={14} />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-700">
                        Automatic Updates
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400">On</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                        <PlayCircle size={14} />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-700">
                        Autoplay Videos
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Wi-Fi Only</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                      <Settings size={14} />
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-700">
                      Playback Quality
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Auto (4K)</span>
                </div>
              )}

              <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                    <HelpCircle size={14} />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-700">Help & Support</span>
                </div>
                <span className="text-[10px] text-zinc-400">FAQ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Finder-style Redirection Popup */}
        {showRedirectPrompt && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center z-[100] p-6 text-center animate-in fade-in duration-150">
            <div className="space-y-4 max-w-xs transform animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 bg-neutral-100 text-neutral-800 rounded-full flex items-center justify-center mx-auto shadow-inner border border-zinc-200">
                <img src="/images/github.webp" alt="GitHub" className="w-7 h-7 object-contain" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-800">Open in New Tab</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Do you want to open the GitHub profile for{" "}
                  <span className="font-semibold text-gray-700">
                    @{profile?.login || GITHUB_USERNAME}
                  </span>{" "}
                  in a new tab?
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowRedirectPrompt(false)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-zinc-200"
                >
                  Cancel
                </button>
                <a
                  href={profile?.html_url || GITHUB_PROFILE}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowRedirectPrompt(false)}
                  className="flex-1 py-2 bg-[#24292e] hover:bg-[#1f2327] active:bg-[#1a1e21] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer text-center"
                >
                  Open Link
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOverlay;
