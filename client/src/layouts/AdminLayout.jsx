import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊' },
        { path: '/admin/scenarios', label: 'Scenario Manager', icon: '📝' },
        { path: '/admin/users', label: 'User Management', icon: '👥' },
        { path: '/admin/news', label: 'Newsfeed', icon: '📰' },
        { path: '/admin/settings', label: 'Admin Team', icon: '🛡️' },
    ];

    return (
        <div className="min-h-screen flex text-white font-sans selection:bg-cyan-500/30">
            {/* Sidebar with Deep Glass */}
            <aside className="w-64 fixed h-full glass-panel border-r-0 border-white/5 flex flex-col z-20 animate-enter">
                <div className="h-20 flex items-center px-6 border-b border-white/5 bg-slate-900/20">
                    <div className="relative">
                        <span className="text-xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            ADMIN
                        </span>
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-transparent opacity-50"></div>
                    </div>
                </div>

                <nav className="flex-grow p-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-r-lg transition-all duration-300 overflow-hidden ${isActive
                                    ? 'text-cyan-400'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {/* Glow Pill Active Indicator */}
                                {isActive && (
                                    <>
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] rounded-r"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-100"></div>
                                    </>
                                )}

                                <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium tracking-wide relative z-10">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Profile Section */}
                <div className="p-4 border-t border-white/5 bg-slate-900/30">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px]">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent">
                                        {user?.name?.charAt(0) || 'A'}
                                    </span>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 pulse-indicator"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">{user?.name}</p>
                            <p className="text-xs text-slate-400 truncate font-mono">SUPER_ADMIN</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="mt-3 w-full text-center text-xs font-mono text-red-400 hover:text-red-300 py-2 border border-red-500/20 rounded hover:bg-red-500/10 hover:border-red-500/40 transition-all uppercase tracking-wider"
                    >
                        [ Terminate Session ]
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 ml-64 flex flex-col relative z-10">
                <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md bg-slate-900/0">
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm font-mono tracking-tight">
                        <span className="text-slate-500">SYS.ROOT</span>
                        <span className="mx-2 text-slate-700">/</span>
                        <span className="text-cyan-400 font-bold drop-shadow-sm">
                            {menuItems.find(i => i.path === location.pathname)?.label.toUpperCase() || 'OVERVIEW'}
                        </span>
                    </div>
                </header>

                <main className="p-8 pt-2 animate-enter delay-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
