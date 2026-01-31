import React from 'react';
import { Zap, BookOpen, Users, Cpu, Heart, FileText } from 'lucide-react';
import { AppView, AdminConfig } from '../core/types';

interface HomeProps {
  config: AdminConfig;
  navigate: (view: AppView, params?: any) => void;
}

const Home: React.FC<HomeProps> = ({ config, navigate }) => {
  return (
    <div className="home-fixed w-full h-full bg-paper flex flex-col relative overflow-hidden">

      {/* 1. CAPA (30%) - Fixed */}
      <section className="h-[30%] w-full relative shrink-0">
        <img
          src={config.coverImageUrl}
          alt="Capa"
          className="w-full h-full object-cover brightness-[0.5]"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent">
          <h2 className="font-heading text-white text-2xl font-semibold leading-tight drop-shadow-md tracking-tight">{config.coverTitle}</h2>
          <span className="text-gold-400 text-[10px] font-body font-semibold uppercase tracking-[0.15em] mt-2">Versão Premium</span>
        </div>
      </section>

      {/* 2. BOTÕES PRINCIPAIS (40%) - 6 Botões (3x2) */}
      <section className="h-[40%] w-full p-4 shrink-0">
        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">

          {/* Linha Superior */}
          <HomeButton
            label="IA"
            icon={<Cpu size={20} />}
            onClick={() => navigate(AppView.BIBLE)}
            variant="default"
          />

          <HomeButton
            label="Exegese"
            icon={<Zap size={20} />}
            onClick={() => navigate(AppView.EXEGESIS)}
            variant="primary"
          />

          <HomeButton
            label="Estudos"
            icon={<FileText size={20} />}
            onClick={() => navigate(AppView.MORE, { section: 'NOTES' })}
            variant="default"
          />

          {/* Linha Inferior */}
          <HomeButton
            label="Comunidade"
            icon={<Users size={20} />}
            onClick={() => navigate(AppView.MORE, { section: 'COMMUNITY' })}
            variant="default"
          />

          <HomeButton
            label="Devocional"
            icon={<Heart size={20} />}
            onClick={() => navigate(AppView.MORE, { section: 'DEVOTIONAL' })}
            variant="default"
          />

          <HomeButton
            label="Livros"
            icon={<BookOpen size={20} />}
            onClick={() => navigate(AppView.MORE, { section: 'BOOKS' })}
            variant="default"
          />

        </div>
      </section>

      {/* 3. ESPAÇO RESERVADO (Restante) */}
      <section className="flex-1 w-full px-4 pb-4 min-h-0">
        <div className="w-full h-full bg-gradient-to-br from-paper-secondary to-paper-tertiary rounded-2xl border border-paper-tertiary flex flex-col items-center justify-center text-ink-tertiary">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] mb-1">Mural de Avisos</span>
          <span className="font-body text-[10px]">Espaço reservado para recados</span>
        </div>
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
    <button
      onClick={onClick}
      className={`rounded-2xl shadow-soft border flex flex-col items-center justify-center gap-1.5 active:scale-[0.97] transition-all duration-200 w-full h-full cursor-pointer ${isPrimary
          ? 'bg-gold-500 text-white border-gold-600 shadow-medium hover:bg-gold-600'
          : 'bg-white text-ink border-paper-tertiary hover:border-gold-200 hover:shadow-medium'
        }`}
    >
      <div className={`p-2.5 rounded-xl ${isPrimary ? 'bg-white/20' : 'bg-paper-secondary'
        }`}>
        {icon}
      </div>
      <span className="font-body font-semibold text-[11px] leading-none">{label}</span>
    </button>
  );
};

export default Home;