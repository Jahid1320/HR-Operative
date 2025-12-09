import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(formData.email, formData.password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/app');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-crisis-dark">
            <div className="w-full max-w-md p-8 bg-crisis-slate rounded-lg shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white mb-2">HR Operative</h2>
                <p className="text-center text-crisis-red font-semibold mb-8 uppercase tracking-widest text-sm">Authorized Access Only</p>

                {error && <div className="bg-red-500/10 text-red-500 p-3 mb-4 rounded text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Email Address</label>
                        <input
                            type="email"
                            className="mt-1 block w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded focus:ring-crisis-red focus:border-crisis-red text-white"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded focus:ring-crisis-red focus:border-crisis-red text-white"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-crisis-red hover:bg-red-700 text-white font-bold rounded transition duration-200 uppercase tracking-wide"
                    >
                        Access Terminal
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-500 text-sm">
                    Don't have clearance? <Link to="/signup" className="text-crisis-red hover:underline">Request Access</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
