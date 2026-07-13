import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { INITIAL_Z_INDEX, WINDOW_CONFIG, dockApps } from "@constants";

const useWindowsStore = create(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,
    favorites: [],
    dockAppIds: dockApps.map((app) => app.id),
    desktopShortcuts: [],
    isDockHiddenByCollision: false,
    isDockDragging: false,
    githubRedirect: null,
    setGithubRedirect: (redirect) =>
      set((state) => {
        state.githubRedirect = redirect;
      }),
    setDockDragging: (isDragging) =>
      set((state) => {
        state.isDockDragging = isDragging;
      }),
    music: {
      activeTrack: {
        id: 0,
        title: "Select a Song",
        artist: "Jamendo Music",
        album: "Streaming",
        duration: 0,
        coverColor: "from-zinc-400 to-zinc-600",
        coverText: "🎵",
        coverUrl: "",
        url: "",
      },
      isPlaying: false,
      volume: 72,
      isMuted: false,
      tracks: [],
      isShuffle: false,
      isRepeat: false,
    },
    isSiriOpen: false,
    isAboutPortfolioOpen: false,
    systemSettings: {
      wifi: true,
      bluetooth: true,
      airdrop: false,
      darkMode: true,
      focusMode: false,
      brightness: 100,
      soundLevel: 45,
      nightLight: false,
      firewall: true,
      activeWifiNetwork: "Home Network",
      thunderbolt: false,
      vpn: false,
      vpnConfig: null,
      bluetoothDevices: {
        airpods: true,
        keyboard: false,
        mouse: false,
        headphones: false,
      },
      lowPowerMode: "Never",
      showBatteryPercentage: true,
      optimizedBatteryCharging: true,
    },

    updateSystemSetting: (key, value) =>
      set((state) => {
        state.systemSettings[key] = value;
      }),

    toggleSystemSetting: (key) =>
      set((state) => {
        state.systemSettings[key] = !state.systemSettings[key];
      }),

    setMusicState: (musicData) =>
      set((state) => {
        state.music = { ...state.music, ...musicData };
      }),

    setSiriOpen: (isOpen) =>
      set((state) => {
        state.isSiriOpen = isOpen;
      }),

    setAboutPortfolioOpen: (isOpen) =>
      set((state) => {
        state.isAboutPortfolioOpen = isOpen;
      }),

    setDockHiddenByCollision: (isHidden) =>
      set((state) => {
        state.isDockHiddenByCollision = isHidden;
      }),

    toggleFavorite: (id) =>
      set((state) => {
        if (state.favorites.includes(id)) {
          state.favorites = state.favorites.filter((fId) => fId !== id);
        } else {
          state.favorites.push(id);
        }
      }),

    openWindow: (windowKey, data = null) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isOpen = true;
        win.isMinimized = false;
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        state.nextZIndex++;
      }),
    closeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isOpen = false;
        win.isMinimized = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
      }),
    closeAllWindows: () =>
      set((state) => {
        Object.keys(state.windows).forEach((key) => {
          const win = state.windows[key];
          if (win) {
            win.isOpen = false;
            win.isMinimized = false;
            win.zIndex = INITIAL_Z_INDEX;
            win.data = null;
          }
        });
      }),
    setWindowData: (windowKey, data) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.data = data;
      }),
    minimizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isMinimized = true;
      }),
    unminimizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isMinimized = false;
        win.zIndex = state.nextZIndex++;
      }),
    focusWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.zIndex = state.nextZIndex++;
      }),
    toggleMaximize: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isMaximized = !win.isMaximized;
      }),
    reorderDockApps: (startIndex, endIndex) =>
      set((state) => {
        const result = Array.from(state.dockAppIds);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        state.dockAppIds = result;
      }),
    addDesktopShortcut: (appId, x, y) =>
      set((state) => {
        const exists = state.desktopShortcuts.some((s) => s.appId === appId);
        if (exists) return;

        const app = dockApps.find((a) => a.id === appId);
        if (!app) return;

        state.desktopShortcuts.push({
          id: `shortcut-${appId}-${Date.now()}`,
          appId,
          name: app.name,
          icon: app.icon,
          x,
          y,
        });
      }),
    removeDesktopShortcut: (id) =>
      set((state) => {
        state.desktopShortcuts = state.desktopShortcuts.filter((s) => s.id !== id);
      }),
    updateShortcutPosition: (id, x, y) =>
      set((state) => {
        const shortcut = state.desktopShortcuts.find((s) => s.id === id);
        if (shortcut) {
          shortcut.x = x;
          shortcut.y = y;
        }
      }),
  })),
);

export default useWindowsStore;
