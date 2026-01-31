import React from 'react';
import { ArrowRight, Grid, ChevronLeft } from 'lucide-react';
import { AppView } from '../core/types';

interface ToolsProps {
  navigate: (view: AppView) => void;
}

const Tools: React.FC<ToolsProps> = ({ navigate }) => {
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col pt-20 px-6">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
           <Grid className="text-indigo-600" /> Ferramentas
        </h2>
        <p className="text-sm text-gray-500">Nossos aplicativos disponíveis</p>
      </div>

      {/* Apps List */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-24">
        
        {/* Current App (Free) */}
        <AppCard 
          name="Exegese Pura e Simples" 
          description="Ferramenta completa de estudo bíblico com IA."
          type="Atual - Grátis" 
          active 
        />

        {/* Test/Commercial Apps */}
        <AppCard 
          name="Hebrew Daily" 
          description="Aprenda uma palavra em hebraico por dia."
          type="Teste - Premium" 
        />
        
        <AppCard 
          name="Greek Master" 
          description="Curso intensivo de grego koiné."
          type="Teste - Premium" 
        />
        
        <AppCard 
          name="Church Management" 
          description="Gestão financeira e de membros para igrejas."
          type="Teste - Enterprise" 
        />

        <AppCard 
          name="Kids Bible" 
          description="Histórias bíblicas interativas para crianças."
          type="Em Breve" 
        />

      </div>
    </div>
  );
};

const AppCard = ({ name, description, type, active }: any) => (
  <div className={`bg-white dark:bg-gray-800 p-4 rounded-xl border ${active ? 'border-green-500/30' : 'border-gray-100 dark:border-gray-700'} shadow-sm flex flex-col gap-2`}>
    <div className="flex justify-between items-start">
      <h3 className="font-bold text-gray-800 dark:text-white text-lg">{name}</h3>
      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${active ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{type}</span>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    {!active && (
      <button className="mt-2 w-full py-2 border border-indigo-100 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors">
        Saiba Mais
      </button>
    )}
  </div>
);

export default Tools;