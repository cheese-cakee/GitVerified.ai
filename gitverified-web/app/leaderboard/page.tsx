"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [prodigies, setProdigies] = useState([
    { rank: 1, name: "Alex Chen", handle: "@alexc_dev", pScore: 98, algo: { val: "Top 1%", trend: "up" }, unique: "High", badge: "Titan" },
    { rank: 2, name: "Sarah V.", handle: "@s_void", pScore: 96, algo: { val: "Top 5%", trend: "flat" }, unique: "High", badge: "Elite" },
    { rank: 3, name: "Jim H.", handle: "@j_hacker", pScore: 94, algo: { val: "Top 5%", trend: "up" }, unique: "Med", badge: "Elite" },
    { rank: 4, name: "David K.", handle: "@dk_code", pScore: 91, algo: { val: "Top 10%", trend: "up" }, unique: "Med", badge: "Pro" },
    { rank: 5, name: "Maria R.", handle: "@m_rodriguez", pScore: 89, algo: { val: "Top 10%", trend: "down" }, unique: "High", badge: "Pro" },
  ]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-green-500/30">
      <Header />
      
      <div className="w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
         
         <div className="text-center mb-16 space-y-4">
             <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-bold tracking-widest uppercase">Hall of Fame</div>
             <h1 className="text-5xl md:text-6xl font-serif font-thin text-white">Verified <span className="text-green-400 italic">Prodigies</span></h1>
             <p className="text-gray-400 max-w-2xl mx-auto">
                The top 1% of engineers verified by Kestra, Oumi, and CodeRabbit. <br/>
                Ranked by P-Score (Prodigy Score).
             </p>
         </div>

         {/* Leaderboard Table */}
         <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
             
             {/* Header Row */}
             <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 border-b border-white/10 text-xs font-bold text-gray-500 uppercase tracking-wider items-center">
                 <div className="col-span-1 text-center">Rank</div>
                 <div className="col-span-4">Engineer</div>
                 <div className="col-span-2 text-center">P-Score</div>
                 <div className="col-span-2 text-center">Algo Growth</div>
                 <div className="col-span-2 text-center">Uniqueness</div>
                 <div className="col-span-1 text-center">Status</div>
             </div>

             {/* Rows */}
             <div className="divide-y divide-white/5">
                 {prodigies.map((p) => (
                    <div key={p.rank} className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-colors items-center group">
                        <div className="col-span-1 text-center font-mono text-gray-400 font-bold group-hover:text-white">
                           #{p.rank}
                        </div>
                        <div className="col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center font-bold text-sm">
                                {p.name.charAt(0)}
                            </div>
                            <div>
                               <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{p.name}</div>
                               <div className="text-xs text-gray-500">{p.handle}</div>
                            </div>
                        </div>
                        <div className="col-span-2 text-center">
                            <div className="inline-block text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                               {p.pScore}
                            </div>
                        </div>
                        <div className="col-span-2 text-center flex flex-col items-center justify-center gap-1">
                            <div className="text-sm text-gray-300">{p.algo.val}</div>
                            <div className={`text-[10px] ${p.algo.trend === 'up' ? 'text-green-500' : p.algo.trend === 'down' ? 'text-red-500' : 'text-gray-500'} flex items-center gap-1`}>
                               {p.algo.trend === 'up' ? '▲ Rising' : p.algo.trend === 'down' ? '▼ Falling' : '– Flat'}
                            </div>
                        </div>
                        <div className="col-span-2 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${p.unique === 'High' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                               {p.unique}
                            </span>
                        </div>
                        <div className="col-span-1 text-center">
                             <div className="w-6 h-6 mx-auto rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                             </div>
                        </div>
                    </div>
                 ))}
             </div>

         </div>

      </div>

      <Footer />
    </main>
  );
}
