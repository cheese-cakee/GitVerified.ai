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



      {/* Feature 1: Verification */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
         <RevealOnScroll className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
               <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
                  ADAPTIVE VERIFICATION
               </div>
                <h2 className="text-4xl md:text-5xl font-serif font-thin text-white tracking-tight">
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
      <section className="w-full max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
         <RevealOnScroll className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="lg:order-2 space-y-8">
               <div className="inline-block px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider rounded-full">
                  INTELLIGENT FRAUD DETECTION
               </div>
                <h2 className="text-4xl md:text-5xl font-serif font-thin text-white tracking-tight">
                   The "God Mode" <br /> Integrity Gate.
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed">
                   We have zero tolerance for deception. Our agents instantly auto-reject candidates using <strong>"White Text"</strong> hacks, 0% opacity keywords, or resume stuffers who list skills they've never coded in.
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

      {/* Feature 3: The Algo Engine (Mission Phase 3) */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
         <RevealOnScroll className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8">
               <div className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-bold uppercase tracking-wider rounded-full">
                  THE ALGO ENGINE
               </div>
                <h2 className="text-4xl md:text-5xl font-serif font-thin text-white tracking-tight">
                   Measure <span className="text-yellow-400">Growth Slope</span>, <br /> not just Activity.
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed">
                   We distinguish "Learners" from "Spammers". We track LeetCode rating improvement over <strong>4-6 months</strong> and flag unnatural velocity spikes (e.g. 15 hard problems in 1 hour). We hire for trajectory.
                </p>
               <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-3 text-gray-300">
                       <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                       <span>Velocity Analysis (Hard problems / 24h)</span>
                   </div>
                   <div className="flex items-center gap-3 text-gray-300">
                       <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <span>Execution Time Percentile Checks</span>
                   </div>
               </div>
            </div>

            <div className="relative h-[400px] bg-gradient-to-tr from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden group flex items-center justify-center">
               <div className="absolute inset-0 bg-grid opacity-10"></div>
               
               {/* Visual: Grinder Pattern vs Cheater Spikes */}
               <div className="relative w-full max-w-md p-6 space-y-4">
                  {/* Grinder Card */}
                  <div className="glass-card p-4 rounded-xl border border-white/5 bg-black/50 transform translate-x-4 animate-fade-in-up">
                     <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                           <span className="text-green-500 font-bold text-sm">Valid Grinder</span>
                           <span className="text-xs text-gray-500">6 Month Consistency</span>
                        </div>
                        <div className="text-xs text-green-400 font-mono">P-SCORE +15</div>
                     </div>
                     <div className="flex gap-1 items-end h-10 w-full">
                        {[2,3,4,3,5,4,6,5,4,3,5,6,5,4,3,2,3,4,5].map((h, i) => (
                           <div key={i} className="flex-1 bg-green-500/40 rounded-sm" style={{ height: `${h * 10}%` }}></div>
                        ))}
                     </div>
                  </div>

                  {/* Cheater Card */}
                  <div className="glass-card p-4 rounded-xl border border-red-500/30 bg-red-900/10 transform -translate-x-4 border-l-4 border-l-red-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                     <div className="flex justify-between items-center mb-1">
                        <div>
                           <div className="text-xs text-red-400 uppercase font-bold tracking-wider">Suspicious Activity</div>
                           <div className="text-white font-bold text-lg">Velocity Spike</div>
                        </div>
                        <div className="px-2 py-1 bg-red-500 text-black text-xs font-bold rounded">FLAGGED</div>
                     </div>
                     <div className="mt-2 text-xs text-gray-400 font-mono">
                        {">"} 50 Hard Problems Solved in 2h
                        <br/>
                        {">"} Execution Time: 99th Percentile (Exact Match)
                     </div>
                  </div>
               </div>
            </div>

         </RevealOnScroll>
      </section>
      <section className="w-full max-w-7xl mx-auto px-6 pb-12">
        <RevealOnScroll>
            <div className="text-center mb-8 space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif font-thin text-white">The <span className="text-red-400">Broken</span> Filter.</h2>
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
               
               <h3 className="text-2xl font-serif font-thin text-white mb-6">keyword_match("Java")</h3>
               
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
               
               <h3 className="text-2xl font-serif font-thin text-white mb-6">Agent.audit(codebase)</h3>
               
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

      <section className="w-full max-w-7xl mx-auto px-6 pb-12">
        <RevealOnScroll>
          {/* Feature Card (Kestra Style Layout but Dark) */}
          <div className="glass-card p-12 rounded-3xl border border-white/10 bg-white/5 mb-20 relative overflow-hidden">
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                {/* Feature 1 */}
                <div className="text-center space-y-4 group">
                   <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                   </div>
                   <h3 className="text-2xl font-serif font-thin text-white">Oumi Uniqueness</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Our Oumi-powered LLM Judge reads code intent. It distinguishes "Generic Tutorials" (1/10) from "Novel Engineering" (10/10).
                   </p>
                </div>

                {/* Feature 2 */}
                <div className="text-center space-y-4 group">
                   <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                      <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                   </div>
                   <h3 className="text-2xl font-serif font-thin text-white">Kestra Decision Core</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Kestra orchestrates the entire forensic pipeline, using AI to synthesize signals from all agents into a final "Hire/No-Hire" verdict.
                   </p>
                </div>

                {/* Feature 3 */}
                <div className="text-center space-y-4 group">
                   <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                      <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <h3 className="text-2xl font-serif font-thin text-white">CodeRabbit Quality</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      CodeRabbit performs a deep semantic audit. We don't just check syntax; we check for maintainability, security, and SOLID principles.
                   </p>
                </div>
             </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/5 pt-12">
             <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10k+</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Candidates Verified</div>
             </div>
             <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Engineering Teams</div>
             </div>
             <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Time Saved</div>
             </div>
             <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">1M+</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Lines Audited</div>
             </div>
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
