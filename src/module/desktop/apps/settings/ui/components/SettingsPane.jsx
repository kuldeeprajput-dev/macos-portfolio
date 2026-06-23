import { ChevronLeft } from "lucide-react";
import { Settings as SettingsIcon } from "lucide-react";
import WindowControls from "@components/WindowControls";
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

const SettingsPane = ({
  activeTab,
  _setActiveTab,
  githubData,
  _isLoading,
  isMobile,
  _mobileView,
  setMobileView,
}) => {
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
        return <SettingsNotificationsSection />;
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
        <div className="flex items-center justify-between shrink-0 bg-[#f2f2f7] border-b border-gray-300 px-2 py-3">
          <div
            className="flex items-center gap-1 text-blue-500 cursor-pointer w-1/3"
            onClick={() => setMobileView("main")}
          >
            <ChevronLeft size={22} />
            <span className="text-[16px]">Settings</span>
          </div>
          <h2 className="text-[16px] font-semibold text-black text-center w-1/3 truncate">
            {activeTab}
          </h2>
          <div className="w-1/3"></div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto thin-scrollbar min-w-0 w-full">{renderContent()}</div>
    </>
  );
};

export default SettingsPane;
