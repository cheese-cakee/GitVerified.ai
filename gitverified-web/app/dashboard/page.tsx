"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Dashboard() {
  // Mock Data representing a Completed Scan
  const candidate = {
    name: "Alex Chen",
    role: "Senior Frontend Engineer",
    p_score: 92,
    verdict: "HIGH POTENTIAL",
    summary: "Candidate demonstrates elite algorithmic growth (+200 pts/6mo) and unique engineering intent. Code quality is high (A-), with minor security debt.",
    signals: {
      algo: { score: 95, label: "Grinder", detail: "Top 5% Consistency" },
      oumi: { score: 8.5, label: "Novel", detail: "Custom Kernel Implementation" },
      rabbit: { score: 88, label: "Clean", detail: "Follows SOLID Principles" },
      integrity: { score: 100, label: "Verified", detail: "No White Text Detected" }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-black text-white selection:bg-purple-500/30">
      <Header />
      
      <div className="w-full max-w-7xl px-6 pt-32 pb-20">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="text-sm font-mono text-gray-500 mb-2">Audit Report #8X29-A</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{candidate.name}</h1>
            <div className="text-xl text-gray-400">{candidate.role}</div>
          </div>
          <div className="text-right">
             <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">P-Score</div>
             <div className="text-6xl font-bold text-green-400">{candidate.p_score}</div>
          </div>
        </div>

        {/* Verdict Banner */}
        <div className="w-full bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-12 flex items-start gap-4">
           <div className="p-3 bg-green-500/20 rounded-full">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <div>
              <h3 className="text-xl font-bold text-white mb-1">Verdict: {candidate.verdict}</h3>
              <p className="text-gray-300 leading-relaxed font-light">
                 {candidate.summary}
              </p>
           </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           
           {/* Algo Card */}
           <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-colors group">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex justify-between">
                 <span>Algo Engine</span>
                 <span className="text-yellow-500 group-hover:animate-pulse">Active</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{candidate.signals.algo.score}</div>
              <div className="text-lg text-yellow-400 font-medium mb-2">{candidate.signals.algo.label}</div>
              <div className="text-sm text-gray-400 font-mono">{candidate.signals.algo.detail}</div>
           </div>

           {/* Oumi Card */}
           <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-blue-500/30 transition-colors group">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex justify-between">
                 <span>Oumi Uniqueness</span>
                 <span className="text-blue-500 group-hover:animate-pulse">Active</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{candidate.signals.oumi.score}/10</div>
              <div className="text-lg text-blue-400 font-medium mb-2">{candidate.signals.oumi.label}</div>
              <div className="text-sm text-gray-400 font-mono">{candidate.signals.oumi.detail}</div>
           </div>

           {/* CodeRabbit Card */}
           <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors group">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex justify-between">
                 <span>CodeRabbit Quality</span>
                 <span className="text-purple-500 group-hover:animate-pulse">Active</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{candidate.signals.rabbit.score}</div>
              <div className="text-lg text-purple-400 font-medium mb-2">{candidate.signals.rabbit.label}</div>
              <div className="text-sm text-gray-400 font-mono">{candidate.signals.rabbit.detail}</div>
           </div>

           {/* Integrity Card */}
           <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-red-500/30 transition-colors group">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex justify-between">
                 <span>Integrity Gate</span>
                 <span className="text-red-500 group-hover:animate-pulse">Locked</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{candidate.signals.integrity.score}%</div>
              <div className="text-lg text-green-400 font-medium mb-2">{candidate.signals.integrity.label}</div>
              <div className="text-sm text-gray-400 font-mono">{candidate.signals.integrity.detail}</div>
           </div>

        </div>

      </div>
      <Footer />
    </main>
  );
}
