import React from 'react';
import { Moon, Sun, Info, LogOut } from 'lucide-react';

interface SettingsProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: (theme: 'light' | 'dark') => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ currentTheme, onToggleTheme, onLogout }) => {
  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 pt-24 px-6 overflow-y-auto pb-24">
      <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6">Configurações</h2>

      <div className="space-y-6">
        
        {/* THEME SETTINGS */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Aparência</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            
            <button 
              onClick={() => onToggleTheme('light')}
              className="w-full p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Sun size={18} />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Modo Claro</span>
              </div>
              {currentTheme === 'light' && <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-200" />}
            </button>

            <button 
              onClick={() => onToggleTheme('dark')}
              className="w-full p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Moon size={18} />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Modo Escuro</span>
              </div>
              {currentTheme === 'dark' && <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-200" />}
            </button>
            
          </div>
        </section>

        {/* APP INFO */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sobre</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4">
             <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300">
               <Info size={20} />
             </div>
             <div>
               <p className="font-bold text-gray-800 dark:text-gray-200">Exegese Pura e Simples</p>
               <p className="text-xs text-gray-500 dark:text-gray-400">Versão 2.1.0 (Premium)</p>
             </div>
          </div>
        </section>

        {/* LOGOUT */}
        <section>
          <button 
            onClick={onLogout}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 p-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition-all"
          >
            <LogOut size={20} />
            <span className="font-bold">Sair do Aplicativo</span>
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-3">
            Seus dados permanecerão salvos neste dispositivo.
          </p>
        </section>

      </div>
    </div>
  );
};

export default Settings;