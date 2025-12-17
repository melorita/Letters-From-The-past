import { useState } from 'react';

function Settings({ letters, setLetters, onBack }) {
    const [confirmClear, setConfirmClear] = useState(false);

    const handleClearData = () => {
        localStorage.removeItem('future_letters');
        setLetters([]);
        setConfirmClear(false);
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(letters, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "time_capsule_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 max-w-lg mx-auto w-full animate-fade-in">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-stone-100">
                <button onClick={onBack} className="text-2xl hover:-translate-x-1 transition-transform">←</button>
                <h2 className="text-2xl font-serif text-stone-800">Settings</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-stone-700 mb-2">Data Management</h3>
                    <p className="text-sm text-stone-500 mb-4">Control your local data. Everything is stored in your browser.</p>

                    <button
                        onClick={handleExport}
                        className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors text-left group border border-stone-200"
                    >
                        <span className="font-medium text-stone-700">Export Backup (JSON)</span>
                        <span className="text-xl group-hover:translate-x-1 transition-transform">⬇️</span>
                    </button>
                </div>

                <div className="pt-4 border-t border-stone-100">
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
