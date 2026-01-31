import React, { useState, useEffect } from 'react';
import { AppView, AdminConfig } from './core/types';
import { CoreStorage } from './core/storage';

// Module Imports
import Navigation from './client/Navigation';
import Home from './client/Home';
import Exegesis from './client/Exegesis';
import BibleAI from './client/BibleAI';
import Tools from './client/Tools';
import More from './client/More';
import Profile from './client/Profile';
import Settings from './client/Settings';
import Registration from './client/Registration';
import Dashboard from './admin/Dashboard';
import AdminLogin from './admin/Login';
import { Book, Lock, User, Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.WELCOME);
  const [viewParams, setViewParams] = useState<any>(null); // To pass data between views
  const [config, setConfig] = useState<AdminConfig>(CoreStorage.loadConfig());
  const [theme, setTheme] = useState<'light' | 'dark'>(CoreStorage.loadTheme());
  const [currentUser, setCurrentUser] = useState(CoreStorage.loadUser());

  useEffect(() => {
    setConfig(CoreStorage.loadConfig());
    setCurrentUser(CoreStorage.loadUser());
  }, [view]);

  // Handle Theme Logic
  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    CoreStorage.saveTheme(newTheme);
  };

  const navigate = (newView: AppView, params?: any) => {
    setViewParams(params);
    setView(newView);
  };

  // --- 1. ADMIN PLATFORM ---
  if (view.startsWith('ADMIN_')) {
    if (view === AppView.ADMIN_LOGIN) {
      return <AdminLogin onLogin={() => setView(AppView.ADMIN_HOME)} onBack={() => setView(AppView.WELCOME)} />;
    }
    return <Dashboard onLogout={() => setView(AppView.WELCOME)} />;
  }

  // --- 2. WELCOME SCREEN ---
  if (view === AppView.WELCOME) {
    return (
      <div className="h-full w-full bg-paper flex flex-col relative overflow-hidden">
        {/* Header Section - 45% */}
        <div className="h-[45%] w-full flex flex-col items-center justify-center bg-gradient-to-b from-paper to-paper-secondary relative">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60"></div>
          
          {/* Icon */}
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-gold-500 shadow-strong mb-6 transform -rotate-2 border-2 border-gold-500/20">
            <Book size={40} strokeWidth={1.5} />
          </div>
          
          {/* Title - Cormorant font */}
          <h1 className="font-heading text-4xl font-semibold text-ink tracking-tight">Exegese</h1>
          <h2 className="font-heading text-xl text-gold-500 font-medium tracking-wide mt-1 italic">Pura & Simples</h2>
          
          {/* Tagline */}
          <p className="font-body text-sm text-ink-tertiary mt-4 tracking-wide">Profundidade com Simplicidade</p>
        </div>
        
        {/* Main Content Section */}
        <div className="flex-1 w-full flex flex-col items-center justify-center px-8 bg-paper">
          <p className="font-body text-ink-secondary text-base mb-8 text-center leading-relaxed">
            Descubra as riquezas das Escrituras<br/>com ferramentas de estudo profundo.
          </p>
          
          {/* Primary CTA Button */}
          <button 
            onClick={() => {
              const user = CoreStorage.loadUser();
              if (user.isRegistered) {
                setView(AppView.HOME);
              } else {
                setView(AppView.REGISTER);
              }
            }}
            className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-xl font-body font-semibold text-base shadow-medium hover:shadow-strong active:scale-[0.98] transition-all duration-200"
          >
            Entrar no Estudo
          </button>
          
          {/* Secondary Link */}
          <button 
            onClick={() => setView(AppView.HOME)}
            className="mt-5 font-body text-ink-tertiary font-medium text-sm hover:text-gold-500 transition-colors duration-200 py-2"
          >
            Explorar sem cadastro
          </button>
        </div>
        
        {/* Footer Section */}
        <div className="w-full py-5 flex flex-col items-center bg-paper-secondary border-t border-paper-tertiary">
          <span className="font-body text-[10px] text-ink-tertiary uppercase tracking-[0.2em] font-medium">
            FerTaise Tech
          </span>
          <button 
            onClick={() => setView(AppView.ADMIN_LOGIN)}
            className="mt-3 px-4 py-1.5 text-xs text-ink-tertiary/50 hover:text-ink-tertiary font-body transition-colors duration-200 rounded-full hover:bg-paper-tertiary/50"
          >
            Admin
          </button>
        </div>
      </div>
    );
  }

  // --- 3. REGISTRATION SCREEN ---
  if (view === AppView.REGISTER) {
    return <Registration onComplete={() => setView(AppView.HOME)} />;
  }

  // --- 4. CLIENT PLATFORM ---
  
  // Wrapper for Dark Mode
  return (
    <div className={`h-full w-full ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="h-full w-full bg-white dark:bg-gray-900 flex flex-col relative transition-colors duration-300">
        
        {config.maintenanceMode ? (
          <div className="h-full center-flex flex-col p-8 bg-gray-50 dark:bg-gray-900 text-center">
            <Lock size={48} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-700 dark:text-white">Em Manutenção</h2>
            <button onClick={() => setView(AppView.ADMIN_LOGIN)} className="mt-8 text-indigo-500 font-bold text-sm">Sou Admin</button>
          </div>
        ) : (
          <>
            {/* GLOBAL TOP BAR (Fixed over content) */}
            <header className="absolute top-0 left-0 w-full z-50 flex justify-between p-4 pt-8 pointer-events-none">
              <button 
                onClick={() => setView(AppView.PROFILE)}
                className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active:scale-95 transition-transform pointer-events-auto shadow-sm overflow-hidden">
                {currentUser.isRegistered && currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} />
                )}
              </button>
              <button 
                onClick={() => setView(AppView.SETTINGS)}
                className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active:scale-95 transition-transform pointer-events-auto shadow-sm">
                <SettingsIcon size={18} />
              </button>
            </header>

            {/* Content Area */}
            <div className={`w-full overflow-hidden h-[90%]`}>
              {(() => {
                switch (view) {
                  case AppView.HOME: return <Home config={config} navigate={navigate} />;
                  case AppView.EXEGESIS: return <Exegesis onBack={() => setView(AppView.HOME)} />;
                  case AppView.BIBLE: return <BibleAI />;
                  case AppView.TOOLS: return <Tools navigate={navigate} />;
                  case AppView.MORE: return <More navigate={navigate} config={config} initialSection={viewParams?.section} />;
                  case AppView.PROFILE: return <Profile />;
                  case AppView.SETTINGS: return <Settings currentTheme={theme} onToggleTheme={toggleTheme} onLogout={() => setView(AppView.WELCOME)} />;
                  default: return <Home config={config} navigate={navigate} />;
                }
              })()}
            </div>

            {/* Persistent Bottom Nav */}
            <div className="h-[10%] w-full z-50">
              <Navigation currentView={view} onChangeView={(v) => navigate(v)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;