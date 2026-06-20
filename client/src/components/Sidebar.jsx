import React, { useEffect, useState } from 'react';
import { Home, Cpu, BarChart3, Columns, User, MessageSquare, ShieldAlert, LogOut, LogIn } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth status
    const updateAuth = () => {
      const storedUser = localStorage.getItem('autoverse_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    updateAuth();
    // Poll/check periodically or use window events
    window.addEventListener('storage', updateAuth);
    const interval = setInterval(updateAuth, 1000);
    
    return () => {
      window.removeEventListener('storage', updateAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('autoverse_token');
    localStorage.removeItem('autoverse_user');
    setUser(null);
    setActivePage('home');
  };

  const navItems = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'predict', name: 'AI Predictor', icon: Cpu },
    { id: 'compare', name: 'Compare Cars', icon: Columns },
    { id: 'analytics', name: 'Market Analytics', icon: BarChart3 },
    { id: 'dashboard', name: 'User Dashboard', icon: User, protected: true },
    { id: 'chat', name: 'AI Advisor', icon: MessageSquare },
    { id: 'admin', name: 'Admin Console', icon: ShieldAlert, adminOnly: true }
  ];

  return (
    <aside className="w-20 md:w-64 h-[calc(100vh-2rem)] fixed left-4 top-4 glass-card rounded-2xl flex flex-col items-center justify-between p-4 z-40">
      {/* Brand Logo */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-autoverseSecondary to-autoversePrimary flex items-center justify-center shadow-neonPrimary">
          <span className="text-xl font-bold tracking-tighter text-white">AV</span>
        </div>
        <span className="hidden md:block text-sm font-extrabold tracking-widest text-glow-primary bg-gradient-to-r from-autoversePrimary to-autoverseAccent bg-clip-text text-transparent uppercase mt-1">
          AutoVerse AI
        </span>
      </div>

      {/* Navigation List */}
      <nav className="w-full flex flex-col gap-2 my-auto">
        {navItems.map((item) => {
          // Hide dashboard if not logged in
          if (item.protected && !user) return null;
          // Hide admin console if user is not admin
          if (item.adminOnly && (!user || !user.isAdmin)) return null;

          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-center md:justify-start gap-4 px-3 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-autoverseSecondary/30 to-autoversePrimary/10 border-l-4 border-autoversePrimary text-white shadow-neonPrimary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-autoversePrimary' : ''}`} />
              <span className="hidden md:block text-sm font-medium tracking-wide">
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Profile / Authentication Action */}
      <div className="w-full flex flex-col items-center border-t border-white/5 pt-4 gap-2">
        {user ? (
          <div className="w-full flex flex-col items-center md:items-stretch gap-2">
            {/* User display */}
            <div className="hidden md:flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-autoverseAccent to-autoversePrimary flex items-center justify-center text-xs font-bold text-autoverseBg border border-white/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[9px] text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center md:justify-start gap-4 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:block text-xs font-medium">Log Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActivePage('login')}
            className="w-full flex items-center justify-center md:justify-start gap-4 px-3 py-2.5 rounded-xl text-autoversePrimary hover:text-white hover:bg-autoversePrimary/10 transition-all border border-autoversePrimary/20 hover:border-autoversePrimary/60"
          >
            <LogIn className="w-5 h-5" />
            <span className="hidden md:block text-xs font-medium tracking-wide">Account Access</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
