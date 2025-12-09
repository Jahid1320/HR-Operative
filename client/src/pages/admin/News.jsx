import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminNews = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState({ title: '', content: '', summary: '', image: '', isPublished: true });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/api/news');
            setPosts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch news", err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentPost(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentPost.id) {
                await axios.put(`/api/news/${currentPost.id}`, currentPost);
            } else {
                await axios.post('/api/news', currentPost);
            }
            setIsEditing(false);
            setCurrentPost({ title: '', content: '', summary: '', image: '', isPublished: true });
            fetchPosts();
        } catch (err) {
            console.error("Failed to save post", err);
            alert("Failed to save post");
        }
    };

    const handleEdit = (post) => {
        setCurrentPost(post);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await axios.delete(`/api/news/${id}`);
                fetchPosts();
            } catch (err) {
                console.error("Failed to delete post", err);
            }
        }
    };

    if (loading) return <div className="text-slate-400">Loading Newsfeed...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Newsfeed Management</h2>
                <button
                    onClick={() => {
                        setCurrentPost({ title: '', content: '', summary: '', image: '', isPublished: true });
                        setIsEditing(true);
                    }}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded shadow-lg shadow-cyan-500/20 transition-all font-bold text-sm uppercase tracking-wide"
                >
                    + New Post
                </button>
            </div>

            {isEditing && (
                <div className="card bg-navy-800 border border-navy-600 p-6 rounded-lg animate-enter">
                    <h3 className="text-xl font-bold text-white mb-4">{currentPost.id ? 'Edit Post' : 'Create New Post'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={currentPost.title}
                                onChange={handleInputChange}
                                className="w-full bg-navy-900 border border-navy-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Summary</label>
                            <input
                                type="text"
                                name="summary"
                                value={currentPost.summary}
                                onChange={handleInputChange}
                                className="w-full bg-navy-900 border border-navy-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Content</label>
                            <textarea
                                name="content"
                                value={currentPost.content}
                                onChange={handleInputChange}
                                className="w-full bg-navy-900 border border-navy-700 rounded p-2 text-white focus:border-cyan-500 outline-none h-32"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Image URL (Optional)</label>
                            <input
                                type="text"
                                name="image"
                                value={currentPost.image}
                                onChange={handleInputChange}
                                className="w-full bg-navy-900 border border-navy-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={currentPost.isPublished}
                                onChange={handleInputChange}
                                id="isPublished"
                            />
                            <label htmlFor="isPublished" className="text-slate-300 text-sm cursor-pointer">Publish Immediately</label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded">Save Post</button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card overflow-hidden p-0">
                <table className="w-full text-left">
                    <thead className="bg-navy-700 text-slate-300 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Author</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700 text-sm">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-navy-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                                <td className="px-6 py-4 text-slate-400">{post.author}</td>
                                <td className="px-6 py-4 text-slate-400">{new Date(post.publishDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${post.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {post.isPublished ? 'PUBLISHED' : 'DRAFT'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => handleEdit(post)} className="text-cyan-400 hover:text-white">Edit</button>
                                    <button onClick={() => handleDelete(post.id)} className="text-red-400 hover:text-white">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No news posts found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminNews;
