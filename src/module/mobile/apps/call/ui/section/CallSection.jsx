import { useEffect, useState } from "react";
import { Link, Video, Phone, Info, X, Search, Grid, Users, ChevronLeft } from "lucide-react";
import CallInProgress from "../components/CallInProgress";
import CallContactList from "../components/CallContactList";
import CallDialPad from "../components/CallDialPad";
import { CONTACTS } from "../../data";
import WindowControls from "@components/WindowControls";
import useWindowsStore from "@store/window";

const CallSection = ({
  sidebarTab,
  setSidebarTab,
  searchQuery,
  setSearchQuery,
  dialNumber,
  setDialNumber,
  _isSidebarOpen,
  _setIsSidebarOpen,
  activeCall,
  callTimer,
  micMuted,
  setMicMuted,
  cameraMuted,
  setCameraMuted,
  speakerMuted,
  setSpeakerMuted,
  handleDialPress,
  handleBackspace,
  initiateCall,
  endCall,
  formatTimer,
}) => {
  const { closeWindow } = useWindowsStore();
  const [showNewFaceTimeDrawer, setShowNewFaceTimeDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeoutId, setToastTimeoutId] = useState(null);
  const [activeInfoContact, setActiveInfoContact] = useState(null);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [forwardTarget, setForwardTarget] = useState(null);

  const showToast = (message) => {
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    setToastMessage(message);
    const id = setTimeout(() => {
      setToastMessage(null);
    }, 2000);
    setToastTimeoutId(id);
  };

  // Mock Recents Call Log
  const recentsLog = [
    {
      name: "Kuldeep (Developer)",
      type: "video",
      date: "10:30 AM",
      avatarColor: "from-blue-500 to-indigo-600",
    },
    {
      name: "Bhavesh Kumar",
      type: "video",
      date: "Yesterday",
      avatarColor: "from-indigo-500 to-purple-600",
    },
    {
      name: "Mahabub",
      type: "video",
      date: "Monday",
      avatarColor: "from-purple-500 to-pink-600",
    },
  ];

  const handleInitiateCall = (name, type) => {
    initiateCall(name, type);
    setShowNewFaceTimeDrawer(false);
  };

  const handleClear = () => setDialNumber("");

  useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app !== "call") return;

      if (activeCall) {
        e.preventDefault();
        endCall();
        setForwardTarget(null);
      } else if (activeInfoContact) {
        e.preventDefault();
        setForwardTarget({ type: "info", contact: activeInfoContact });
        setActiveInfoContact(null);
      } else if (generatedLink) {
        e.preventDefault();
        setForwardTarget({ type: "link", link: generatedLink });
        setGeneratedLink(null);
      } else if (showNewFaceTimeDrawer) {
        e.preventDefault();
        setForwardTarget({ type: "drawer" });
        setShowNewFaceTimeDrawer(false);
      }
    };

    const handleNavForward = (e) => {
      if (e.detail?.app !== "call" || !forwardTarget) return;

      e.preventDefault();
      if (forwardTarget.type === "info") {
        setActiveInfoContact(forwardTarget.contact);
      } else if (forwardTarget.type === "link") {
        setGeneratedLink(forwardTarget.link);
      } else if (forwardTarget.type === "drawer") {
        setShowNewFaceTimeDrawer(true);
      }
      setForwardTarget(null);
    };

    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
  }, [activeCall, activeInfoContact, endCall, forwardTarget, generatedLink, showNewFaceTimeDrawer]);

  return (
    <div className="flex flex-col h-full w-full bg-zinc-50 rounded-xl overflow-hidden shadow-2xl border border-black/5 select-none text-zinc-950 relative">
      {/* iOS style Top Header */}
      <div className="shrink-0 bg-white/80 backdrop-blur-md border-b border-zinc-200/50 px-4 py-2 flex items-center justify-between z-20 relative">
        <button
          onClick={() => closeWindow("call")}
          style={{
            border: "none",
            background: "none",
            color: "#27272a",
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontSize: 12,
            fontWeight: 500,
            padding: "0",
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={14} />
          <span>Back</span>
        </button>

        <h2 className="text-xs font-bold text-zinc-800 absolute left-1/2 -translate-x-1/2 pointer-events-none">
          FaceTime
        </h2>

        {/* Spacer to keep title centered */}
        <div className="w-[60px]" />
      </div>

      {/* iOS-Style Toast Popup Notification */}
      {toastMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md text-white text-[11px] font-bold px-4.5 py-2.5 rounded-full shadow-lg border border-white/10 z-[100] animate-fade-in flex items-center gap-2 select-none pointer-events-none">
          <span className="w-1.5 h-1.5 bg-[#30d158] rounded-full animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-h-0 relative bg-zinc-50">
        {activeCall ? (
          <CallInProgress
            activeCall={activeCall}
            callTimer={callTimer}
            micMuted={micMuted}
            cameraMuted={cameraMuted}
            speakerMuted={speakerMuted}
            onMicToggle={() => setMicMuted(!micMuted)}
            onCameraToggle={() => setCameraMuted(!cameraMuted)}
            onSpeakerToggle={() => setSpeakerMuted(!speakerMuted)}
            onEndCall={endCall}
            formatTimer={formatTimer}
          />
        ) : (
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* FaceTime Dashboard View */}
            {/* Animated Bokeh Camera Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f9fafb] to-[#f3f4f6] overflow-hidden pointer-events-none">
              <div
                className="absolute top-[-10%] left-[-20%] w-[90%] h-[70%] bg-green-500/5 rounded-full blur-[120px] animate-pulse"
                style={{ animationDuration: "8s" }}
              />
              <div
                className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[60%] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse"
                style={{ animationDuration: "12s" }}
              />
            </div>

            {/* Dashboard Scrollable Content */}
            <div className="flex-1 overflow-y-auto z-10 px-5 pb-6">
              {/* FaceTime Heading */}
              <div className="pt-6 pb-5">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">FaceTime</h1>
              </div>

              {/* Action Buttons Row */}
              <div className="flex gap-4 mb-8">
                {/* Create Link Card */}
                <button
                  onClick={() => {
                    setForwardTarget(null);
                    const rnd1 = Math.random().toString(36).substring(2, 7);
                    const rnd2 = Math.random().toString(36).substring(2, 7);
                    setGeneratedLink(`https://facetime.apple.com/join/${rnd1}-${rnd2}`);
                  }}
                  className="flex-1 h-24 bg-white hover:bg-zinc-50/80 border border-zinc-200 shadow-sm rounded-2xl p-4 flex flex-col justify-between items-start text-left transition-all active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-[#30d158]">
                    <Link size={18} strokeWidth={2.4} />
                  </div>
                  <span className="text-[13px] font-bold text-zinc-800 tracking-wide">
                    Create Link
                  </span>
                </button>

                {/* New FaceTime Card */}
                <button
                  onClick={() => {
                    setForwardTarget(null);
                    setShowNewFaceTimeDrawer(true);
                  }}
                  className="flex-1 h-24 bg-[#30d158] hover:bg-[#2cb84e] rounded-2xl p-4 flex flex-col justify-between items-start text-left transition-all active:scale-95 shadow-lg shadow-green-500/10"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Video size={20} strokeWidth={2.4} />
                  </div>
                  <span className="text-[13px] font-bold text-white tracking-wide">
                    New FaceTime
                  </span>
                </button>
              </div>

              {/* Recents Section */}
              <div>
                <h2 className="text-xs font-bold text-zinc-400 tracking-wider uppercase mb-3">
                  Recents
                </h2>
                <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden divide-y divide-zinc-100 shadow-sm">
                  {recentsLog.map((log, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleInitiateCall(log.name, log.type)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-tr ${log.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-inner overflow-hidden`}
                        >
                          {(() => {
                            const contact = CONTACTS.find(
                              (c) => c.name.toLowerCase() === log.name.toLowerCase(),
                            );
                            if (contact && contact.avatar) {
                              return (
                                <img
                                  src={contact.avatar}
                                  alt={log.name}
                                  className="w-full h-full object-cover"
                                />
                              );
                            }
                            const cleanName = log.name.replace(/\([^)]*\)/g, "").trim();
                            return cleanName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase();
                          })()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-zinc-800 group-hover:text-[#30d158] transition-colors">
                            {log.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-zinc-400">
                            {log.type === "video" ? (
                              <Video size={12} className="text-zinc-400" />
                            ) : (
                              <Phone size={11} className="text-zinc-400" />
                            )}
                            <span>FaceTime {log.type === "video" ? "Video" : "Audio"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400">{log.date}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setForwardTarget(null);
                            setActiveInfoContact({
                              ...log,
                              faceTimeId: `+1 (${Math.floor(200 + Math.random() * 800)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
                            });
                          }}
                          className="p-1 rounded-full hover:bg-zinc-100 text-[#30d158] transition-colors"
                        >
                          <Info size={18} strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New FaceTime Slide-up Drawer Overlay */}
        {showNewFaceTimeDrawer && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-50 flex flex-col justify-end">
            <div className="absolute inset-0" onClick={() => setShowNewFaceTimeDrawer(false)} />
            <div className="w-full max-h-[92%] h-[92%] bg-white border-t border-zinc-200 rounded-t-[28px] z-10 flex flex-col shadow-2xl overflow-hidden animate-slide-up">
              {/* Drawer Header */}
              <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
                <span className="text-base font-bold text-zinc-850">New FaceTime</span>
                <button
                  onClick={() => setShowNewFaceTimeDrawer(false)}
                  className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200/80 flex items-center justify-center text-zinc-500 transition-colors"
                >
                  <X size={16} strokeWidth={2.4} />
                </button>
              </div>

              {/* Drawer Navigation Tabs */}
              <div className="px-5 py-2.5 bg-white border-b border-zinc-100 flex justify-center shrink-0">
                <div className="flex bg-zinc-100 p-0.5 rounded-lg w-full max-w-[240px] border border-zinc-200/40">
                  <button
                    onClick={() => setSidebarTab("contacts")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-bold rounded-md transition-all ${
                      sidebarTab === "contacts"
                        ? "bg-white text-zinc-800 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-850"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Contacts
                  </button>
                  <button
                    onClick={() => setSidebarTab("dialpad")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-bold rounded-md transition-all ${
                      sidebarTab === "dialpad"
                        ? "bg-white text-zinc-800 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-850"
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    Keypad
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto bg-white">
                {sidebarTab === "contacts" && (
                  <div className="text-zinc-800">
                    <CallContactList
                      contacts={CONTACTS}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      onInitiateCall={handleInitiateCall}
                    />
                  </div>
                )}

                {sidebarTab === "dialpad" && (
                  <div className="p-4 flex justify-center bg-white">
                    <CallDialPad
                      dialNumber={dialNumber}
                      onDialPress={handleDialPress}
                      onBackspace={handleBackspace}
                      onClear={handleClear}
                      onInputChange={setDialNumber}
                      onInitiateCall={handleInitiateCall}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FaceTime Link Generation Modal */}
        {generatedLink && (
          <>
            {/* Backdrop overlay */}
            <div
              onClick={() => setGeneratedLink(null)}
              className="absolute inset-0 bg-white/60 backdrop-blur-md z-[110]"
            />
            {/* Centered Modal Card */}
            <div className="absolute inset-0 flex items-center justify-center p-4 z-[111] pointer-events-none">
              <div
                style={{
                  backgroundColor: "#ffffff",
                  color: "#1c1c1e",
                  border: "1px solid #e4e4e7",
                }}
                className="bg-white text-zinc-900 rounded-[28px] p-5 w-full max-w-[280px] shadow-2xl flex flex-col items-center relative animate-fade-in pointer-events-auto"
              >
                <h3 className="font-extrabold text-base mb-1.5" style={{ color: "#1c1c1e" }}>
                  FaceTime Link
                </h3>
                <p className="text-[11px] text-zinc-500 text-center mb-4 leading-relaxed px-2">
                  Share this link to let others join your FaceTime call.
                </p>

                <div
                  style={{ backgroundColor: "#f4f4f5", borderColor: "#e4e4e7", color: "#27272a" }}
                  className="w-full border rounded-xl p-3 mb-4 font-mono text-[10.5px] break-all select-all text-center font-semibold"
                >
                  {generatedLink}
                </div>

                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                      showToast("Link copied!");
                    }}
                    className="flex-1 py-2.5 bg-[#30d158] hover:bg-[#2cb84e] text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-md shadow-green-500/10"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => setGeneratedLink(null)}
                    style={{ backgroundColor: "#f4f4f5", color: "#27272a" }}
                    className="py-2.5 px-4 hover:bg-zinc-200 text-xs font-bold rounded-xl active:scale-95 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Contact Info Card Modal */}
        {activeInfoContact && (
          <>
            {/* Backdrop overlay */}
            <div
              onClick={() => setActiveInfoContact(null)}
              className="absolute inset-0 bg-white/60 backdrop-blur-md z-[110]"
            />
            {/* Centered Modal Card */}
            <div className="absolute inset-0 flex items-center justify-center p-4 z-[111] pointer-events-none">
              <div
                style={{
                  backgroundColor: "#ffffff",
                  color: "#1c1c1e",
                  border: "1px solid #e4e4e7",
                }}
                className="bg-white text-zinc-900 rounded-[28px] p-5 w-full max-w-[280px] shadow-2xl flex flex-col items-center relative animate-fade-in pointer-events-auto"
              >
                <button
                  onClick={() => setActiveInfoContact(null)}
                  style={{ backgroundColor: "#f4f4f5", color: "#71717a" }}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors"
                >
                  <X size={15} strokeWidth={2.4} />
                </button>

                <div
                  className={`w-15 h-15 rounded-full bg-gradient-to-tr ${activeInfoContact.avatarColor} text-white flex items-center justify-center font-extrabold text-lg shadow-md mb-2.5 mt-2 overflow-hidden`}
                >
                  {(() => {
                    const contact = CONTACTS.find(
                      (c) => c.name.toLowerCase() === activeInfoContact.name.toLowerCase(),
                    );
                    if (contact && contact.avatar) {
                      return (
                        <img
                          src={contact.avatar}
                          alt={activeInfoContact.name}
                          className="w-full h-full object-cover"
                        />
                      );
                    }
                    const cleanName = activeInfoContact.name.replace(/\([^)]*\)/g, "").trim();
                    return cleanName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();
                  })()}
                </div>

                <h3 className="font-extrabold text-base mb-0.5" style={{ color: "#1c1c1e" }}>
                  {activeInfoContact.name}
                </h3>
                <p className="text-[11px] text-[#30d158] font-bold mb-4">FaceTime Available</p>

                <div className="w-full space-y-3.5 mb-5 text-left border-t border-b border-zinc-100 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9.5px] text-zinc-400 font-bold uppercase tracking-wider">
                      FaceTime Email
                    </span>
                    <span className="text-xs font-semibold" style={{ color: "#27272a" }}>
                      {activeInfoContact.name.toLowerCase().replace(" ", "")}@apple.com
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9.5px] text-zinc-400 font-bold uppercase tracking-wider">
                      FaceTime ID
                    </span>
                    <span className="text-xs font-semibold" style={{ color: "#27272a" }}>
                      {activeInfoContact.faceTimeId}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 w-full">
                  <button
                    onClick={() => {
                      handleInitiateCall(activeInfoContact.name, "audio");
                      setActiveInfoContact(null);
                    }}
                    style={{ backgroundColor: "#f4f4f5", color: "#27272a" }}
                    className="flex-1 py-2.5 hover:bg-zinc-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Phone size={13} className="fill-zinc-700 text-transparent" />
                    Audio
                  </button>
                  <button
                    onClick={() => {
                      handleInitiateCall(activeInfoContact.name, "video");
                      setActiveInfoContact(null);
                    }}
                    className="flex-1 py-2.5 bg-[#30d158] hover:bg-[#2cb84e] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-green-500/10"
                  >
                    <Video size={13} className="fill-white text-transparent" />
                    FaceTime
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CallSection;
