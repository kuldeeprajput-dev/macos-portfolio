import AppleTV from "@module/mobile/apps/appletv/ui/view/AppleTVView";
import AppStore from "@module/mobile/apps/appstore/ui/view/AppStoreView";
import Calculator from "@module/mobile/apps/calculator/ui/view/CalculatorView";
import Calendar from "@module/mobile/apps/calendar/ui/view/CalendarView";
import Call from "@module/mobile/apps/call/ui/view/CallView";
import Contact from "@module/mobile/apps/contact/ui/view/ContactView";
import Finder from "@module/mobile/apps/finder/ui/view/FinderView";
import FontBook from "@module/mobile/apps/fontbook/ui/view/FontBookView";
import Image from "@module/mobile/apps/image/ui/view/ImageView";
import Launchpad from "@module/mobile/apps/launchpad/ui/view/LaunchpadView";
import Map from "@module/mobile/apps/map/ui/view/MapView";
import Messages from "@module/mobile/apps/messages/ui/view/MessagesView";
import MobileOS from "@module/mobile/home/ui/view/MobileOSView";
import Music from "@module/mobile/apps/music/ui/view/MusicView";
import Notes from "@module/mobile/apps/notes/ui/view/NotesView";
import Photos from "@module/mobile/apps/photos/ui/view/PhotosView";
import dynamic from "next/dynamic";
const Resume = dynamic(() => import("@module/mobile/apps/resume/ui/view/ResumeView"), {
  ssr: false,
});
import Safari from "@module/mobile/apps/safari/ui/view/SafariView";
import Settings from "@module/mobile/apps/settings/ui/view/SettingsView";
import Telegram from "@module/mobile/apps/telegram/ui/view/TelegramView";
const Terminal = dynamic(() => import("@module/mobile/apps/terminal/ui/view/TerminalView"), {
  ssr: false,
});
import Text from "@module/mobile/apps/text/ui/view/TextView";
import Weather from "@module/mobile/apps/weather/ui/view/WeatherView";
import AssistiveTouch from "./assistivetouch/ui/components/AssistiveTouch";
import useWindowsStore from "@store/window";

const Mobile = () => {
  const githubRedirect = useWindowsStore((state) => state.githubRedirect);
  const setGithubRedirect = useWindowsStore((state) => state.setGithubRedirect);

  return (
    <main className="mobile-os">
      <MobileOS />
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
      <Map />
      <FontBook />
      <Telegram />
      <Music />
      <Launchpad />
      <AssistiveTouch />

      {/* Global Redirection Popup */}
      {githubRedirect && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
          }}
          className="animate-in fade-in duration-150 flex items-center justify-center"
          onClick={() => setGithubRedirect(null)}
        >
          <div
            className="bg-white/95 border border-zinc-200/50 p-6 rounded-2xl shadow-2xl max-w-[280px] w-full mx-4 text-center space-y-4 transform animate-in zoom-in-95 duration-150 backdrop-blur-md"
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
            <div className="flex gap-2 pt-1">
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

export default Mobile;
