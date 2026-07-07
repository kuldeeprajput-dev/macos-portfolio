import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  Phone,
  Users,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Send,
  MoreVertical,
  Paperclip,
  Check,
  CheckCheck,
  Moon,
  Info,
  Palette,
  Mic,
  MicOff,
  Camera,
  Video,
  VideoOff,
  PhoneOff,
  Trash2,
} from "lucide-react";
import WindowControls from "@components/WindowControls";
import useWindowsStore from "@store/window";

const TelegramSection = ({
  activeChatId,
  setActiveChatId,
  inputText,
  setInputText,
  searchQuery,
  setSearchQuery,
  isSidebarOpen,
  setIsSidebarOpen,
  isTyping,
  showProfileDrawer,
  setShowProfileDrawer,
  nightMode,
  setNightMode,
  _isDrawerOpen,
  _setIsDrawerOpen,
  _drawerSection,
  _setDrawerSection,
  userProfile,
  setUserProfile,
  newGroupName,
  setNewGroupName,
  newChannelName,
  setNewChannelName,
  newChannelBio,
  setNewChannelBio,
  chatThemeColor,
  setChatThemeColor,
  messagesEndRef,
  activeChat,
  handleSend,
  handleCreateGroup,
  handleCreateChannel,
  openOrCreateChat,
  openSavedMessages,
  handleDeleteChat,
  filteredChats,
  getThemeClass,
  activeCall,
  callDuration,
  callLogs,
  handlePlaceCall,
  handleEndCall,
}) => {
  const [activeTab, setActiveTab] = useState("chats"); // "chats" | "contacts" | "calls" | "settings"
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingGroupModal, setIsCreatingGroupModal] = useState(false);
  const [isCreatingChannelModal, setIsCreatingChannelModal] = useState(false);
  const [forwardDestination, setForwardDestination] = useState(null);
  const [callMicMuted, setCallMicMuted] = useState(false);
  const [callCameraOff, setCallCameraOff] = useState(true);

  // Status helper
  const getStatusColor = (status) => {
    if (status === "online") return "bg-green-500";
    if (status === "bot") return "bg-blue-400";
    if (status.includes("subscribers") || status.includes("members")) return "bg-zinc-400";
    return "bg-zinc-400";
  };

  // Chat Sent Message Status ticks
  const renderMessageTicks = (status) => {
    if (status === "sent") return <Check size={11} className="text-blue-400" />;
    if (status === "read") return <CheckCheck size={11} className="text-blue-500" />;
    return null;
  };

  // Close active chat room and go back to chats index
  const handleBackToChats = React.useCallback(() => {
    setForwardDestination({ type: "chat" });
    setIsSidebarOpen(true);
  }, [setIsSidebarOpen]);

  useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app !== "telegram") return;

      if (activeCall) {
        e.preventDefault();
        handleEndCall();
        setForwardDestination(null);
      } else if (showProfileDrawer) {
        e.preventDefault();
        setShowProfileDrawer(false);
        setForwardDestination({ type: "profile" });
      } else if (isCreatingGroupModal) {
        e.preventDefault();
        setIsCreatingGroupModal(false);
        setForwardDestination({ type: "group" });
      } else if (isCreatingChannelModal) {
        e.preventDefault();
        setIsCreatingChannelModal(false);
        setForwardDestination({ type: "channel" });
      } else if (isEditingProfile) {
        e.preventDefault();
        setIsEditingProfile(false);
        setForwardDestination({ type: "editProfile" });
      } else if (activeTab === "chats" && !isSidebarOpen) {
        e.preventDefault();
        handleBackToChats();
      } else if (activeTab !== "chats") {
        e.preventDefault();
        setForwardDestination({ type: "tab", tab: activeTab });
        setActiveTab("chats");
        setIsSidebarOpen(true);
      }
    };

    const handleNavForward = (e) => {
      if (e.detail?.app !== "telegram" || !forwardDestination) return;

      e.preventDefault();
      if (forwardDestination.type === "profile" && activeTab === "chats" && !isSidebarOpen) {
        setShowProfileDrawer(true);
      } else if (forwardDestination.type === "group") {
        setIsCreatingGroupModal(true);
      } else if (forwardDestination.type === "channel") {
        setIsCreatingChannelModal(true);
      } else if (forwardDestination.type === "editProfile") {
        setIsEditingProfile(true);
      } else if (forwardDestination.type === "chat" && isSidebarOpen) {
        setIsSidebarOpen(false);
      } else if (forwardDestination.type === "tab") {
        setActiveTab(forwardDestination.tab);
        setIsSidebarOpen(true);
      }
      setForwardDestination(null);
    };

    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
  }, [
    activeCall,
    activeTab,
    forwardDestination,
    handleBackToChats,
    handleEndCall,
    isCreatingChannelModal,
    isCreatingGroupModal,
    isEditingProfile,
    isSidebarOpen,
    setIsSidebarOpen,
    setShowProfileDrawer,
    showProfileDrawer,
  ]);

  // Mock Contacts List
  const contacts = [
    {
      name: "Kuldeep (Developer)",
      id: "kuldeep",
      initials: "K",
      status: "online",
      color: "bg-gradient-to-tr from-blue-500 to-indigo-600",
      avatar: "/images/profile.webp",
    },
    {
      name: "Saved Messages",
      id: "saved",
      initials: "🔖",
      status: "cloud",
      color: "bg-gradient-to-tr from-blue-600 to-sky-700",
    },
    {
      name: "Telegram Assistant Bot",
      id: "bot",
      initials: "TB",
      status: "bot",
      color: "bg-gradient-to-tr from-cyan-400 to-sky-600",
      avatar: "/images/telegram/bot.webp",
    },
    {
      name: "Amit Sharma",
      id: "amit",
      initials: "AS",
      status: "offline",
      color: "bg-gradient-to-tr from-emerald-450 to-teal-500",
    },
    {
      name: "Sneha Patel",
      id: "sneha",
      initials: "SP",
      status: "online",
      color: "bg-gradient-to-tr from-pink-500 to-rose-500",
    },
  ];

  return (
    <div
      className={`flex flex-col h-full w-full rounded-xl overflow-hidden shadow-2xl border transition-colors select-none font-sans relative ${
        nightMode
          ? "bg-[#0e1621] text-zinc-100 border-zinc-800/80"
          : "bg-[#f1f1f4] text-zinc-950 border-[#e3e3e5]"
      }`}
    >
      {/* 1. Window Header (Always top z-index for focus & close integrity) */}
      <div
        id="window-header"
        className={`shrink-0 flex items-center justify-between border-b px-4 py-2.5 z-40 transition-colors ${
          nightMode ? "bg-[#17212b] border-zinc-800/60" : "bg-[#f9f9fa] border-[#e3e3e5]"
        }`}
      >
        {activeTab === "chats" && !isSidebarOpen ? (
          <>
            <button
              onClick={handleBackToChats}
              className={`w-20 shrink-0 flex items-center justify-start gap-0.5 font-semibold text-[13px] focus:outline-none bg-transparent border-none cursor-pointer p-0 transition-colors ${
                nightMode ? "text-zinc-200" : "text-zinc-950"
              }`}
            >
              <ChevronLeft size={18} strokeWidth={2.5} className="relative -left-0.5" />
              <span>Chats</span>
            </button>

            <div
              onClick={() => setShowProfileDrawer(true)}
              className="flex-1 min-w-0 flex flex-col items-center justify-center text-center cursor-pointer"
            >
              <span
                className={`font-bold text-[15px] leading-tight block truncate w-full ${
                  nightMode ? "text-white" : "text-zinc-900"
                }`}
              >
                {activeChat.name}
              </span>
              <span
                className={`text-[10.5px] leading-tight block truncate w-full font-medium mt-0.5 ${
                  isTyping
                    ? "text-blue-500"
                    : activeChat.status === "online"
                      ? "text-blue-500"
                      : nightMode
                        ? "text-zinc-400"
                        : "text-zinc-500"
                }`}
              >
                {isTyping ? "typing..." : activeChat.status}
              </span>
            </div>

            <div className="w-20 shrink-0 flex justify-end items-center gap-2.5">
              <button
                onClick={() =>
                  handlePlaceCall(
                    activeChat.name,
                    activeChat.avatarColor,
                    activeChat.initials,
                    activeChat.avatar,
                  )
                }
                className={`p-1.5 rounded-full bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center ${
                  nightMode
                    ? "text-zinc-300 hover:bg-zinc-800/50"
                    : "text-zinc-700 hover:bg-zinc-200/50"
                }`}
                title="Call"
              >
                <Phone size={16} />
              </button>
              {activeChat.avatar ? (
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  onClick={() => setShowProfileDrawer(true)}
                  className="w-7.5 h-7.5 rounded-full object-cover shadow-sm cursor-pointer hover:opacity-90 transition-opacity shrink-0 border border-black/5"
                />
              ) : (
                <div
                  onClick={() => setShowProfileDrawer(true)}
                  className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity shrink-0 ${activeChat.avatarColor}`}
                >
                  {activeChat.initials}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <WindowControls target="telegram" />
            <span className="text-xs font-bold text-gray-400">Telegram</span>
            <div className="w-12" /> {/* spacer */}
          </>
        )}
      </div>

      {/* 2. Main content container */}
      <div className="flex-1 flex flex-col min-h-0 relative pb-[56px]">
        {/* VIEW A: CHAT ROOM VIEW (Active when isSidebarOpen is false in Chats tab) */}
        {activeTab === "chats" && !isSidebarOpen ? (
          <div
            className={`absolute inset-0 flex flex-col min-h-0 z-30 animate-in slide-in-from-right-3 duration-250 ${
              nightMode ? "bg-[#0e1621]" : "bg-white"
            }`}
          >
            <div
              className={`flex-1 overflow-y-auto p-4 space-y-3.5 ${
                nightMode ? "bg-[#0e1621]" : "bg-[#e7ebf0]"
              }`}
              style={{
                backgroundImage: nightMode
                  ? "radial-gradient(rgba(255,255,255,0.015) 1px, transparent 0)"
                  : "radial-gradient(rgba(0,0,0,0.02) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            >
              {activeChat.messages.map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[78%] ${
                      isMe ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    {!isMe && msg.senderName && (
                      <span className="text-[10px] font-bold text-blue-500 mb-0.5 pl-1.5">
                        {msg.senderName}
                      </span>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-[14px] shadow-sm select-text ${
                        isMe
                          ? getThemeClass(true)
                          : nightMode
                            ? "bg-[#182533] text-zinc-100 border border-zinc-800/80 rounded-tr-none"
                            : "bg-white text-gray-800 border border-zinc-200/50 rounded-tl-none"
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 -mr-1">
                        <span className="text-[9px] opacity-50 font-medium">{msg.time}</span>
                        {isMe && renderMessageTicks(msg.status)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col mr-auto max-w-[78%] items-start animate-pulse">
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-[14px] rounded-tl-none shadow-sm ${
                      nightMode ? "bg-[#182533] text-zinc-300" : "bg-white text-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div
              className={`p-3 border-t flex items-center gap-3 shrink-0 ${
                nightMode ? "bg-[#17212b] border-zinc-800/60" : "bg-[#f9f9fa] border-[#e3e3e5]"
              }`}
            >
              <button className="text-zinc-400 hover:text-blue-500 transition-colors bg-transparent border-none cursor-pointer">
                <Paperclip size={21} />
              </button>
              <input
                type="text"
                placeholder="Message"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  useWindowsStore.getState().focusWindow("telegram");
                  e.currentTarget.focus();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  useWindowsStore.getState().focusWindow("telegram");
                  e.currentTarget.focus();
                }}
                className={`flex-1 min-w-0 border rounded-full px-4 py-2 text-sm outline-none font-medium select-text ${
                  nightMode
                    ? "bg-[#24303f] border-zinc-800 text-white focus:border-blue-500"
                    : "bg-white border-[#e3e3e5] text-zinc-950 focus:border-blue-500"
                }`}
              />
              {inputText.trim() ? (
                <button
                  onClick={handleSend}
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all active:scale-95 border-none cursor-pointer flex items-center justify-center shadow"
                >
                  <Send size={15} />
                </button>
              ) : (
                <button className="text-zinc-400 hover:text-blue-500 transition-colors bg-transparent border-none cursor-pointer">
                  <Mic size={21} />
                </button>
              )}
            </div>

            {/* Profile Drawer Overlay (Inside Chat view) */}
            {showProfileDrawer && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-xs z-40 rounded-xl flex flex-col justify-end animate-in fade-in duration-200">
                <div className="flex-1" onClick={() => setShowProfileDrawer(false)} />
                <div
                  className={`w-full max-h-[85%] rounded-t-3xl overflow-y-auto p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-250 ${
                    nightMode ? "bg-[#17212b] text-zinc-100" : "bg-white text-gray-800"
                  }`}
                >
                  {/* iOS Drag Handle */}
                  <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-1 shrink-0" />

                  <div className="flex flex-col items-center text-center">
                    {activeChat.avatar ? (
                      <img
                        src={activeChat.avatar}
                        alt={activeChat.name}
                        className="w-20 h-20 rounded-full object-cover shadow-md border border-white/20"
                      />
                    ) : (
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold text-white shadow-md ${activeChat.avatarColor}`}
                      >
                        {activeChat.initials}
                      </div>
                    )}
                    <h3
                      className={`text-xl font-bold mt-3 ${nightMode ? "text-white" : "text-zinc-900"}`}
                    >
                      {activeChat.name}
                    </h3>
                    <span className="text-xs text-zinc-400">{activeChat.username}</span>
                  </div>

                  {/* Grouped iOS Settings List block */}
                  <div
                    className={`rounded-2xl p-4 space-y-4 ${
                      nightMode ? "bg-[#242f3d]" : "bg-zinc-100/80"
                    }`}
                  >
                    {/* Row 1: Bio */}
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                        Bio
                      </span>
                      <p
                        className={`text-[13px] leading-relaxed font-medium ${
                          nightMode ? "text-zinc-100" : "text-zinc-800"
                        }`}
                      >
                        {activeChat.bio}
                      </p>
                    </div>

                    <div className={`h-px ${nightMode ? "bg-zinc-800" : "bg-zinc-200"}`} />

                    {/* Row 2: Phone */}
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                        Phone
                      </span>
                      <p
                        className={`text-[13px] font-semibold ${
                          nightMode ? "text-zinc-100" : "text-zinc-800"
                        }`}
                      >
                        {activeChat.phone}
                      </p>
                    </div>

                    <div className={`h-px ${nightMode ? "bg-zinc-800" : "bg-zinc-200"}`} />

                    {/* Row 3: Username */}
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                        Username
                      </span>
                      <p className="text-[13px] font-semibold text-blue-500">
                        {activeChat.username}
                      </p>
                    </div>

                    <div className={`h-px ${nightMode ? "bg-zinc-800" : "bg-zinc-200"}`} />

                    {/* Row 4: Chat Type */}
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                        Chat Type
                      </span>
                      <span
                        className={`text-[13px] capitalize font-semibold ${
                          nightMode ? "text-zinc-100" : "text-zinc-800"
                        }`}
                      >
                        {activeChat.type}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mt-2">
                    <button
                      onClick={() => {
                        handleDeleteChat(activeChat.id);
                        setShowProfileDrawer(false);
                        setIsSidebarOpen(true);
                      }}
                      className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all border-none cursor-pointer text-center ${
                        nightMode
                          ? "bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30"
                          : "bg-red-50 hover:bg-red-100/80 text-red-500"
                      }`}
                    >
                      Delete Chat
                    </button>

                    <button
                      onClick={() => setShowProfileDrawer(false)}
                      className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-sm font-bold border-none cursor-pointer transition-all shadow"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* VIEW B: CHATS LIST VIEW */}
        {activeTab === "chats" && isSidebarOpen ? (
          <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-200">
            {/* Chats List Header */}
            <div className="px-5 pt-4 pb-2 flex justify-between items-center">
              <h1
                className={`text-[34px] font-extrabold tracking-tight ${
                  nightMode ? "text-white" : "text-black"
                }`}
              >
                Chats
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCreatingGroupModal(true)}
                  className={`p-2 rounded-full hover:opacity-80 active:scale-95 transition-all border-none cursor-pointer flex items-center justify-center ${
                    nightMode ? "bg-zinc-800 text-zinc-100" : "bg-zinc-200/80 text-zinc-800"
                  }`}
                  title="Create Group"
                >
                  <Users size={16} />
                </button>
                <button
                  onClick={() => setIsCreatingChannelModal(true)}
                  className={`p-2 rounded-full hover:opacity-80 active:scale-95 transition-all border-none cursor-pointer flex items-center justify-center ${
                    nightMode ? "bg-zinc-800 text-zinc-100" : "bg-zinc-200/80 text-zinc-800"
                  }`}
                  title="Create Channel"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-5 pb-4">
              <div
                className={`relative flex items-center rounded-xl px-3 py-1.5 h-9 shrink-0 ${
                  nightMode ? "bg-zinc-800" : "bg-[#e3e3e9]"
                }`}
              >
                <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search chats"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    useWindowsStore.getState().focusWindow("telegram");
                    e.currentTarget.focus();
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    useWindowsStore.getState().focusWindow("telegram");
                    e.currentTarget.focus();
                  }}
                  className={`w-full bg-transparent text-sm focus:outline-none border-none outline-none font-medium select-text ${
                    nightMode ? "text-white" : "text-gray-800"
                  }`}
                />
              </div>
            </div>

            {/* Chats List Body */}
            <div className="flex-1 overflow-y-auto px-5 pb-4">
              <div
                className={`rounded-2xl border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y ${
                  nightMode
                    ? "bg-[#182533] border-zinc-800 divide-zinc-800"
                    : "bg-white border-black/5 divide-zinc-100"
                }`}
              >
                {filteredChats.map((chat) => {
                  const lastMsg = chat.messages[chat.messages.length - 1];
                  const _isActive = activeChatId === chat.id;
                  return (
                    <div
                      key={chat.id}
                      onClick={() => {
                        setForwardDestination(null);
                        setActiveChatId(chat.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`p-4 flex items-center gap-3.5 cursor-pointer transition-colors ${
                        nightMode ? "active:bg-[#24303f]" : "active:bg-zinc-50"
                      }`}
                    >
                      <div className="relative shrink-0">
                        {chat.avatar ? (
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="w-11 h-11 rounded-full object-cover shadow-sm shrink-0 border border-black/5"
                          />
                        ) : (
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${chat.avatarColor}`}
                          >
                            {chat.initials}
                          </div>
                        )}
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                            nightMode ? "border-[#182533]" : "border-white"
                          } ${getStatusColor(chat.status)}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4
                            className={`font-bold text-[15px] truncate ${
                              nightMode ? "text-white" : "text-zinc-900"
                            }`}
                          >
                            {chat.name}
                          </h4>
                          <span className="text-[10px] text-zinc-400 shrink-0 font-medium">
                            {lastMsg ? lastMsg.time : ""}
                          </span>
                        </div>
                        <p
                          className={`text-[12.5px] truncate mt-0.5 font-medium ${
                            nightMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          {lastMsg ? lastMsg.text : "No messages"}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {filteredChats.length === 0 && (
                  <div
                    className={`rounded-2xl border-none p-8 text-center text-gray-400 shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${
                      nightMode ? "bg-transparent" : "bg-white"
                    }`}
                  >
                    No Chats Found
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* VIEW C: CONTACTS VIEW */}
        {activeTab === "contacts" && (
          <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-200">
            {/* Contacts Header */}
            <div className="px-5 pt-4 pb-2">
              <h1
                className={`text-[34px] font-extrabold tracking-tight ${
                  nightMode ? "text-white" : "text-black"
                }`}
              >
                Contacts
              </h1>
            </div>

            {/* Contacts Search */}
            <div className="px-5 pb-4">
              <div
                className={`relative flex items-center rounded-xl px-3 py-1.5 h-9 shrink-0 ${
                  nightMode ? "bg-zinc-800" : "bg-[#e3e3e9]"
                }`}
              >
                <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search contacts"
                  className={`w-full bg-transparent text-sm focus:outline-none border-none outline-none font-medium select-text ${
                    nightMode ? "text-white" : "text-gray-800"
                  }`}
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto px-5 pb-4">
              <div
                className={`rounded-2xl border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y ${
                  nightMode
                    ? "bg-[#182533] border-zinc-800 divide-zinc-800"
                    : "bg-white border-black/5 divide-zinc-100"
                }`}
              >
                {contacts.map((contact, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setForwardDestination(null);
                      openOrCreateChat(
                        contact.id,
                        contact.name,
                        contact.initials,
                        contact.color,
                        contact.status,
                        undefined,
                        contact.avatar,
                      );
                      setActiveTab("chats");
                      setIsSidebarOpen(false);
                    }}
                    className={`p-4 flex items-center gap-3.5 cursor-pointer transition-colors ${
                      nightMode ? "active:bg-[#24303f]" : "active:bg-zinc-50"
                    }`}
                  >
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover shadow-sm border border-black/5"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${contact.color}`}
                      >
                        {contact.initials}
                      </div>
                    )}
                    <div>
                      <h4
                        className={`font-bold text-[15px] leading-tight ${
                          nightMode ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        {contact.name}
                      </h4>
                      <span className="text-[10px] text-zinc-400">{contact.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW D: CALLS VIEW */}
        {activeTab === "calls" && (
          <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-200">
            {/* Calls Header */}
            <div className="px-5 pt-4 pb-2">
              <h1
                className={`text-[34px] font-extrabold tracking-tight ${
                  nightMode ? "text-white" : "text-black"
                }`}
              >
                Calls
              </h1>
            </div>

            {/* Calls list */}
            <div className="flex-1 overflow-y-auto px-5 pb-4">
              <div
                className={`rounded-2xl border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y ${
                  nightMode
                    ? "bg-[#182533] border-zinc-800 divide-zinc-800"
                    : "bg-white border-black/5 divide-zinc-100"
                }`}
              >
                {callLogs.map((log, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      handlePlaceCall(log.name, log.avatarColor, log.initials, log.avatar)
                    }
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                      nightMode ? "active:bg-[#24303f]" : "active:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {log.avatar ? (
                        <img
                          src={log.avatar}
                          alt={log.name}
                          className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0 border border-black/5"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0 ${log.avatarColor || "bg-blue-500"}`}
                        >
                          {log.initials || log.name[0]}
                        </div>
                      )}
                      <div>
                        <h4
                          className={`font-bold text-[15px] leading-tight ${
                            log.missed ? "text-red-500" : nightMode ? "text-white" : "text-zinc-900"
                          }`}
                        >
                          {log.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10.5px] text-zinc-400 font-medium">
                            {log.type === "outgoing" ? "↗" : "↙"} {log.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      className={`p-2 rounded-full border-none cursor-pointer flex items-center justify-center ${
                        nightMode
                          ? "text-zinc-400 hover:bg-zinc-800"
                          : "text-zinc-500 hover:bg-zinc-100"
                      }`}
                    >
                      <Phone size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW E: SETTINGS VIEW */}
        {activeTab === "settings" && (
          <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-200">
            {/* Settings Header */}
            <div className="px-5 pt-4 pb-2">
              <h1
                className={`text-[34px] font-extrabold tracking-tight ${
                  nightMode ? "text-white" : "text-black"
                }`}
              >
                Settings
              </h1>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-6">
              {/* Profile Card Info Banner */}
              <div
                onClick={() => setIsEditingProfile(true)}
                className={`rounded-2xl border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-3 cursor-pointer hover:opacity-95 transition-opacity ${
                  nightMode ? "bg-[#182533] border-zinc-800" : "bg-white border-black/5"
                }`}
              >
                <div className="flex flex-row items-center gap-4">
                  <img
                    src="/images/profile.webp"
                    alt={userProfile.name}
                    className="w-14 h-14 rounded-full object-cover shadow-sm border border-white/20 shrink-0"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <h3
                      className={`font-extrabold text-[16px] leading-tight ${
                        nightMode ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {userProfile.name}
                    </h3>
                    <span className="text-xs text-zinc-400 font-semibold block mt-0.5">
                      {userProfile.username}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium block mt-0.5">
                      {userProfile.phone}
                    </span>
                  </div>
                </div>
                {userProfile.bio && (
                  <p
                    className={`text-xs text-left leading-relaxed text-zinc-500 font-medium px-1 border-t pt-2 ${
                      nightMode ? "border-zinc-800/60" : "border-zinc-100"
                    }`}
                  >
                    {userProfile.bio}
                  </p>
                )}
              </div>

              {/* Saved Messages Quick Access */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1">
                  Saved Cloud
                </span>
                <div
                  onClick={() => {
                    setForwardDestination(null);
                    openSavedMessages();
                    setActiveTab("chats");
                    setIsSidebarOpen(false);
                  }}
                  className={`rounded-2xl border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer transition-colors ${
                    nightMode
                      ? "bg-[#182533] border-zinc-800 active:bg-[#24303f]"
                      : "bg-white border-black/5 active:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      🔖
                    </div>
                    <div>
                      <h4
                        className={`font-bold text-[15px] leading-none ${
                          nightMode ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        Saved Messages
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-1 font-semibold">
                        Your personal cloud storage chat
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-zinc-300" />
                </div>
              </div>

              {/* Chat Customizer Options Group */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1">
                  Appearance
                </span>
                <div
                  className={`rounded-2xl border shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y ${
                    nightMode
                      ? "bg-[#182533] border-zinc-800 divide-zinc-800"
                      : "bg-white border-black/5 divide-zinc-100"
                  }`}
                >
                  {/* Theme Switcher Toggle */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                        <Moon size={16} />
                      </div>
                      <span
                        className={`font-bold text-[15px] ${nightMode ? "text-white" : "text-zinc-900"}`}
                      >
                        Night Mode
                      </span>
                    </div>
                    {/* iOS style Toggle Switch */}
                    <button
                      onClick={() => setNightMode(!nightMode)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors relative border-none cursor-pointer flex items-center ${
                        nightMode ? "bg-blue-500 justify-end" : "bg-zinc-200 justify-start"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-md block transition-transform" />
                    </button>
                  </div>

                  {/* Chat Theme Color Picker */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
                        <Palette size={16} />
                      </div>
                      <span
                        className={`font-bold text-[15px] ${nightMode ? "text-white" : "text-zinc-900"}`}
                      >
                        Chat Bubble Accent
                      </span>
                    </div>
                    {/* Circle buttons */}
                    <div className="flex gap-3.5 pl-12">
                      {["blue", "green", "purple", "orange"].map((color) => {
                        const bgColors = {
                          blue: "bg-blue-500",
                          green: "bg-emerald-500",
                          purple: "bg-purple-500",
                          orange: "bg-orange-500",
                        };
                        return (
                          <button
                            key={color}
                            onClick={() => setChatThemeColor(color)}
                            className={`w-7 h-7 rounded-full transition-all border-2 cursor-pointer flex items-center justify-center shrink-0 ${
                              nightMode ? "border-[#182533]" : "border-white"
                            } ${bgColors[color]} ${
                              chatThemeColor === color ? "scale-115 ring-2 ring-blue-400" : ""
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* About developers / credentials */}
              <div
                className={`rounded-2xl border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start gap-3 ${
                  nightMode ? "bg-[#182533] border-zinc-800" : "bg-white border-black/5"
                }`}
              >
                <Info size={16} className="text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <h4
                    className={`font-bold text-xs ${nightMode ? "text-zinc-300" : "text-zinc-800"}`}
                  >
                    Telegram iOS Client v2.0
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed font-semibold">
                    Simulated using React & TailwindCSS context. Complete local state database
                    synchronization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom iOS Tab bar navigation panel */}
      <div
        className={`absolute bottom-0 inset-x-0 h-[56px] border-t flex items-center justify-around z-20 ${
          nightMode
            ? "bg-[#17212b]/95 border-zinc-800/80 text-zinc-400"
            : "bg-[#f9f9fa]/95 border-[#e3e3e5] text-zinc-500"
        } backdrop-blur-md`}
      >
        <button
          onClick={() => {
            setForwardDestination(null);
            setActiveTab("contacts");
            setIsSidebarOpen(true);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full border-none bg-transparent cursor-pointer transition-colors ${
            activeTab === "contacts" ? "text-blue-500" : ""
          }`}
        >
          <Users size={20} strokeWidth={activeTab === "contacts" ? 2.5 : 2} />
          <span className="text-[9.5px] font-bold">Contacts</span>
        </button>

        <button
          onClick={() => {
            setForwardDestination(null);
            setActiveTab("calls");
            setIsSidebarOpen(true);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full border-none bg-transparent cursor-pointer transition-colors ${
            activeTab === "calls" ? "text-blue-500" : ""
          }`}
        >
          <Phone size={20} strokeWidth={activeTab === "calls" ? 2.5 : 2} />
          <span className="text-[9.5px] font-bold">Calls</span>
        </button>

        <button
          onClick={() => {
            setForwardDestination(null);
            setActiveTab("chats");
            setIsSidebarOpen(true);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full border-none bg-transparent cursor-pointer transition-colors ${
            activeTab === "chats" ? "text-blue-500" : ""
          }`}
        >
          <MessageCircle size={20} strokeWidth={activeTab === "chats" ? 2.5 : 2} />
          <span className="text-[9.5px] font-bold">Chats</span>
        </button>

        <button
          onClick={() => {
            setForwardDestination(null);
            setActiveTab("settings");
            setIsSidebarOpen(true);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full border-none bg-transparent cursor-pointer transition-colors ${
            activeTab === "settings" ? "text-blue-500" : ""
          }`}
        >
          <SettingsIcon size={20} strokeWidth={activeTab === "settings" ? 2.5 : 2} />
          <span className="text-[9.5px] font-bold">Settings</span>
        </button>
      </div>

      {/* 4. Group / Channel Modal Overlays */}
      {/* Create Group Drawer */}
      {isCreatingGroupModal && (
        <div className="absolute inset-0 bg-black/45 backdrop-blur-xs z-40 rounded-xl flex flex-col justify-end animate-in fade-in duration-200">
          <div className="flex-1" onClick={() => setIsCreatingGroupModal(false)} />
          <div
            className={`w-full max-h-[85%] rounded-t-3xl overflow-y-auto p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-250 ${
              nightMode ? "bg-[#17212b] text-zinc-100" : "bg-white text-zinc-950"
            }`}
          >
            <div>
              <h3
                className={`font-extrabold text-lg ${nightMode ? "text-white" : "text-zinc-950"}`}
              >
                Create New Group
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Start a private group chat with mock participants.
              </p>
            </div>
            <input
              type="text"
              placeholder="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.currentTarget.focus();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                e.currentTarget.focus();
              }}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 font-semibold select-text ${
                nightMode
                  ? "bg-zinc-800 border-zinc-800 text-white"
                  : "bg-white border-zinc-200 text-zinc-950"
              }`}
            />
            <div className="flex gap-3.5 pt-2">
              <button
                onClick={() => {
                  handleCreateGroup();
                  setIsCreatingGroupModal(false);
                  setIsSidebarOpen(false);
                }}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold border-none cursor-pointer shadow active:scale-95 transition-all"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingGroupModal(false)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold border-none cursor-pointer active:scale-95 transition-all ${
                  nightMode
                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Channel Drawer */}
      {isCreatingChannelModal && (
        <div className="absolute inset-0 bg-black/45 backdrop-blur-xs z-40 rounded-xl flex flex-col justify-end animate-in fade-in duration-200">
          <div className="flex-1" onClick={() => setIsCreatingChannelModal(false)} />
          <div
            className={`w-full max-h-[85%] rounded-t-3xl overflow-y-auto p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-250 ${
              nightMode ? "bg-[#17212b] text-zinc-100" : "bg-white text-zinc-950"
            }`}
          >
            <div>
              <h3
                className={`font-extrabold text-lg ${nightMode ? "text-white" : "text-zinc-950"}`}
              >
                Create New Channel
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Setup a broadcast stream to post logs/updates.
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Channel Name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.currentTarget.focus();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.currentTarget.focus();
                }}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 font-semibold select-text ${
                  nightMode
                    ? "bg-zinc-800 border-zinc-800 text-white"
                    : "bg-white border-zinc-200 text-zinc-950"
                }`}
              />
              <input
                type="text"
                placeholder="Description / Bio"
                value={newChannelBio}
                onChange={(e) => setNewChannelBio(e.target.value)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.currentTarget.focus();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.currentTarget.focus();
                }}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 font-semibold select-text ${
                  nightMode
                    ? "bg-zinc-800 border-zinc-800 text-white"
                    : "bg-white border-zinc-200 text-zinc-950"
                }`}
              />
            </div>
            <div className="flex gap-3.5 pt-2">
              <button
                onClick={() => {
                  handleCreateChannel();
                  setIsCreatingChannelModal(false);
                  setIsSidebarOpen(false);
                }}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold border-none cursor-pointer shadow active:scale-95 transition-all"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingChannelModal(false)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold border-none cursor-pointer active:scale-95 transition-all ${
                  nightMode
                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Drawer */}
      {isEditingProfile && (
        <div className="absolute inset-0 bg-black/45 backdrop-blur-xs z-40 rounded-xl flex flex-col justify-end animate-in fade-in duration-200">
          <div className="flex-1" onClick={() => setIsEditingProfile(false)} />
          <div
            className={`w-full max-h-[85%] rounded-t-3xl overflow-y-auto p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-250 ${
              nightMode ? "bg-[#17212b] text-zinc-100" : "bg-white text-zinc-950"
            }`}
          >
            <div>
              <h3
                className={`font-extrabold text-lg ${nightMode ? "text-white" : "text-zinc-950"}`}
              >
                Edit Profile Details
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Customize your personal bio, phone and name.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.currentTarget.focus();
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.currentTarget.focus();
                  }}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 font-semibold select-text ${
                    nightMode
                      ? "bg-zinc-800 border-zinc-800 text-white"
                      : "bg-white border-zinc-200 text-zinc-950"
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block mb-1">
                  Bio
                </label>
                <input
                  type="text"
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.currentTarget.focus();
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.currentTarget.focus();
                  }}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 font-semibold select-text ${
                    nightMode
                      ? "bg-zinc-800 border-zinc-800 text-white"
                      : "bg-white border-zinc-200 text-zinc-950"
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.currentTarget.focus();
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.currentTarget.focus();
                  }}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 font-semibold select-text ${
                    nightMode
                      ? "bg-zinc-800 border-zinc-800 text-white"
                      : "bg-white border-zinc-200 text-zinc-950"
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-3.5 pt-2">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer shadow active:scale-95 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 5. Calling Overlay (Full screen inside the iPhone mockup container) */}
      {activeCall && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1e] via-[#0d0d0e] to-[#121214] text-white z-50 rounded-2xl flex flex-col items-center justify-between py-10 px-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="text-center mt-4 select-none">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
              FaceTime Audio
            </span>
            <h2 className="text-2xl font-bold mt-1 text-white">{activeCall.name}</h2>
            <p className="text-sm text-neutral-300 mt-1 font-medium">
              {activeCall.status === "Connected" ? callDuration : activeCall.status}
            </p>
          </div>

          {/* Avatar and pulses */}
          <div className="flex-1 flex flex-col items-center justify-center w-full relative">
            <div className="relative flex items-center justify-center">
              {activeCall.status !== "Connected" ? (
                <>
                  <div
                    className="absolute w-28 h-28 rounded-full border border-white/20 animate-ping opacity-70"
                    style={{ animationDuration: "2s" }}
                  />
                  <div
                    className="absolute w-28 h-28 rounded-full border border-white/10 animate-ping opacity-40"
                    style={{ animationDuration: "2.8s", animationDelay: "0.4s" }}
                  />
                  <div className="absolute -inset-4 rounded-full bg-white/5 blur-xl animate-pulse" />
                </>
              ) : (
                <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-xl animate-pulse animate-duration-2000" />
              )}

              <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl relative z-10 flex items-center justify-center bg-zinc-900 border border-white/15">
                {activeCall.avatar ? (
                  <img
                    src={activeCall.avatar}
                    alt={activeCall.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center text-white font-bold text-3xl ${activeCall.avatarColor}`}
                  >
                    {activeCall.initials}
                  </div>
                )}
              </div>
            </div>

            {/* Connected Sound Wave visualizer */}
            {activeCall.status === "Connected" && (
              <div className="flex items-end gap-1.5 h-8 mt-8 justify-center select-none z-10">
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

          {/* Action Buttons Panel */}
          <div className="flex items-center gap-6 mb-4 z-10">
            {/* Mic Toggle button */}
            <button
              onClick={() => setCallMicMuted(!callMicMuted)}
              className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-colors cursor-pointer outline-none ${
                callMicMuted
                  ? "bg-red-600 text-white"
                  : "bg-neutral-800/80 hover:bg-neutral-700 text-neutral-250"
              }`}
              title={callMicMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {callMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="w-16 h-16 bg-red-650 hover:bg-red-700 active:scale-95 transition-all text-white rounded-full shadow-lg flex items-center justify-center border-none cursor-pointer animate-pulse"
              style={{ backgroundColor: "#ef4444" }}
              title="End Call"
            >
              <PhoneOff className="w-6 h-6" />
            </button>

            {/* Camera Toggle Button */}
            <button
              onClick={() => setCallCameraOff(!callCameraOff)}
              className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-colors cursor-pointer outline-none ${
                !callCameraOff
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-800/80 hover:bg-neutral-700 text-neutral-250"
              }`}
              title={callCameraOff ? "Turn Camera On" : "Turn Camera Off"}
            >
              {!callCameraOff ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelegramSection;
