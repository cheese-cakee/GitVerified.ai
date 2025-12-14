"use client";

import { useEffect, useRef, useState } from "react";

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsHovering(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div 
        ref={containerRef} 
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
    >
      {/* 
        Layer 1: Base Grid 
        ALWAYS VISIBLE. Low opacity default grid.
      */}
      <div 
        className="absolute inset-0 bg-grid opacity-[0.1]" 
      ></div>

      {/* 
        Layer 2: Bright White Grid (The "Glow")
        Uses a brighter gradient than the base grid.
        Only revealed by the mouse mask.
      */}
      <div
        className="absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: isHovering ? 1 : 0,
          backgroundSize: "50px 50px",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          maskImage: `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
        }}
      ></div>
    </div>
  );
}
