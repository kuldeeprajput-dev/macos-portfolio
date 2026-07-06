import React from "react";
import {
  Settings as SettingsIcon,
  Monitor,
  Wifi,
  Bluetooth,
  Bell,
  Volume2,
  Moon,
  Hourglass,
  Accessibility,
  LayoutDashboard,
  Globe,
  Battery,
} from "lucide-react";

export const GithubIcon = ({ size, className }) => (
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

export const BookMarkedIcon = ({ size, className }) => (
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
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

export const SidebarItem = ({ icon, label, color, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2.5 px-2 py-1 rounded-md cursor-pointer transition-colors ${
      active ? "bg-blue-500 text-white" : "hover:bg-black/5 text-gray-800"
    }`}
  >
    <div
      className={`flex items-center justify-center w-[20px] h-[20px] rounded-[4px] shadow-sm text-white ${color}`}
    >
      {icon}
    </div>
    <span className="text-[13px] font-medium truncate">{label}</span>
  </div>
);

export const SIDEBAR_GROUPS = [
  [
    { id: "Wi-Fi", icon: <Wifi size={13} />, color: "bg-blue-500" },
    { id: "Bluetooth", icon: <Bluetooth size={13} />, color: "bg-blue-500" },
    { id: "Network", icon: <Globe size={13} />, color: "bg-blue-500" },
    { id: "Battery", icon: <Battery size={13} />, color: "bg-green-500" },
  ],
  [
    { id: "Notifications", icon: <Bell size={13} />, color: "bg-red-500" },
    { id: "Sound", icon: <Volume2 size={13} />, color: "bg-pink-500" },
    { id: "Focus", icon: <Moon size={13} />, color: "bg-indigo-500" },
    { id: "Screen Time", icon: <Hourglass size={13} />, color: "bg-purple-500" },
  ],
  [
    { id: "General", icon: <SettingsIcon size={13} />, color: "bg-gray-400" },
    { id: "Appearance", icon: <Monitor size={13} />, color: "bg-gray-800" },
    { id: "Accessibility", icon: <Accessibility size={13} />, color: "bg-blue-500" },
    { id: "Control Center", icon: <LayoutDashboard size={13} />, color: "bg-gray-400" },
  ],
];
