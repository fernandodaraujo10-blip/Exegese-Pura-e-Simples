import React, { useState, useRef, useEffect } from 'react';
import { Send, HeartHandshake, GraduationCap, FileText, Cpu, Sparkles } from 'lucide-react';
import { askBibleAI } from '../core/gemini';
import { TheologyLine } from '../core/types';
import { motion, AnimatePresence } from 'framer-motion';

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
    "Como encontrar descanso em Cristo?",
    "A Providência em tempos de luto",
    "Lidando com o pecado recorrente",
    "Perdão vs Reconciliação",
    "Contentamento cristão"
  ],
  THEOLOGIAN: [
    "Pacto da Redenção na salvação",
    "Atributos na Pessoa de Cristo",
    "Justificação: Sola Fide vs Tiago 2",
    "Lei e Evangelho na tradição clássica",
    "Inspiração Plenária e Verbal"
  ],
  STUDIES: [
    "Sensus Plenior no AT",
    "Tipologia de Cristo no Tabernáculo",
    "Estrutura de Gênesis 3:15",
    "O termo 'Logos' em João",
    "O Sínodo de Dort"
  ]
};

const BibleAI: React.FC = () => {
  // Estado
  const [activeMode, setActiveMode] = useState<AIMode>('COUNSELOR');
  const [theology, setTheology] = useState<TheologyLine>(TheologyLine.CALVINIST);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Olá! Como posso ajudar em sua jornada bíblica hoje?', modeLabel: 'IA' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleModeChange = (mode: AIMode) => {
    setActiveMode(mode);
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
    switch (mode) {
      case 'COUNSELOR': return 'Aconselhamento';
      case 'THEOLOGIAN': return 'Teologia';
      case 'STUDIES': return 'Estudos';
      default: return 'IA';
    }
  };

  return (
    <div className="flex flex-col h-full bg-paper pt-12 overflow-hidden">

      {/* 1. SELEÇÃO DE MODO */}
      <div className="bg-white/80 backdrop-blur-md border-b border-paper-tertiary px-4 py-4 z-20 shadow-sm">
        <div className="flex items-center gap-3 mb-4 pl-2">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-ink leading-none">Bible AI</h2>
            <span className="text-[9px] font-bold text-gold-600 uppercase tracking-widest">Inteligência Bíblica</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => handleModeChange('COUNSELOR')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-2xl border transition-all ${activeMode === 'COUNSELOR' ? 'bg-primary border-primary text-white shadow-medium' : 'bg-paper-secondary border-paper-tertiary text-ink-tertiary'}`}
          >
            <HeartHandshake size={18} className="mb-1" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Conselheiro</span>
          </button>

          <button
            onClick={() => handleModeChange('THEOLOGIAN')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-2xl border transition-all ${activeMode === 'THEOLOGIAN' ? 'bg-primary border-primary text-white shadow-medium' : 'bg-paper-secondary border-paper-tertiary text-ink-tertiary'}`}
          >
            <GraduationCap size={18} className="mb-1" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Teólogo</span>
          </button>

          <button
            onClick={() => handleModeChange('STUDIES')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-2xl border transition-all ${activeMode === 'STUDIES' ? 'bg-primary border-primary text-white shadow-medium' : 'bg-paper-secondary border-paper-tertiary text-ink-tertiary'}`}
          >
            <FileText size={18} className="mb-1" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Estudos</span>
          </button>
        </div>

        {/* 2. SELETOR DE TEOLOGIA */}
        <div className="flex items-center gap-2 bg-paper-secondary p-1 rounded-xl border border-paper-tertiary">
          {Object.values(TheologyLine).map(t => (
            <button
              key={t}
              onClick={() => setTheology(t)}
              className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${theology === t ? 'bg-white text-ink shadow-soft' : 'text-ink-tertiary'
                }`}
            >
              {t.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ÁREA DE CHAT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-y bg-paper pb-32" ref={scrollRef}>
        {messages.length === 1 && messages[0].role === 'ai' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center px-8"
          >
            <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-strong transition-colors ${activeMode === 'COUNSELOR' ? 'bg-rose-100 text-rose-600' :
              activeMode === 'THEOLOGIAN' ? 'bg-indigo-100 text-indigo-600' :
                'bg-emerald-100 text-emerald-600'
              }`}>
              {activeMode === 'COUNSELOR' ? <HeartHandshake size={32} /> :
                activeMode === 'THEOLOGIAN' ? <GraduationCap size={32} /> :
                  <FileText size={32} />}
            </div>
            <h3 className="font-heading text-xl font-bold text-ink mb-2">Como posso te ajudar hoje?</h3>
            <p className="font-body text-xs text-ink-tertiary leading-relaxed">
              Inicie uma conversa profunda sobre as Escrituras. Escolha uma sugestão no rodapé ou digite sua dúvida.
            </p>
          </motion.div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.role === 'ai' && (
                <span className="text-[9px] font-bold text-ink-tertiary mb-1 ml-1 uppercase flex items-center gap-1 tracking-widest">
                  <Cpu size={10} /> {msg.modeLabel}
                </span>
              )}
              <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-soft border ${msg.role === 'user'
                ? 'bg-primary text-white border-primary rounded-tr-none'
                : 'bg-white text-ink border-paper-tertiary rounded-tl-none font-medium'
                }`}>
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0 transition-all">{line}</p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 px-5 rounded-3xl rounded-tl-none shadow-soft text-[11px] text-gold-600 font-bold uppercase tracking-widest border border-paper-tertiary animate-pulse">
              Consultando Fontes...
            </div>
          </div>
        )}
      </div>

      {/* 4. BARRA DE INPUT E SUGESTÕES (Fixa no rodapé) */}
      <div className="fixed bottom-[10%] left-0 w-full bg-paper border-t border-paper-tertiary z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">

        {/* SUGESTÕES (Acima do input) */}
        <div className="w-full overflow-x-auto whitespace-nowrap px-4 py-3 bg-paper-secondary/50 border-b border-paper-tertiary hide-scrollbar flex gap-2">
          {SUGGESTIONS[activeMode].map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all active:scale-95 shrink-0 ${activeMode === 'COUNSELOR' ? 'bg-white text-rose-600 border-rose-100 hover:bg-rose-50' :
                  activeMode === 'THEOLOGIAN' ? 'bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50' :
                    'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'
                }`}
            >
              {sug}
            </button>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white">
          <div className="flex items-center gap-3 bg-paper-secondary p-2.5 rounded-2xl border border-paper-tertiary focus-within:border-gold-500 focus-within:ring-4 focus-within:ring-gold-500/10 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Mensagem para o ${getModeLabel(activeMode)}...`}
              className="flex-1 bg-transparent px-3 outline-none text-ink placeholder-ink-tertiary/50 text-sm font-medium"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all shadow-soft active:scale-90 ${!input.trim() || isLoading ? 'text-ink-tertiary/30 bg-paper-tertiary' : 'text-white bg-primary shadow-medium'
                }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleAI;