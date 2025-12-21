import { isLetterUnlocked, formatDate, getTimeDifference } from '../utils/dateUtils';

function LetterCard({ letter, onDelete, onClick, onBack, isFullView = false }) {
    if (!letter) return null;

    // Prefer backend status, otherwise check date
    const unlocked = letter.status === 'open' || letter.status === 'opened' || isLetterUnlocked(letter.unlock_date);
    const countdown = getTimeDifference(letter.unlock_date);

    if (!isFullView) {
        return (
            <div
                onClick={onClick}
                className={`relative p-5 rounded-2xl border transition-all duration-300 w-full group cursor-pointer ${unlocked
                    ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md hover:-translate-y-1'
                    : 'bg-stone-50/50 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800/60 opacity-90 hover:opacity-100 hover:bg-white dark:hover:bg-stone-900'
                    }`}
            >
                <div className="absolute -left-10 top-8 w-3 h-3 rounded-full bg-stone-200 dark:bg-stone-800 border-2 border-stone-50 dark:border-stone-950 hidden md:block group-hover:bg-stone-400 dark:group-hover:bg-stone-600 transition-all group-hover:scale-125"></div>

                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl" role="img" aria-label="mood">
                                {letter.mood || '😐'}
                            </span>
                            <h3 className="text-base font-serif font-semibold text-stone-800 dark:text-stone-100 truncate transition-colors">
                                {letter.title}
                            </h3>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 flex items-center gap-2">
                            {unlocked ? (
                                <span className="text-teal-600 dark:text-teal-400 flex items-center gap-1">
                                    <span className="text-xs">📬</span> OPENED
                                </span>
                            ) : (
                                <span className="text-amber-600 dark:text-amber-500 flex items-center gap-1">
                                    <span className="text-xs">⏳</span> LOCKED
                                </span>
                            )}
                            <span>•</span>
                            <span>WRITTEN {formatDate(letter.created_at || letter.unlock_date).toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="text-stone-300 dark:text-stone-600 group-hover:text-stone-400 dark:group-hover:text-stone-500 transition-colors ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={onBack}
                className="group flex items-center gap-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors text-sm font-bold uppercase tracking-widest"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=" group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                Back to write
            </button>

            <div className={`relative p-8 md:p-12 rounded-[2.5rem] border shadow-2xl transition-all duration-500 w-full ${unlocked
                ? 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800'
                : 'bg-stone-50/80 dark:bg-stone-900/40 border-stone-200/50 dark:border-stone-800/50'
                }`}>

                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl bg-stone-50 dark:bg-stone-800 w-20 h-20 flex items-center justify-center rounded-3xl shadow-inner">
                                {letter.mood || '😐'}
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 dark:text-white leading-tight">
                                    {letter.title}
                                </h2>
                                <div className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 mt-2 flex items-center gap-3">
                                    {unlocked ? (
                                        <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-full border border-teal-100 dark:border-teal-800/50">
                                            📬 Opened Memory
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-800/50">
                                            ⏳ Locked in Time
                                        </span>
                                    )}
                                    <span>•</span>
                                    <span>{formatDate(letter.unlock_date)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {onDelete && (
                            <button
                                onClick={() => onDelete(letter.id)}
                                className="text-red-500 dark:text-red-400 p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all outline-none"
                                title="Delete this memory"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        )}
                    </div>
                </div>

                {unlocked ? (
                    <div className="relative">
                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-100 via-stone-50 to-transparent dark:from-stone-800 dark:via-stone-800 dark:to-transparent rounded-full opacity-50"></div>
                        <div className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap font-sans text-lg md:text-xl py-4 italic selection:bg-stone-200 dark:selection:bg-stone-700">
                            {letter.message || letter.content}
                        </div>
                        {/* Aesthetic footer signature line */}
                        <div className="mt-12 pt-8 border-t border-stone-50 dark:border-stone-800 flex justify-end">
                            <div className="text-stone-500 dark:text-stone-400 font-serif italic text-sm">
                                A message from {formatDate(letter.created_at || letter.unlock_date)}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-stone-50/50 dark:bg-stone-800/30 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center gap-6 border border-white dark:border-stone-800/50 shadow-inner mt-4">
                        <div className="relative">
                            <span className="text-6xl filter grayscale opacity-20">🔒</span>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl animate-pulse">⏳</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-stone-500 dark:text-stone-400 font-serif text-xl">
                                This letter is currently sealed.
                            </p>
                            <p className="text-stone-400 dark:text-stone-500 text-sm font-medium tracking-widest uppercase">
                                Unlocking in {countdown}
                            </p>
                        </div>
                        <div className="max-w-xs text-stone-400 dark:text-stone-600 text-xs italic">
                            Some things are worth waiting for. Your past self wanted you to read this at just the right moment.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LetterCard;
