import { isLetterUnlocked, formatDate, getTimeDifference } from '../utils/dateUtils';

function LetterCard({ letter }) {
    const unlocked = isLetterUnlocked(letter.openDate);
    const countdown = getTimeDifference(letter.openDate);

    return (
        <div className={`relative p-6 rounded-2xl border transition-all duration-300 w-full group ${unlocked
                ? 'bg-white border-stone-200 shadow-sm hover:shadow-md'
                : 'bg-stone-50 border-stone-200/60 opacity-90 hover:opacity-100'
            }`}>
            {/* Decorative timeline connector (optional conceptual visual) */}
            <div className="absolute -left-10 top-8 w-4 h-4 rounded-full bg-stone-200 border-4 border-stone-50 hidden md:block group-hover:bg-stone-400 transition-colors"></div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl" role="img" aria-label="mood">
                            {letter.mood || '😐'}
                        </span>
                        <h3 className="text-lg font-serif font-semibold text-stone-800 line-clamp-1">
                            {letter.title}
                        </h3>
                    </div>

                    <div className="text-xs font-medium uppercase tracking-wider text-stone-400 flex items-center gap-2">
                        {unlocked ? (
                            <span className="text-teal-600 flex items-center gap-1">
                                📬 Opened
                            </span>
                        ) : (
                            <span className="text-amber-600 flex items-center gap-1">
                                ⏳ Locked
                            </span>
                        )}
                        <span>•</span>
                        <span>{formatDate(letter.openDate)}</span>
                    </div>
                </div>
            </div>

            {unlocked ? (
                <div className="text-stone-700 leading-relaxed whitespace-pre-wrap font-sans text-sm md:text-base border-t border-stone-100 pt-4 mt-2">
                    {letter.content}
                </div>
            ) : (
                <div className="bg-stone-100/50 rounded-lg p-4 flex flex-col items-center justify-center text-center gap-2 border border-stone-100/50 mt-2">
                    <span className="text-2xl opacity-40">🔒</span>
                    <p className="text-stone-500 font-medium text-sm">
                        This letter is sealed.
                    </p>
                    <p className="text-stone-400 text-xs">
                        {countdown}
                    </p>
                </div>
            )}
        </div>
    );
}

export default LetterCard;
