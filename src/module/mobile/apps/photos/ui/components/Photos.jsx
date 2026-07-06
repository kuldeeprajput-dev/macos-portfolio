import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import { gallery } from "@constants";
import { useState, useEffect } from "react";
import PhotosSection from "../section/PhotosSection";

const Photos = () => {
  const { openWindow, favorites } = useWindowsStore();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState("Library");

  const filteredGallery = gallery.filter((item) => {
    if (activeTab === "Favorites") return favorites.includes(item.id);
    return item.category === activeTab;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePhotoClick = ({ id, img }) => {
    openWindow("imgfile", {
      id,
      name: "Gallery image",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      imageUrl: img,
    });
  };

  return (
    <PhotosSection
      isMobile={isMobile}
      gallery={gallery}
      favorites={favorites}
      filteredGallery={filteredGallery}
      activeTab={activeTab}
      onSelectPhoto={handlePhotoClick}
      onSelectAlbum={setActiveTab}
    />
  );
};

const PhotosWindow = windowWrapper(Photos, "photos");
PhotosWindow.displayName = "Photos";
export default PhotosWindow;
