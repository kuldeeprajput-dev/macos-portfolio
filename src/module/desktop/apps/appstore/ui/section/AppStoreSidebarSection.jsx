import AppStoreSidebar from "../components/AppStoreSidebar";

const AppStoreSidebarSection = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  isSidebarOpen,
  onCloseSidebar,
  githubProfile,
  onProfileClick,
  isNarrow,
  isFirstLayout,
  containerHeight,
}) => (
  <>
    {isNarrow && isSidebarOpen && (
      <div
        onClick={onCloseSidebar}
        className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-20"
      />
    )}
    <div
      className={`inset-y-0 left-0 z-30 shrink-0 h-full w-52 ${
        isFirstLayout ? "" : "transition-transform duration-300 ease-in-out"
      } ${isNarrow ? "absolute bg-gray-50/95 shadow-lg border-r border-[#d1d1d1]" : "relative"} ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <AppStoreSidebar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onClose={onCloseSidebar}
        githubProfile={githubProfile}
        onProfileClick={onProfileClick}
        isNarrow={isNarrow}
        containerHeight={containerHeight}
      />
    </div>
  </>
);

export default AppStoreSidebarSection;
