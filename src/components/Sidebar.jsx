import { useState, useEffect } from 'react';

const QUOTES = [
    "The future makes up for the past.",
    "Your future self is watching you right now through memories.",
    "Plant seeds today, harvest tomorrow.",
    "Time is the most valuable thing a man can spend.",
    "Don't wait for the perfect moment, take the moment and make it perfect."
];

function Sidebar({ letters, onNavigate }) {
    const [quote, setQuote] = useState('');

    // Calculate stats
    const totalLetters = letters.length;
    const lockedLetters = letters.filter(l => new Date() < new Date(l.openDate)).length;
    const openedLetters = totalLetters - lockedLetters;

    useEffect(() => {
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, []);

    return (
        <div className="space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Capsule Stats</h3>
                <div className="flex justify-between items-center text-center">
                    <div>
                        <div className="text-2xl font-serif text-stone-800">{totalLetters}</div>
                        <div className="text-xs text-stone-500">Total</div>
                    </div>
                    <div className="w-px h-8 bg-stone-100"></div>
                    <div>
                        <div className="text-2xl font-serif text-amber-600">{lockedLetters}</div>
                        <div className="text-xs text-stone-500">Locked</div>
                    </div>
                    <div className="w-px h-8 bg-stone-100"></div>
                    <div>
                        <div className="text-2xl font-serif text-teal-600">{openedLetters}</div>
                        <div className="text-xs text-stone-500">Opened</div>
                    </div>
                </div>
            </div>

            {/* Quote Card */}
            <div className="bg-stone-100/50 rounded-2xl p-6 border border-stone-200/50 relative overflow-hidden group hover:bg-stone-100 transition-colors">
                <div className="absolute top-0 right-0 text-6xl text-stone-200 -mr-4 -mt-4 opacity-50 font-serif">”</div>
                <p className="relative z-10 text-stone-600 italic font-serif leading-relaxed">
                    {quote}
                </p>
                <div className="mt-4 flex gap-2">
                    <div className="h-1 w-8 bg-stone-300 rounded-full"></div>
                    <div className="h-1 w-2 bg-stone-200 rounded-full"></div>
                </div>
            </div>

            {/* Quick Action visual placeholders */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => onNavigate('settings')}
                    className="p-3 bg-white rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:border-stone-400 transition-colors hover:shadow-sm text-left flex flex-col gap-1"
                >
                    <span className="text-xl">⚙️</span>
                    Settings
                </button>
                <button
                    onClick={() => onNavigate('trends')}
                    className="p-3 bg-white rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:border-stone-400 transition-colors hover:shadow-sm text-left flex flex-col gap-1"
                >
                    <span className="text-xl">📊</span>
                    Trends
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
