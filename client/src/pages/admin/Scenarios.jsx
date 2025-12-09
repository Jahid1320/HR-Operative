import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateScenarioModal from '../../components/CreateScenarioModal';
import EditScenarioModal from '../../components/EditScenarioModal';

const AdminScenarios = () => {
    const [scenarios, setScenarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingScenario, setEditingScenario] = useState(null);

    const fetchScenarios = async () => {
        try {
            const res = await axios.get('/api/admin/scenarios');
            setScenarios(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch scenarios", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScenarios();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this scenario?')) return;
        try {
            await axios.delete(`/api/admin/scenario/${id}`);
            fetchScenarios();
        } catch (err) {
            alert('Failed to delete scenario');
        }
    };

    if (loading) return <div className="text-slate-400">Loading Scenarios...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Scenario Management</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <span>+</span> Create Scenario
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {scenarios.map((scenario) => (
                    <div key={scenario.id} className="card flex justify-between items-center group hover:border-brand-500/30 transition-colors">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">{scenario.title}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded ${new Date(scenario.publishDate) > new Date() ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                    {new Date(scenario.publishDate) > new Date() ? 'Scheduled' : 'Published'}
                                </span>
                            </div>
                            <div className="text-sm text-slate-500">
                                Published: {new Date(scenario.publishDate).toLocaleString()}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setEditingScenario(scenario)}
                                className="px-3 py-1.5 bg-navy-700 hover:bg-navy-600 text-slate-300 rounded text-sm transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(scenario.id)}
                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-sm transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {scenarios.length === 0 && (
                    <div className="text-center py-12 text-slate-500 border-2 border-dashed border-navy-700 rounded-xl">
                        No scenarios found. Create one to get started.
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateScenarioModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        setShowCreateModal(false);
                        fetchScenarios();
                    }}
                />
            )}

            {editingScenario && (
                <EditScenarioModal
                    scenario={editingScenario}
                    onClose={() => setEditingScenario(null)}
                    onUpdated={() => {
                        setEditingScenario(null);
                        fetchScenarios();
                    }}
                />
            )}
        </div>
    );
};

export default AdminScenarios;
