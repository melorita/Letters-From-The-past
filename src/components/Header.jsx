function Header({ onShowProfile, user }) {
    return (
        <header className="py-4 px-6 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800 flex items-center justify-between sticky top-0 z-50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="text-2xl">🕰️</div>
                <div>
                    <h1 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-100 tracking-tight leading-none">
                        Letter From The Past
                    </h1>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium tracking-wide uppercase opacity-80 mt-0.5">
                        Time Capsule
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <p className="text-sm font-serif italic text-stone-400 dark:text-stone-500 hidden lg:block">
                    "A message you’re not ready to read just yet."
                </p>

                {user && (
                    <button
                        onClick={onShowProfile}
                        className="flex items-center gap-3 pl-6 border-l border-stone-200 dark:border-stone-800 group transition-all"
                    >
                        <div className="hidden sm:block text-right">
                            <p className="text-[10px] text-stone-400 dark:text-stone-500 uppercase font-bold tracking-wider leading-none mb-1">My Journey</p>
                            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
                                {user.name || user.email.split('@')[0]}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center ring-1 ring-stone-100 dark:ring-stone-700 group-hover:ring-stone-200 dark:group-hover:ring-stone-600 group-hover:bg-white dark:group-hover:bg-stone-700 transition-all overflow-hidden shadow-sm">
                            {user.profile_pic ? (
                                <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-lg">👤</span>
                            )}
                        </div>
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;


