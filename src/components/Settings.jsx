import { useState } from 'react';

function Settings({ letters, setLetters, onBack, onDeleteAll }) {
    const [confirmClear, setConfirmClear] = useState(false);

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
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 max-w-lg mx-auto w-full animate-fade-in">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-stone-100">
                <button onClick={onBack} className="text-2xl hover:-translate-x-1 transition-transform">←</button>
                <h2 className="text-2xl font-serif text-stone-800">Settings</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-red-800 mb-2">Danger Zone</h3>

                    {!confirmClear ? (
                        <button
                            onClick={() => setConfirmClear(true)}
                            className="w-full p-4 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
                        >
                            Delete All Letters
                        </button>
                    ) : (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                            <p className="text-red-800 font-medium mb-3">Are you sure? This cannot be undone.</p>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setConfirmClear(false)}
                                    className="px-4 py-2 bg-white border border-red-200 text-stone-600 rounded-lg hover:bg-stone-50 font-medium"
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
                </div>
            </div>
        </div>
    );
}

export default Settings;
