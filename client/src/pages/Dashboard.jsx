import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LeaderboardWidget from '../components/LeaderboardWidget';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [scenario, setScenario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responded, setResponded] = useState(false);
    const [message, setMessage] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scenarioRes, leaderboardRes, historyRes] = await Promise.all([
                    axios.get('/api/scenario/today'),
                    axios.get('/api/auth/leaderboard'),
                    axios.get('/api/auth/history')
                ]);

                if (scenarioRes.data.scenario) {
                    setScenario(scenarioRes.data.scenario);
                    setResponded(scenarioRes.data.responded);
                } else {
                    setScenario(null);
                }
                setLeaderboard(leaderboardRes.data);
                setHistory(historyRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOptionSelect = async (optionId) => {
        try {
            await axios.post('/api/scenario/respond', {
                scenarioId: scenario.id,
                optionId
            });
            setResponded(true);
            setMessage('Response Protocol Initiated. Awaiting Impact Analysis...');
        } catch (err) {
            console.error("Failed to submit response", err);
            // If error is 400, maybe they already responded
            if (err.response && err.response.status === 400) {
                setResponded(true);
                setMessage('You have already responded to this crisis.');
            } else {
                setMessage('Transmission Failed. Retry connection.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-crisis-dark text-white font-sans">
            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-crisis-slate px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-crisis-red animate-pulse"></div>
                    <h1 className="text-xl font-bold tracking-wider">Test Your Skills. <span className="text-gray-500 font-normal">Lead the Industry</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                        <p className="text-xs text-gray-400 uppercase">{user.jobTitle} | {user.company}</p>
                    </div>
                    <button onClick={logout} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm transition">Logout</button>
                </div>
            </nav>

            <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Status & Leaderboard */}
                <div className="space-y-6">
                    {/* Status Panel */}
                    <div className="bg-crisis-slate border-l-4 border-crisis-red p-6 rounded shadow-lg">
                        <h2 className="text-gray-400 text-xs font-bold uppercase mb-2 tracking-widest">Current Status</h2>
                        <div className="text-3xl font-bold text-white mb-1">Active Duty</div>
                        <p className="text-sm text-gray-500">Day 1 / 10</p>
                    </div>

                    <div className="bg-crisis-slate p-6 rounded shadow-lg">
                        <h2 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-widest">Performance Metrics</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1"><span>Compliance</span> <span className="font-bold text-green-400">{user.complianceScore || 0}</span></div>
                                <div className="h-2 bg-gray-700 rounded-full"><div className="h-2 bg-green-500 rounded-full" style={{ width: `${Math.min(user.complianceScore || 0, 100)}%` }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1"><span>Efficiency</span> <span className="font-bold text-yellow-500">{user.efficiencyScore || 0}</span></div>
                                <div className="h-2 bg-gray-700 rounded-full"><div className="h-2 bg-yellow-500 rounded-full" style={{ width: `${Math.min(user.efficiencyScore || 0, 100)}%` }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1"><span>Satisfaction</span> <span className="font-bold text-blue-400">{user.satisfactionScore || 0}</span></div>
                                <div className="h-2 bg-gray-700 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${Math.min(user.satisfactionScore || 0, 100)}%` }}></div></div>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Widget */}
                    <LeaderboardWidget data={leaderboard} />
                </div>

                {/* Middle/Right: Scenario & History */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="text-center p-20 text-gray-400 animate-pulse">Scanning for incoming threats...</div>
                    ) : scenario ? (
                        <div className="bg-gradient-to-br from-crisis-slate to-gray-900 border border-gray-700 rounded-xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                            </div>

                            <h3 className="text-red-500 font-bold tracking-widest uppercase mb-2 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                Incoming Scenarios
                            </h3>
                            <h2 className="text-3xl font-bold text-white mb-4">{scenario.title}</h2>
                            <p className="text-gray-300 mb-8 max-w-lg leading-relaxed">
                                {scenario.description}
                            </p>

                            {!responded ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-bold">Select Response Protocol:</p>
                                    {scenario.options && scenario.options.length > 0 ? (
                                        scenario.options.map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleOptionSelect(option.id)}
                                                className="w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded p-4 transition flex items-center justify-between group"
                                            >
                                                <span className="font-semibold text-gray-200 group-hover:text-white">{option.text}</span>
                                                <span className="text-xs text-gray-500 group-hover:text-gray-300 border border-gray-600 px-2 py-1 rounded">EXECUTE</span>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-yellow-500 text-sm">No response protocols available.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-green-900/20 border border-green-700 p-6 rounded text-center">
                                    <h4 className="text-green-400 font-bold text-xl mb-2">Response Submitted</h4>
                                    <p className="text-gray-300">{message || "Kudos! You have completed this scenario. Stay tuned for the next episode."}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-800 p-10 rounded border border-gray-700 text-center shadow-lg">
                            {history.length > 0 ? (
                                <>
                                    <div className="mx-auto w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4 border border-green-500/50">
                                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Excellent Work, Agent</h3>
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 max-w-lg mx-auto">
                                        <p className="text-green-300 font-medium">
                                            Kudos! You have successfully completed all currently available simulation modules.
                                        </p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Stay tuned for the next series of episodes.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl text-gray-400">No Active Scenarios</h3>
                                    <p className="text-gray-500 mt-2">The global situation is currently stable. Stand by regarding further alerts.</p>
                                </>
                            )}
                        </div>
                    )}

                    {/* History Widget */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Command History</h3>
                        {history.length === 0 ? (
                            <p className="text-gray-500 text-sm">No commands issued yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {history.map((h, i) => (
                                    <div key={i} className="bg-gray-900 p-3 rounded border-l-4 border-blue-500">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold text-white">{h.scenario ? h.scenario.title : 'Unknown Scenario'}</p>
                                                <p className="text-xs text-gray-400">Action: {h.option ? h.option.text : 'Unknown Action'}</p>
                                            </div>
                                            <span className="text-xs text-gray-600">{new Date(h.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Badges / Achievements */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-crisis-slate p-4 rounded text-center opacity-50 grayscale hover:grayscale-0 transition cursor-help border border-transparent hover:border-gray-600">
                                <div className="w-10 h-10 bg-gray-700 rounded-full mx-auto mb-2"></div>
                                <div className="text-xs font-bold text-gray-400">Locked Asset</div>
                            </div>
                        ))}
                    </div>
                </div>

            </main >
        </div >
    );
};

export default Dashboard;
