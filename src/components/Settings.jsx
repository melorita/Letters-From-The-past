import { useState } from 'react';
import { api } from '../services/api';

function Settings({ user, onUpdate, letters, setLetters, onBack, onDeleteAll, isDarkMode, onToggleDarkMode }) {
    const [confirmClear, setConfirmClear] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleToggleNotification = async (type) => {
        setLoading(true);
        setMessage({ type: 'info', text: 'Updating preferences...' });

        try {
            const updatedData = {
                id: user.id,
                email_notifications: type === 'email' ? !user.email_notifications : !!user.email_notifications,
                early_reminders: type === 'reminder' ? !user.early_reminders : !!user.early_reminders,
                name: user.name,
                profile_pic: user.profile_pic
            };

            const response = await api.auth.updateProfile(updatedData);
            if (response.status === 'success') {
                onUpdate(response.user);
                setMessage({ type: 'success', text: 'Preferences updated!' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to update' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleClearData = () => {
        // Call the parent handler which triggers the API
        if (onDeleteAll) {
            onDeleteAll();
        } else {
            // Fallback for offline/local mode if ever used (legacy)
            localStorage.removeItem('future_letters');
            setLetters([]);
        }
        setConfirmClear(false);
    };

    return (
        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 max-w-lg mx-auto w-full animate-fade-in transition-colors duration-300">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-stone-100 dark:border-stone-800">
                <button onClick={onBack} className="text-2xl hover:-translate-x-1 transition-transform dark:text-stone-300">←</button>
                <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100">Settings</h2>
            </div>

            <div className="space-y-8 relative">
                {message.text && (
                    <div className={`absolute -top-4 left-0 right-0 p-3 rounded-xl text-xs font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2 z-20 ${message.type === 'success' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                        message.type === 'info' ? 'bg-stone-800 text-white animate-pulse' :
                            'bg-red-500 text-white shadow-lg shadow-red-500/20'
                        }`}>
                        {message.text}
                    </div>
                )}
                {/* Appearance Section */}
                <section>
                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Appearance</h3>
                    <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-stone-800 rounded-xl shadow-sm">
                                {isDarkMode ? '🌙' : '☀️'}
                            </div>
                            <div>
                                <p className="font-medium text-stone-800 dark:text-stone-200 text-sm">Dark Mode</p>
                                <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-tight">Reduce glare and eye strain</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onToggleDarkMode}
                            className={`w-12 h-6 rounded-full transition-all duration-500 relative flex items-center ${isDarkMode === true ? 'bg-stone-600' : 'bg-stone-300'
                                }`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-all duration-500 absolute shadow-sm ${isDarkMode === true ? 'left-7' : 'left-1'
                                }`} />
                        </button>
                    </div>
                </section>

                {/* Notifications Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">Notifications</h3>
                    </div>

                    <div className="space-y-3">
                        <div
                            onClick={() => !loading && handleToggleNotification('email')}
                            className={`flex items-center justify-between p-4 bg-stone-50/50 dark:bg-stone-800/30 rounded-2xl border transition-all cursor-pointer group hover:bg-white dark:hover:bg-stone-800 ${user.email_notifications ? 'border-amber-200 dark:border-amber-900/40 bg-white dark:bg-stone-800 shadow-sm' : 'border-stone-100 dark:border-stone-800'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-stone-800 rounded-xl shadow-sm text-lg">📧</div>
                                <div>
                                    <p className="font-medium text-stone-800 dark:text-stone-200 text-sm">Email Alerts</p>
                                    <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-tight italic">Get notified when a letter unlocks</p>
                                </div>
                            </div>
                            <button
                                disabled={loading}
                                className={`w-10 h-6 rounded-full transition-all duration-300 relative flex items-center ${user.email_notifications ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
                                    }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 absolute shadow-sm ${user.email_notifications ? 'left-5' : 'left-1'
                                    }`} />
                            </button>
                        </div>

                        <div
                            onClick={() => !loading && handleToggleNotification('reminder')}
                            className={`flex items-center justify-between p-4 bg-stone-50/50 dark:bg-stone-800/30 rounded-2xl border transition-all cursor-pointer group hover:bg-white dark:hover:bg-stone-800 ${user.early_reminders ? 'border-amber-200 dark:border-amber-900/40 bg-white dark:bg-stone-800 shadow-sm' : 'border-stone-100 dark:border-stone-800'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-stone-800 rounded-xl shadow-sm text-lg">🔔</div>
                                <div>
                                    <p className="font-medium text-stone-800 dark:text-stone-200 text-sm">Early Reminder</p>
                                    <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-tight italic">Receive a nudge 1 day before opening</p>
                                </div>
                            </div>
                            <button
                                disabled={loading}
                                className={`w-10 h-6 rounded-full transition-all duration-300 relative flex items-center ${user.early_reminders ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
                                    }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 absolute shadow-sm ${user.early_reminders ? 'left-5' : 'left-1'
                                    }`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section>
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4">Danger Zone</h3>

                    {!confirmClear ? (
                        <button
                            onClick={() => setConfirmClear(true)}
                            className="w-full p-4 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium text-left flex items-center justify-between"
                        >
                            <span>Delete All Letters</span>
                            <span className="text-xs opacity-50">Irreversible</span>
                        </button>
                    ) : (
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 text-center">
                            <p className="text-red-800 dark:text-red-300 font-medium mb-3">Are you sure? This cannot be undone.</p>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setConfirmClear(false)}
                                    className="px-4 py-2 bg-white dark:bg-stone-800 border border-red-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleClearData}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm"
                                >
                                    Yes, Delete Everything
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Settings;
