import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView } from './core/types';
import { useAppStore } from './core/store';
import { auth, getUserProfile } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
import Community from './client/Community';
import Dashboard from './admin/Dashboard';
import AdminLogin from './admin/Login';
import { Book, Lock, User, Settings as SettingsIcon, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const {
    view,
    viewParams,
    setView,
    user,
    setUser,
    config,
    theme,
    readingSettings,
    isLoading,
    init,
    setTheme,
    setReadingSettings
  } = useAppStore();

  useEffect(() => {
    // 1. Initialize Config and Theme
    init();

    // 2. Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid);
        if (profile) {
          setUser(profile);
          if (view === AppView.WELCOME || view === AppView.REGISTER) {
            setView(AppView.HOME);
          }
        } else {
          // If logged in but no profile, force registration
          setUser({ ...user, id: fbUser.uid });
          setView(AppView.REGISTER);
        }
      } else {
        // Not logged in
        setUser({ ...user, id: 'guest', isRegistered: false });
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full bg-paper center-flex flex-col gap-4">
        <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
        <p className="font-heading text-xl text-ink">Preparando as Escrituras...</p>
      </div>
    );
  }

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
        <div className="h-[45%] w-full flex flex-col items-center justify-center bg-gradient-to-b from-paper to-paper-secondary relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60"></div>
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-strong mb-6 border-2 border-gold-500/20 overflow-hidden">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-heading text-4xl font-semibold text-ink tracking-tight">Exegese</h1>
          <h2 className="font-heading text-xl text-gold-500 font-medium tracking-wide mt-1 italic">Pura & Simples</h2>
          <p className="font-body text-sm text-ink-tertiary mt-4 tracking-wide">Profundidade com Simplicidade</p>
        </div>

        <div className="flex-1 w-full flex flex-col items-center justify-center px-8 bg-paper">
          <p className="font-body text-ink-secondary text-base mb-8 text-center leading-relaxed">
            Descubra as riquezas das Escrituras<br />com ferramentas de estudo profundo.
          </p>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#d4af37' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (user.isRegistered) {
                setView(AppView.HOME);
              } else {
                setView(AppView.REGISTER);
              }
            }}
            className="w-full py-4 bg-gold-500 text-white rounded-xl font-body font-semibold text-base shadow-medium transition-all duration-200"
          >
            Entrar no Estudo
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, color: '#A16207' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView(AppView.HOME)}
            className="mt-5 font-body text-ink-tertiary font-medium text-sm transition-colors duration-200 py-2"
          >
            Explorar sem cadastro
          </motion.button>
        </div>

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
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={AppView.REGISTER}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <Registration onComplete={() => setView(AppView.HOME)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // --- 4. CLIENT PLATFORM ---
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
            <header className="absolute top-0 left-0 w-full z-50 flex justify-between p-4 pt-8 pointer-events-none">
              <button
                onClick={() => setView(AppView.PROFILE)}
                className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active:scale-95 transition-transform pointer-events-auto shadow-sm overflow-hidden">
                {user.isRegistered && user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Perfil" className="w-full h-full object-cover" />
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

            <div className={`w-full overflow-hidden h-[90%] relative`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="h-full w-full"
                >
                  {(() => {
                    switch (view) {
                      case AppView.HOME: return <Home config={config} navigate={setView} />;
                      case AppView.EXEGESIS: return <Exegesis onBack={() => setView(AppView.HOME)} />;
                      case AppView.BIBLE: return <BibleAI />;
                      case AppView.COMMUNITY: return <Community />;
                      case AppView.TOOLS: return <Tools navigate={setView} />;
                      case AppView.MORE: return <More navigate={setView} config={config} initialSection={viewParams?.section} />;
                      case AppView.PROFILE: return <Profile />;
                      case AppView.SETTINGS: return (
                        <Settings
                          currentTheme={theme}
                          onToggleTheme={setTheme}
                          onLogout={() => setView(AppView.WELCOME)}
                          readingSettings={readingSettings}
                          onUpdateReadingSettings={setReadingSettings}
                        />
                      );
                      default: return <Home config={config} navigate={setView} />;
                    }
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="h-[10%] w-full z-50">
              <Navigation currentView={view} onChangeView={(v) => setView(v)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;