import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";

const BootScreen = ({ onComplete, isMobile: propIsMobile }) => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const [isMobile, setIsMobile] = useState(propIsMobile);

  useEffect(() => {
    setIsMobile(propIsMobile);
  }, [propIsMobile]);

  useEffect(() => {
    if (propIsMobile === undefined && typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, [propIsMobile]);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: onComplete,
        });
      },
    });

    if (isMobile) {
      // Metallic titanium gradient sweep animation on Apple logo
      gsap.fromTo(
        "#titaniumGradient",
        { attr: { x1: "-100%", x2: "0%" } },
        { attr: { x1: "100%", x2: "200%" }, duration: 2.2, ease: "power1.inOut", repeat: -1 },
      );

      // Simulate the iPhone boot delay
      tl.to(
        {},
        {
          duration: 2.5,
          delay: 0.3,
        },
      );
    } else {
      // Simulate the Mac boot progress bar
      tl.to(progressRef.current, {
        width: "100%",
        duration: 2.2,
        ease: "power1.inOut",
        delay: 0.4,
      });
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-99999 bg-black flex flex-col items-center justify-center py-12 px-6 select-none overflow-hidden"
      >
        {/* Apple Logo (Centered) */}
        <div className="flex flex-col items-center justify-center flex-1 w-full">
          <div className="relative">
            {/* Metallic Titanium Apple Logo */}
            <svg
              viewBox="0 0 384 512"
              width="65"
              height="65"
              className="drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]"
            >
              <defs>
                <linearGradient id="titaniumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#444446" />
                  <stop offset="35%" stopColor="#8e8e93" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="65%" stopColor="#8e8e93" />
                  <stop offset="100%" stopColor="#444446" />
                </linearGradient>
              </defs>
              <path
                d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-93.1 22.7-18.9 0-46.5-20.9-77-20.9-38.6 0-77.2 22.7-98.8 59.8-43.2 74-27 181 16.2 243.6 20.8 30.1 46.2 64.1 79.5 63 32.5-1.1 44.9-20.7 83.9-20.7 38.8 0 50.4 20.9 84.1 20.4 34.6-.5 56.4-31.5 76.9-61.9 23.5-35.4 33-69.6 33.8-71.4-1.2-.5-71-27.1-71.4-105.2zM227.5 106.6c31.1-37.4 25.5-74.1 24.3-81.8-31.6 1.3-68.9 21-91.2 57.6-18.4 30.5-27 68.3-21.2 103.5 35 2.7 69-18.7 88.1-79.3z"
                fill="url(#titaniumGradient)"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Boot Screen (Classic Mac Style)
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-99999 bg-black flex flex-col items-center justify-center gap-16"
    >
      <img src="/system/icons/appleLogo.svg" alt="Apple Logo" width="70" height="70" />
      <div className="w-56 h-1.5 bg-[#333] rounded-full overflow-hidden">
        <div ref={progressRef} className="h-full bg-white rounded-full w-0" />
      </div>
    </div>
  );
};

export default BootScreen;
