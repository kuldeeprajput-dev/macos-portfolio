import React, { useState, useRef, useEffect } from "react";
import { Heart, RotateCw, ZoomIn, ZoomOut, Download } from "lucide-react";
import useWindowsStore from "@store/window";
import { gallery } from "@constants";

const ImageViewer = ({ imageUrl, imageMobUrl, name, id, isMobile }) => {
  const { favorites, toggleFavorite, openWindow } = useWindowsStore();
  const isFavorite = id ? favorites.includes(id) : false;

  // Swipe / Drag states
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const [rotation, setRotation] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const initialPinchDistanceRef = useRef(null);
  const initialZoomScaleRef = useRef(1);

  const currentIndex = gallery.findIndex((item) => item.id === id);

  const goToNext = () => {
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % gallery.length;
    const nextPhoto = gallery[nextIndex];
    openWindow("imgfile", {
      id: nextPhoto.id,
      name: "Gallery image",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      imageUrl: nextPhoto.img,
    });
  };

  const goToPrev = () => {
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    const prevPhoto = gallery[prevIndex];
    openWindow("imgfile", {
      id: prevPhoto.id,
      name: "Gallery image",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      imageUrl: prevPhoto.img,
    });
  };

  // Reset view state on photo change
  useEffect(() => {
    setRotation(0);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  }, [id]);

  const handleTouchStart = (e) => {
    if (e.targetTouches.length === 2) {
      // Pinch gesture
      const touch1 = e.targetTouches[0];
      const touch2 = e.targetTouches[1];
      const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      initialPinchDistanceRef.current = distance;
      initialZoomScaleRef.current = zoomScale;
      setIsDragging(false); // Disable dragging when pinching
      setIsPinching(true);
    } else if (e.targetTouches.length === 1) {
      const touch = e.targetTouches[0];
      if (zoomScale > 1) {
        setIsDragging(true);
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        panStartRef.current = { x: panOffset.x, y: panOffset.y };
      } else {
        setTouchStart(touch.clientX);
      }
    }
  };

  const handleTouchMove = (e) => {
    if (e.targetTouches.length === 2 && initialPinchDistanceRef.current) {
      // Pinching
      const touch1 = e.targetTouches[0];
      const touch2 = e.targetTouches[1];
      const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const factor = distance / initialPinchDistanceRef.current;
      const newScale = Math.min(4, Math.max(0.5, initialZoomScaleRef.current * factor));
      setZoomScale(parseFloat(newScale.toFixed(2)));
    } else if (e.targetTouches.length === 1) {
      const touch = e.targetTouches[0];
      if (zoomScale > 1 && isDragging) {
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        setPanOffset({
          x: panStartRef.current.x + deltaX,
          y: panStartRef.current.y + deltaY,
        });
      } else if (zoomScale === 1) {
        setTouchEnd(touch.clientX);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (e.targetTouches.length < 2) {
      initialPinchDistanceRef.current = null;
      setIsPinching(false);
    }

    if (zoomScale > 1) {
      setIsDragging(false);
    } else {
      // If we pinched back to <= 1, reset offset
      if (zoomScale <= 1) {
        setPanOffset({ x: 0, y: 0 });
      }

      if (e.targetTouches.length === 0) {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
          goToNext();
        } else if (isRightSwipe) {
          goToPrev();
        }
        setTouchStart(0);
        setTouchEnd(0);
      }
    }
  };

  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleZoomIn = () => setZoomScale((s) => Math.min(4, parseFloat((s + 0.25).toFixed(2))));
  const handleZoomOut = () => {
    setZoomScale((s) => {
      const newScale = Math.max(0.25, parseFloat((s - 0.25).toFixed(2)));
      if (newScale <= 1) {
        setPanOffset({ x: 0, y: 0 });
      }
      return newScale;
    });
  };
  const handleZoomFit = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };
  const handleDownload = () => {
    const activeUrl = imageMobUrl || imageUrl;
    if (!activeUrl) return;
    const a = document.createElement("a");
    a.href = activeUrl;
    a.download = name || "photo";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isMobile) {
    return (
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          overflow: "hidden",
          position: "relative",
          width: "100%",
          height: "100%",
          userSelect: "none",
        }}
      >
        {imageUrl ? (
          <>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) rotate(${rotation}deg) scale(${zoomScale})`,
                  transition:
                    isDragging || isPinching
                      ? "none"
                      : "transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transformOrigin: "center center",
                }}
              >
                <img
                  src={imageMobUrl ? imageMobUrl : imageUrl}
                  alt={name}
                  style={{
                    width: "90%",
                    height: "90%",
                    objectFit: "contain",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* Floating Glassmorphic Toolbar (iPhone style) */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "8px 16px",
                borderRadius: 24,
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                zIndex: 100,
                pointerEvents: "auto",
              }}
            >
              {/* Rotate button */}
              <button
                onClick={handleRotate}
                style={{
                  border: "none",
                  background: "none",
                  padding: 4,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1c1c1e",
                }}
              >
                <RotateCw size={18} />
              </button>

              <div style={{ width: 1, height: 16, background: "rgba(0,0,0,0.15)" }} />

              {/* Zoom Out button */}
              <button
                onClick={handleZoomOut}
                disabled={zoomScale <= 0.25}
                style={{
                  border: "none",
                  background: "none",
                  padding: 4,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1c1c1e",
                  opacity: zoomScale <= 0.25 ? 0.3 : 1,
                }}
              >
                <ZoomOut size={18} />
              </button>

              {/* Zoom label */}
              <button
                onClick={handleZoomFit}
                style={{
                  border: "none",
                  background: "none",
                  padding: "2px 4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#1c1c1e",
                  minWidth: 32,
                }}
              >
                {Math.round(zoomScale * 100)}%
              </button>

              {/* Zoom In button */}
              <button
                onClick={handleZoomIn}
                disabled={zoomScale >= 4}
                style={{
                  border: "none",
                  background: "none",
                  padding: 4,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1c1c1e",
                  opacity: zoomScale >= 4 ? 0.3 : 1,
                }}
              >
                <ZoomIn size={18} />
              </button>

              <div style={{ width: 1, height: 16, background: "rgba(0,0,0,0.15)" }} />

              {/* Favorite button */}
              {id && (
                <button
                  onClick={() => toggleFavorite(id)}
                  style={{
                    border: "none",
                    background: "none",
                    padding: 4,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Heart
                    size={18}
                    fill={isFavorite ? "#ff3b30" : "transparent"}
                    color={isFavorite ? "#ff3b30" : "#1c1c1e"}
                    strokeWidth={2}
                  />
                </button>
              )}

              {/* Download button */}
              <button
                onClick={handleDownload}
                style={{
                  border: "none",
                  background: "none",
                  padding: 4,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1c1c1e",
                }}
              >
                <Download size={18} />
              </button>
            </div>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex items-center justify-center bg-gray-50 p-2 @sm:p-4 relative">
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain drop-shadow-md rounded-md"
          />
          {id && (
            <button
              onClick={() => toggleFavorite(id)}
              className="absolute top-6 right-6 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm shadow-xl z-10"
            >
              <Heart
                size={24}
                fill={isFavorite ? "#ff3b30" : "transparent"}
                color={isFavorite ? "#ff3b30" : "white"}
                strokeWidth={2}
              />
            </button>
          )}
        </>
      ) : null}
    </div>
  );
};

export default ImageViewer;
