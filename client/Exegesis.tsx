import React, { useState } from 'react';
import { TheologyLine, ExegesisModule } from '../core/types';
import { generateExegesis } from '../core/gemini';
import { CoreStorage } from '../core/storage';
import { Send, Loader2, ArrowLeft, Save, BookOpen } from 'lucide-react';

interface ExegesisProps {
  onBack: () => void;
}

const Exegesis: React.FC<ExegesisProps> = ({ onBack }) => {
  const [reference, setReference] = useState('');
  const [theology, setTheology] = useState<TheologyLine>(TheologyLine.CALVINIST);
  const [module, setModule] = useState<ExegesisModule>(ExegesisModule.FULL_EXEGESIS);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!reference) return;
    setIsLoading(true);
    const text = await generateExegesis(reference, theology, module);
    setResult(text);
    setIsLoading(false);
  };

  const handleSave = () => {
    if (!result) return;
    CoreStorage.saveStudy({
      id: Date.now().toString(),
      reference,
      theology,
      module,
      content: result,
      date: new Date().toISOString()
    });
    alert('Estudo salvo!');
  };

  // TELA DE RESULTADO
  if (result) {
    return (
      <div className="flex flex-col h-full bg-white pt-20">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
          <button onClick={() => setResult(null)} className="flex items-center gap-1 text-gray-500 hover:text-gray-800">
            <ArrowLeft size={18} /> <span className="text-xs font-bold uppercase">Voltar</span>
          </button>
          <div className="text-center">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{module}</span>
            <span className="font-serif font-bold text-gray-800">{reference}</span>
          </div>
          <button onClick={handleSave} className="text-indigo-600 hover:text-indigo-800">
            <Save size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 pb-24 scroll-y">
           <div className="prose prose-sm max-w-none font-serif leading-relaxed text-gray-700">
             {/* Renderização limpa e espaçada */}
             {result.split('\n').map((line, i) => {
                if (line.startsWith('##') || line.startsWith('**')) {
                    return <p key={i} className="text-indigo-900 font-bold mt-6 mb-2 border-b border-indigo-100 pb-1">{line.replace(/[#*]/g, '')}</p>;
                }
                return <p key={i} className="mb-3 text-justify">{line.replace(/[#*]/g, '')}</p>;
             })}
           </div>
        </div>
      </div>
    );
  }

  // TELA DE CONFIGURAÇÃO (COMPACTA)
  return (
    <div className="flex flex-col h-full bg-gray-50 pt-20 pb-4 overflow-hidden">
      
      <div className="flex-1 flex flex-col px-4 gap-4 justify-center max-w-md mx-auto w-full">
        
        {/* Cabeçalho Compacto */}
        <div className="flex items-center gap-2 mb-2 opacity-80">
            <BookOpen size={18} className="text-gray-400"/>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Configuração do Estudo</h2>
        </div>

        {/* 1. Reference Input */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Texto Bíblico</label>
          <input 
            type="text" 
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Ex: Romanos 8:28"
            className="w-full text-lg font-serif font-bold text-gray-800 placeholder-gray-300 outline-none bg-transparent"
          />
        </div>

        {/* 2. Theology Selector (Compact Buttons) */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Linha Teológica</label>
          <div className="flex gap-2">
            {Object.values(TheologyLine).map((t) => (
              <button
                key={t}
                onClick={() => setTheology(t)}
                className={`flex-1 py-2 rounded text-[10px] font-bold uppercase tracking-wide border transition-all ${
                  theology === t 
                    ? 'bg-gray-800 text-white border-gray-800' 
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Module Selector (Dense Grid) */}
        <div className="flex-1 min-h-0 flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Tipo de Estudo</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(ExegesisModule).map((m) => (
              <button
                key={m}
                onClick={() => setModule(m)}
                className={`py-3 px-3 rounded text-left border transition-all flex items-center justify-between ${
                  module === m
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-[11px] font-bold leading-tight">{m}</span>
                {module === m && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Action Button */}
        <button 
          onClick={handleExecute}
          disabled={!reference || isLoading}
          className={`w-full py-3.5 rounded-lg shadow-md flex items-center justify-center gap-2 font-bold text-sm text-white transition-all mt-auto ${
            !reference || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 active:scale-[0.98]'
          }`}
        >
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          <span>GERAR ANÁLISE</span>
        </button>

      </div>
    </div>
  );
};

export default Exegesis;