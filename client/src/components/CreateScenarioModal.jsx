import { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const CreateScenarioModal = ({ onClose, onCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        publishDate: '',
        publishTime: '',
        publishNow: false,
        options: [
            { text: '', complianceImpact: 0, efficiencyImpact: 0, satisfactionImpact: 0, personalityTag: '' },
            { text: '', complianceImpact: 0, efficiencyImpact: 0, satisfactionImpact: 0, personalityTag: '' },
            { text: '', complianceImpact: 0, efficiencyImpact: 0, satisfactionImpact: 0, personalityTag: '' },
            { text: '', complianceImpact: 0, efficiencyImpact: 0, satisfactionImpact: 0, personalityTag: '' }
        ]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...formData.options];
        newOptions[index][field] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Combine date and time
            let combinedDate;
            if (formData.publishNow) {
                combinedDate = new Date();
            } else {
                if (!formData.publishDate || !formData.publishTime) {
                    setError("Please select a date and time");
                    setLoading(false);
                    return;
                }
                combinedDate = new Date(`${formData.publishDate}T${formData.publishTime}`);
            }

            // Filter out empty options
            const validOptions = formData.options.filter(opt => opt.text.trim() !== '');
            if (validOptions.length < 2) {
                setError("Please provide at least 2 valid options");
                setLoading(false);
                return;
            }

            const payload = {
                title: formData.title,
                description: formData.description,
                publishDate: combinedDate,
                options: validOptions
            };

            await axios.post('/api/admin/scenario', payload);
            onCreated();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Failed to create scenario');
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4">
            <div className="bg-gray-800 border border-gray-600 rounded-xl w-[95vw] max-w-7xl h-[90vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-white">New Scenario</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2 text-xl">✕</button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-gray-700">

                    {/* Left Column: General Info */}
                    <div className="p-6 overflow-y-auto space-y-6">
                        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded">{error}</div>}

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">Title</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Level 2: The Server Crash"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">Description / Story</label>
                            <textarea
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white h-48 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the scenario context..."
                            />
                        </div>

                        <div className="bg-gray-900/50 p-4 rounded border border-gray-700 space-y-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="publishNow"
                                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    checked={formData.publishNow}
                                    onChange={e => setFormData({ ...formData, publishNow: e.target.checked })}
                                />
                                <label htmlFor="publishNow" className="font-bold text-blue-400 cursor-pointer select-none">Publish Immediately</label>
                            </div>

                            {!formData.publishNow && (
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Publish Date</label>
                                        <input
                                            required={!formData.publishNow}
                                            type="date"
                                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                                            value={formData.publishDate}
                                            onChange={e => setFormData({ ...formData, publishDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Publish Time</label>
                                        <input
                                            required={!formData.publishNow}
                                            type="time"
                                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                                            value={formData.publishTime}
                                            onChange={e => setFormData({ ...formData, publishTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Options */}
                    <div className="p-6 flex flex-col h-full overflow-hidden bg-gray-800/50">
                        <div className="mb-4 flex justify-between items-end">
                            <h3 className="text-xl font-bold text-gray-300">Decision Options</h3>
                            <span className="text-xs text-gray-500">Minimum 2 options required</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {formData.options.map((opt, idx) => (
                                <div key={idx} className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-sm relative group hover:border-gray-600 transition-colors">
                                    <div className="absolute top-2 right-2 text-xs font-bold text-gray-600 bg-gray-800 px-2 py-1 rounded">
                                        Option {String.fromCharCode(65 + idx)}
                                    </div>

                                    <div className="mb-3 pr-8">
                                        <label className="block text-xs text-gray-500 mb-1">Option Text</label>
                                        <input
                                            required={idx < 2}
                                            placeholder={`What happens in Option ${String.fromCharCode(65 + idx)}?`}
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
                        </div>
                    </div>

                    {/* Footer Actions (Floating bottom bar, usually span both cols or be outside grid) */}
                    {/* Since grid is used, we can't easily put footer inside form as a direct child without span. 
                        Actually, let's move footer outside the scrollable grid area to keep it fixed.
                        We'll close the form tag appropriately.
                    */}
                </form>

                <div className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-xl flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-400 hover:text-white font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit} // Trigger form submit via ref or just click since state is managed
                        type="button" // changed to button to call form submit manually or we can use formId
                        className="bg-blue-600 hover:bg-blue-500 px-8 py-2 rounded-lg text-white font-bold disabled:opacity-50 shadow-lg shadow-blue-900/20"
                        disabled={loading}
                    >
                        {loading ? 'Creating Scenario...' : 'Create Scenario'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CreateScenarioModal;
