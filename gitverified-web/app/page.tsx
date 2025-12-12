"use client";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import RevealOnScroll from "./components/RevealOnScroll";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center relative selection:bg-white/20">
      
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Trust, but verify Section */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-8 pb-8 text-center">
         <RevealOnScroll>
            <h2 className="text-2xl md:text-3xl font-serif font-thin italic text-white mb-2">
               Trust, but <span className="text-blue-400">verify</span>.
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
               Traditional resumes are full of hallucinations. <br/>
               GitVerified uses agentic AI to audit the actual source of truth: 
               <span className="text-white font-medium border-b border-white/20 pb-0.5 ml-2">The Codebase.</span>
            </p>
         </RevealOnScroll>
      </section>

      {/* Feature 1: Verification */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
         <RevealOnScroll className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
               <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
                  ADAPTIVE VERIFICATION
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Self-healing audits for <br /> consistently changing repos.
               </h2>
               <p className="text-lg text-gray-400 leading-relaxed">
                  Repos change? Branches merge? No problem. GitVerified's agents adapt to project structure changes, correctly identifying core logic even if filenames or architectures shift completely.
               </p>
               <Link href="/docs" className="inline-flex items-center text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                  Learn More <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
               </Link>
            </div>

            <div className="relative h-[400px] bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden group">
               {/* Visual Mockup for Adaptive Verification */}
               <div className="absolute inset-0 bg-grid opacity-20"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%]">
                  <div className="glass-card p-4 rounded-lg border border-white/10 mb-4 animate-scale-in">
                     <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-mono text-gray-500">Scanning structure...</div>
                        <div className="text-green-500 text-xs">Healed</div>
                     </div>
                     <div className="h-2 bg-gray-800 rounded mb-2 w-3/4"></div>
                     <div className="h-2 bg-gray-800 rounded w-1/2"></div>
                  </div>
                   <div className="glass-card p-4 rounded-lg border border-blue-500/30 bg-blue-900/10">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <div className="text-xs font-bold text-white">Detected Logic Shift</div>
                     </div>
                     <div className="text-xs text-gray-400 font-mono">
                        New entry point: /src/core/v2/app.ts
                     </div>
                  </div>
               </div>
            </div>

         </RevealOnScroll>
      </section>

      {/* Feature 2: Anti-Cheat */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
         <RevealOnScroll className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="lg:order-2 space-y-8">
               <div className="inline-block px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider rounded-full">
                  INTELLIGENT FRAUD DETECTION
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Catch what the human eye <br /> misses completely.
               </h2>
               <p className="text-lg text-gray-400 leading-relaxed">
                  From "white text" keywords to copy-pasted tutorial code, our agents run forensic analysis on commit history to ensure the candidate actually wrote the code they claim.
               </p>
               <Link href="/docs/security" className="inline-flex items-center text-red-400 font-semibold hover:text-red-300 transition-colors">
                  See Security Specs <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
               </Link>
            </div>

             <div className="lg:order-1 relative h-[400px] bg-gradient-to-bl from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden group">
               <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors duration-500"></div>
               
               {/* Abstract forensic grid */}
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-red-900/20 to-transparent"></div>
               
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
                  {/* Identification Card */}
                  <div className="glass-card p-6 rounded-xl border border-red-500/20 bg-black/40">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                           <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                           </svg>
                        </div>
                        <div>
                           <div className="text-sm font-bold text-white">Risk Detected</div>
                           <div className="text-xs text-red-400">High Confidence</div>
                        </div>
                     </div>
                     
                     <div className="space-y-3">
                         <div className="flex justify-between items-center text-xs p-2 rounded bg-white/5 border border-white/5">
                            <span className="text-gray-400">Pattern:</span>
                            <span className="text-red-300 font-mono">Hidden Markers</span>
                         </div>
                         <div className="flex justify-between items-center text-xs p-2 rounded bg-white/5 border border-white/5">
                            <span className="text-gray-400">Origin:</span>
                            <span className="text-red-300 font-mono">Known Farm</span>
                         </div>
                     </div>
                  </div>
               </div>
            </div>

         </RevealOnScroll>
      </section>

      {/* The Problem: ATS vs GitVerified */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-32">
        <RevealOnScroll>
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-5xl font-serif font-bold italic text-white">The <span className="text-red-400">Broken</span> Filter.</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                75% of qualified resumes are rejected by ATS bots before a human ever sees them. 
                <br/>Recruiters miss hidden gems; Candidates hit a brick wall.
                </p>
            </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Chart: Traditional ATS */}
            <div className="glass-card p-8 rounded-2xl border border-red-500/10 bg-red-900/5 relative overflow-hidden group hover:border-red-500/30 transition-colors">
               <div className="absolute top-0 right-0 bg-red-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">TRADITIONAL ATS</div>
               
               <h3 className="text-xl font-bold text-white mb-6">keyword_match("Java")</h3>
               
               {/* Visual Funnel */}
               <div className="space-y-4">
                  <div className="w-full bg-white/5 rounded-lg h-12 flex items-center px-4 relative overflow-hidden">
                     <div className="absolute inset-0 bg-white/10 w-[100%]"></div>
                     <span className="relative text-sm text-gray-300 z-10 flex justify-between w-full"><span>Applicants</span> <span>100%</span></span>
                  </div>
                  <div className="w-full bg-white/5 rounded-lg h-12 flex items-center px-4 relative overflow-hidden">
                     <div className="absolute inset-0 bg-red-500/20 w-[25%] transition-all duration-1000 group-hover:bg-red-500/30"></div>
                     <span className="relative text-sm text-gray-300 z-10 flex justify-between w-full"><span>Passed Keyword Filter</span> <span>25%</span></span>
                  </div>
                   <div className="w-full bg-white/5 rounded-lg h-12 flex items-center px-4 relative overflow-hidden">
                     <div className="absolute inset-0 bg-red-500/20 w-[5%] transition-all duration-1000 group-hover:bg-red-500/30"></div>
                     <span className="relative text-sm text-gray-300 z-10 flex justify-between w-full"><span>Interviewed</span> <span>5%</span></span>
                  </div>
               </div>
               
               <p className="mt-6 text-sm text-red-300 italic">
                  "Rejects great engineers who don't optimize for keywords."
               </p>
            </div>

            {/* Chart: GitVerified Agentic */}
            <div className="glass-card p-8 rounded-2xl border border-green-500/10 bg-green-900/5 relative overflow-hidden group hover:border-green-500/30 transition-colors">
               <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">GITVERIFIED AGENTS</div>
               
               <h3 className="text-xl font-bold text-white mb-6">Agent.audit(codebase)</h3>
               
               {/* Visual Funnel */}
               <div className="space-y-4">
                  <div className="w-full bg-white/5 rounded-lg h-12 flex items-center px-4 relative overflow-hidden">
                     <div className="absolute inset-0 bg-white/10 w-[100%]"></div>
                     <span className="relative text-sm text-gray-300 z-10 flex justify-between w-full"><span>Applicants</span> <span>100%</span></span>
                  </div>
                  <div className="w-full bg-white/5 rounded-lg h-12 flex items-center px-4 relative overflow-hidden">
                     <div className="absolute inset-0 bg-green-500/20 w-[85%] transition-all duration-1000 group-hover:bg-green-500/30"></div>
                     <span className="relative text-sm text-gray-300 z-10 flex justify-between w-full"><span>Verified Skills</span> <span>85%</span></span>
                  </div>
                   <div className="w-full bg-white/5 rounded-lg h-12 flex items-center px-4 relative overflow-hidden">
                     <div className="absolute inset-0 bg-green-500/20 w-[60%] transition-all duration-1000 group-hover:bg-green-500/30"></div>
                     <span className="relative text-sm text-gray-300 z-10 flex justify-between w-full"><span>Quality Candidates</span> <span>60%</span></span>
                  </div>
               </div>
               
               <p className="mt-6 text-sm text-green-300 italic">
                  "Identifies talent based on actual code quality, not PDF hacking."
               </p>
            </div>

        </RevealOnScroll>
      </section>

      <Footer />
    </main>
  );
}


function FeatureRow({ title, desc, delay = 0 }: { title: string, desc: string, delay?: number }) {
   return (
      <div 
        className="flex gap-4 group animate-fade-in-up"
        style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
      >
         <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors shrink-0">
            <div className="w-2 h-2 bg-white rounded-full"></div>
         </div>
         <div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm">{desc}</p>
         </div>
      </div>
   )
}

function FloatingSnippet({ code, label, color, delay, top, left }: { code: string, label: string, color: string, delay: number, top: string, left: string }) {
   return (
     <div 
       className="absolute glass-card px-4 py-3 rounded-lg border border-white/10 animate-fade-in-up" 
       style={{ 
          top, 
          left, 
          animationDelay: `${delay}s`,
          animationFillMode: 'both'
       }}
     >
        <div className="text-xs text-gray-500 mb-1 font-mono flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500`}></div>
           {label}
        </div>
        <div className="font-mono text-sm text-white">
           {code}
        </div>
     </div>
   )
}
