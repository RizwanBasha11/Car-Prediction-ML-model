import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FloatingParticles from './components/FloatingParticles';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Compare from './pages/Compare';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { Sun, Moon } from 'lucide-react';

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('autoverse_theme') || 'light';
  });

  // Track theme changes on root HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('autoverse_theme', theme);
  }, [theme]);

  // Update mouse position for custom magnetic cursor glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} />;
      case 'predict':
        return <Predict />;
      case 'compare':
        return <Compare />;
      case 'analytics':
        return <Analytics />;
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <Chat />;
      case 'admin':
        return <Admin />;
      case 'login':
        return <Login setActivePage={setActivePage} />;
      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-grid-glow overflow-x-hidden relative flex transition-colors duration-500">
      {/* 1. Custom magnetic cursor glow */}
      <div 
        className="magnetic-glow"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* 2. Floating canvas background particles */}
      <FloatingParticles />

      {/* 3. Floating Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* 4. Main Scrollable Panel */}
      <main className="flex-1 min-h-screen ml-24 md:ml-72 p-4 md:p-8 z-10 transition-all duration-300">
        
        {/* Floating Theme Switcher */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-3 glass-card rounded-xl hover:scale-105 active:scale-95 transition-all text-autoversePrimary flex items-center justify-center cursor-pointer border border-white/10"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-autoverseSecondary" />
            ) : (
              <Sun className="w-5 h-5 text-autoverseAccent" />
            )}
          </button>
        </div>

        <div className="min-h-[calc(100vh-2rem)] w-full">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
