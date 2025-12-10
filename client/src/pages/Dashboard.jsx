import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LeaderboardWidget from '../components/LeaderboardWidget';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [scenarios, setScenarios] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
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

                if (scenarioRes.data.scenarios) {
                    setScenarios(scenarioRes.data.scenarios);
                } else {
                    setScenarios([]);
                }
                setLeaderboard(leaderboardRes.data);
                setHistory(historyRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                let errorMsg = "Unknown error";
                if (err.response) {
                    if (typeof err.response.data === 'object' && err.response.data.msg) {
                        errorMsg = err.response.data.msg;
                    } else if (typeof err.response.data === 'string') {
                        errorMsg = err.response.data;
                    } else {
                        errorMsg = `Status ${err.response.status}`;
                    }
                } else if (err.message) {
                    errorMsg = err.message;
                }
                setMessage(`SYSTEM FAILURE: ${errorMsg}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOptionSelect = async (optionId) => {
        if (scenarios.length === 0) return;
        const currentScenario = scenarios[currentIndex];

        try {
            await axios.post('/api/scenario/respond', {
                scenarioId: currentScenario.id,
                optionId
            });

            // Refresh history
            const historyRes = await axios.get('/api/auth/history');
            setHistory(historyRes.data);

            // Fetch latest leaderboard
            const leaderboardRes = await axios.get('/api/auth/leaderboard');
            setLeaderboard(leaderboardRes.data);

            // Remove current scenario from list
            const newScenarios = scenarios.filter(s => s.id !== currentScenario.id);
            setScenarios(newScenarios);

            // Adjust index if needed
            if (currentIndex >= newScenarios.length) {
                setCurrentIndex(Math.max(0, newScenarios.length - 1));
            }

            setMessage('Response Protocol Initiated. Impact Analysis Complete.');
            setTimeout(() => setMessage(''), 3000); // Clear message after delay

        } catch (err) {
            console.error("Failed to submit response", err);
            setMessage('Transmission Failed. Retry connection.');
        }
    };

    const handleNext = () => {
        if (currentIndex < scenarios.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentScenario = scenarios.length > 0 ? scenarios[currentIndex] : null;

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
                    {message && (
                        <div className={`p-4 rounded mb-4 font-mono text-sm border ${message.includes("SYSTEM FAILURE") ? "bg-red-900/50 border-red-500 text-red-200" : "bg-blue-900/50 border-blue-500 text-blue-200"}`}>
                            {message}
                        </div>
                    )}
                    {loading ? (
                        <div className="text-center p-20 text-gray-400 animate-pulse">Scanning for incoming threats...</div>
                    ) : currentScenario ? (
                        <div className="bg-gradient-to-br from-crisis-slate to-gray-900 border border-gray-700 rounded-xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-red-500 font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                    Incoming Scenario ({currentIndex + 1} / {scenarios.length})
                                </h3>
                                {/* Navigation Arrows */}
                                {scenarios.length > 1 && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handlePrev}
                                            disabled={currentIndex === 0}
                                            className={`p-2 rounded border border-gray-600 ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                                        >
                                            &lt;
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={currentIndex === scenarios.length - 1}
                                            className={`p-2 rounded border border-gray-600 ${currentIndex === scenarios.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                )}
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-4">{currentScenario.title}</h2>
                            <p className="text-gray-300 mb-8 max-w-lg leading-relaxed">
                                {currentScenario.description}
                            </p>

                            <div className="space-y-3">
                                <p className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-bold">Select Response Protocol:</p>
                                {currentScenario.options && currentScenario.options.length > 0 ? (
                                    currentScenario.options.map(option => (
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
