import React, { useEffect, useRef, useState } from "react";
import WindowControls from "@components/WindowControls";
import { Search, X, ChevronLeft } from "lucide-react";
import PhotosSidebarSection from "./PhotosSidebarSection";
import PhotosGridSection from "./PhotosGridSection";
import { PhotosCollectionsMobile } from "../components/PhotosCollections";
import { photosLinks } from "@constants";
import useWindowsStore from "@store/window";

const PhotosSection = ({
  isMobile,
  gallery = [],
  favorites = [],
  filteredGallery,
  activeTab,
  onSelectPhoto,
  onSelectAlbum,
}) => {
  const { closeWindow } = useWindowsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null); // null means show main collections page
  const [forwardView, setForwardView] = useState(null);
  const scrollContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const collectionsRef = useRef(null);

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    if (currentScrollY <= 10) {
      setShowHeader(true);
    } else if (currentScrollY > lastScrollY.current + 5) {
      setShowHeader(false);
    } else if (currentScrollY < lastScrollY.current - 5) {
      setShowHeader(true);
    }
    lastScrollY.current = currentScrollY;
  };

  const _handleScrollToCollections = () => {
    if (collectionsRef.current) {
      collectionsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearchClick = () => {
    setForwardView(null);
    setShowSearchInput(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const selectAlbum = React.useCallback(
    (albumName) => {
      setForwardView(null);
      setSelectedAlbum(albumName);
      onSelectAlbum(albumName);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [onSelectAlbum],
  );

  const goBack = React.useCallback(
    ({ closeAtRoot = false } = {}) => {
      if (showSearchInput) {
        setForwardView({ type: "search", query: searchQuery });
        setShowSearchInput(false);
        setSearchQuery("");
        return true;
      }
      if (selectedAlbum) {
        setForwardView({ type: "album", album: selectedAlbum });
        setSelectedAlbum(null);
        return true;
      }
      if (closeAtRoot) {
        closeWindow("photos");
        return true;
      }
      return false;
    },
    [closeWindow, searchQuery, selectedAlbum, showSearchInput],
  );

  const goForward = React.useCallback(() => {
    if (!forwardView) return false;

    if (forwardView.type === "search") {
      setShowSearchInput(true);
      setSearchQuery(forwardView.query || "");
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else if (forwardView.type === "album") {
      setSelectedAlbum(forwardView.album);
      onSelectAlbum(forwardView.album);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    setForwardView(null);
    return true;
  }, [forwardView, onSelectAlbum]);

  useEffect(() => {
    if (!isMobile) return;

    const handleNavBack = (e) => {
      if (e.detail?.app === "photos" && goBack()) {
        e.preventDefault();
      }
    };
    const handleNavForward = (e) => {
      if (e.detail?.app === "photos" && goForward()) {
        e.preventDefault();
      }
    };
    window.addEventListener("app-navigate-back", handleNavBack);
    window.addEventListener("app-navigate-forward", handleNavForward);
    return () => {
      window.removeEventListener("app-navigate-back", handleNavBack);
      window.removeEventListener("app-navigate-forward", handleNavForward);
    };
  }, [forwardView, goBack, goForward, isMobile, searchQuery, selectedAlbum, showSearchInput]);

  // Filter gallery based on search query or selectedAlbum/activeTab
  const getFilteredPhotos = () => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return gallery.filter(
        (p) => p.category.toLowerCase().includes(q) || (p.img && p.img.toLowerCase().includes(q)),
      );
    }

    const albumToFilter = selectedAlbum || activeTab;
    if (albumToFilter === "Favorites") {
      return gallery.filter((p) => favorites.includes(p.id));
    }
    return gallery.filter((p) => p.category === albumToFilter);
  };

  const finalPhotos = getFilteredPhotos();

  if (isMobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          position: "relative",
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <div
          id="window-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            background: "rgba(242, 242, 247, 0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid #e5e5ea",
            gap: 10,
            minHeight: 42,
            zIndex: 100,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: showHeader ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <button
            onClick={() => goBack({ closeAtRoot: true })}
            style={{
              border: "none",
              background: "none",
              color: "#000",
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontSize: 12,
              fontWeight: 500,
              padding: "4px 0",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>

          {showSearchInput ? (
            <div
              style={{
                width: "180px",
                display: "flex",
                alignItems: "center",
                background: "#e5e5ea",
                borderRadius: 8,
                padding: "4px 8px",
              }}
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 12,
                  width: "100%",
                  color: "#000",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ border: "none", background: "none", padding: 2 }}
                >
                  <X size={12} style={{ color: "#8e8e93" }} />
                </button>
              )}
            </div>
          ) : (
            <h1
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#000",
                flex: 1,
                textAlign: "center",
              }}
            >
              {selectedAlbum ? selectedAlbum : "Photos"}
            </h1>
          )}

          {showSearchInput ? (
            <button
              onClick={() => {
                setShowSearchInput(false);
                setSearchQuery("");
              }}
              style={{
                border: "none",
                background: "none",
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={18} style={{ color: "#000" }} />
            </button>
          ) : (
            <button
              onClick={handleSearchClick}
              style={{ border: "none", background: "none", padding: 4 }}
            >
              <Search size={16} style={{ color: "#000" }} />
            </button>
          )}
        </div>

        {/* Unified Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="photos-main"
          style={{
            flex: 1,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            paddingTop: 42,
            paddingBottom: 80, // space for floating navigation pill
          }}
        >
          {selectedAlbum || searchQuery ? (
            /* Show Photo Grid if an album is selected or user is searching */
            <PhotosGridSection
              photos={finalPhotos}
              onSelectPhoto={onSelectPhoto}
              activeTab={searchQuery ? "Search Results" : selectedAlbum}
              isMobile
            />
          ) : (
            /* Show unified collections by default on mobile */
            <div style={{ marginTop: 16 }}>
              <PhotosCollectionsMobile
                gallery={gallery}
                favorites={favorites}
                onSelectPhoto={onSelectPhoto}
                onSelectAlbum={(albumName) => {
                  selectAlbum(albumName);
                }}
              />
            </div>
          )}
        </div>

        {/* Floating Glassy Bottom Bar */}
        <PhotosSidebarSection
          albums={photosLinks}
          activeAlbum={selectedAlbum || "Collections"}
          onSelectAlbum={(albumName) => {
            if (albumName === "Collections") {
              setForwardView(null);
              setSelectedAlbum(null);
            } else {
              selectAlbum(albumName);
            }
            if (scrollContainerRef.current && albumName === "Collections") {
              scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          isMobile
          onScrollToCollections={() => {
            setForwardView(null);
            setSelectedAlbum(null);
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          onSearchClick={handleSearchClick}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full @container bg-white rounded-xl overflow-hidden">
      <div id="window-header" className="shrink-0 !bg-gray-50 !border-b-[#d1d1d1] !px-4 !py-2">
        <WindowControls target="photos" />
        <div className="w-full flex justify-end items-center gap-3 text-gray-500">
          <Search className="icon" />
        </div>
      </div>
      <div className="flex w-full flex-1 overflow-hidden photos-main">
        <PhotosSidebarSection
          albums={photosLinks}
          activeAlbum={activeTab}
          onSelectAlbum={onSelectAlbum}
          isSidebarOpen
        />
        <PhotosGridSection
          photos={filteredGallery}
          onSelectPhoto={onSelectPhoto}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default PhotosSection;
