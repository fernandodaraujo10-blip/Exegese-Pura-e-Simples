import React from 'react';
import { Moon, Sun, Info, LogOut, Type, Minus, Plus, AlignLeft } from 'lucide-react';
import { ReadingSettings } from '../core/types';

interface SettingsProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: (theme: 'light' | 'dark') => void;
  onLogout: () => void;
  readingSettings: ReadingSettings;
  onUpdateReadingSettings: (settings: Partial<ReadingSettings>) => void;
}

const Settings: React.FC<SettingsProps> = ({
  currentTheme,
  onToggleTheme,
  onLogout,
  readingSettings,
  onUpdateReadingSettings
}) => {
  return (
    <div className="h-full w-full bg-paper dark:bg-gray-900 pt-24 px-6 overflow-y-auto pb-24">
      <h2 className="font-heading text-3xl font-bold text-ink dark:text-white mb-8">Configurações</h2>

      <div className="space-y-8">

        {/* THEME SETTINGS */}
        <section>
          <h3 className="text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.2em] mb-4">Aparência</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-paper-tertiary dark:border-gray-700 overflow-hidden">

            <button
              onClick={() => onToggleTheme('light')}
              className="w-full p-4 flex items-center justify-between border-b border-paper-secondary dark:border-gray-700 active:bg-paper-secondary dark:active:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
                  <Sun size={20} />
                </div>
                <span className="font-body font-medium text-ink dark:text-gray-200">Modo Claro</span>
              </div>
              {currentTheme === 'light' && <div className="w-2.5 h-2.5 bg-gold-500 rounded-full shadow-lg shadow-gold-200" />}
            </button>

            <button
              onClick={() => onToggleTheme('dark')}
              className="w-full p-4 flex items-center justify-between active:bg-paper-secondary dark:active:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary text-gold-500 flex items-center justify-center border border-gold-500/20">
                  <Moon size={20} />
                </div>
                <span className="font-body font-medium text-ink dark:text-gray-200">Modo Escuro</span>
              </div>
              {currentTheme === 'dark' && <div className="w-2.5 h-2.5 bg-gold-500 rounded-full shadow-lg shadow-gold-200" />}
            </button>

          </div>
        </section>

        {/* TYPOGRAPHY SETTINGS */}
        <section>
          <h3 className="text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.2em] mb-4">Experiência de Leitura</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-paper-tertiary dark:border-gray-700 p-5 space-y-6">

            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type size={16} className="text-ink-tertiary" />
                  <span className="text-sm font-medium text-ink-secondary dark:text-gray-300">Tamanho da Fonte</span>
                </div>
                <span className="text-xs font-bold text-gold-600">{readingSettings.fontSize}px</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onUpdateReadingSettings({ fontSize: Math.max(12, readingSettings.fontSize - 1) })}
                  className="flex-1 py-2 bg-paper-secondary dark:bg-gray-700 rounded-lg flex items-center justify-center text-ink active:scale-95 transition-transform"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => onUpdateReadingSettings({ fontSize: Math.min(24, readingSettings.fontSize + 1) })}
                  className="flex-1 py-2 bg-paper-secondary dark:bg-gray-700 rounded-lg flex items-center justify-center text-ink active:scale-95 transition-transform"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Line Height */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlignLeft size={16} className="text-ink-tertiary" />
                  <span className="text-sm font-medium text-ink-secondary dark:text-gray-300">Espaçamento entre linhas</span>
                </div>
                <span className="text-xs font-bold text-gold-600">{readingSettings.lineHeight.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onUpdateReadingSettings({ lineHeight: Math.max(1.2, readingSettings.lineHeight - 0.1) })}
                  className="flex-1 py-2 bg-paper-secondary dark:bg-gray-700 rounded-lg flex items-center justify-center text-ink active:scale-95 transition-transform"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => onUpdateReadingSettings({ lineHeight: Math.min(2.2, readingSettings.lineHeight + 0.1) })}
                  className="flex-1 py-2 bg-paper-secondary dark:bg-gray-700 rounded-lg flex items-center justify-center text-ink active:scale-95 transition-transform"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-ink-secondary dark:text-gray-300 block">Estilo da Fonte</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateReadingSettings({ fontFamily: 'serif' })}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all border ${readingSettings.fontFamily === 'serif'
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-paper-secondary text-ink border-transparent dark:bg-gray-700 dark:text-white'
                    }`}
                >
                  <span className="font-heading">Serifa</span>
                </button>
                <button
                  onClick={() => onUpdateReadingSettings({ fontFamily: 'sans' })}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all border ${readingSettings.fontFamily === 'sans'
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-paper-secondary text-ink border-transparent dark:bg-gray-700 dark:text-white'
                    }`}
                >
                  <span className="font-body">Sans</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* APP INFO */}
        <section>
          <div className="bg-paper-secondary dark:bg-gray-800 rounded-2xl p-5 flex items-center gap-4 border border-paper-tertiary dark:border-gray-700">
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl shadow-soft flex items-center justify-center text-gold-500">
              <Info size={24} />
            </div>
            <div>
              <p className="font-heading text-lg font-bold text-ink dark:text-gray-200 leading-none">Exegese Pura e Simples</p>
              <p className="font-body text-xs text-ink-tertiary dark:text-gray-400 mt-1 uppercase tracking-widest leading-none">Versão 2.1.0 • Premium</p>
            </div>
          </div>
        </section>

        {/* LOGOUT */}
        <section>
          <button
            onClick={onLogout}
            className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-red-100 dark:border-red-900/30 p-5 flex items-center justify-center gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition-all group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-body font-bold">Encerrar Sessão</span>
          </button>
          <p className="font-body text-[10px] text-ink-tertiary text-center mt-4 uppercase tracking-[0.1em]">
            Seus dados estão protegidos neste dispositivo.
          </p>
        </section>

      </div>
    </div>
  );
};

export default Settings;