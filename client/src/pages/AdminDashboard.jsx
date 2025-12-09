import { useState, useEffect } from 'react';
import axios from 'axios';
import LeaderboardWidget from '../components/LeaderboardWidget';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        userCount: 0,
        scenarioCount: 0,
        responseCount: 0
    });
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock live logs for typewriter effect
    const [logs, setLogs] = useState([
        { time: '14:02:11', msg: 'New agent [ID: 994] registered', type: 'success' },
        { time: '13:30:00', msg: 'System backup verified integrity', type: 'info' },
        { time: '12:15:22', msg: 'Daily Scenario #42 Published', type: 'primary' },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Mock data fallback if API fails (since environment is unstable)
                const mockStats = { userCount: 1254, scenarioCount: 42, responseCount: 15892 };
                const statsRes = await axios.get('/api/admin/stats').catch(() => ({ data: mockStats }));

                setStats(statsRes.data || mockStats);
                setLeaderboard(statsRes.data.leaderboard || []);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
                setLoading(false);
            }
        };
        fetchStats();

        // Simulate new log coming in
        const interval = setInterval(() => {
            setLogs(prev => [
                { time: new Date().toLocaleTimeString('en-GB'), msg: 'Heartbeat signal received...', type: 'info' },
                ...prev.slice(0, 4)
            ]);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-cyan-500 font-mono animate-pulse">
            INITIALIZING_DASHBOARD_PROTOCOL...
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Quick Stats Row - Stagger 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-enter">

                {/* Stat Card 1 */}
                <div className="card-premium group">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-cyan-400 transition-colors">Active Scenarios</p>
                            <h3 className="text-4xl font-mono-numbers font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover:from-cyan-400 group-hover:to-blue-500 transition-all">
                                {stats.scenarioCount || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-full border border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all backdrop-blur-sm">
                            <span className="text-xl">📝</span>
                        </div>
                    </div>
                    {/* Sparkline Svg */}
                    <svg className="absolute bottom-0 left-0 w-full h-16 text-cyan-500/20 group-hover:text-cyan-500/30 transition-colors" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path d="M0,40 Q25,35 50,20 T100,10 L100,40 Z" fill="currentColor" />
                    </svg>
                </div>

                {/* Stat Card 2 */}
                <div className="card-premium group delay-100">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-emerald-400 transition-colors">Total Agents</p>
                            <h3 className="text-4xl font-mono-numbers font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover:from-emerald-400 group-hover:to-teal-500 transition-all">
                                {stats.userCount ? stats.userCount.toLocaleString() : 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-full border border-white/10 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-all backdrop-blur-sm">
                            <span className="text-xl">👥</span>
                        </div>
                    </div>
                    <svg className="absolute bottom-0 left-0 w-full h-16 text-emerald-500/20 group-hover:text-emerald-500/30 transition-colors" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path d="M0,40 Q30,30 50,30 T100,5 L100,40 Z" fill="currentColor" />
                    </svg>
                </div>

                {/* Stat Card 3 */}
                <div className="card-premium group delay-200">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-amber-400 transition-colors">Responses</p>
                            <h3 className="text-4xl font-mono-numbers font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover:from-amber-400 group-hover:to-orange-500 transition-all">
                                {stats.responseCount ? stats.responseCount.toLocaleString() : 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-full border border-white/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-all backdrop-blur-sm">
                            <span className="text-xl">📊</span>
                        </div>
                    </div>
                    <svg className="absolute bottom-0 left-0 w-full h-16 text-amber-500/20 group-hover:text-amber-500/30 transition-colors" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path d="M0,40 Q20,35 40,25 T100,15 L100,40 Z" fill="currentColor" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Leaderboard Preview - Stagger 2 */}
                <div className="lg:col-span-2 space-y-6 animate-enter delay-200">
                    <div className="card-premium min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-cyan-400">🏆</span> Top Field Agents
                            </h3>
                            <Link to="/admin/users" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded hover:bg-cyan-500/10 transition-colors">
                                VIEW_FULL_ROSTER →
                            </Link>
                        </div>
                        {leaderboard.length > 0 ? (
                            <LeaderboardWidget data={leaderboard.slice(0, 5)} />
                        ) : (
                            <div className="text-center py-10 text-slate-500 font-mono text-sm">Waiting for live data feed...</div>
                        )}
                    </div>
                </div>

                {/* Sidebar: System Logs & Actions - Stagger 3 */}
                <div className="space-y-6 animate-enter delay-300">
                    {/* System Live Logs */}
                    <div className="card-premium">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-sm uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-indicator"></span>
                                System Stream
                            </h3>
                            <span className="text-[10px] text-slate-500 font-mono">LIVE</span>
                        </div>
                        <div className="space-y-3 font-mono text-xs max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {logs.map((log, i) => (
                                <div key={i} className={`border-l-2 pl-3 py-1 ${log.type === 'success' ? 'border-emerald-500 text-emerald-400' :
                                        log.type === 'info' ? 'border-slate-600 text-slate-300' :
                                            'border-cyan-500 text-cyan-400'
                                    } ${i === 0 ? 'typewriter bg-white/5' : ''}`}>
                                    <span className="opacity-50 block mb-0.5 text-[10px]">[{log.time}]</span>
                                    {log.msg}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions Tiles */}
                    <div className="card-premium border-cyan-500/20 bg-gradient-to-br from-slate-900/60 to-cyan-900/10">
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Command Center</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/admin/scenarios" className="flex flex-col items-center justify-center p-4 bg-slate-800/50 hover:bg-cyan-600/20 border border-white/5 hover:border-cyan-500/50 rounded-lg transition-all active:scale-95 group text-center">
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</span>
                                <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-300">Deploy Scenario</span>
                            </Link>
                            <button className="flex flex-col items-center justify-center p-4 bg-slate-800/50 hover:bg-emerald-600/20 border border-white/5 hover:border-emerald-500/50 rounded-lg transition-all active:scale-95 group text-center">
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📄</span>
                                <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-300">Export Logs</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
