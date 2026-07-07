import React from "react";
import {
  ArrowLeft,
  User,
  Users,
  Megaphone,
  Phone,
  Bookmark,
  Settings as SettingsIcon,
  Moon,
  Camera,
  Lock,
  Bell,
  Monitor,
} from "lucide-react";

const TelegramSidebarDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  drawerSection,
  setDrawerSection,
  nightMode,
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
  handleCreateGroup,
  handleCreateChannel,
  openSavedMessages,
  setActiveChatId,
  setNightMode,
  containerWidth = 800,
}) => {
  if (!isDrawerOpen) return null;

  return (
    <div
      className={`absolute inset-y-0 left-0 z-30 flex flex-col transition-all duration-300 ${
        containerWidth < 550 ? "w-full" : "w-64"
      } ${
        nightMode ? "bg-[#181818] border-r border-zinc-800" : "bg-white border-r border-zinc-200"
      }`}
    >
      <div
        className={`p-3 border-b flex items-center gap-3 shrink-0 ${
          nightMode ? "border-zinc-800" : "border-zinc-200"
        }`}
      >
        <button
          onClick={() => {
            if (drawerSection === "menu") {
              setIsDrawerOpen(false);
            } else {
              setDrawerSection("menu");
            }
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            nightMode ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-zinc-100 text-gray-600"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span
          className={`font-bold text-xs capitalize ${
            nightMode ? "text-zinc-200" : "text-gray-700"
          }`}
        >
          {drawerSection === "menu" ? "Back" : drawerSection.replace("_", " ")}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {drawerSection === "menu" && (
          <div className="flex flex-col h-full">
            <div className="p-3 text-left flex flex-row items-center gap-4 shrink-0">
              <img
                src="/images/profile.webp"
                alt={userProfile.name}
                className="w-14 h-14 rounded-full object-cover shadow-md border border-white/20"
              />
              <div>
                <h4
                  className={`font-bold text-sm flex items-center gap-1 ${nightMode ? "text-white" : "text-gray-900"}`}
                >
                  {userProfile.name}
                </h4>
                <span className={`text-[10px] ${nightMode ? "text-zinc-400" : "text-gray-500"}`}>
                  Set Emoji Status
                </span>
              </div>
            </div>

            <div className="p-2 space-y-0.5 text-xs text-left">
              <button
                onClick={() => setDrawerSection("profile")}
                className="w-full p-2.5 rounded-lg flex items-center gap-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-850"
              >
                <User className="w-4.5 h-4.5 text-gray-400" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => setDrawerSection("new_group")}
                className="w-full p-2.5 rounded-lg flex items-center gap-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-850"
              >
                <Users className="w-4.5 h-4.5 text-gray-400" />
                <span>New Group</span>
              </button>
              <button
                onClick={() => setDrawerSection("new_channel")}
                className="w-full p-2.5 rounded-lg flex items-center gap-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-850"
              >
                <Megaphone className="w-4.5 h-4.5 text-gray-400" />
                <span>New Channel</span>
              </button>
              <button
                onClick={() => setDrawerSection("contacts")}
                className="w-full p-2.5 rounded-lg flex items-center gap-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-850"
              >
                <User className="w-4.5 h-4.5 text-gray-400" />
                <span>Contacts</span>
              </button>
              <button
                onClick={() => setDrawerSection("calls")}
                className="w-full p-2.5 rounded-lg flex items-center gap-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-850"
              >
                <Phone className="w-4.5 h-4.5 text-gray-400" />
                <span>Calls</span>
              </button>
              <button
                onClick={openSavedMessages}
                className="w-full p-2.5 rounded-lg flex items-center gap-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-850"
              >
                <Bookmark className="w-4.5 h-4.5 text-gray-400" />
                <span>Saved Messages</span>
              </button>
              <button
                onClick={() => setDrawerSection("settings")}
                className="w-full p-2.5 rounded-lg flex items-center gap-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-850"
              >
                <SettingsIcon className="w-4.5 h-4.5 text-gray-400" />
                <span>Settings</span>
              </button>

              <div
                className={`p-2.5 flex items-center justify-between text-xs border-t mt-2 ${
                  nightMode ? "border-zinc-800 text-zinc-300" : "border-zinc-100 text-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Moon className="w-4.5 h-4.5 text-gray-400" />
                  <span>Night Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nightMode}
                    onChange={() => setNightMode(!nightMode)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-8 h-4.5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-500 ${
                      nightMode ? "bg-zinc-700" : "bg-zinc-200"
                    }`}
                  ></div>
                </label>
              </div>
            </div>

            <div
              className={`mt-auto p-4 text-[10px] text-gray-400 text-center select-none border-t ${
                nightMode ? "border-zinc-800" : "border-zinc-200"
              }`}
            >
              Telegram Desktop
              <br />
              Version 6.8.2 – About
            </div>
          </div>
        )}

        {drawerSection === "profile" && (
          <div className="p-4 space-y-4 text-xs text-left">
            <div
              className={`flex flex-col items-center gap-2.5 py-4 border-b ${
                nightMode ? "border-zinc-800" : "border-zinc-200"
              }`}
            >
              <div className="w-18 h-18 rounded-full relative shadow group overflow-hidden border border-white/20">
                <img
                  src="/images/profile.webp"
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-[10px] text-blue-500 font-bold hover:underline cursor-pointer">
                Change Profile Photo
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Display Name
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile((prev) => ({ ...prev, name: e.target.value }))}
                  className={`w-full border-none rounded px-3 py-1.5 mt-1 outline-none text-xs focus:ring-1 focus:ring-blue-500 select-text ${
                    nightMode ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-850"
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Username</label>
                <input
                  type="text"
                  value={userProfile.username}
                  onChange={(e) =>
                    setUserProfile((prev) => ({ ...prev, username: e.target.value }))
                  }
                  className={`w-full border-none rounded px-3 py-1.5 mt-1 outline-none text-xs focus:ring-1 focus:ring-blue-500 select-text ${
                    nightMode ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-850"
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile((prev) => ({ ...prev, phone: e.target.value }))}
                  className={`w-full border-none rounded px-3 py-1.5 mt-1 outline-none text-xs focus:ring-1 focus:ring-blue-500 select-text ${
                    nightMode ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-850"
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Bio</label>
                <textarea
                  rows="3"
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  className={`w-full border-none rounded px-3 py-1.5 mt-1 outline-none text-xs resize-none focus:ring-1 focus:ring-blue-500 select-text ${
                    nightMode ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-850"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {drawerSection === "new_group" && (
          <div className="p-4 space-y-4 text-xs text-left">
            <span className="text-[10px] text-gray-400 font-bold block uppercase">
              Create Group Chat
            </span>
            <div>
              <label className="text-[10px] text-gray-400 font-medium">Group Name</label>
              <input
                type="text"
                placeholder="e.g. Next.js Developers"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className={`w-full rounded px-3 py-1.5 mt-1 outline-none focus:border-blue-500 border select-text ${
                  nightMode
                    ? "bg-zinc-800 text-white border-zinc-700"
                    : "bg-zinc-100 text-zinc-950 border-zinc-200"
                }`}
              />
            </div>
            <button
              onClick={handleCreateGroup}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors cursor-pointer text-center"
            >
              Create Group
            </button>
          </div>
        )}

        {drawerSection === "new_channel" && (
          <div className="p-4 space-y-4 text-xs text-left">
            <span className="text-[10px] text-gray-400 font-bold block uppercase">
              Create Broadcast Channel
            </span>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 font-medium">Channel Name</label>
                <input
                  type="text"
                  placeholder="e.g. Daily Tech Bytes"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className={`w-full rounded px-3 py-1.5 mt-1 outline-none focus:border-blue-500 border select-text ${
                    nightMode
                      ? "bg-zinc-800 text-white border-zinc-700"
                      : "bg-zinc-100 text-zinc-950 border-zinc-200"
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-medium">Description</label>
                <textarea
                  placeholder="What is this channel about?"
                  rows="3"
                  value={newChannelBio}
                  onChange={(e) => setNewChannelBio(e.target.value)}
                  className={`w-full rounded px-3 py-1.5 mt-1 outline-none focus:border-blue-500 border select-text resize-none ${
                    nightMode
                      ? "bg-zinc-800 text-white border-zinc-700"
                      : "bg-zinc-100 text-zinc-950 border-zinc-200"
                  }`}
                />
              </div>
            </div>
            <button
              onClick={handleCreateChannel}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors cursor-pointer text-center"
            >
              Create Channel
            </button>
          </div>
        )}

        {drawerSection === "contacts" && (
          <div className="p-2 space-y-1 text-xs text-left">
            <span className="text-[10px] text-gray-400 font-bold px-2.5 block uppercase tracking-wider mb-2">
              My Contacts
            </span>
            {[
              {
                name: "Kuldeep (Developer)",
                role: "@kuldeeprajput_dev",
                color: "bg-blue-500",
                initial: "K",
                id: "kuldeep",
              },
              {
                name: "Amit Kumar",
                role: "@amit_kumar",
                color: "bg-teal-500",
                initial: "A",
                id: "react_group",
              },
              {
                name: "Sneha Reddy",
                role: "@sneha_dev",
                color: "bg-emerald-500",
                initial: "S",
                id: "react_group",
              },
            ].map((cont) => (
              <div
                key={cont.name}
                onClick={() => {
                  setActiveChatId(cont.id);
                  setIsDrawerOpen(false);
                }}
                className="p-2 flex items-center gap-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850 cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${cont.color}`}
                >
                  {cont.initial}
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">{cont.name}</h5>
                  <span className="text-[10px] text-gray-400 block">{cont.role}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {drawerSection === "calls" && (
          <div className="p-3 space-y-2.5 text-xs text-left">
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider mb-1">
              Recent Call Logs
            </span>
            {[
              { name: "Kuldeep (Developer)", time: "Today, 10:35 AM", type: "Outgoing" },
              { name: "Kuldeep (Developer)", time: "Yesterday, 2:40 PM", type: "Missed" },
              { name: "System Assistant", time: "May 25, 4:10 PM", type: "Incoming" },
            ].map((call, idx) => (
              <div
                key={idx}
                className={`border-b pb-2 flex justify-between items-center ${
                  nightMode ? "border-zinc-800" : "border-zinc-200"
                }`}
              >
                <div>
                  <h5 className={`font-semibold ${nightMode ? "text-white" : "text-gray-900"}`}>
                    {call.name}
                  </h5>
                  <span className="text-[10px] text-gray-400 block">{call.time}</span>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    call.type === "Missed"
                      ? nightMode
                        ? "bg-red-950/40 text-red-300"
                        : "bg-red-100 text-red-600"
                      : nightMode
                        ? "bg-zinc-800 text-zinc-400"
                        : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  {call.type}
                </span>
              </div>
            ))}
          </div>
        )}

        {drawerSection === "settings" && (
          <div className="p-3 text-xs text-left space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Privacy & Security
              </span>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>Passcode Lock</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div
                    className={`w-8 h-4.5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-500 ${
                      nightMode ? "bg-zinc-700" : "bg-zinc-200"
                    }`}
                  ></div>
                </label>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <span>Push Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div
                    className={`w-8 h-4.5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-500 ${
                      nightMode ? "bg-zinc-700" : "bg-zinc-200"
                    }`}
                  ></div>
                </label>
              </div>
            </div>
            <hr className={nightMode ? "border-zinc-800" : "border-zinc-200"} />
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Active Devices
              </span>
              <div
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  nightMode ? "bg-zinc-800 text-white" : "bg-zinc-100 text-gray-800"
                }`}
              >
                <Monitor className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <h6
                    className={`font-bold text-[10px] ${nightMode ? "text-white" : "text-gray-800"}`}
                  >
                    macOS M2 Max
                  </h6>
                  <span className="text-[8px] text-gray-400 block">
                    Safari Browser • Active Now
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelegramSidebarDrawer;
