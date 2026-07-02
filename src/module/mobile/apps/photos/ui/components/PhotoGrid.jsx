import React from "react";

const PhotoGrid = ({ photos = [], onPhotoClick }) => (
  <div className="gallery flex-1 overflow-y-auto p-2 @sm:p-5">
    <ul className="flex flex-col @sm:grid @sm:grid-cols-5 @sm:grid-rows-5 gap-2.5">
      {photos.map(({ id, img }) => (
        <li key={id} onClick={() => onPhotoClick({ id, img })}>
          <img src={img} alt={`Gallery image ${id}`} />
        </li>
      ))}
    </ul>
  </div>
);

const PhotoGridMobile = ({ photos = [], onPhotoClick, activeTab }) => {
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 10px 6px" }}>
        <p style={{ fontSize: 22, fontWeight: 700, color: "#000" }}>{activeTab}</p>
        <p style={{ fontSize: 13, color: "#8e8e93", marginTop: 2 }}>{photos.length} Photos</p>
      </div>

      <div style={{ padding: "4px 2px", minHeight: 180 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
          }}
        >
          {photos.map(({ id, img }) => (
            <button
              key={id}
              onClick={() => onPhotoClick({ id, img })}
              style={{
                aspectRatio: "1/1",
                overflow: "hidden",
                background: "#e5e5ea",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <img
                src={img}
                alt={`Gallery image ${id}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { PhotoGrid, PhotoGridMobile };
