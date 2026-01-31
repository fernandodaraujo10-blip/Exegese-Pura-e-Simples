import React from 'react';
import { User, Settings, Star, Bell, ShieldCheck, Zap } from 'lucide-react';
import { AppView, AdminConfig } from '../types';

interface HomeViewProps {
  adminConfig: AdminConfig;
  onChangeView: (view: AppView) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ adminConfig, onChangeView }) => {
  return (
    <div className="h-full w-full flex flex-col bg-gray-50 relative">
      
      {/* 1. COVER AREA (30%) - Fixed */}
      <div className="h-[30%] w-full relative">
        <img 
          src={adminConfig.coverImageUrl} 
          alt="Cover" 
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-6">
           <h2 className="text-white text-2xl font-bold leading-tight">{adminConfig.coverTitle}</h2>
           <span className="text-gray-300 text-sm mt-1">Versão Premium Ativa</span>
        </div>

        {/* FLOATING TOP BUTTONS (Absolute to maintain strict layout %) */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pt-safe-top">
           <button 
             onClick={() => onChangeView(AppView.PROFILE)}
             className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-lg active:scale-95 transition-all">
             <User size={20} />
           </button>
           <button 
             onClick={() => onChangeView(AppView.SETTINGS)}
             className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-lg active:scale-95 transition-all">
             <Settings size={20} />
           </button>
        </div>
      </div>

      {/* 2. CENTRAL AREA (40%) - 4 Buttons Grid */}
      <div className="h-[40%] w-full p-4 grid grid-cols-2 gap-4">
        <button 
          onClick={() => onChangeView(AppView.BIBLE)}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-all hover:border-blue-200 group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <ShieldCheck size={24} />
          </div>
          <span className="font-bold text-gray-700 text-sm">Biblioteca</span>
        </button>

        <button 
          onClick={() => onChangeView(AppView.EXEGESIS)}
          className="bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <Zap size={60} />
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Star size={24} fill="currentColor" />
          </div>
          <span className="font-bold text-white text-sm">EXEGESE AI</span>
        </button>

        <button 
          onClick={() => onChangeView(AppView.NOTES)}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-all hover:border-blue-200 group"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Settings size={24} />
          </div>
          <span className="font-bold text-gray-700 text-sm">Estudos</span>
        </button>

        <button 
          onClick={() => onChangeView(AppView.COMMUNITY)}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-all hover:border-blue-200 group"
        >
           <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Bell size={24} />
          </div>
          <span className="font-bold text-gray-700 text-sm">Comunidade</span>
        </button>
      </div>

      {/* 3. RESERVED AREA (20%) - Empty Card */}
      <div className="h-[20%] w-full px-4 pb-2">
        <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
           <span className="text-xs font-semibold uppercase tracking-widest mb-1">Espaço Reservado</span>
           <span className="text-[10px]">Avisos • Destaques • Ads</span>
        </div>
      </div>
      
      {/* 4. BOTTOM NAV is handled by parent (10%) */}
    </div>
  );
};

export default HomeView;