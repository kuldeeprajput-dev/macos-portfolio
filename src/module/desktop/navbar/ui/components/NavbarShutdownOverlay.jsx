const NavbarShutdownOverlay = ({ isAsleep, isShuttingDown, setIsAsleep }) => (
  <>
    {isAsleep && (
      <div
        className="fixed inset-0 z-[999999] bg-black cursor-pointer"
        onClick={() => setIsAsleep(false)}
      ></div>
    )}
    {isShuttingDown && (
      <div className="fixed inset-0 bg-black z-[9999999] flex flex-col items-center justify-center select-none cursor-none animate-fade-in">
        <img
          src="/system/icons/apple/logo.svg"
          alt="logo"
          className="w-14 h-14 invert opacity-95 animate-pulse mb-8"
        />
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )}
  </>
);

export default NavbarShutdownOverlay;
