import useWindowsStore from "@store/window";

const NavbarBatteryMenu = ({ battery }) => {
  const { systemSettings } = useWindowsStore();
  const isLowPowerActive =
    systemSettings.lowPowerMode === "Always" ||
    (systemSettings.lowPowerMode === "Battery" && !battery.charging) ||
    (systemSettings.lowPowerMode === "Adapter" && battery.charging);

  return (
    <div className="battery-indicator" title="Battery status">
      <span className="battery-text" style={{ color: isLowPowerActive ? "#f59e0b" : undefined }}>
        {battery.supported && battery.level !== null ? `${battery.level}%` : "--"}
      </span>
      <div
        className="battery-icon-shell"
        style={{ borderColor: isLowPowerActive ? "rgba(245, 158, 11, 0.4)" : undefined }}
      >
        <div
          className="battery-level"
          style={{
            width: `${battery.supported && battery.level !== null ? battery.level : 0}%`,
            backgroundColor: isLowPowerActive ? "#f59e0b" : undefined,
          }}
        />
        <i style={{ backgroundColor: isLowPowerActive ? "#f59e0b" : undefined }} />
      </div>
      {battery.charging && (
        <img
          src="/system/icons/battery-charging.svg"
          alt="Charging"
          aria-hidden="true"
          className="w-[14px]"
        />
      )}
    </div>
  );
};

export default NavbarBatteryMenu;
