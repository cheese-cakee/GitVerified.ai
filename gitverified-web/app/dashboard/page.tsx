import Link from "next/link";
import { getLeaderboardData } from "../lib/api";

export default async function Dashboard() {
    const CANDIDATES = await getLeaderboardData();

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-white/20">

            {/* Header */}
            <header className="flex justify-between items-center mb-12 max-w-6xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                    <h1 className="text-xl font-semibold tracking-tight">GitVerified <span className="text-gray-500 font-normal">/ Batch #004</span></h1>
                </div>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Log out</Link>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-3xl font-bold glow-text mb-2">Leaderboard</h2>
                        <p className="text-gray-400">Top candidates sorted by P-Score (Passion + Truth + Code).</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-gray-300 hover:bg-white/10 transition-colors">
                            Export CSV
                        </button>
                        <button className="px-4 py-2 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">
                            Start New Batch
                        </button>
                    </div>
                </div>

                {/* Table Card */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/50 backdrop-blur-md">
                    {CANDIDATES.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No evaluations found. Run a candidate evaluation to see results here.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4 font-medium">Rank</th>
                                    <th className="px-6 py-4 font-medium">Candidate</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">P-Score</th>
                                    <th className="px-6 py-4 font-medium">Flags</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {CANDIDATES.map((c, i) => (
                                    <tr key={c.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 font-mono text-sm">#{i + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{c.name}</div>
                                            <div className="text-xs text-gray-500">ID: {c.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge status={c.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${getScoreColor(c.p_score)}`}>{c.p_score}</span>
                                                <span className="text-xs text-gray-600">/100</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-400">{c.flag}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-sm text-gray-500 hover:text-white transition-colors">View Report &rarr;</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}

function Badge({ status }: { status: string }) {
    const s = status.toUpperCase();
    let colorClass = "bg-gray-500/10 text-gray-500 border-gray-500/20";
    let pulse = false;

    if (s === "PASS" || s === "INTERVIEW") {
        colorClass = "bg-green-500/10 text-green-500 border-green-500/20";
        pulse = true;
    } else if (s === "WAITLIST") {
        colorClass = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    } else if (s === "REJECT") {
        colorClass = "bg-red-500/10 text-red-500 border-red-500/20";
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
            {pulse && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>}
            {status}
        </span>
    )
}

function getScoreColor(score: number) {
    if (score >= 90) return "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]";
    if (score >= 70) return "text-yellow-400";
    return "text-red-500";
}
