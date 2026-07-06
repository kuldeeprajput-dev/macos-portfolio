import React from "react";
import { ChevronRight } from "lucide-react";

export const PhotosCollectionsMobile = ({
  gallery = [],
  favorites = [],
  onSelectPhoto,
  onSelectAlbum,
}) => {
  // Extract categories for albums cover images
  const getCoverImage = (category) => {
    const item = gallery.find((p) => p.category === category);
    return item ? item.img : "/images/gal1.webp";
  };

  const getFavoritesCover = () => {
    if (favorites.length > 0) {
      const favId = favorites[0];
      const item = gallery.find((p) => p.id === favId);
      if (item) return item.img;
    }
    return "/images/gal1.webp";
  };

  const albumList = [
    {
      name: "Library",
      count: gallery.filter((p) => p.category === "Library").length,
      img: getCoverImage("Library"),
    },
    {
      name: "Memories",
      count: gallery.filter((p) => p.category === "Memories").length,
      img: getCoverImage("Memories"),
    },
    {
      name: "Places",
      count: gallery.filter((p) => p.category === "Places").length,
      img: getCoverImage("Places"),
    },
    {
      name: "People",
      count: gallery.filter((p) => p.category === "People").length,
      img: getCoverImage("People"),
    },
    ...(favorites.length > 0
      ? [{ name: "Favorites", count: favorites.length, img: getFavoritesCover() }]
      : []),
  ];

  const peoplePhotos = gallery.filter((p) => p.category === "People");
  const memoriesPhotos = gallery.filter((p) => p.category === "Memories");

  const peopleNames = ["John", "Sarah", "Mom", "Alex", "Emma", "David"];

  return (
    <div style={{ padding: "0 10px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Recent Days Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>Recent Days</h2>
          <ChevronRight size={18} style={{ color: "#8e8e93" }} />
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 4,
          }}
          className="scrollbar-none"
        >
          {[
            { date: "Yesterday", count: 3, photos: gallery.slice(0, 3) },
            { date: "May 28", count: 2, photos: gallery.slice(3, 5) },
            { date: "May 20", count: 4, photos: gallery.slice(5, 9) },
          ].map((day, idx) => (
            <div
              key={idx}
              style={{
                flexShrink: 0,
                width: 140,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  position: "relative",
                  background: "#e5e5ea",
                }}
                onClick={() => day.photos[0] && onSelectPhoto(day.photos[0])}
              >
                {day.photos[0] && (
                  <img
                    src={day.photos[0].img}
                    alt={day.date}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                    padding: "8px 10px",
                  }}
                >
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{day.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* People & Pets Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>People & Pets</h2>
          <ChevronRight size={18} style={{ color: "#8e8e93" }} />
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 4,
          }}
          className="scrollbar-none"
        >
          {peoplePhotos.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => onSelectPhoto(p)}
              style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                  border: "2px solid #fff",
                  background: "#e5e5ea",
                }}
              >
                <img
                  src={p.img}
                  alt="person"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <span style={{ fontSize: 12, color: "#1c1c1e", fontWeight: 500 }}>
                {peopleNames[idx % peopleNames.length]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Memories Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>Memories</h2>
          <ChevronRight size={18} style={{ color: "#8e8e93" }} />
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 4,
          }}
          className="scrollbar-none"
        >
          {memoriesPhotos.map((p, idx) => {
            const memoryTitles = [
              "Summer Adventure",
              "Sunset Glow",
              "Cozy Vibe",
              "On the Road",
              "Nature Walk",
            ];
            return (
              <div
                key={p.id}
                onClick={() => onSelectPhoto(p)}
                style={{
                  flexShrink: 0,
                  width: 220,
                  height: 140,
                  borderRadius: 18,
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                  background: "#e5e5ea",
                }}
              >
                <img
                  src={p.img}
                  alt="memory"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.9)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 14,
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      opacity: 0.8,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Memory
                  </span>
                  <p
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: 700,
                      marginTop: 2,
                      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                  >
                    {memoryTitles[idx % memoryTitles.length]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Albums Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>Albums</h2>
          <ChevronRight size={18} style={{ color: "#8e8e93" }} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {albumList.map((album) => (
            <div
              key={album.name}
              onClick={() => onSelectAlbum(album.name)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                  background: "#e5e5ea",
                }}
              >
                <img
                  src={album.img}
                  alt={album.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1c1c1e" }}>{album.name}</p>
                <p style={{ fontSize: 12, color: "#8e8e93" }}>{album.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
