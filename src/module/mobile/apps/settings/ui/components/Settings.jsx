import React from "react";
import windowWrapper from "@hoc/windowWrapper";
import useSettings from "../../hooks/useSettings";
import SettingsSidebar from "./SettingsSidebar";
import SettingsPane from "./SettingsPane";

const Settings = () => {
  const { activeTab, setActiveTab, githubData, isLoading, isMobile, mobileView, setMobileView } =
    useSettings();
  const [forwardMobileView, setForwardMobileView] = React.useState(null);

  const handleSetMobileView = React.useCallback(
    (nextView) => {
      if (nextView === "main" && mobileView !== "main") {
        setForwardMobileView(mobileView);
      } else if (nextView !== "main") {
        setForwardMobileView(null);
      }
      setMobileView(nextView);
    },
    [mobileView, setMobileView],
  );

  React.useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app !== "settings") return;

      setTimeout(() => {
        if (e.defaultPrevented) return;
        if (mobileView !== "main") {
          handleSetMobileView("main");
        }
      }, 0);
    };
    const handleNavForward = (e) => {
      if (e.detail?.app !== "settings") return;

      setTimeout(() => {
        if (e.defaultPrevented) return;
        if (mobileView === "main" && forwardMobileView) {
          setMobileView(forwardMobileView);
          setForwardMobileView(null);
        }
      }, 0);
    };
    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
  }, [forwardMobileView, handleSetMobileView, mobileView, setMobileView]);

  return (
    <div className="@container w-full h-full">
      <div className="flex h-full w-full bg-[#f3f3f3]/95 backdrop-blur-3xl overflow-hidden rounded-lg font-sans select-none border border-black/10">
        <SettingsSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          githubData={githubData}
          isLoading={isLoading}
          isMobile={isMobile}
          mobileView={mobileView}
          setMobileView={handleSetMobileView}
        />

        <div
          className={`${isMobile ? (mobileView !== "main" ? "flex w-full" : "hidden") : "flex-1 flex"} flex-col bg-white`}
        >
          <SettingsPane
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            githubData={githubData}
            isLoading={isLoading}
            isMobile={isMobile}
            mobileView={mobileView}
            setMobileView={handleSetMobileView}
          />
        </div>
      </div>
    </div>
  );
};

const SettingsWindow = windowWrapper(Settings, "settings");
export default SettingsWindow;
