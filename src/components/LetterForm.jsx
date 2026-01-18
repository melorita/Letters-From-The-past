import { useState } from 'react';
import { getTodayString } from '../utils/dateUtils';

const MOODS = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '🤔', label: 'Pensive' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😤', label: 'Frustrated' },
    { emoji: '✨', label: 'Inspired' },
    { emoji: '🌱', label: 'Hopeful' },
];

function LetterForm({ onSave }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [openDate, setOpenDate] = useState('');
    const [mood, setMood] = useState(MOODS[0]); // Default mood
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content || !openDate) return;

        onSave({
            title: title || 'Untitled Letter',
            message: content,
            unlock_date: openDate,
            mood: mood.emoji,
        });

        // Reset form
        setTitle('');
        setContent('');
        setOpenDate('');
        setMood(MOODS[0]);

        // Show success feedback
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 flex flex-col gap-6 w-full relative z-10 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100 transition-colors">Write to Future You</h2>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">How do you feel right now?</label>
                    <div className="flex gap-2 flex-wrap mb-2">
                        {MOODS.map(m => (
                            <button
                                key={m.label}
                                type="button"
                                onClick={() => setMood(m)}
                                className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center transition-all ${mood.label === m.label
                                    ? 'bg-stone-100 dark:bg-stone-800 scale-110 shadow-inner ring-2 ring-stone-200 dark:ring-stone-700'
                                    : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 hover:scale-105 opacity-60 hover:opacity-100'
                                    }`}
                                title={m.label}
                            >
                                {m.emoji}
                            </button>
                        ))}
                    </div>
                    <div className="h-5 text-sm font-medium text-stone-500 dark:text-stone-400 pl-2 transition-all duration-300">
                        {mood.label}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. A note about your day"
                        className="w-full p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border-2 border-transparent focus:bg-white dark:focus:bg-stone-800 focus:border-stone-200 dark:focus:border-stone-700 focus:outline-none transition-all placeholder:text-stone-300 dark:placeholder:text-stone-600 font-medium dark:text-stone-200"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">Message</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Dear Future Me, I hope you remember..."
                        rows={12}
                        className="w-full p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border-2 border-transparent focus:bg-white dark:focus:bg-stone-800 focus:border-stone-200 dark:focus:border-stone-700 focus:outline-none transition-all resize-none placeholder:text-stone-300 dark:placeholder:text-stone-600 leading-relaxed dark:text-stone-200"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">Unlock Date</label>
                    <input
                        type="date"
                        value={openDate}
                        min={getTodayString()}
                        onChange={(e) => setOpenDate(e.target.value)}
                        className="w-full p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border-2 border-transparent focus:bg-white dark:focus:bg-stone-800 focus:border-stone-200 dark:focus:border-stone-700 focus:outline-none transition-all text-stone-600 dark:text-stone-200 font-medium"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="mt-4 bg-stone-800 dark:bg-stone-100 hover:bg-stone-900 dark:hover:bg-white text-white dark:text-stone-950 font-medium py-4 px-6 rounded-xl transition-all shadow-lg shadow-stone-200 dark:shadow-none active:scale-95 transform duration-100 flex items-center justify-center gap-2 group"
                >
                    <span>Seal Time Capsule</span>
                    <span className="group-hover:translate-x-1 transition-transform">🔒</span>
                </button>
            </form>

            {/* Success Toast */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-500 ease-out flex flex-col items-center justify-center w-full ${isSubmitted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
                }`}>
                <div className="bg-emerald-50 dark:bg-stone-800 text-emerald-800 dark:text-emerald-400 px-8 py-6 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center text-center backdrop-blur-sm bg-white/90 dark:bg-stone-900/90">
                    <span className="text-4xl mb-3">✨</span>
                    <p className="font-serif font-medium text-xl">Sent to the future!</p>
                    <p className="text-emerald-600/80 dark:text-emerald-500/80 text-sm mt-1">Your letter is safely waiting for you.</p>
                </div>
            </div>
        </div>
    );
}

export default LetterForm;
