import { useState, useEffect } from 'react';
import Header from './components/Header';
import LetterForm from './components/LetterForm';
import LetterList from './components/LetterList';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Trends from './components/Trends';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Profile from './components/Profile';
import LetterCard from './components/LetterCard';
import { api } from './services/api';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('capsule_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [activeLetter, setActiveLetter] = useState(null);
  const [activeView, setActiveView] = useState('home'); // 'home', 'settings', 'trends', 'profile', 'view'
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('capsule_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Apply dark mode class
  useEffect(() => {
    const root = window.document.documentElement;

    if (isDarkMode === true) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('capsule_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('capsule_theme', 'light');
    }
  }, [isDarkMode]);

  // Fetch letters when user logs in
  useEffect(() => {
    if (user) {
      fetchLetters();
    }
  }, [user]);

  const fetchLetters = async () => {
    if (!user) return;

    // Only show loading spinner on initial load to prevent UI "blinks"
    const isInitialLoad = letters.length === 0;
    if (isInitialLoad) setLoading(true);

    try {
      console.log("Fetching letters for user:", user.id);
      const data = await api.letters.list(user.id);
      console.log("Fetch response:", data);
      if (data.status === 'success') {
        setLetters(data.letters);
      }
    } catch (err) {
      console.error("Failed to fetch letters", err);
    } finally {
      if (isInitialLoad) setLoading(false);
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
          user={user}
          onUpdate={handleUpdateUser}
          letters={letters}
          setLetters={setLetters}
          onBack={() => setActiveView('home')}
          onDeleteAll={deleteAllLetters}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => {
            console.log("Toggling dark mode to", !isDarkMode);
            setIsDarkMode(prev => !prev);
          }}
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
      case 'view':
        return <LetterCard
          letter={activeLetter}
          onBack={() => setActiveView('home')}
          onDelete={(id) => {
            deleteLetter(id);
            setActiveView('home');
          }}
          isFullView={true}
        />;
      default:
        return <LetterForm onSave={addLetter} />;
    }
  };

  // Handle URL routing for reset password
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/reset-password') {
      setAuthMode('reset-password');
    }
  }, []);

  const renderAuthContent = () => {
    switch (authMode) {
      case 'register':
        return (
          <Register
            onRegisterSuccess={handleLogin}
            onShowLogin={() => setAuthMode('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPassword
            onBack={() => setAuthMode('login')}
          />
        );
      case 'reset-password':
        const urlParams = new URLSearchParams(window.location.search);
        return (
          <ResetPassword
            onLogin={() => {
              setAuthMode('login');
              // Clear the URL
              window.history.pushState({}, '', '/');
            }}
            token={urlParams.get('token')}
            email={urlParams.get('email')}
          />
        );
      case 'login':
      default:
        return (
          <Login
            onLoginSuccess={handleLogin}
            onShowRegister={() => setAuthMode('register')}
            onForgotPassword={() => setAuthMode('forgot-password')}
          />
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f9f7] dark:bg-stone-950 text-stone-800 dark:text-stone-200 font-sans relative transition-colors duration-300">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-stone-100 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-stone-200 rounded-full blur-[80px] opacity-40"></div>
        </div>

        <Header />
        <main className="flex-1 flex flex-col items-center justify-center relative z-10 py-12 px-4">
          <div className="w-full max-w-md mx-auto">
            {renderAuthContent()}

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
    <div className="h-screen flex flex-col bg-[#f7f9f7] dark:bg-stone-950 text-stone-800 dark:text-stone-200 font-sans selection:bg-stone-200 dark:selection:bg-stone-800 overflow-hidden animate-in fade-in duration-1000 transition-colors duration-300">
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
            {activeView === 'home' && loading ? (
              <div className="flex items-center justify-center h-40 animate-pulse">
                <div className="text-stone-300 font-serif italic">Loading your timeline...</div>
              </div>
            ) : renderContent()}
          </main>

          {/* Right Column: Timeline (Sticky/Fixed) */}
          <aside className="lg:col-span-4 h-full overflow-hidden hidden lg:flex flex-col pb-6">
            <div className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm p-4 rounded-3xl border border-stone-100 dark:border-stone-800 flex-1 flex flex-col min-h-0 transition-colors">
              <div className="flex items-center gap-3 mb-4 px-2 pt-2 flex-shrink-0">
                <span className="text-xl">🕰️</span>
                <span className="text-stone-500 dark:text-stone-400 text-sm tracking-widest uppercase font-bold">Timeline</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <LetterList
                  letters={letters}
                  refreshLetters={fetchLetters}
                  onDelete={deleteLetter}
                  onLetterClick={(letter) => {
                    setActiveLetter(letter);
                    setActiveView('view');
                  }}
                />
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default App;

