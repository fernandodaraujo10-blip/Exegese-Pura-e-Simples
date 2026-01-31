import React from 'react';
import { LayoutDashboard, Users, Smartphone, BarChart2, LifeBuoy } from 'lucide-react';
import { AppView } from '../core/types';

interface AdminNavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { view: AppView.ADMIN_HOME, icon: LayoutDashboard, label: 'Home' },
    { view: AppView.ADMIN_USERS, icon: Users, label: 'Usuários' },
    { view: AppView.ADMIN_CONTENT, icon: Smartphone, label: 'Conteúdo' },
    { view: AppView.ADMIN_ANALYTICS, icon: BarChart2, label: 'Analytics' },
    { view: AppView.ADMIN_SUPPORT, icon: LifeBuoy, label: 'Suporte' },
  ];

  return (
    <nav className="h-full w-full bg-slate-900 border-t border-slate-800 flex items-center justify-around shadow-lg z-50">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        const Icon = item.icon;
        
        return (
          <button
            key={item.label}
            onClick={() => onChangeView(item.view)}
            className={`flex-1 flex flex-col items-center justify-center h-full active:scale-95 transition-all ${
              isActive ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-red-500/10' : ''}`}>
               <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default AdminNavigation;