import React, { useState } from 'react';
import { TheologyLine, ExegesisModule, StudyResult } from '../types';
import { generateExegesis } from '../services/geminiService';
import { BookOpen, Send, Loader2, ArrowLeft, Save } from 'lucide-react';

interface ExegesisViewProps {
  onBack: () => void;
  onSaveStudy: (study: StudyResult) => void;
}

const ExegesisView: React.FC<ExegesisViewProps> = ({ onBack, onSaveStudy }) => {
  const [reference, setReference] = useState('');
  const [theology, setTheology] = useState<TheologyLine>(TheologyLine.CALVINIST);
  const [module, setModule] = useState<ExegesisModule>(ExegesisModule.FULL_EXEGESIS);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!reference) return;
    
    setIsLoading(true);
    setResult(null);
    
    const generatedText = await generateExegesis(reference, theology, module);
    
    setResult(generatedText);
    setIsLoading(false);
  };

  const handleSave = () => {
    if (result) {
      onSaveStudy({
        id: Date.now().toString(),
        reference,
        theology,
        module,
        content: result,
        date: new Date()
      });
      alert('Estudo salvo com sucesso!');
    }
  };

  if (result) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="bg-indigo-600 text-white p-4 flex items-center justify-between shadow-md shrink-0">
          <button onClick={() => setResult(null)} className="p-2 -ml-2 hover:bg-white/20 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-bold truncate max-w-[60%]">{reference}</h3>
          <button onClick={handleSave} className="p-2 -mr-2 hover:bg-white/20 rounded-full bg-indigo-700">
            <Save size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 prose prose-indigo max-w-none">
           <div className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-2">
             {theology} • {module}
           </div>
           {/* Simple markdown rendering simulation */}
           {result.split('\n').map((line, i) => (
             <p key={i} className={line.startsWith('#') ? 'font-bold text-gray-800 mt-4 mb-2' : 'text-gray-600 mb-2 leading-relaxed'}>
               {line.replace(/#/g, '')}
             </p>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Nova Exegese</h2>
            <p className="text-xs text-gray-500">Inteligência Artificial Teológica</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Reference Input */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Texto Bíblico</label>
            <input 
              type="text" 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: João 3:16, Salmos 23..."
              className="w-full text-lg font-semibold text-gray-800 placeholder-gray-300 outline-none border-b-2 border-transparent focus:border-indigo-500 transition-colors pb-1"
            />
          </div>

          {/* Theology Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Linha Teológica</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(TheologyLine).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheology(t)}
                  className={`p-3 rounded-xl text-left text-sm font-medium transition-all border ${
                    theology === t 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-[1.02]' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Module Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Módulo de Estudo</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(ExegesisModule).map((m) => (
                <button
                  key={m}
                  onClick={() => setModule(m)}
                  className={`p-3 rounded-xl text-left text-xs font-medium transition-all border h-20 flex flex-col justify-between ${
                    module === m
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span>{m}</span>
                  {module === m && <div className="w-2 h-2 bg-white rounded-full self-end animate-pulse" />}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-20" /> {/* Spacer */}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-[12%] left-0 w-full px-6 pointer-events-none">
        <button 
          onClick={handleExecute}
          disabled={!reference || isLoading}
          className={`w-full py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 font-bold text-lg text-white pointer-events-auto transition-all ${
            !reference || isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-600 to-blue-600 active:scale-95'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Analisando...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Executar Estudo</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExegesisView;