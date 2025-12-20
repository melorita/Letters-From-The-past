import { isLetterUnlocked, formatDate, getTimeDifference } from '../utils/dateUtils';

function LetterCard({ letter, onDelete }) {
    // Prefer backend status, otherwise check date
    const unlocked = letter.status === 'open' || letter.status === 'opened' || isLetterUnlocked(letter.unlock_date);
    const countdown = getTimeDifference(letter.unlock_date);

    return (
        <div className={`relative p-6 rounded-2xl border transition-all duration-300 w-full group ${unlocked
            ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md'
            : 'bg-stone-50/50 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800/60 opacity-90 hover:opacity-100'
            }`}>
            {/* Decorative timeline connector (optional conceptual visual) */}
            <div className="absolute -left-10 top-8 w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-800 border-4 border-stone-50 dark:border-stone-950 hidden md:block group-hover:bg-stone-400 dark:group-hover:bg-stone-600 transition-colors"></div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl" role="img" aria-label="mood">
                            {letter.mood || '😐'}
                        </span>
                        <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-100 line-clamp-1 max-w-[150px] sm:max-w-none transition-colors">
                            {letter.title}
                        </h3>
                    </div>

                    <div className="text-xs font-medium uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center gap-2">
                        {unlocked ? (
                            <span className="text-teal-600 dark:text-teal-400 flex items-center gap-1">
                                📬 Opened
                            </span>
                        ) : (
                            <span className="text-amber-600 dark:text-amber-500 flex items-center gap-1">
                                ⏳ Locked
                            </span>
                        )}
                        <span>•</span>
                        <span>{formatDate(letter.unlock_date)}</span>
                    </div>
                </div>

                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(letter.id);
                        }}
                        className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all focus:ring-2 focus:ring-red-100 outline-none"
                        title="Delete this letter"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                )}
            </div>

            {unlocked ? (
                <div className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap font-sans text-sm md:text-base border-t border-stone-100 dark:border-stone-800 pt-4 mt-2 transition-colors">
                    {letter.message || letter.content}
                </div>
            ) : (
                <div className="bg-stone-50 dark:bg-stone-800/30 rounded-lg p-4 flex flex-col items-center justify-center text-center gap-2 border border-stone-100/50 dark:border-stone-800/50 mt-2 transition-colors">
                    <span className="text-2xl opacity-40">🔒</span>
                    <p className="text-stone-500 dark:text-stone-400 font-medium text-sm">
                        This letter is sealed.
                    </p>
                    <p className="text-stone-400 dark:text-stone-500 text-xs text font-serif italic">
                        {countdown}
                    </p>
                </div>
            )}
        </div>
    );
}

export default LetterCard;
