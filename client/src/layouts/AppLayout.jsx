import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const AppLayout = () => {
    const { logout, user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-navy-900">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-40 bg-navy-800/80 backdrop-blur border-b border-navy-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Left: Logo & Nav */}
                        <div className="flex items-center gap-8">
                            <Link to="/app" className="flex items-center gap-2">
                                <img src="/logo.png" alt="HR Operative" className="h-14 w-auto hover:opacity-90 transition-opacity" />
                            </Link>

                            <div className="hidden md:flex space-x-4">
                                <Link to="/app" className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${location.pathname === '/app' ? 'bg-navy-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                                    Dashboard
                                </Link>
                                <Link to="/app/newsfeed" className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${location.pathname === '/app/newsfeed' ? 'bg-navy-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                                    Newsfeed
                                </Link>
                                <Link to="/app/leaderboard" className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${location.pathname === '/app/leaderboard' ? 'bg-navy-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                                    Leaderboard
                                </Link>
                                <Link to="/app/about" className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${location.pathname === '/app/about' ? 'bg-navy-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                                    About
                                </Link>
                            </div>
                        </div>

                        {/* Right: User Profile & Stats */}
                        <div className="flex items-center gap-4">
                            {/* Mini Stats */}
                            <div className="hidden md:flex items-center gap-4 mr-4 text-xs font-mono">
                                <div className="px-3 py-1 bg-navy-900 border border-navy-700 rounded text-brand-500">
                                    RANK: <span className="text-white font-bold">{user?.id ? `#${user.id}` : 'N/A'}</span>
                                </div>
                                <div className="px-3 py-1 bg-navy-900 border border-navy-700 rounded text-green-500">
                                    SCORE: <span className="text-white font-bold">{(user?.complianceScore || 0) + (user?.efficiencyScore || 0) + (user?.satisfactionScore || 0)}</span>
                                </div>
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 hover:bg-navy-700 p-1.5 rounded-lg transition-colors border border-transparent hover:border-navy-600"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-navy-900 overflow-hidden">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            user?.name?.charAt(0) || 'U'
                                        )}
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-navy-900 rounded-full"></div>
                                    </div>
                                    <span className="text-sm font-medium text-white hidden sm:block">{user?.name}</span>
                                    <span className="text-slate-400 text-xs">▼</span>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-navy-800 border border-navy-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="px-4 py-2 border-b border-navy-700">
                                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                            <p className="text-xs text-slate-400 truncate">{user?.company}</p>
                                        </div>
                                        <Link
                                            to="/app/profile"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-navy-700 hover:text-white"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <div className="border-t border-navy-700 my-1"></div>
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-navy-700 hover:text-red-300"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
