import AppleTV from "@module/desktop/apps/appletv/ui/view/AppleTVView";
import AppStore from "@module/desktop/apps/appstore/ui/view/AppStoreView";
import Calculator from "@module/desktop/apps/calculator/ui/view/CalculatorView";
import Calendar from "@module/desktop/apps/calendar/ui/view/CalendarView";
import Call from "@module/desktop/apps/call/ui/view/CallView";
import Contact from "@module/desktop/apps/contact/ui/view/ContactView";
import Dock from "@module/desktop/dock/ui/view/DockView";
import DockVisualizer from "./dock/ui/components/DockVisualizer";
import Finder from "@module/desktop/apps/finder/ui/view/FinderView";
import FontBook from "@module/desktop/apps/fontbook/ui/view/FontBookView";
import Home from "@module/desktop/home/ui/view/HomeView";
import Image from "@module/desktop/apps/image/ui/view/ImageView";
import Launchpad from "@module/desktop/apps/launchpad/ui/view/LaunchpadView";
import Map from "@module/desktop/apps/map/ui/view/MapView";
import Messages from "@module/desktop/apps/messages/ui/view/MessagesView";
import Music from "@module/desktop/apps/music/ui/view/MusicView";
import Navbar from "@module/desktop/navbar/ui/view/NavbarView";
import Notes from "@module/desktop/apps/notes/ui/view/NotesView";
import Photos from "@module/desktop/apps/photos/ui/view/PhotosView";
import dynamic from "next/dynamic";
import Postman from "@module/desktop/apps/postman/ui/view/PostmanView";
const Resume = dynamic(() => import("@module/desktop/apps/resume/ui/view/ResumeView"), {
  ssr: false,
});
import Safari from "@module/desktop/apps/safari/ui/view/SafariView";
import Settings from "@module/desktop/apps/settings/ui/view/SettingsView";
import Telegram from "@module/desktop/apps/telegram/ui/view/TelegramView";
const Terminal = dynamic(() => import("@module/desktop/apps/terminal/ui/view/TerminalView"), {
  ssr: false,
});
import Text from "@module/desktop/apps/text/ui/view/TextView";
import VSCode from "@module/desktop/apps/vscode/ui/view/VSCodeView";
import Weather from "@module/desktop/apps/weather/ui/view/WeatherView";
import Welcome from "@module/desktop/apps/welcome/ui/view/WelcomeView";
import Notch from "./notch/ui/view/NotchView";
import { useState, useEffect } from "react";
import useWindowsStore from "@store/window";
import AboutPortfolioModal from "@module/desktop/navbar/ui/components/AboutPortfolioModal";

const DesktopWidgets = dynamic(() => import("./widgets/ui/components/Widgets"), {
  ssr: false,
});

const Desktop = () => {
  const isAboutPortfolioOpen = useWindowsStore((state) => state.isAboutPortfolioOpen);
  const setAboutPortfolioOpen = useWindowsStore((state) => state.setAboutPortfolioOpen);
  const githubRedirect = useWindowsStore((state) => state.githubRedirect);
  const setGithubRedirect = useWindowsStore((state) => state.setGithubRedirect);
  const [popupCoords, setPopupCoords] = useState(null);

  useEffect(() => {
    const updateCoords = () => {
      if (githubRedirect) {
        const sourceId = githubRedirect.source || "finder";
        const targetEl = document.getElementById(sourceId);
        if (targetEl && targetEl.style.display !== "none") {
          const rect = targetEl.getBoundingClientRect();
          setPopupCoords({
            left: rect.left + rect.width / 2,
            top: rect.top + rect.height / 2,
          });
        } else {
          setPopupCoords(null);
        }
      }
    };

    updateCoords();

    const sourceId = githubRedirect?.source || "finder";
    const targetEl = document.getElementById(sourceId);
    let observer;
    if (targetEl) {
      observer = new MutationObserver(updateCoords);
      observer.observe(targetEl, { attributes: true, attributeFilter: ["style", "class"] });
    }

    window.addEventListener("resize", updateCoords);
    return () => {
      window.removeEventListener("resize", updateCoords);
      if (observer) observer.disconnect();
    };
  }, [githubRedirect]);

  return (
    <main>
      <Navbar />
      <Notch />
      <div
        id="desktop-area"
        className="absolute top-[35px] bottom-0 left-0 right-0 pointer-events-none z-0"
      />
      <DesktopWidgets />
      <div id="folder-bounds" className="absolute pointer-events-none z-0" />
      <Welcome />
      <DockVisualizer />
      <Dock />
      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <Image />
      <Contact />
      <Photos />
      <Settings />
      <Calculator />
      <Notes />
      <Messages />
      <AppleTV />
      <Call />
      <AppStore />
      <Calendar />
      <Weather />
      <VSCode />
      <Postman />
      <Map />
      <FontBook />
      <Telegram />
      <Music />
      <Launchpad />
      <Home />

      {/* About Portfolio Dialog */}
      <AboutPortfolioModal
        show={isAboutPortfolioOpen}
        onClose={() => setAboutPortfolioOpen(false)}
      />

      {/* Global Redirection Popup */}
      {githubRedirect && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(2px)",
            zIndex: 10000,
          }}
          className="animate-in fade-in duration-150"
          onClick={() => setGithubRedirect(null)}
        >
          <div
            style={
              popupCoords
                ? {
                    position: "absolute",
                    left: `${popupCoords.left}px`,
                    top: `${popupCoords.top}px`,
                    transform: "translate(-50%, -50%)",
                  }
                : {
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }
            }
            className="bg-white/95 border border-zinc-200/50 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center space-y-4 transform animate-in zoom-in-95 duration-150 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-neutral-100 text-neutral-800 rounded-full flex items-center justify-center mx-auto shadow-inner border border-zinc-200">
              <img src="/images/github.webp" alt="GitHub" className="w-7 h-7 object-contain" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800">Open in New Tab</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Do you want to open the GitHub repository for{" "}
                <span className="font-semibold text-gray-700">{githubRedirect.name}</span> in a new
                tab?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setGithubRedirect(null)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-zinc-200"
              >
                Cancel
              </button>
              <a
                href={githubRedirect.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setGithubRedirect(null)}
                className="flex-1 py-2 bg-[#24292e] hover:bg-[#1f2327] active:bg-[#1a1e21] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer text-center"
              >
                Open Link
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Desktop;
