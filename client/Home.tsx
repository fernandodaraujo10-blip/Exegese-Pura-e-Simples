import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Users, Cpu, Heart, FileText, Clock } from 'lucide-react';
import { AppView, AdminConfig } from '../core/types';

interface HomeProps {
  config: AdminConfig;
  navigate: (view: AppView, params?: any) => void;
}

const Home: React.FC<HomeProps> = ({ config, navigate }) => {
  return (
    <div className="home-fixed w-full h-full bg-paper flex flex-col relative overflow-hidden">

      {/* 1. CAPA (30%) - Fixed */}
      <section className="h-[30%] w-full relative shrink-0 overflow-hidden bg-paper-tertiary">
        <div className="absolute inset-0 animate-pulse bg-paper-tertiary" />
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 0.5 }}
          transition={{
            scale: { duration: 10, repeat: Infinity, repeatType: "reverse" },
            opacity: { duration: 1 }
          }}
          src={config.coverImageUrl}
          alt="Capa"
          className="w-full h-full object-cover"
          onLoad={(e) => (e.currentTarget.style.opacity = '0.5')}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-heading text-white text-2xl font-semibold leading-tight drop-shadow-md tracking-tight">{config.coverTitle}</h2>
            <span className="text-gold-400 text-[10px] font-body font-semibold uppercase tracking-[0.15em] mt-2 inline-block px-2 py-0.5 bg-gold-400/10 rounded border border-gold-400/20">Versão Premium</span>
          </motion.div>
        </div>
      </section>

      {/* 2. BOTÕES PRINCIPAIS (40%) - 6 Botões (3x2) */}
      <section className="h-[40%] w-full p-4 shrink-0">
        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">
          {[
            { label: "IA", icon: <Cpu size={20} />, view: AppView.BIBLE, variant: 'default' },
            { label: "Exegese", icon: <Zap size={20} />, view: AppView.EXEGESIS, variant: 'primary' },
            { label: "Estudos", icon: <FileText size={20} />, params: { section: 'NOTES' }, view: AppView.MORE, variant: 'default' },
            { label: "Comunidade", icon: <Users size={20} />, view: AppView.COMMUNITY, variant: 'default' },
            { label: "Devocional", icon: <Heart size={20} />, params: { section: 'DEVOTIONAL' }, view: AppView.MORE, variant: 'default' },
            { label: "Livros", icon: <BookOpen size={20} />, params: { section: 'BOOKS' }, view: AppView.MORE, variant: 'default' },
            { label: "Histórico", icon: <Clock size={20} />, view: AppView.HISTORY, variant: 'default' }, // Added History button
          ].map((btn, i) => (
            <motion.div
              key={btn.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="h-full w-full"
            >
              <HomeButton
                label={btn.label}
                icon={btn.icon}
                onClick={() => 'params' in btn && btn.params ? navigate(btn.view, btn.params) : navigate(btn.view)}
                variant={btn.variant as 'default' | 'primary'}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. ESPAÇO RESERVADO (Restante) */}
      <section className="flex-1 w-full px-4 pb-4 min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full h-full bg-paper-secondary rounded-2xl border border-paper-tertiary flex flex-col items-center justify-center text-ink-tertiary relative group overflow-hidden px-8 text-center"
        >
          <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] mb-2 relative z-10 text-gold-600">Mural de Avisos</span>
          <p className="font-body text-xs relative z-10 leading-relaxed italic">{config.announcement}</p>
        </motion.div>
      </section>

    </div>
  );
};

interface HomeButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: 'default' | 'primary';
}

const HomeButton: React.FC<HomeButtonProps> = ({ label, icon, onClick, variant }) => {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`rounded-2xl shadow-soft border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 w-full h-full cursor-pointer relative overflow-hidden group ${isPrimary
        ? 'bg-gold-500 text-white border-gold-600 shadow-medium'
        : 'bg-white text-ink border-paper-tertiary hover:border-gold-300/50'
        }`}
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${isPrimary ? 'bg-white' : 'bg-gold-500'}`} />

      <div className={`p-2.5 rounded-xl transition-all duration-300 relative z-10 ${isPrimary ? 'bg-white/20 group-hover:scale-110' : 'bg-paper-secondary group-hover:bg-gold-50'
        }`}>
        {icon}
      </div>
      <span className="font-body font-semibold text-[11px] leading-none relative z-10 tracking-tight">{label}</span>
    </motion.button>
  );
};

export default Home;