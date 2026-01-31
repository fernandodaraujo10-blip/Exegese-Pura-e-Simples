import React from 'react';
import { motion } from 'framer-motion';
import { Search, Home, Grid, Menu, Cpu } from 'lucide-react';
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
    <nav className="h-full w-full bg-paper/80 backdrop-blur-lg border-t border-paper-tertiary flex items-center justify-around shadow-[0_-4px_15px_rgba(12,10,9,0.05)] z-50 px-2">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            onClick={() => onChangeView(item.view)}
            className={`relative flex-1 flex flex-col items-center justify-center h-full transition-colors duration-300 ${isActive ? 'text-gold-600' : 'text-ink-tertiary hover:text-ink-secondary'
              }`}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
              className={`p-1.5 rounded-xl transition-colors duration-300 ${item.highlight && isActive ? 'bg-gold-100' : ''
                }`}
            >
              <Icon size={item.highlight ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>

            <span className="font-body text-[9px] font-bold uppercase tracking-widest mt-1">{item.label}</span>

            {isActive && (
              <motion.div
                layoutId="active-nav"
                className="absolute -top-[1px] w-12 h-1 bg-gold-500 rounded-b-full shadow-[0_2px_10px_rgba(202,138,4,0.3)]"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;