import { useMemo } from 'react';

function Trends({ letters, onBack }) {
    const stats = useMemo(() => {
        const total = letters.length;
        const unlocked = letters.filter(l => new Date() >= new Date(l.unlock_date)).length;
        const moodCounts = letters.reduce((acc, l) => {
            const m = l.mood || '😐'; // Fallback
            acc[m] = (acc[m] || 0) + 1;
            return acc;
        }, {});

        // Sort moods by frequency
        const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

        return { total, unlocked, moodCounts, topMoods };
    }, [letters]);

    return (
        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 max-w-lg mx-auto w-full animate-fade-in transition-colors duration-300">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-stone-100 dark:border-stone-800">
                <button onClick={onBack} className="text-2xl hover:-translate-x-1 transition-transform dark:text-stone-300">←</button>
                <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100">Your Trends</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-indigo-50 dark:bg-indigo-950/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 text-center">
                    <div className="text-3xl font-serif text-indigo-900 dark:text-indigo-300 mb-1">{stats.total}</div>
                    <div className="text-xs font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest">Sent</div>
                </div>
                <div className="bg-teal-50 dark:bg-teal-950/20 p-5 rounded-2xl border border-teal-100 dark:border-teal-900/30 text-center">
                    <div className="text-3xl font-serif text-teal-900 dark:text-teal-300 mb-1">{stats.unlocked}</div>
                    <div className="text-xs font-bold text-teal-400 dark:text-teal-500 uppercase tracking-widest">Opened</div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-4">Mood History</h3>
                <div className="space-y-3">
                    {stats.topMoods.length === 0 ? (
                        <p className="text-stone-400 dark:text-stone-500 text-sm italic">No mood data yet.</p>
                    ) : (
                        stats.topMoods.map(([emoji, count]) => (
                            <div key={emoji} className="flex items-center gap-3">
                                <span className="text-2xl w-8 text-center">{emoji}</span>
                                <div className="flex-grow h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-stone-800 dark:bg-stone-200 opacity-60 rounded-full transition-all duration-1000"
                                        style={{ width: `${(count / stats.total) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-stone-500 dark:text-stone-400 font-medium w-6 text-right">{count}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Trends;
