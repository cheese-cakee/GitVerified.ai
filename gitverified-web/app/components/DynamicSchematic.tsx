"use client";

import { useEffect, useState } from "react";

export default function DynamicSchematic() {
  const [activePacket, setActivePacket] = useState(0);

  // Simulating data flow tick
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePacket((prev) => (prev + 1) % 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-12 flex flex-col items-center select-none">

       
       {/* HEADER */}
       <div className="mb-12 flex items-center gap-3 opacity-90">
          <div className="h-[1px] w-12 bg-green-500"></div>
          <span className="font-mono text-xs text-green-400 tracking-[0.3em] font-bold">PROTOCOL: TRUST_BUT_VERIFY</span>
          <div className="h-[1px] w-12 bg-green-500"></div>
       </div>

       {/* MAIN CONTAINER */}
       <div className="flex flex-col md:flex-row items-center justify-center gap-0 w-full px-4">
          
          {/* 1. INPUT SOURCE (Rectangular) */}
          <div className="relative w-[220px] h-[140px] bg-black/80 border border-blue-500/50 rounded-lg flex flex-col overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.2)]">
             <div className="bg-blue-500/10 p-2 border-b border-blue-500/20 flex justify-between items-center">
                 <span className="text-[10px] text-blue-400 font-mono font-bold">INCOMING_REPOS</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
             </div>
             {/* Scrolling List */}
             <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10"></div>
                <div 
                   className="flex flex-col gap-2 p-3 text-[10px] font-mono text-gray-500"
                   style={{ animation: 'scroll-up 10s linear infinite' }} 
                >
                   {/* Duplicated list for infinite scroll */}
                   {Array.from({length: 20}).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                         <span className="text-blue-500/50">-</span>
                         <span>github.com/user_{8000+i}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* CONNECTOR LINE 1 (Blue) */}
          <div className="hidden md:block w-[100px] h-[2px] bg-gray-800 relative z-0">
             <div 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                style={{ animation: 'flow-right 1.5s linear infinite' }}
             ></div>
          </div>

          {/* 2. AGENT CORE (Geometric Cluster) */}
          <div className="relative mx-8 my-8 md:my-0 flex items-center justify-center bg-transparent z-10">
             
             {/* CENTRAL HUB (Kestra Circle) */}
             <div className="w-24 h-24 rounded-full border-2 border-purple-500 bg-black flex items-center justify-center relative shadow-[0_0_40px_rgba(168,85,247,0.4)] z-20">
                 <div className="absolute inset-0 rounded-full border border-purple-500/50" style={{ animation: 'pulse-ring 2s infinite' }}></div>
                 <img src="/images/kestra.png" alt="Kestra" className="w-10 h-auto relative z-10" />
                 
                 {/* Satellite Lines */}
                 <div className="absolute top-1/2 left-0 w-8 h-[2px] bg-purple-900 -translate-x-full"></div>
                 <div className="absolute top-1/2 right-0 w-8 h-[2px] bg-purple-900 translate-x-full"></div>
             </div>

             {/* SATELLITE 1 (Oumi Hexagon - Left) */}
             <div className="absolute left-[-80px] top-1/2 -translate-y-1/2 z-10">
                 <div className="w-16 h-16 bg-blue-900/10 border border-blue-500 backdrop-blur-sm flex items-center justify-center clip-hexagon hover:bg-blue-500/10 transition-colors">
                     <img src="/images/oumi.png" alt="Oumi" className="w-6 h-auto invert opacity-80" />
                 </div>

             </div>

             {/* SATELLITE 2 (Rabbit Hexagon - Right) */}
             <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 z-10">
                 <div className="w-16 h-16 bg-orange-900/10 border border-orange-500 backdrop-blur-sm flex items-center justify-center clip-hexagon hover:bg-orange-500/10 transition-colors">
                     <img src="/images/coderabbit.png" alt="Rabbit" className="w-6 h-auto opacity-80" />
                 </div>
             </div>

          </div>

          {/* CONNECTOR LINE 2 (Green) */}
          <div className="hidden md:block w-[100px] h-[2px] bg-gray-800 relative z-0">
             <div 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                style={{ animation: 'flow-right 1.5s linear infinite', animationDelay: '0.75s' }}
             ></div>
          </div>

          {/* 3. OUTPUT METRICS (Rectangular) */}
          <div className="relative w-[220px] h-[140px] bg-black/80 border border-green-500/50 rounded-lg flex flex-col shadow-[0_0_20px_rgba(34,197,94,0.2)]">
             <div className="bg-green-500/10 p-2 border-b border-green-500/20 flex justify-between items-center">
                 <span className="text-[10px] text-green-400 font-mono font-bold">VERIFIED_PRODIGY</span>
                 <span className="text-[9px] bg-green-500 text-black px-1 rounded font-bold">PASS</span>
             </div>
             <div className="flex-1 p-4 flex flex-col justify-center gap-3">
                 <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                       <span>Algorithm</span>
                       <span className="text-green-400 font-mono">98/100</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                       <div className="h-full bg-green-500 animate-[pulse_2s_infinite]" style={{width: '98%'}}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                       <span>Uniqueness</span>
                       <span className="text-blue-400 font-mono">Top 1%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 animate-[pulse_2s_infinite]" style={{width: '99%'}}></div>
                    </div>
                 </div>
             </div>
          </div>

       </div>
    </div>
  );
}
