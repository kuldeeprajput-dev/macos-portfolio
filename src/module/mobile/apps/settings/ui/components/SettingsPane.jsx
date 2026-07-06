import { ChevronLeft } from "lucide-react";
import { Settings as SettingsIcon } from "lucide-react";
import SettingsWiFiSection from "../section/SettingsWiFiSection";
import SettingsGeneralSection from "../section/SettingsGeneralSection";
import SettingsAppearanceSection from "../section/SettingsAppearanceSection";
import SettingsBluetoothSection from "../section/SettingsBluetoothSection";
import SettingsNetworkSection from "../section/SettingsNetworkSection";
import SettingsNotificationsSection from "../section/SettingsNotificationsSection";
import SettingsSoundSection from "../section/SettingsSoundSection";
import SettingsFocusSection from "../section/SettingsFocusSection";
import SettingsScreenTimeSection from "../section/SettingsScreenTimeSection";
import SettingsAccessibilitySection from "../section/SettingsAccessibilitySection";
import SettingsControlCenterSection from "../section/SettingsControlCenterSection";
import SettingsAppleIDSection from "../section/SettingsAppleIDSection";
import SettingsBatterySection from "../section/SettingsBatterySection";

const SettingsPane = ({ activeTab, githubData, isMobile, mobileView, setMobileView }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "Wi-Fi":
        return <SettingsWiFiSection />;
      case "General":
        return <SettingsGeneralSection />;
      case "Appearance":
        return <SettingsAppearanceSection />;
      case "Bluetooth":
        return <SettingsBluetoothSection />;
      case "Network":
        return <SettingsNetworkSection />;
      case "Notifications":
        return (
          <SettingsNotificationsSection isActive={!isMobile || mobileView === "Notifications"} />
        );
      case "Sound":
        return <SettingsSoundSection />;
      case "Focus":
        return <SettingsFocusSection />;
      case "Screen Time":
        return <SettingsScreenTimeSection />;
      case "Accessibility":
        return <SettingsAccessibilitySection />;
      case "Control Center":
        return <SettingsControlCenterSection />;
      case "Apple ID":
        return <SettingsAppleIDSection githubData={githubData} />;
      case "Battery":
        return <SettingsBatterySection />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-in fade-in duration-300">
            <SettingsIcon size={48} className="mb-4 opacity-20" />
            <p className="text-[14px] font-medium text-gray-500">
              Settings for {activeTab} are not available yet.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      {isMobile && (
        <div className="flex items-center justify-between shrink-0 bg-[#f2f2f7]/95 backdrop-blur-md border-b border-zinc-200 px-4 pt-5 pb-3 z-40 select-none">
          <div
            className="flex items-center gap-0.5 text-black cursor-pointer w-1/3 active:opacity-60 transition-opacity"
            onClick={() => setMobileView("main")}
          >
            <ChevronLeft size={18} strokeWidth={2.5} className="relative -left-0.5" />
            <span className="text-[14px] font-semibold">Settings</span>
          </div>
          <h2 className="text-[17px] font-bold text-gray-900 text-center w-1/3 truncate">
            {activeTab}
          </h2>
          <div className="w-1/3"></div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto bg-[#f2f2f7] scrollbar-none pb-16">
        {renderContent()}
      </div>
    </>
  );
};

export default SettingsPane;
