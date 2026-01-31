import React, { useState } from 'react';
import { TheologyLine, ExegesisModule, AppView } from '../core/types';
import { generateExegesis } from '../core/gemini';
import { CoreStorage } from '../core/storage';
import { useAppStore } from '../core/store';
import { shareStudy } from '../services/firebase';
import { Send, Loader2, ArrowLeft, Save, BookOpen, Settings, Share2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExegesisProps {
  onBack: () => void;
}

const Exegesis: React.FC<ExegesisProps> = ({ onBack }) => {
  const { readingSettings, viewParams, setView, user } = useAppStore();
  const [reference, setReference] = useState('');
  const [theology, setTheology] = useState<TheologyLine>(TheologyLine.CALVINIST);
  const [module, setModule] = useState<ExegesisModule>(ExegesisModule.FULL_EXEGESIS);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);

  React.useEffect(() => {
    if (viewParams?.savedStudy) {
      setReference(viewParams.savedStudy.reference);
      setTheology(viewParams.savedStudy.theology);
      setModule(viewParams.savedStudy.module);
      setResult(viewParams.savedStudy.content);
    }
  }, [viewParams]);

  const handleExecute = async () => {
    if (!reference) return;
    setIsLoading(true);
    try {
      const text = await generateExegesis(reference, theology, module);
      setResult(text);
    } catch (error) {
      alert("Erro ao conectar com a IA. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
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

  const handleShare = async () => {
    if (!result || isSharing) return;
    setIsSharing(true);
    try {
      await shareStudy({
        userId: user.id,
        userName: user.name || 'Estudante da Bíblia',
        userAvatar: user.avatarUrl,
        reference,
        theology,
        content: result
      });
      alert('Estudo compartilhado com a comunidade! 🕊️');
    } catch (error) {
      alert('Erro ao compartilhar.');
    } finally {
      setIsSharing(false);
    }
  };

  // TELA DE RESULTADO
  if (result) {
    return (
      <div className={`flex flex-col h-full bg-paper transition-all duration-500 ${isReadingMode ? 'z-[100] fixed inset-0 pt-6' : 'pt-20'}`}>
        <div className="bg-white/80 backdrop-blur-md border-b border-paper-tertiary px-4 py-3 flex items-center justify-between shadow-soft z-10 transition-colors">
          <button onClick={() => isReadingMode ? setIsReadingMode(false) : setResult(null)} className="flex items-center gap-1 text-ink-tertiary hover:text-ink">
            <ArrowLeft size={18} /> <span className="text-[10px] font-bold uppercase tracking-wider">Voltar</span>
          </button>

          {!isReadingMode && (
            <div className="text-center">
              <span className="block text-[9px] font-bold text-ink-tertiary uppercase tracking-widest">{module}</span>
              <span className="font-heading font-bold text-ink text-sm truncate max-w-[150px] inline-block">{reference}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={() => setIsReadingMode(!isReadingMode)} className={`p-2 rounded-full transition-colors ${isReadingMode ? 'bg-gold-500 text-white' : 'text-ink-tertiary hover:bg-paper-tertiary'}`}>
              <Maximize2 size={18} />
            </button>
            {!isReadingMode && (
              <>
                <button onClick={handleShare} disabled={isSharing} className="text-gold-600 hover:text-gold-800 disabled:opacity-50">
                  {isSharing ? <Loader2 className="animate-spin" size={18} /> : <Share2 size={18} />}
                </button>
                <button onClick={handleSave} className="text-indigo-600 hover:text-indigo-700">
                  <Save size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto p-6 scroll-y transition-all duration-500 ${isReadingMode ? 'pb-20 bg-white' : 'pb-32 bg-paper'}`}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-2xl mx-auto text-ink leading-relaxed ${readingSettings.fontFamily === 'serif' ? 'font-heading' : 'font-body'}`}
            style={{
              fontSize: `${readingSettings.fontSize}px`,
              lineHeight: readingSettings.lineHeight
            }}
          >
            <div className="flex items-center gap-2 mb-8 opacity-60">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-paper-tertiary rounded-full text-ink">
                {theology}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-gold-100 text-gold-700 rounded-full">
                {module}
              </span>
            </div>

            {result.split('\n').map((line, i) => {
              if (line.startsWith('##') || line.startsWith('**')) {
                return (
                  <h4 key={i} className="text-primary font-bold mt-12 mb-6 border-b border-gold-200/50 pb-2 text-xl tracking-tight">
                    {line.replace(/[#*]/g, '')}
                  </h4>
                );
              }
              if (!line.trim()) return <div key={i} className="h-6" />;
              return <p key={i} className="mb-6 text-justify whitespace-pre-wrap antialiased">{line.replace(/[#*]/g, '')}</p>;
            })}

            {!isReadingMode && (
              <div className="mt-16 p-8 bg-paper-secondary rounded-3xl border border-paper-tertiary shadow-soft text-center group">
                <div className="w-12 h-12 bg-gold-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-500">
                  <BookOpen size={24} />
                </div>
                <h4 className="font-heading text-base font-bold text-ink uppercase tracking-widest mb-2">Perspectiva Aplicada</h4>
                <p className="font-body text-xs text-ink-tertiary italic leading-relaxed">
                  Este estudo foi gerado sob a ótica {theology.toLowerCase()}, explorando as nuances ricas do texto inspirado com rigor e reverência.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // TELA DE CONFIGURAÇÃO
  return (
    <div className="flex flex-col h-full bg-paper pt-24 pb-8 overflow-y-auto scroll-y">
      <div className="flex flex-col px-6 gap-8 max-w-md mx-auto w-full">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-2"
        >
          <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-2xl flex items-center justify-center shadow-soft">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-ink tracking-tight leading-none">Nova Exegese</h2>
            <p className="font-body text-[10px] text-ink-tertiary uppercase tracking-widest mt-1.5 font-bold">Arquitetura de Estudo Profundo</p>
          </div>
        </motion.div>

        {/* 1. Reference Input */}
        <div className="flex flex-col gap-3">
          <div className="bg-white p-5 rounded-3xl border border-paper-tertiary shadow-soft focus-within:border-gold-500 transition-all focus-within:shadow-medium">
            <label className="text-[10px] font-black text-ink-tertiary uppercase tracking-widest block mb-1">Passagem Bíblica</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: Hebreus 11:1"
              className="w-full text-2xl font-heading font-bold text-ink placeholder-paper-tertiary/50 outline-none bg-transparent"
            />
          </div>

          {/* Suggestions */}
          <div className="flex gap-2 pl-1">
            {['Hebreus 11:1', 'Salmos 23:1', 'João 3:16'].map((sug) => (
              <button
                key={sug}
                onClick={() => setReference(sug)}
                className="px-3 py-1.5 bg-paper-secondary border border-paper-tertiary rounded-full text-[10px] font-bold text-ink-tertiary hover:text-gold-600 hover:border-gold-200 transition-all active:scale-95"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Theology Selector */}
        <div>
          <label className="text-[10px] font-black text-ink-tertiary uppercase tracking-widest block mb-3 pl-1">Linha Teológica</label>
          <div className="flex gap-2">
            {Object.values(TheologyLine).map((t, idx) => (
              <motion.button
                key={t}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setTheology(t)}
                className={`flex-1 py-3.5 rounded-2xl text-[10px] font-body font-bold uppercase tracking-[0.15em] border transition-all ${theology === t
                  ? 'bg-primary text-white border-primary shadow-medium scale-[1.02]'
                  : 'bg-white text-ink-tertiary border-paper-tertiary hover:bg-paper-secondary'
                  }`}
              >
                {t}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 3. Module Selector */}
        <div className="flex flex-col">
          <label className="text-[10px] font-black text-ink-tertiary uppercase tracking-widest block mb-3 pl-1">Módulo de Processamento</label>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(ExegesisModule).map((m, idx) => {
              const arts = [
                'https://images.unsplash.com/photo-1544648156-5388451882c5?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1524311583145-d4508933cced?auto=format&fit=crop&q=80&w=300'
              ];
              return (
                <motion.button
                  key={m}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  onClick={() => setModule(m)}
                  className={`group rounded-3xl text-left border transition-all h-32 relative overflow-hidden ${module === m
                    ? 'border-gold-500 shadow-strong scale-[1.02] ring-2 ring-gold-500/20'
                    : 'bg-white border-paper-tertiary text-ink-secondary hover:border-gold-300'
                    }`}
                >
                  <img src={arts[idx]} className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${module === m ? 'opacity-40 scale-110' : 'opacity-10 group-hover:opacity-20'}`} />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-paper/90 via-paper/20 to-transparent">
                    <span className={`font-heading text-[12px] font-bold leading-tight relative z-10 ${module === m ? 'text-gold-700' : 'text-ink'}`}>{m}</span>
                    {module === m && <motion.div layoutId="activeMod" className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold-500 shadow-soft" />}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* 4. Action Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExecute}
          disabled={!reference || isLoading}
          className={`w-full py-5 min-h-[64px] rounded-3xl shadow-strong flex items-center justify-center gap-4 font-body font-bold text-base text-white transition-all mt-2 active:brightness-90 ${!reference || isLoading ? 'bg-paper-tertiary cursor-not-allowed' : 'bg-primary'
            }`}
        >
          {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} className="text-gold-400" />}
          <span className="tracking-[0.2em] uppercase text-xs">Iniciar Exegese Profunda</span>
        </motion.button>

      </div>
    </div>
  );
};

export default Exegesis;