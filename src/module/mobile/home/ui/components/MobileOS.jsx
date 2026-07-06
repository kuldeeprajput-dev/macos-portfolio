import { dockApps } from "@constants";
import useWindowsStore from "@store/window";
import dayjs from "dayjs";
import { useRef, useState, useEffect } from "react";
import useTimeStore from "@store/time";
import MobileOSStatusBar from "../../../statusbar/ui/components/MobileOSStatusBar";
import MobileOSControlCenter from "../../../controlcenter/ui/components/MobileOSControlCenter";
import MobileOSAppGrid from "./MobileOSAppGrid";
import MobileOSDock from "../../../dock/ui/components/MobileOSDock";
import MobileNotch from "../../../notch/ui/components/MobileNotch";

const MobileOS = () => {
  const { openWindow, windows, systemSettings } = useWindowsStore();
  const time = useTimeStore((state) => state.time);
  const now = dayjs(time);
  const [isControlOpen, setIsControlOpen] = useState(false);
  const [settings, setSettings] = useState({
    wifi: true,
    bluetooth: true,
    darkMode: false,
    lowPower: false,
    flashlight: false,
    airplane: false,
    cellular: true,
  });
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(50);
  const controlCenterRef = useRef(null);

  const anyWindowOpen = Object.values(windows).some((w) => w.isOpen);

  const toggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  // Apply night mode class globally
  useEffect(() => {
    document.body.classList.toggle("night-light-active", !!systemSettings.nightLight);
  }, [systemSettings.nightLight]);

  return (
    <div className="mobile-os-container text-white font-sans select-none fixed top-0 left-0 w-dvw h-dvh overflow-hidden z-[1]">
      <MobileOSStatusBar
        now={now}
        anyWindowOpen={anyWindowOpen}
        setIsControlOpen={setIsControlOpen}
        settings={settings}
      />

      {/* iPhone 15/16/17 Interactive Dynamic Island */}
      <MobileNotch />

      <MobileOSControlCenter
        isControlOpen={isControlOpen}
        setIsControlOpen={setIsControlOpen}
        settings={settings}
        now={now}
        toggle={toggle}
        brightness={brightness}
        setBrightness={setBrightness}
        volume={volume}
        setVolume={setVolume}
        controlCenterRef={controlCenterRef}
        openWindow={openWindow}
      />

      <MobileOSAppGrid
        dockApps={dockApps.filter(
          (app) =>
            app.id !== "launchpad" &&
            app.id !== "trash" &&
            !["safari", "messages", "call", "music", "vscode", "postman", "folder"].includes(
              app.id,
            ),
        )}
        openWindow={openWindow}
      />

      <MobileOSDock
        dockApps={["call", "safari", "messages", "music"]
          .map((id) => dockApps.find((app) => app.id === id))
          .filter(Boolean)}
        openWindow={openWindow}
      />

      <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 rounded-full z-50 w-[134px] h-[5px] bg-white/55" />

      {/* Screen Brightness Overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-[9999]"
        style={{ opacity: ((100 - brightness) / 100) * 0.85 }}
      />
    </div>
  );
};

export default MobileOS;
