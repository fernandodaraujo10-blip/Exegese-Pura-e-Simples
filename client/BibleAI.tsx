import React, { useState, useRef, useEffect } from 'react';
import { Send, HeartHandshake, GraduationCap, FileText, Cpu } from 'lucide-react';
import { askBibleAI } from '../core/gemini';
import { TheologyLine } from '../core/types';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  modeLabel?: string;
}

type AIMode = 'COUNSELOR' | 'THEOLOGIAN' | 'STUDIES';

// Sugestões por modo
const SUGGESTIONS: Record<AIMode, string[]> = {
  COUNSELOR: [
    "Estou me sentindo muito ansioso",
    "Estou com problemas no casamento",
    "Como consigo perdoar alguém?",
    "Como lidar com o luto?",
    "Qual é o meu propósito de vida?"
  ],
  THEOLOGIAN: [
    "Explique a doutrina da Predestinação",
    "Como explicar a Trindade?",
    "A salvação pode ser perdida?",
    "Quais os sinais do fim dos tempos?",
    "O que é o batismo no Espírito Santo?"
  ],
  STUDIES: [
    "Estudo detalhado de Romanos 8",
    "Análise do Salmo 23",
    "As Parábolas de Jesus",
    "Estudo sobre o Sermão do Monte",
    "O significado do Tabernáculo"
  ]
};

const BibleAI: React.FC = () => {
  // Estado
  const [activeMode, setActiveMode] = useState<AIMode>('COUNSELOR');
  const [theology, setTheology] = useState<TheologyLine>(TheologyLine.CALVINIST);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Olá! Selecione um modo acima e uma linha teológica. Como posso ajudar?', modeLabel: 'IA' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleModeChange = (mode: AIMode) => {
    setActiveMode(mode);
    setMessages(prev => [
      ...prev, 
      { 
        id: Date.now().toString(), 
        role: 'ai', 
        content: `Modo alterado para: ${getModeLabel(mode)}. Selecione uma sugestão abaixo ou digite sua dúvida.`,
        modeLabel: 'Sistema'
      }
    ]);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Mapear modo para persona interna do Gemini
    let persona = '';
    if (activeMode === 'COUNSELOR') persona = 'Conselheiro';
    if (activeMode === 'THEOLOGIAN') persona = 'Teólogo';
    if (activeMode === 'STUDIES') persona = 'Professor';

    const answer = await askBibleAI(text, theology, persona);

    const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        content: answer,
        modeLabel: getModeLabel(activeMode)
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const getModeLabel = (mode: AIMode) => {
    switch(mode) {
        case 'COUNSELOR': return 'Conselheiro';
        case 'THEOLOGIAN': return 'Teólogo';
        case 'STUDIES': return 'Estudos';
        default: return 'IA';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pt-16">
      
      {/* 1. SELEÇÃO DE MODO (Acima da Teologia) */}
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-2 z-20">
         <div className="grid grid-cols-3 gap-2 mb-3">
            <button 
              onClick={() => handleModeChange('COUNSELOR')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${activeMode === 'COUNSELOR' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
            >
               <HeartHandshake size={20} className="mb-1" />
               <span className="text-[10px] font-bold text-center leading-tight">Conselheiro<br/>Bíblico</span>
            </button>
            
            <button 
              onClick={() => handleModeChange('THEOLOGIAN')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${activeMode === 'THEOLOGIAN' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
            >
               <GraduationCap size={20} className="mb-1" />
               <span className="text-[10px] font-bold text-center leading-tight">Pergunte ao<br/>Teólogo</span>
            </button>

            <button 
              onClick={() => handleModeChange('STUDIES')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${activeMode === 'STUDIES' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
            >
               <FileText size={20} className="mb-1" />
               <span className="text-[10px] font-bold text-center leading-tight">Estudos<br/>Bíblicos</span>
            </button>
         </div>

         {/* 2. SELETOR DE TEOLOGIA (Abaixo dos Modos) */}
         <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
           {Object.values(TheologyLine).map(t => (
             <button
               key={t}
               onClick={() => setTheology(t)}
               className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${
                 theology === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'
               }`}
             >
               {t.split(' ')[0]} {/* Pega apenas o primeiro nome para caber */}
             </button>
           ))}
         </div>
      </div>

      {/* 3. ÁREA DE CHAT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-y bg-gray-50 pb-32" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'ai' && (
                  <span className="text-[9px] font-bold text-gray-400 mb-1 ml-1 uppercase flex items-center gap-1">
                    <Cpu size={10} /> {msg.modeLabel}
                  </span>
                )}
                <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                    {msg.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-1 last:mb-0">{line}</p>
                    ))}
                </div>
             </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs text-gray-400 italic border border-gray-100">
               Digitando...
             </div>
          </div>
        )}
      </div>

      {/* 4. BARRA DE INPUT E SUGESTÕES (Fixa no rodapé) */}
      <div className="fixed bottom-[10%] left-0 w-full bg-white border-t border-gray-200 z-30">
        
        {/* SUGESTÕES (Acima do input) */}
        <div className="w-full overflow-x-auto whitespace-nowrap px-4 py-3 bg-gray-50 border-b border-gray-100 hide-scrollbar flex gap-2">
            {SUGGESTIONS[activeMode].map((sug, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(sug)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors shrink-0 ${
                    activeMode === 'COUNSELOR' ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' :
                    activeMode === 'THEOLOGIAN' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                  }`}
                >
                  {sug}
                </button>
            ))}
        </div>

        {/* INPUT */}
        <div className="p-3 bg-white">
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-indigo-500 transition-all">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Pergunte ao ${getModeLabel(activeMode)}...`}
                className="flex-1 bg-transparent px-2 outline-none text-gray-800 placeholder-gray-400 text-sm"
            />
            <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-lg transition-all ${
                !input.trim() || isLoading ? 'text-gray-300' : 'text-indigo-600 bg-indigo-50'
                }`}
            >
                <Send size={20} />
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BibleAI;