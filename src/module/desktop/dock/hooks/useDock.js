import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useEffect } from "react";
import useWindowsStore from "@store/window";

const useDock = () => {
  const dockRef = useRef(null);
  const isDockDragging = useWindowsStore((state) => state.isDockDragging);
  const dockAppIds = useWindowsStore((state) => state.dockAppIds);

  const clearAllGSAPStyles = () => {
    if (dockRef.current) {
      const icons = dockRef.current.querySelectorAll(".dock-icon");
      icons.forEach((icon) => {
        gsap.killTweensOf(icon);
        gsap.set(icon, { clearProps: "all" });
      });
    }
  };

  useEffect(() => {
    clearAllGSAPStyles();
  }, [isDockDragging, dockAppIds]);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const animateIcons = (mouseX) => {
      if (isDockDragging) return;
      const icons = dock.querySelectorAll(".dock-icon");
      const { left } = dock.getBoundingClientRect();
      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.2) / 12000);

        gsap.to(icon, {
          scale: 1 + 0.48 * intensity,
          y: -34 * intensity,
          duration: 0.24,
          ease: "power2.out",
        });
      });
    };

    const handleMouseMove = (e) => {
      if (isDockDragging) return;
      const { left } = dock.getBoundingClientRect();
      animateIcons(e.clientX - left);
    };

    const resetIcons = () => {
      if (isDockDragging) return;
      const icons = dock.querySelectorAll(".dock-icon");
      icons.forEach((icon) =>
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.34,
          ease: "elastic.out(1, 0.72)",
        }),
      );
    };

    const handlePointerDown = (e) => {
      if (isDockDragging) return;
      const icon = e.target.closest(".dock-icon");
      if (!icon || icon.disabled) return;
      gsap.fromTo(
        icon,
        { y: -4 },
        { y: -22, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" },
      );
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);
    dock.addEventListener("pointerdown", handlePointerDown);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
      dock.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isDockDragging]);

  return dockRef;
};

export default useDock;
