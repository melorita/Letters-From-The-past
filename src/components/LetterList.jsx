import LetterCard from './LetterCard';

function LetterList({ letters, onDelete, onLetterClick }) {
    if (letters.length === 0) {
        return (
            <div className="text-center py-20 bg-stone-50/50 dark:bg-stone-900/30 rounded-3xl border border-stone-100 dark:border-stone-800 border-dashed">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-stone-500 dark:text-stone-400 font-medium">No time capsules yet.</p>
                <p className="text-stone-400 dark:text-stone-500 text-sm mt-1">Write a letter to start your timeline.</p>
            </div>
        );
    }

    // Sort letters: Earliest open date first (original preferred logic)
    const sortedLetters = [...letters].sort((a, b) => new Date(a.unlock_date) - new Date(b.unlock_date));

    return (
        <div className="relative border-l-2 border-stone-200 dark:border-stone-800 ml-2 space-y-8 pl-6 py-2 transition-colors">
            {sortedLetters.map((letter) => (
                <LetterCard
                    key={letter.id}
                    letter={letter}
                    onDelete={onDelete}
                    onClick={() => onLetterClick(letter)}
                />
            ))}
        </div>
    );
}

export default LetterList;
