import React, { useState } from 'react';
import { TheologyLine, ExegesisModule, AppView } from '../core/types';
import { generateExegesis } from '../core/gemini';
import { CoreStorage } from '../core/storage';
import { useAppStore } from '../core/store';
import { shareStudy } from '../services/firebase';
import { Send, Loader2, ArrowLeft, Save, BookOpen, Settings, Share2 } from 'lucide-react';

interface ExegesisProps {
  onBack: () => void;
}

const Exegesis: React.FC<ExegesisProps> = ({ onBack }) => {
  const { readingSettings, setView, user } = useAppStore();
  const [reference, setReference] = useState('');
  const [theology, setTheology] = useState<TheologyLine>(TheologyLine.CALVINIST);
  const [module, setModule] = useState<ExegesisModule>(ExegesisModule.FULL_EXEGESIS);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

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
      <div className="flex flex-col h-full bg-paper pt-20">
        <div className="bg-white/80 backdrop-blur-md border-b border-paper-tertiary px-4 py-3 flex items-center justify-between shadow-soft z-10">
          <button onClick={() => setResult(null)} className="flex items-center gap-1 text-ink-tertiary hover:text-ink">
            <ArrowLeft size={18} /> <span className="text-[10px] font-bold uppercase tracking-wider">Voltar</span>
          </button>
          <div className="text-center">
            <span className="block text-[9px] font-bold text-ink-tertiary uppercase tracking-widest">{module}</span>
            <span className="font-heading font-bold text-ink text-sm truncate max-w-[150px] inline-block">{reference}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} disabled={isSharing} className="text-gold-600 hover:text-gold-800 disabled:opacity-50">
              {isSharing ? <Loader2 className="animate-spin" size={18} /> : <Share2 size={18} />}
            </button>
            <button onClick={handleSave} className="text-indigo-600 hover:text-indigo-700">
              <Save size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-24 scroll-y bg-paper">
          <div
            className={`max-w-none text-ink leading-relaxed ${readingSettings.fontFamily === 'serif' ? 'font-heading' : 'font-body'}`}
            style={{
              fontSize: readingSettings ? `${readingSettings.fontSize}px` : '16px',
              lineHeight: readingSettings ? readingSettings.lineHeight : 1.6
            }}
          >
            <div className="flex items-center gap-2 mb-6 opacity-60">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 bg-paper-tertiary rounded text-ink">
                {theology}
              </span>
            </div>

            {result.split('\n').map((line, i) => {
              if (line.startsWith('##') || line.startsWith('**')) {
                return (
                  <h4 key={i} className="text-primary font-bold mt-8 mb-4 border-b border-gold-200/50 pb-2">
                    {line.replace(/[#*]/g, '')}
                  </h4>
                );
              }
              if (!line.trim()) return <div key={i} className="h-4" />;
              return <p key={i} className="mb-4 text-justify whitespace-pre-wrap">{line.replace(/[#*]/g, '')}</p>;
            })}

            {/* Context Card */}
            <div className="mt-12 p-6 bg-paper-secondary rounded-2xl border border-paper-tertiary shadow-soft">
              <h4 className="font-heading text-sm font-bold text-gold-600 uppercase tracking-widest mb-2">Perspectiva Aplicada</h4>
              <p className="font-body text-xs text-ink-secondary italic">Este estudo foi gerado sob a ótica {theology}, priorizando a profundidade gramático-histórica e a tradição teológica.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TELA DE CONFIGURAÇÃO (COMPACTA)
  return (
    <div className="flex flex-col h-full bg-paper pt-20 pb-4 overflow-hidden">
      <div className="flex-1 flex flex-col px-6 gap-6 justify-center max-w-md mx-auto w-full">

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gold-100 text-gold-600 rounded-xl flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-ink tracking-tight leading-none">Nova Exegese</h2>
            <p className="font-body text-[10px] text-ink-tertiary uppercase tracking-widest mt-1">Configuração do Estudo</p>
          </div>
        </div>

        {/* 1. Reference Input */}
        <div className="bg-white p-4 rounded-2xl border border-paper-tertiary shadow-soft focus-within:border-gold-500 transition-colors">
          <label className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider block mb-2">Texto Bíblico</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Ex: Romanos 8:28"
            className="w-full text-xl font-heading font-bold text-ink placeholder-paper-tertiary outline-none bg-transparent"
          />
        </div>

        {/* 2. Theology Selector */}
        <div>
          <label className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider block mb-3">Linha Teológica</label>
          <div className="flex gap-2">
            {Object.values(TheologyLine).map((t) => (
              <button
                key={t}
                onClick={() => setTheology(t)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-body font-bold uppercase tracking-wider border transition-all ${theology === t
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-ink-tertiary border-paper-tertiary hover:bg-paper-secondary'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Module Selector */}
        <div className="flex-1 min-h-0 flex flex-col">
          <label className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider block mb-3">Tipo de Estudo</label>
          <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 pb-2">
            {Object.values(ExegesisModule).map((m) => (
              <button
                key={m}
                onClick={() => setModule(m)}
                className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between h-24 ${module === m
                  ? 'bg-gold-50 border-gold-500 text-gold-700 shadow-soft'
                  : 'bg-white border-paper-tertiary text-ink-secondary hover:bg-paper-secondary'
                  }`}
              >
                <span className="font-body text-[11px] font-bold leading-tight">{m}</span>
                {module === m && <div className="w-2 h-2 rounded-full bg-gold-500 self-end" />}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Action Button */}
        <button
          onClick={handleExecute}
          disabled={!reference || isLoading}
          className={`w-full py-4 rounded-2xl shadow-medium flex items-center justify-center gap-3 font-body font-bold text-sm text-white transition-all mt-auto ${!reference || isLoading ? 'bg-paper-tertiary cursor-not-allowed' : 'bg-gold-500 hover:bg-gold-600 active:scale-[0.98]'
            }`}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          <span className="tracking-widest uppercase">Gerar Estudo Profundo</span>
        </button>

      </div>
    </div>
  );
};

export default Exegesis;