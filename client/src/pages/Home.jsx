import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-navy-900 min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-600/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 tracking-tight">
                        Master HR Compliance.<br />
                        <span className="text-brand-500">One Level at a Time.</span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The premier daily gaming platform for Global Payroll & HR professionals. Test your skills, climb the leaderboard, and stay ahead of the crisis.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/login" className="btn-primary text-lg px-8 py-3">
                            Start Playing Now
                        </Link>
                        <Link to="/about" className="px-8 py-3 rounded-lg border border-navy-700 text-slate-300 hover:bg-navy-800 hover:text-white transition-all font-medium">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsfeed Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-brand-500 pl-4">Latest Intelligence</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Blog Card 1 */}
                    <article className="card-interactive flex flex-col h-full group">
                        <div className="h-48 bg-navy-900 rounded-lg mb-4 overflow-hidden relative">
                            {/* Placeholder pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
                                <span className="text-4xl">📜</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="text-brand-500 text-xs font-bold uppercase tracking-wider mb-2 block">Regulatory Update</span>
                            <h3 className="text-xl text-white mb-2 group-hover:text-brand-500 transition-colors">The 2026 Payroll Compliance Outlook</h3>
                            <p className="text-slate-400 text-sm line-clamp-3">
                                New regulations in the EU and APAC regions are set to shake up the global payroll landscape. Are you prepared for the shift?
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-navy-700 flex justify-between items-center">
                            <span className="text-xs text-slate-500">Dec 08, 2025</span>
                            <span className="text-sm font-medium text-brand-500 group-hover:underline">Read Article →</span>
                        </div>
                    </article>

                    {/* Social Card (LinkedIn Style) */}
                    <article className="card bg-[#0077b5]/10 border-navy-700 hover:border-[#0077b5]/50 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#0077b5] rounded-full flex items-center justify-center text-white font-bold">in</div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Global Audit Network</h4>
                                <p className="text-xs text-slate-400">posted 2 hours ago</p>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm mb-4">
                            "Crisis management isn't just about fixing problems—it's about anticipating them. Join thousands of professionals in our daily simulation."
                        </p>
                        <div className="bg-navy-900/50 p-3 rounded border border-navy-700 text-xs text-slate-400">
                            #Payroll #HRTech #CrisisManagement
                        </div>
                    </article>

                    {/* Media Card (Podcast) */}
                    <article className="card-interactive bg-gradient-to-br from-navy-800 to-indigo-900/20">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-indigo-400 uppercase">Podcast</span>
                            <span className="text-xs text-slate-500">Ep. 42</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">The Crisis Room: Payroll Disasters</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Interview with Chief Compliance Officer Sarah Jenkins on surviving a multi-region audit failure.
                        </p>
                        <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center justify-center gap-2 transition-colors">
                            <span>▶</span> Listen Now (24m)
                        </button>
                    </article>

                    {/* Blog Card 2 */}
                    <article className="card-interactive flex flex-col h-full group">
                        <div className="h-48 bg-navy-900 rounded-lg mb-4 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
                                <span className="text-4xl">🤖</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="text-brand-500 text-xs font-bold uppercase tracking-wider mb-2 block">Tech Insight</span>
                            <h3 className="text-xl text-white mb-2 group-hover:text-brand-500 transition-colors">AI in Payroll: Friend or Foe?</h3>
                            <p className="text-slate-400 text-sm line-clamp-3">
                                Exploring how automated agents are changing the role of payroll administrators and what skills you need to stay relevant.
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-navy-700 flex justify-between items-center">
                            <span className="text-xs text-slate-500">Dec 07, 2025</span>
                            <span className="text-sm font-medium text-brand-500 group-hover:underline">Read Article →</span>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
};

export default Home;
