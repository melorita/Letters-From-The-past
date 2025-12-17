import { useState, useEffect } from 'react';
import Header from './components/Header';
import LetterForm from './components/LetterForm';
import LetterList from './components/LetterList';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Trends from './components/Trends';

function App() {
  const [activeView, setActiveView] = useState('home'); // 'home', 'settings', 'trends'
  const [letters, setLetters] = useState(() => {
    const saved = localStorage.getItem('future_letters');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('future_letters', JSON.stringify(letters));
  }, [letters]);

  const addLetter = (newLetter) => {
    const letterWithId = {
      ...newLetter,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      opened: false, // Legacy field
    };
    setLetters([letterWithId, ...letters]);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'settings':
        return <Settings letters={letters} setLetters={setLetters} onBack={() => setActiveView('home')} />;
      case 'trends':
        return <Trends letters={letters} onBack={() => setActiveView('home')} />;
      default:
        return <LetterForm onSave={addLetter} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f7f9f7] text-stone-800 font-sans selection:bg-stone-200 overflow-hidden">
      <Header />

      {/* Scrollable Container with centered content */}
      <div className="flex-1 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto h-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 pb-2">

          {/* Left Column: Sidebar (Sticky/Fixed) */}
          <aside className="lg:col-span-3 h-full overflow-y-auto hidden lg:block pb-10">
            <Sidebar letters={letters} onNavigate={setActiveView} />
          </aside>

          {/* Center Column: Scrollable Content (Form or Pages) */}
          <main className="lg:col-span-5 h-full overflow-y-auto pb-20 no-scrollbar">
            {renderContent()}
          </main>

          {/* Right Column: Timeline (Sticky/Fixed) */}
          <aside className="lg:col-span-4 h-full overflow-hidden hidden lg:flex flex-col pb-6">
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-stone-100 flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-3 mb-4 px-2 pt-2 flex-shrink-0">
                <span className="text-xl">🕰️</span>
                <span className="text-stone-500 text-sm tracking-widest uppercase font-bold">Timeline</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <LetterList letters={letters} />
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default App;
