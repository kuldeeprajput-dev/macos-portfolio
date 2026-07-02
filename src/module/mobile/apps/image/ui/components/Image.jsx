import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import { useState, useEffect } from "react";
import ImageToolbar from "./ImageToolbar";
import ImageViewer from "./ImageViewer";

const Image = () => {
  const { windows } = useWindowsStore();
  const data = windows.imgfile?.data;
  const { name = "Image", imageMobUrl = "", imageUrl = "", id } = data || {};
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <>
        <div
          id="window-header"
          className="shrink-0 bg-white/80 backdrop-blur-md border-b border-zinc-200/50 px-4 py-2 flex items-center justify-between z-20 relative"
        >
          <WindowControls target="imgfile" />
          <p className="text-xs font-bold text-zinc-800 absolute left-1/2 -translate-x-1/2 overflow-hidden text-ellipsis whitespace-nowrap pointer-events-none">
            {name}
          </p>
          <div className="w-[60px]" />
        </div>
        <ImageViewer
          imageUrl={imageUrl}
          imageMobUrl={imageMobUrl}
          name={name}
          id={id}
          isMobile={true}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col h-full w-full @container bg-white rounded-xl overflow-hidden">
      <ImageToolbar name={name} />
      <ImageViewer
        imageUrl={imageUrl}
        imageMobUrl={imageMobUrl}
        name={name}
        id={id}
        isMobile={false}
      />
    </div>
  );
};

const ImageWindow = windowWrapper(Image, "imgfile");
export default ImageWindow;
