import LetterCard from './LetterCard';

function LetterList({ letters }) {
    if (letters.length === 0) {
        return (
            <div className="text-center py-20 bg-stone-50/50 rounded-3xl border border-stone-100 border-dashed">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-stone-500 font-medium">No time capsules yet.</p>
                <p className="text-stone-400 text-sm mt-1">Write a letter to start your timeline.</p>
            </div>
        );
    }

    // Sort letters: Earliest open date first
    const sortedLetters = [...letters].sort((a, b) => new Date(a.openDate) - new Date(b.openDate));

    return (
        <div className="relative border-l-2 border-stone-200 ml-2 space-y-8 pl-6 py-2">
            {sortedLetters.map((letter) => (
                <LetterCard key={letter.id} letter={letter} />
            ))}
        </div>
    );
}

export default LetterList;
