import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-navy-900 min-h-screen text-white">
            {/* Header/Nav would usually be here or handled by layout. Since this is likely a public page, we can add a simple back home link or use a layout if provided. For now, we'll assume it renders within a layout or standalone. Given the prompt requests content, we focus on that. */}

            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Hero / Vision */}
                <div className="text-center mb-16">
                    <img src="/logo.png" alt="HR Operative Logo" className="h-24 mx-auto mb-8 opacity-90" />
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-6">
                        Bridging Theory & Practice
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        <span className="font-bold text-brand-400">HR Operative</span> is the premier gamified learning platform designed exclusively for Payroll, HR, and Reward professionals. We combine addictive gameplay mechanics with high-level professional development to transform how you engage with industry knowledge.
                    </p>
                </div>

                {/* What We Do Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-navy-800/50 p-6 rounded-xl border border-navy-700 hover:border-brand-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-blue-900/40 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Daily Challenges</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            We present you with intricate HR and Payroll scenarios. You decide the outcome. Test your decision-making in a risk-free simulator.
                        </p>
                    </div>

                    <div className="bg-navy-800/50 p-6 rounded-xl border border-navy-700 hover:border-brand-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-purple-900/40 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">🧠</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Knowledge Hub</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            A centralized newsfeed integrating top-rated media, including The Payroll Podcast, The HR L&D Podcast, and curated industry blogs.
                        </p>
                    </div>

                    <div className="bg-navy-800/50 p-6 rounded-xl border border-navy-700 hover:border-brand-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-emerald-900/40 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Community Ranking</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Track your progress and compare your compliance scores against a global network of peers. Compete for the top spot on the leaderboard.
                        </p>
                    </div>
                </div>

                {/* Vision Section */}
                <div className="bg-gradient-to-br from-navy-800 to-navy-900 p-8 md:p-12 rounded-2xl border border-navy-700 text-center relative overflow-hidden">
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">Our Vision</h2>
                    <p className="text-slate-300 max-w-3xl mx-auto mb-8 relative z-10">
                        To bridge the gap between theory and practice by fostering a community of engaged, sharp, and competitive professionals ready for the future of work.
                    </p>
                    <Link to="/signup" className="inline-block bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-brand-900/20 relative z-10">
                        Join the Movement
                    </Link>
                </div>

                <div className="mt-12 text-center text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} HR Operative. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default About;
