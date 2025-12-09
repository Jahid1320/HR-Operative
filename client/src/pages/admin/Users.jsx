import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Mocking a full user fetch endpoint or reusing leaderboard for now if specific endpoint doesn't exist
                // Ideally backend should have /api/admin/users
                // For now, let's use what we have or mocked data if endpoint missing
                // Assuming we will implement /api/admin/users in backend
                const res = await axios.get('/api/admin/users');
                setUsers(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch users", err);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="text-slate-400">Loading Users...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">User Management</h2>

            <div className="card overflow-hidden p-0">
                <table className="w-full text-left">
                    <thead className="bg-navy-700 text-slate-300 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Agent</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Score</th>
                            <th className="px-6 py-4">Rank</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700 text-sm">
                        {users.map((user, index) => (
                            <tr key={user.id} className="hover:bg-navy-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-300">{user.company}</td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-brand-400 font-bold">{user.complianceScore + user.efficiencyScore + user.satisfactionScore || 0}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">#{index + 1}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="text-brand-500 hover:text-white transition-colors"
                                    >
                                        View Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No users found in the system.
                    </div>
                )}
            </div>

            {/* Simple User Modal Placeholder */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-navy-800 border border-navy-600 rounded-xl p-6 w-full max-w-lg shadow-2xl relative">
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold text-white mb-4">Agent Profile</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{selectedUser.name}</h4>
                                    <p className="text-slate-400">{selectedUser.jobTitle} at {selectedUser.company}</p>
                                    <p className="text-xs text-slate-500">{selectedUser.email}</p>
                                </div>
                            </div>

                            <hr className="border-navy-700" />

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-navy-900 rounded border border-navy-700">
                                    <div className="text-xs text-slate-500 uppercase">Compliance</div>
                                    <div className="text-xl font-bold text-blue-400">{selectedUser.complianceScore}</div>
                                </div>
                                <div className="p-3 bg-navy-900 rounded border border-navy-700">
                                    <div className="text-xs text-slate-500 uppercase">Efficiency</div>
                                    <div className="text-xl font-bold text-green-400">{selectedUser.efficiencyScore}</div>
                                </div>
                                <div className="p-3 bg-navy-900 rounded border border-navy-700">
                                    <div className="text-xs text-slate-500 uppercase">Satisfaction</div>
                                    <div className="text-xl font-bold text-yellow-400">{selectedUser.satisfactionScore}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
