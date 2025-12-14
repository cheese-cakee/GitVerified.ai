"use client";

import Link from "next/link";


import InteractiveGrid from "./InteractiveGrid";
import DynamicSchematic from "./DynamicSchematic";

export default function Hero() {


  return (
    <div className="relative w-full flex flex-col items-center justify-center pt-20 pb-4 px-4 min-h-[90vh] overflow-hidden">
      {/* Dynamic Background Elements */}
      <InteractiveGrid />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-purple-500/10 via-blue-500/5 to-transparent blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <div className="z-10 text-center max-w-5xl mx-auto space-y-12 w-full">
        
        {/* Main Title Area */}
        <div className="space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-gray-300 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            System Online: Verification Engine Active
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-thin text-white tracking-tight leading-tight">
            <span className="glow-text">Verification System</span>
            <br />
            <span className="text-gray-400">for Recruiters</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed font-sans">
            The agentic standard for candidate assessment.
          </p>
          
          
          <div className="flex flex-col items-center gap-6">
             {/* Partner Links */}
             <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
               <span>Powered by</span>
               <Link href="https://kestra.io" target="_blank" className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <img src="/images/kestra.png" alt="Kestra" className="h-5 w-auto" />
               </Link>
                <Link href="https://oumi.ai" target="_blank" className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <img src="/images/oumi.png" alt="Oumi" className="h-5 w-auto invert" />
               </Link>
                <Link href="https://coderabbit.ai" target="_blank" className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <img src="/images/coderabbit.png" alt="CodeRabbit" className="h-5 w-auto" />
               </Link>
             </div>

             {/* GitHub Button */}
             <Link href="https://github.com/RealEngineers-ai/gitverified" target="_blank" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors border-b border-white/20 hover:border-white pb-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span>View Source on GitHub</span>
             </Link>
          </div>
        </div>

         {/* Dynamic Abstract Visual / Code Snippet */}
        <DynamicSchematic />
      </div>
    </div>
  );
}
