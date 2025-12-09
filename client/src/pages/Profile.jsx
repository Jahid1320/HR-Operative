import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, updateUser, updatePassword } = useAuth();

    // Form State for Profile Details
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        company: user?.company || '',
        jobTitle: user?.jobTitle || '',
        email: user?.email || '', // Read-only
        avatar: user?.avatar || null
    });
    const [previewImage, setPreviewImage] = useState(null);

    // Form State for Password Change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setProfileData((prev) => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser({
                name: profileData.name,
                company: profileData.company,
                jobTitle: profileData.jobTitle,
                avatar: profileData.avatar
            });
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
            setIsEditing(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        try {
            await updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully.' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to update password.' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="border-b border-navy-700 pb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight">Operative Profile</h1>
                <p className="text-slate-400 mt-2">Manage your credentials and identification.</p>
            </div>

            {/* Notification Message */}
            {message.text && (
                <div className={`p-4 rounded-lg border ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'} flex items-center justify-between`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ type: '', text: '' })} className="hover:opacity-75">✕</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-navy-800 rounded-xl border border-navy-700 p-6 flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white mb-4 ring-4 ring-navy-900 border border-white/10 overflow-hidden">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0) || 'U'
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer mb-4">
                                <span className="text-white text-xs font-bold">Change</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </label>
                        </div>
                        <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                        <p className="text-sm text-slate-400">{user?.jobTitle}</p>

                        <div className="mt-6 w-full space-y-2">
                            <div className="flex justify-between items-center text-sm p-3 bg-navy-900 rounded border border-navy-700">
                                <span className="text-slate-500">Rank</span>
                                <span className="font-mono font-bold text-brand-400">#{user?.id || 5}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 bg-navy-900 rounded border border-navy-700">
                                <span className="text-slate-500">Status</span>
                                <span className="font-bold text-green-500 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Forms Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* General Information Form */}
                    <section className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
                        <div className="bg-navy-900/50 px-6 py-4 border-b border-navy-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">General Information</h3>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors uppercase tracking-wider"
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Details'}
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-2 bg-navy-900 border rounded-lg focus:ring-2 focus:ring-brand-500/50 outline-none transition-all ${isEditing ? 'border-navy-600 text-white' : 'border-transparent text-slate-300 cursor-not-allowed'}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Job Title</label>
                                        <input
                                            type="text"
                                            name="jobTitle"
                                            value={profileData.jobTitle}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-2 bg-navy-900 border rounded-lg focus:ring-2 focus:ring-brand-500/50 outline-none transition-all ${isEditing ? 'border-navy-600 text-white' : 'border-transparent text-slate-300 cursor-not-allowed'}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Company</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={profileData.company}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-2 bg-navy-900 border rounded-lg focus:ring-2 focus:ring-brand-500/50 outline-none transition-all ${isEditing ? 'border-navy-600 text-white' : 'border-transparent text-slate-300 cursor-not-allowed'}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-500">Email Address <span className="text-xs text-slate-600">(Read Only)</span></label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            disabled={true}
                                            className="w-full px-4 py-2 bg-navy-950/50 border border-transparent rounded-lg text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                {isEditing && (
                                    <div className="flex justify-end pt-4">
                                        <button type="submit" className="btn-primary px-6 py-2">
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
                        <div className="bg-navy-900/50 px-6 py-4 border-b border-navy-700">
                            <h3 className="text-lg font-bold text-white">Security</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 bg-navy-900 border border-navy-600 rounded-lg focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none text-white transition-all"
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2 bg-navy-900 border border-navy-600 rounded-lg focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none text-white transition-all"
                                            placeholder="Min 8 chars"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2 bg-navy-900 border border-navy-600 rounded-lg focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none text-white transition-all"
                                            placeholder="Re-enter new password"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
