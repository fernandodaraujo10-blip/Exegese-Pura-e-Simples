import React from 'react';
import { BookOpen, Search, Home, FileText, HelpCircle } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { view: AppView.BIBLE, icon: BookOpen, label: 'Bíblia' },
    { view: AppView.EXEGESIS, icon: Search, label: 'Exegese', highlight: true },
    { view: AppView.HOME, icon: Home, label: 'Home' },
    { view: AppView.NOTES, icon: FileText, label: 'Estudos' },
    { view: AppView.COMMUNITY, icon: HelpCircle, label: 'Ajuda' },
  ];

  return (
    <div className="h-full w-full bg-white border-t border-gray-200 flex items-center justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        const Icon = item.icon;
        
        return (
          <button
            key={item.label}
            onClick={() => onChangeView(item.view)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${
              isActive ? 'text-blue-900' : 'text-gray-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${item.highlight && isActive ? 'bg-blue-100' : ''}`}>
               <Icon size={item.highlight ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;