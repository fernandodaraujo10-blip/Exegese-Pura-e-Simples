import React from 'react';
import { Book, Search, Home, Grid, Menu, Cpu } from 'lucide-react';
import { AppView } from '../core/types';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { view: AppView.BIBLE, icon: Cpu, label: 'IA' },
    { view: AppView.EXEGESIS, icon: Search, label: 'Exegese', highlight: true },
    { view: AppView.HOME, icon: Home, label: 'Home' },
    { view: AppView.TOOLS, icon: Grid, label: 'Ferramentas' },
    { view: AppView.MORE, icon: Menu, label: 'Mais' },
  ];

  return (
    <nav className="h-full w-full bg-paper border-t border-paper-tertiary flex items-center justify-around shadow-[0_-4px_15px_rgba(12,10,9,0.05)] z-50">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            onClick={() => onChangeView(item.view)}
            className={`flex-1 flex flex-col items-center justify-center h-full active:scale-90 transition-all duration-200 ${isActive ? 'text-gold-500' : 'text-ink-tertiary hover:text-ink-secondary'
              }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors duration-200 ${item.highlight && isActive ? 'bg-gold-100' : ''
              }`}>
              <Icon size={item.highlight ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="font-body text-[10px] font-medium leading-none mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;