import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// Mock list of admins since backend might not have dedicated endpoint yet for "list admins" specifically
const AdminSettings = () => {
    const { user } = useAuth();
    const [showInviteModal, setShowInviteModal] = useState(false);

    // Mock Data
    const [admins, setAdmins] = useState([
        { id: 1, name: 'Admin User', email: 'adminapi@example.com', role: 'Super Admin', status: 'Active' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Admin Team</h2>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="btn-primary"
                >
                    + Add New Admin
                </button>
            </div>

            <div className="card">
                <div className="space-y-4">
                    {admins.map((admin) => (
                        <div key={admin.id} className="flex justify-between items-center p-4 bg-navy-900 rounded border border-navy-700">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                                    {admin.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{admin.name} {user?.email === admin.email && '(You)'}</h4>
                                    <p className="text-xs text-slate-500">{admin.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-2 py-1 bg-brand-500/10 text-brand-500 rounded text-xs font-bold uppercase">{admin.role}</span>
                                <span className="text-green-500 text-xs">● {admin.status}</span>
                                {user?.email !== admin.email && (
                                    <button className="text-slate-400 hover:text-white">Remove</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <h3 className="text-lg font-bold text-white mb-4">Security Settings</h3>
                <div className="flex justify-between items-center py-4 border-b border-navy-700">
                    <div>
                        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                        <p className="text-slate-500 text-sm">Require 2FA for all admin accounts.</p>
                    </div>
                    <div className="w-12 h-6 bg-navy-700 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-slate-400 rounded-full absolute top-1 left-1"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center py-4">
                    <div>
                        <h4 className="text-white font-medium">System Lockdown</h4>
                        <p className="text-slate-500 text-sm">Temporarily disable all user logins.</p>
                    </div>
                    <div className="w-12 h-6 bg-navy-700 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-slate-400 rounded-full absolute top-1 left-1"></div>
                    </div>
                </div>
            </div>

            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-navy-800 border border-navy-600 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                        <h3 className="text-xl font-bold text-white mb-4">Invite New Admin</h3>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowInviteModal(false); }}>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                                <input type="email" className="input-field" placeholder="colleague@example.com" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Access Level</label>
                                <select className="input-field">
                                    <option>Content Editor</option>
                                    <option>Super Admin</option>
                                    <option>Analyst</option>
                                </select>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary">Send Invite</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
