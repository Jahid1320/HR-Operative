import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import About from './pages/About';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';

// Admin Pages
import Newsfeed from './pages/Newsfeed';
import AdminNews from './pages/admin/News';
import AdminScenarios from './pages/admin/Scenarios';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>

                {/* User Application Routes */}
                <Route path="/app" element={
                    <PrivateRoute>
                        <AppLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="newsfeed" element={<Newsfeed />} />
                    <Route path="about" element={<About />} />
                </Route>

                {/* Legacy Redirect for /dashboard */}
                <Route path="/dashboard" element={<Navigate to="/app" replace />} />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <PrivateRoute>
                        <AdminLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="scenarios" element={<AdminScenarios />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="news" element={<AdminNews />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Legacy Redirect for /admin-dashboard */}
                <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
