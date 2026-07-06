import React from "react";
import windowWrapper from "@hoc/windowWrapper";
import useSettings from "../../hooks/useSettings";
import SettingsSidebar from "./SettingsSidebar";
import SettingsPane from "./SettingsPane";

const Settings = () => {
  const { activeTab, setActiveTab, githubData, isLoading, isMobile, mobileView, setMobileView } =
    useSettings();

  React.useEffect(() => {
    const handleNavBack = (e) => {
      if (e.detail?.app === "settings" && mobileView !== "main") {
        setMobileView("main");
      }
    };
    window.addEventListener("app-navigate-back", handleNavBack);
    return () => window.removeEventListener("app-navigate-back", handleNavBack);
  }, [mobileView, setMobileView]);

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
          setMobileView={setMobileView}
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
            setMobileView={setMobileView}
          />
        </div>
      </div>
    </div>
  );
};

const SettingsWindow = windowWrapper(Settings, "settings");
export default SettingsWindow;
