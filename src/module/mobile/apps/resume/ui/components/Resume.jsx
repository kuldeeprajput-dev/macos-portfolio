import React, { useState, useEffect, useRef } from "react";
import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import { Download, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure pdfjs worker to render the PDF properly from the local public directory
pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.js";

const Resume = () => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0); // Default scale starts at 1.0 (fits dynamic container width)
  const [containerWidth, setContainerWidth] = useState(350);

  const containerRef = useRef(null);
  const scaleRef = useRef(scale);

  // Keep ref up to date to avoid stale closures in event listeners
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    const handleResize = () => {
      // Subtract margins/padding (e.g. 32px) to fit mobile screens perfectly
      const width = Math.min(window.innerWidth - 32, 600);
      setContainerWidth(width);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pinch to zoom gesture implementation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startDist = 0;
    let startScale = 1.0;

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        startDist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
        startScale = scaleRef.current;
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2 && startDist > 0) {
        if (e.cancelable) e.preventDefault();

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

        const factor = dist / startDist;
        const newScale = Math.min(Math.max(startScale * factor, 0.5), 2.5);
        setScale(newScale);
      }
    };

    const onTouchEnd = () => {
      startDist = 0;
    };

    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.15, 0.5));
  const handleResetZoom = () => setScale(1.0);

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-xl overflow-hidden relative">
      <div
        id="window-header"
        className="shrink-0 !bg-gray-50 !border-b-[#d1d1d1] !px-4 !py-2 flex items-center justify-between"
      >
        <WindowControls target={"resume"} />
        <h2>Resume.pdf</h2>
        <a href="/documents/resume.pdf" download className="cursor-pointer" title="Download resume">
          <Download className="icon" />
        </a>
      </div>

      <div ref={containerRef} className="resume-main flex-1 overflow-auto bg-[#f2f2f7] min-h-0">
        <div className="flex flex-col items-center justify-center min-h-full w-fit mx-auto py-6 px-4">
          <Document
            file="/documents/resume.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="p-4 text-gray-500">Loading Resume...</div>}
            error={<div className="p-4 text-rose-500">Failed to load PDF.</div>}
            className="flex flex-col items-center"
          >
            {Array.from(new Array(numPages || 0), (el, index) => (
              <div
                key={`page_container_${index + 1}`}
                className="shadow-md rounded-lg overflow-hidden my-3"
              >
                <Page
                  pageNumber={index + 1}
                  width={containerWidth}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>

      {/* Floating Zoom controls */}
      {numPages && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-4 text-white shadow-lg z-30">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-1 hover:bg-white/20 rounded active:scale-95 transition disabled:opacity-40"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-xs font-semibold select-none min-w-[45px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 2.0}
            className="p-1 hover:bg-white/20 rounded active:scale-95 transition disabled:opacity-40"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <div className="h-4 w-px bg-white/20" />
          <button
            onClick={handleResetZoom}
            className="p-1 hover:bg-white/20 rounded active:scale-95 transition"
            title="Reset"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

const ResumeWindow = windowWrapper(Resume, "resume");
export default ResumeWindow;
