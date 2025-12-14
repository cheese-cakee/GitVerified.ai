"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navItems = [
    { 
      name: "Integration", 
      href: "/integration",
      dropdown: [
        { 
          title: "GitHub", 
          desc: "Native integration with GitHub Actions", 
          icon: (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          )
        },
        { 
          title: "GitLab", 
          desc: "Seamless CI/CD pipelines", 
          icon: (
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.18-1.19l.17-.26L2.9 8.2l.43-1.33a.85.85 0 0 1 1.62.05l.89 2.8h12.32l.89-2.8a.85.85 0 0 1 1.62-.05l.43 1.33 1.56 4.74.16.26a.85.85 0 0 1-.17 1.19z"/></svg>
          )
        },
        { 
          title: "Bitbucket", 
          desc: "Enterprise grade connection", 
          icon: (
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M2.6 2h18.8l-2.9 15.6-1.5 4.3H7L5.5 17.6 2.6 2zM14 13.9l1.6-6.1H8.4l1.6 6.1h4z"/></svg>
          )
        }
      ]
    },
    { 
      name: "Resources", 
      href: "/resources",
      dropdown: [
        { 
          title: "Documentation", 
          desc: "Guides and API reference", 
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          )
        },
        { 
          title: "Blog", 
          desc: "Engineering insights & news", 
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          )
        },
        { 
          title: "Case Studies", 
          desc: "How teams verify skills", 
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          )
        }
      ]
    },
    { name: "Docs", href: "/docs" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-5 md:px-12 backdrop-blur-md border-b border-white/5 bg-black/40">
      <Link href="/" className="flex items-baseline gap-1 z-20 group">
        <span className="font-serif italic text-2xl text-white font-normal">Git</span>
        <span className="font-sans font-bold text-xl text-white tracking-tight">Verified</span>
      </Link>

      {/* Navigation with Dropdowns */}
      <div 
        className="hidden md:flex relative items-center gap-1"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {navItems.map((item, index) => (
          <div key={item.name} className="relative group">
            <Link
              href={item.href}
              className="relative px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors z-10 block"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              {item.name}
            </Link>
            
            {/* Dropdown Menu (Dark Glassmorphism) */}
            {item.dropdown && hoveredIndex === index && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-2 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-500/10 animate-fade-in-up z-50 transform origin-top"
                style={{ animationDuration: '0.2s' }}
              >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl pointer-events-none" />
                  <div className="relative flex flex-col gap-1">
                    {item.dropdown.map((subItem) => (
                        <Link 
                            key={subItem.title} 
                            href="#" 
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group/item"
                        >
                            <span className="flex items-center justify-center w-8 h-8 bg-white/5 rounded-md border border-white/5 group-hover/item:border-white/20 transition-colors">
                                {subItem.icon}
                            </span>
                            <div>
                                <div className="text-sm font-medium text-white group-hover/item:text-blue-400 transition-colors">{subItem.title}</div>
                                <div className="text-xs text-gray-500 leading-tight mt-0.5">{subItem.desc}</div>
                            </div>
                        </Link>
                    ))}
                  </div>
              </div>
            )}
          </div>
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
