import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['x-auth-token'] = token;
                try {
                    const res = await axios.get('/api/auth/me');
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['x-auth-token'];
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        const userRes = await axios.get('/api/auth/me');
        setUser(userRes.data);
        return userRes.data;
    };

    const register = async (userData) => {
        const res = await axios.post('/api/auth/register', userData);
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        setUser(userRes.data);
    };

    const updateUser = async (userData) => {
        const res = await axios.put('/api/auth/me', userData);
        setUser(res.data);
        return res.data;
    };

    const updatePassword = async (passwordData) => {
        const res = await axios.put('/api/auth/me/password', passwordData);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F19] text-white">
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-slate-400 text-sm font-mono tracking-widest uppercase">Initializing System...</span>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
};
