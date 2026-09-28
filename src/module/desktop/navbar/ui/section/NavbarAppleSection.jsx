import NavbarAppleMenu from "../components/NavbarAppleMenu";

const NavbarAppleSection = ({
  isAppleMenuOpen,
  setIsAppleMenuOpen,
  openWindow,
  setIsAsleep,
  setIsShuttingDown,
}) => (
  <>
    <img
      src="/system/icons/apple/logo.svg"
      alt="logo"
      className="apple-logo hover:bg-black/5 rounded px-2"
      onClick={(e) => {
        e.stopPropagation();
        setIsAppleMenuOpen(!isAppleMenuOpen);
      }}
    />
    <NavbarAppleMenu
      isAppleMenuOpen={isAppleMenuOpen}
      setIsAppleMenuOpen={setIsAppleMenuOpen}
      openWindow={openWindow}
      setIsAsleep={setIsAsleep}
      setIsShuttingDown={setIsShuttingDown}
    />
  </>
);

export default NavbarAppleSection;
