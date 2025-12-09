import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Glassmorphism Navbar */}
            <nav className="fixed w-full z-50 bg-navy-900/80 backdrop-blur-md border-b border-navy-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <Link to="/">
                                <img src="/logo.png" alt="HR Operative" className="h-14 w-auto hover:opacity-90 transition-opacity" />
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Newsfeed</Link>
                            <Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">About</Link>
                            <Link to="/login" className="btn-primary text-sm px-6 py-2">
                                Login to Play
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content (Offset for fixed nav) */}
            <main className="flex-grow pt-16">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-navy-900 border-t border-navy-700 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-bold text-white mb-2">HR Operative</h3>
                            <p className="text-slate-400 text-sm">Test Your Skills. Lead the Industry</p>
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="text-slate-400 hover:text-brand-500 transition-colors">Twitter</a>
                            <a href="#" className="text-slate-400 hover:text-brand-500 transition-colors">LinkedIn</a>
                            <a href="#" className="text-slate-400 hover:text-brand-500 transition-colors">GitHub</a>
                        </div>
                        <p className="text-slate-400 text-xs">© 2025 HR Operative. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
