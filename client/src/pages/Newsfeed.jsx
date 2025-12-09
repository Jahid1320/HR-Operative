import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Newsfeed = () => {
    const { user, logout } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('/api/news');
                // Filter for published posts only (though API returns all, client filtering for now or update API)
                // Assuming API returns all, let's filter here if needed, or rely on API.
                // For users, we probably only want isPublished=true.
                const publishedPosts = res.data.filter(p => p.isPublished);
                setPosts(publishedPosts);
            } catch (err) {
                console.error("Failed to fetch news", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-crisis-dark text-white font-sans">
            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-crisis-slate px-6 py-4 flex justify-between items-center sticky top-0 z-50">
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

            <main className="p-6 max-w-4xl mx-auto">
                <header className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">
                        <span className="text-crisis-red">GLOBAL</span> INTELLIGENCE FEED
                    </h2>
                    <p className="text-gray-400">Latest updates from command central.</p>
                </header>

                {loading ? (
                    <div className="text-center p-20 text-gray-500 animate-pulse">Decrypting secure transmission...</div>
                ) : (
                    <div className="space-y-8">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <article key={post.id} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-gray-600 transition-colors">
                                    {post.image && (
                                        <div className="h-48 w-full bg-gray-900 overflow-hidden relative">
                                            <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-80" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                                        </div>
                                    )}
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-1">{post.title}</h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest">
                                                    <span className="text-crisis-red font-bold">OFFICIAL COMMUNIQUE</span>
                                                    <span>•</span>
                                                    <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                                            {post.content.split('\n').map((paragraph, idx) => (
                                                <p key={idx} className="mb-4">{paragraph}</p>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-700/50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                                                    {post.author ? post.author.charAt(0) : 'A'}
                                                </div>
                                                <span className="text-sm text-gray-500 font-medium">{post.author || 'Command'}</span>
                                            </div>
                                            {/* Share or other actions could go here */}
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="text-center p-12 bg-gray-800/30 rounded-lg border border-gray-700/50 border-dashed">
                                <p className="text-gray-500">No active intelligence reports.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Newsfeed;
