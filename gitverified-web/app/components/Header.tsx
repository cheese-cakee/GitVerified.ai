"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navItems = [
    { name: "Integration", href: "/integration" },
    { name: "Resources", href: "/resources" },
    { name: "Docs", href: "/docs" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-5 md:px-12 backdrop-blur-md border-b border-white/5 bg-black/40">
      <Link href="/" className="flex items-baseline gap-1 z-20 group">
        <span className="font-serif italic text-2xl text-white font-normal">Git</span>
        <span className="font-sans font-bold text-xl text-white tracking-tight">Verified</span>
      </Link>

      {/* Sliding Tabs Navigation */}
      <div 
        className="hidden md:flex relative items-center p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-md"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {navItems.map((item, index) => (
          <Link
            key={item.name}
            href={item.href}
            className="relative px-6 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors z-10"
            onMouseEnter={() => setHoveredIndex(index)}
          >
            {item.name}
             {hoveredIndex === index && (
                <div className="absolute inset-0 bg-white/10 rounded-full border border-white/10 z-[-1] transition-all duration-200" />
            )}
          </Link>
        ))}
      </div>


      <div className="flex gap-4 items-center z-20">
        <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Sign in</Link>
        <Link href="/engine" className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
