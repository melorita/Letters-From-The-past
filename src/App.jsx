import { useState, useEffect } from 'react';
import Header from './components/Header';
import LetterForm from './components/LetterForm';
import LetterList from './components/LetterList';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Trends from './components/Trends';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { api } from './services/api';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('capsule_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [activeView, setActiveView] = useState('home'); // 'home', 'settings', 'trends', 'profile'
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch letters when user logs in
  useEffect(() => {
    if (user) {
      fetchLetters();
    }
  }, [user]);

  const fetchLetters = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.letters.list(user.id);
      if (data.status === 'success') {
        setLetters(data.letters);
      }
    } catch (err) {
      console.error("Failed to fetch letters", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('capsule_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('capsule_user');
    setActiveView('home');
  };

  const handleUpdateUser = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem('capsule_user', JSON.stringify(newUser));
  };

  const addLetter = async (newLetter) => {
    if (!user) return;

    try {
      const data = await api.letters.create(user.id, newLetter);
      if (data.status === 'success') {
        fetchLetters(); // Refresh the list
      }
    } catch (err) {
      console.error("Failed to save letter", err);
    }
  };

  const deleteLetter = async (id) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this specific memory?")) return;

    try {
      const data = await api.letters.delete(id, user.id);
      if (data.status === 'success') {
        setLetters(letters.filter(l => l.id !== id));
      } else {
        alert("Failed to delete letter: " + data.message);
      }
    } catch (err) {
      console.error("Failed to delete letter", err);
    }
  };

  const deleteAllLetters = async () => {
    if (!user) return;

    try {
      const data = await api.letters.deleteAll(user.id);
      if (data.status === 'success') {
        setLetters([]);
        alert("All letters have been permanently deleted.");
      } else {
        alert("Failed to delete letters: " + data.message);
      }
    } catch (err) {
      console.error("Failed to delete all letters", err);
      alert("An error occurred while deleting letters.");
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'settings':
        return <Settings
          letters={letters}
          setLetters={setLetters}
          onBack={() => setActiveView('home')}
          onDeleteAll={deleteAllLetters}
        />;
      case 'trends':
        return <Trends letters={letters} onBack={() => setActiveView('home')} />;
      case 'profile':
        return <Profile
          user={user}
          onUpdate={handleUpdateUser}
          onLogout={handleLogout}
          onBack={() => setActiveView('home')}
        />;
      default:
        return <LetterForm onSave={addLetter} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f9f7] text-stone-800 font-sans relative">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-stone-100 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-stone-200 rounded-full blur-[80px] opacity-40"></div>
        </div>

        <Header />
        <main className="flex-1 flex flex-col items-center justify-center relative z-10 py-12 px-4">
          <div className="w-full max-w-md mx-auto">
            {authMode === 'login' ? (
              <Login
                onLoginSuccess={handleLogin}
                onShowRegister={() => setAuthMode('register')}
              />
            ) : (
              <Register
                onRegisterSuccess={handleLogin}
                onShowLogin={() => setAuthMode('login')}
              />
            )}

            {/* Footer aesthetic text */}
            <p className="text-center mt-8 text-stone-300 text-[10px] uppercase tracking-[0.2em] font-bold pb-10">
              {authMode === 'login' ? 'Made for your future self' : 'Start speaking to your future'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#f7f9f7] text-stone-800 font-sans selection:bg-stone-200 overflow-hidden animate-in fade-in duration-1000">
      <Header onShowProfile={() => setActiveView('profile')} user={user} />

      {/* Scrollable Container with centered content */}
      <div className="flex-1 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto h-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 pb-2">


          {/* Left Column: Sidebar (Sticky/Fixed) */}
          <aside className="lg:col-span-3 h-full overflow-y-auto hidden lg:block pb-10">
            <Sidebar letters={letters} onNavigate={setActiveView} />
          </aside>

          {/* Center Column: Scrollable Content (Form or Pages) */}
          <main className="lg:col-span-5 h-full overflow-y-auto pb-20 no-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin text-2xl">⌛</div>
              </div>
            ) : renderContent()}
          </main>

          {/* Right Column: Timeline (Sticky/Fixed) */}
          <aside className="lg:col-span-4 h-full overflow-hidden hidden lg:flex flex-col pb-6">
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-stone-100 flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-3 mb-4 px-2 pt-2 flex-shrink-0">
                <span className="text-xl">🕰️</span>
                <span className="text-stone-500 text-sm tracking-widest uppercase font-bold">Timeline</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <LetterList letters={letters} refreshLetters={fetchLetters} onDelete={deleteLetter} />
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default App;

