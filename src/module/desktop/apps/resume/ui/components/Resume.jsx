import React, { useState, useEffect, useRef } from "react";
import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import { Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import useWindowsStore from "@store/window";

// Configure pdfjs worker to render the PDF properly from the local public directory
pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.js";

const Resume = () => {
  const isOpen = useWindowsStore((state) => state.windows.resume?.isOpen);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [containerWidth, setContainerWidth] = useState(720);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !isOpen) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.min(entry.contentRect.width - 40, 720);
        setContainerWidth(Math.max(width, 280));
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest("button, a, input, select")) return;

    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    };
    containerRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    containerRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
    containerRef.current.scrollTop = dragStartRef.current.scrollTop - dy;
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      containerRef.current.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => setScale(1.0);
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div className="flex flex-col h-full w-full @container bg-white rounded-xl overflow-hidden">
      <div
        id="window-header"
        className="shrink-0 !bg-gray-50 !border-b-[#d1d1d1] !px-4 !py-2 flex items-center justify-between gap-4 select-none"
      >
        <div className="flex items-center gap-4">
          <WindowControls target={"resume"} />
          <span className="text-xs font-semibold text-gray-500">Resume.pdf</span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-3 text-gray-500">
          <div className="flex items-center bg-gray-200/60 rounded px-1.5 py-0.5 gap-2 border border-gray-300/30">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="p-1 hover:bg-gray-300/60 rounded transition disabled:opacity-40"
              title="Zoom Out"
            >
              <ZoomOut size={13} className="text-gray-600" />
            </button>
            <button
              onClick={handleZoomReset}
              className="text-[10px] font-semibold min-w-[32px] text-center text-gray-600 hover:bg-gray-300/60 rounded px-1 transition"
              title="Reset Zoom (100%)"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 3.0}
              className="p-1 hover:bg-gray-300/60 rounded transition disabled:opacity-40"
              title="Zoom In"
            >
              <ZoomIn size={13} className="text-gray-600" />
            </button>
          </div>

          <div className="h-4 w-px bg-gray-300" />

          <button
            onClick={handleRotate}
            className="p-1.5 hover:bg-gray-200/60 rounded transition text-gray-600 hover:text-gray-800"
            title="Rotate Clockwise"
          >
            <RotateCw size={13} />
          </button>

          <a
            href="/documents/resume.pdf"
            download
            className="p-1.5 hover:bg-gray-200/60 rounded transition text-gray-600 hover:text-gray-800"
            title="Download PDF"
          >
            <Download size={13} />
          </a>
        </div>
      </div>

      <div
        ref={containerRef}
        className="resume-main flex-1 overflow-auto bg-gray-100 select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <div className="flex flex-col items-center justify-center min-h-full py-6 px-4 w-fit mx-auto">
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
                className="shadow-md rounded-lg overflow-hidden my-3 bg-white transition-transform duration-300"
              >
                <Page
                  pageNumber={index + 1}
                  width={containerWidth}
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

const ResumeWindow = windowWrapper(Resume, "resume");
export default ResumeWindow;
