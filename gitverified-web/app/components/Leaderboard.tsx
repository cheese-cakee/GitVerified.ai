export default function Leaderboard() {
  const candidates = [
    { rank: 1, name: "Alex Chen", score: 98, github: "A+", verdict: "Must Hire", status: "Verified" },
    { rank: 2, name: "Sarah Jones", score: 94, github: "A", verdict: "Strong Hire", status: "Verified" },
    { rank: 3, name: "Michael T.", score: 88, github: "B+", verdict: "Interview", status: "Verified" },
    { rank: 4, name: "David Kim", score: 72, github: "C", verdict: "Review", status: "Flagged" },
    { rank: 5, name: "Emily R.", score: 45, github: "F", verdict: "Reject", status: "Ghost" },
  ];

  return (
    <div className="w-full h-full glass-card border-white/10 rounded-xl overflow-hidden flex flex-col animate-fade-in-up">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div>
           <h2 className="text-xl font-bold text-white">Candidate Leaderboard</h2>
           <p className="text-sm text-gray-400">Batch #0042 • 5 Candidates Processed</p>
        </div>
        <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded hover:bg-gray-200 transition-colors">
           Export CSV
        </button>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar p-0">
        <table className="w-full text-left border-collapse">
           <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
              <tr>
                 <th className="p-4 border-b border-white/5">Rank</th>
                 <th className="p-4 border-b border-white/5">Candidate</th>
                 <th className="p-4 border-b border-white/5">GitVerified Score</th>
                 <th className="p-4 border-b border-white/5">Code Health</th>
                 <th className="p-4 border-b border-white/5">Verdict</th>
                 <th className="p-4 border-b border-white/5 text-right">Action</th>
              </tr>
           </thead>
           <tbody className="text-sm">
              {candidates.map((c, i) => (
                 <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/5 group">
                    <td className="p-4 font-mono text-gray-500">#{c.rank}</td>
                    <td className="p-4">
                       <div className="font-bold text-white">{c.name}</div>
                       <div className="text-xs text-gray-500">{c.status}</div>
                    </td>
                    <td className="p-4">
                       <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${c.score >= 90 ? 'bg-green-500 text-black' : c.score >= 70 ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}`}>
                             {c.score}
                          </div>
                       </div>
                    </td>
                    <td className="p-4 font-mono">
                       <span className={`${c.github.startsWith('A') ? 'text-green-400' : c.github.startsWith('F') ? 'text-red-400' : 'text-yellow-400'}`}>{c.github}</span>
                    </td>
                    <td className="p-4">
                       <span className={`px-2 py-1 rounded text-xs font-medium ${
                          c.verdict === 'Must Hire' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                          c.verdict === 'Reject' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 
                          'bg-white/10 text-gray-300 border border-white/10'
                       }`}>
                          {c.verdict}
                       </span>
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">View Report →</button>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
