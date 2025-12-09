import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const EditScenarioModal = ({ scenario, onClose, onUpdated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        publishDate: '',
        options: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (scenario) {
            // Format date to local datetime string for input type="datetime-local"
            const date = new Date(scenario.publishDate);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            const dateStr = date.toISOString().slice(0, 16);

            setFormData({
                title: scenario.title,
                description: scenario.description,
                publishDate: dateStr,
                options: scenario.options ? scenario.options.map(o => ({
                    id: o.id,
                    text: o.text || '',
                    complianceImpact: o.complianceImpact || 0,
                    efficiencyImpact: o.efficiencyImpact || 0,
                    satisfactionImpact: o.satisfactionImpact || 0,
                    personalityTag: o.personalityTag || ''
                })) : []
            });
        }
    }, [scenario]);

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...formData.options];
        newOptions[index][field] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { text: '', complianceImpact: 0, efficiencyImpact: 0, satisfactionImpact: 0, personalityTag: '' }]
        });
    };

    const removeOption = (index) => {
        const newOptions = formData.options.filter((_, i) => i !== index);
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.put(`/api/admin/scenario/${scenario.id}`, {
                title: formData.title,
                description: formData.description,
                publishDate: formData.publishDate,
                options: formData.options
            });

            setLoading(false);
            onUpdated();
        } catch (err) {
            console.error("Failed to update scenario", err);
            setError('Failed to update scenario');
            setLoading(false);
        }
    };

    if (!scenario) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4">
            <div className="bg-gray-800 border border-gray-600 rounded-xl w-[95vw] max-w-7xl h-[90vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-white">Edit Scenario: {scenario.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2 text-xl">✕</button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-gray-700">

                    {/* Left Column: General Info */}
                    <div className="p-6 overflow-y-auto space-y-6">
                        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded border border-red-700">{error}</div>}

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">Description / Story</label>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white h-64 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">Publish Date (Auto-publishes at this time)</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                value={formData.publishDate}
                                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Right Column: Options */}
                    <div className="p-6 flex flex-col h-full overflow-hidden bg-gray-800/50">
                        <div className="mb-4 flex justify-between items-end">
                            <h3 className="text-xl font-bold text-gray-300">Decision Options</h3>
                            <button
                                type="button"
                                onClick={addOption}
                                className="text-sm px-3 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded border border-blue-500/30 transition-colors"
                            >
                                + Add New Option
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {formData.options.map((opt, idx) => (
                                <div key={idx} className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-sm relative group hover:border-gray-600 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Option {String.fromCharCode(65 + idx)}</div>
                                        <button type="button" onClick={() => removeOption(idx)} className="text-red-500 hover:text-red-400 text-xs underline">Remove</button>
                                    </div>

                                    <div className="mb-3 pr-2">
                                        <label className="block text-xs text-gray-500 mb-1">Option Text</label>
                                        <input
                                            required
                                            placeholder="Option Text"
                                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm focus:border-blue-500 outline-none"
                                            value={opt.text}
                                            onChange={e => handleOptionChange(idx, 'text', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-xs text-gray-500 mb-1">Personality Tag</label>
                                        <input
                                            placeholder="e.g., The Maverick"
                                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm focus:border-blue-500 outline-none"
                                            value={opt.personalityTag}
                                            onChange={e => handleOptionChange(idx, 'personalityTag', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 bg-gray-800/50 p-2 rounded">
                                        <div>
                                            <label className="text-[10px] text-gray-400 block uppercase tracking-wider mb-1">Compliance</label>
                                            <input
                                                type="number"
                                                className="w-full bg-gray-700 border border-gray-600 rounded p-1 text-white text-sm text-center"
                                                value={opt.complianceImpact}
                                                onChange={e => handleOptionChange(idx, 'complianceImpact', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 block uppercase tracking-wider mb-1">Efficiency</label>
                                            <input
                                                type="number"
                                                className="w-full bg-gray-700 border border-gray-600 rounded p-1 text-white text-sm text-center"
                                                value={opt.efficiencyImpact}
                                                onChange={e => handleOptionChange(idx, 'efficiencyImpact', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 block uppercase tracking-wider mb-1">Satisfaction</label>
                                            <input
                                                type="number"
                                                className="w-full bg-gray-700 border border-gray-600 rounded p-1 text-white text-sm text-center"
                                                value={opt.satisfactionImpact}
                                                onChange={e => handleOptionChange(idx, 'satisfactionImpact', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button type="button" onClick={addOption} className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors font-medium">
                                + Add Another Option
                            </button>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-xl flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-400 hover:text-white font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="button"
                        disabled={loading}
                        className={`px-8 py-2 rounded-lg font-bold text-white shadow-lg shadow-blue-900/20 transition-all ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-900/40'}`}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditScenarioModal;
