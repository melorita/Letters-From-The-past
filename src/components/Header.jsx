function Header() {
    return (
        <header className="py-4 px-6 bg-white/50 backdrop-blur-md border-b border-stone-200/50 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="text-2xl">🕰️</div>
                <div>
                    <h1 className="text-xl font-serif font-bold text-stone-800 tracking-tight leading-none">
                        Letter From The Past
                    </h1>
                    <p className="text-xs text-stone-500 font-medium tracking-wide uppercase opacity-80 mt-0.5">
                        Time Capsule
                    </p>
                </div>
            </div>
            <p className="text-sm font-serif italic text-stone-400 hidden md:block">
                "A message you’re not ready to read just yet."
            </p>
        </header>
    );
}

export default Header;
