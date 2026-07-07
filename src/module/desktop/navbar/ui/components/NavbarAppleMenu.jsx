import NavbarPowerMenu from "./NavbarPowerMenu";

const NavbarAppleMenu = ({
  isAppleMenuOpen,
  setIsAppleMenuOpen,
  openWindow,
  setIsAsleep,
  setIsShuttingDown,
}) => {
  if (!isAppleMenuOpen) return null;

  const closeMenu = () => setIsAppleMenuOpen(false);
  const menuSections = [
    [
      {
        label: "About This Mac",
        action: "about",
      },
    ],
    [
      {
        label: "System Settings...",
        onClick: () => openWindow("settings", { tab: "Apple ID", subPage: null }),
      },
      { label: "App Store...", onClick: () => openWindow("appstore") },
    ],
    [
      { label: "Recent Items", meta: "›", disabled: true },
      { label: "Force Quit...", meta: "⌥⌘⎋", onClick: () => setIsAsleep(true) },
    ],
    [
      { label: "Lock Screen", meta: "⌃⌘Q", onClick: () => setIsAsleep(true) },
      { label: "Log Out Kuldeep...", meta: "⇧⌘Q", onClick: () => setIsAsleep(true) },
    ],
  ];

  const handleItemClick = (item) => {
    if (item.disabled || (!item.onClick && !item.action)) return;
    closeMenu();
    if (item.action === "about") {
      openWindow("settings", { tab: "General", subPage: "about" });
      return;
    }
    item.onClick();
  };

  return (
    <div className="apple-menu" role="menu" aria-label="Apple menu">
      {menuSections.map((section, sectionIndex) => (
        <div className="apple-menu-section" key={sectionIndex}>
          {section.map((item) => (
            <button
              type="button"
              className="apple-menu-item"
              disabled={item.disabled}
              key={item.label}
              onClick={() => handleItemClick(item)}
              role="menuitem"
            >
              <span>{item.label}</span>
              {item.meta && <span className="apple-menu-meta">{item.meta}</span>}
            </button>
          ))}
        </div>
      ))}
      <NavbarPowerMenu
        setIsAppleMenuOpen={setIsAppleMenuOpen}
        setIsAsleep={setIsAsleep}
        setIsShuttingDown={setIsShuttingDown}
      />
    </div>
  );
};

export default NavbarAppleMenu;
