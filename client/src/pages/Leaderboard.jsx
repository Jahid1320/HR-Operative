import { useState } from 'react';

const Leaderboard = () => {
    // Mock Data
    const [leaders] = useState([
        { id: 1, name: "Sarah Jenkins", company: "Global Corp", score: 9850, rank: "Grand Master" },
        { id: 2, name: "David Chen", company: "TechFlow Solutions", score: 9720, rank: "Master" },
        { id: 3, name: "Elena Rodriguez", company: "Innovate HR", score: 9550, rank: "Expert" },
        { id: 4, name: "Michael Chang", company: "Fusion Dynamics", score: 9100, rank: "Expert" },
        { id: 5, name: "Islam Jahid", company: "Thinktive AI", score: 8900, rank: "Advanced" },
        { id: 6, name: "Emily Wilson", company: "NextGen Systems", score: 8750, rank: "Advanced" },
        { id: 7, name: "James Opoku", company: "AfroTech wages", score: 8600, rank: "Intermediate" },
        { id: 8, name: "Nadia Al-Fayed", company: "Desert Sands Payroll", score: 8450, rank: "Intermediate" },
        { id: 9, name: "Klaus Müller", company: "EuroPay GmbH", score: 8300, rank: "Intermediate" },
        { id: 10, name: "Sophie Dubois", company: "Lumière HR", score: 8150, rank: "Novice" },
    ]);

    const getRankColor = (index) => {
        switch (index) {
            case 0: return "text-yellow-400"; // Gold
            case 1: return "text-slate-300";   // Silver
            case 2: return "text-amber-600";   // Bronze
            default: return "text-slate-400";
        }
    };

    const getBadgeColor = (index) => {
        switch (index) {
            case 0: return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]";
            case 1: return "bg-slate-400/20 text-slate-300 border-slate-400/50 shadow-[0_0_15px_rgba(203,213,225,0.3)]";
            case 2: return "bg-amber-600/20 text-amber-500 border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.3)]";
            default: return "bg-navy-800 text-slate-400 border-navy-700";
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-navy-700 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <span className="text-4xl">🏆</span> Global Rankings
                    </h1>
                    <p className="text-slate-400 mt-2">Top performing operatives across the global network.</p>
                </div>
                <div className="flex gap-2 text-sm font-mono bg-navy-800 p-2 rounded-lg border border-navy-700">
                    <span className="text-slate-500">YOUR RANK:</span>
                    <span className="text-brand-400 font-bold">#5</span>
                </div>
            </div>

            {/* Top 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {leaders.slice(0, 3).map((leader, index) => (
                    <div key={leader.id} className={`relative p-6 rounded-xl border flex flex-col items-center text-center transition-all hover:scale-105 duration-300 ${index === 0 ? 'bg-gradient-to-b from-navy-800 to-navy-900 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)] order-first md:order-2 md:-mt-8 z-10' : 'bg-navy-800/50 border-navy-700 md:order-1'}`}>
                        {index === 0 && <div className="absolute -top-6 text-5xl drop-shadow-lg">👑</div>}
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-2 ${getBadgeColor(index)}`}>
                            {index + 1}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{leader.name}</h3>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">{leader.company}</p>
                        <div className="bg-navy-950/50 px-4 py-2 rounded-lg border border-white/5 w-full">
                            <div className="text-xs text-slate-500 mb-1">SCORE</div>
                            <div className={`text-2xl font-mono font-bold ${getRankColor(index)}`}>{leader.score.toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Full List Table */}
            <div className="bg-navy-800/50 rounded-xl border border-navy-700 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-navy-900/50 border-b border-navy-700 text-xs uppercase tracking-wider text-slate-400">
                            <th className="p-4 font-medium w-20 text-center">Rank</th>
                            <th className="p-4 font-medium">Operative</th>
                            <th className="p-4 font-medium hidden md:table-cell">Company</th>
                            <th className="p-4 font-medium hidden sm:table-cell">Status</th>
                            <th className="p-4 font-medium text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700">
                        {leaders.map((leader, index) => (
                            <tr key={leader.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 text-center">
                                    <span className={`font-mono font-bold ${index < 3 ? getRankColor(index) : 'text-slate-500'}`}>
                                        #{index + 1}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
                                            {leader.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className={`font-bold ${leader.name === 'Islam Jahid' ? 'text-brand-400' : 'text-white'}`}>
                                                {leader.name} {leader.name === 'Islam Jahid' && '(You)'}
                                            </div>
                                            <div className="text-xs text-slate-500 md:hidden">{leader.company}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-400 text-sm hidden md:table-cell">{leader.company}</td>
                                <td className="p-4 hidden sm:table-cell">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${index < 3 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                            index < 6 ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' :
                                                'bg-slate-700/30 text-slate-400 border-slate-700/50'
                                        }`}>
                                        {leader.rank}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-mono font-bold text-white group-hover:text-brand-400 transition-colors">
                                    {leader.score.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
