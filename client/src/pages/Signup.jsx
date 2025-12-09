import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        jobTitle: '',
        company: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Email might be in use.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-crisis-dark py-10">
            <div className="w-full max-w-md p-8 bg-crisis-slate rounded-lg shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white mb-2">New Operative Registration</h2>
                <p className="text-center text-gray-400 mb-8 text-sm">Enter your credentials to join the crisis unit.</p>

                {error && <div className="bg-red-500/10 text-red-500 p-3 mb-4 rounded text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Full Name</label>
                        <input name="name" type="text" onChange={handleChange} required
                            className="mt-1 w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white focus:border-crisis-red focus:ring-crisis-red" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Job Title</label>
                        <input name="jobTitle" type="text" onChange={handleChange} required
                            className="mt-1 w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white focus:border-crisis-red focus:ring-crisis-red" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Company Name</label>
                        <input name="company" type="text" onChange={handleChange} required
                            className="mt-1 w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white focus:border-crisis-red focus:ring-crisis-red" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Email Address</label>
                        <input name="email" type="email" onChange={handleChange} required
                            className="mt-1 w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white focus:border-crisis-red focus:ring-crisis-red" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Password</label>
                        <input name="password" type="password" onChange={handleChange} required
                            className="mt-1 w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white focus:border-crisis-red focus:ring-crisis-red" />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-crisis-red hover:bg-red-700 text-white font-bold rounded transition duration-200 mt-4 uppercase tracking-wide"
                    >
                        Register Profile
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-500 text-sm">
                    Already have an ID? <Link to="/login" className="text-crisis-red hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
