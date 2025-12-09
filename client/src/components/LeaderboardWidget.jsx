import React from 'react';

const LeaderboardWidget = ({ data = [] }) => {
    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-yellow-500">🏆</span> Global Leaderboard
            </h3>

            {data.length === 0 ? (
                <p className="text-gray-500 text-sm">No data available yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-800 text-gray-200 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-4 py-3">Rank</th>
                                <th className="px-4 py-3">Agent</th>
                                <th className="px-4 py-3">Company</th>
                                <th className="px-4 py-3 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {data.map((user, idx) => (
                                <tr key={idx} className="hover:bg-gray-800/50 transition">
                                    <td className="px-4 py-3 font-bold text-blue-400">#{idx + 1}</td>
                                    <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                                    <td className="px-4 py-3">{user.company}</td>
                                    <td className="px-4 py-3 text-right font-mono text-yellow-500 font-bold">{user.totalScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="absolute top-0 right-0 p-4 opacity-5">
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
        </div>
    );
};

export default LeaderboardWidget;
