"use client";

import { useEffect, useRef, useState } from "react";

export default function RevealOnScroll({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(ref.current!);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it enters fully
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div 
        ref={ref} 
        className={`${className} reveal-hidden ${isVisible ? "reveal-visible" : ""}`}
        style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
