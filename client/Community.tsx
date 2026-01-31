import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Loader2,
  Cpu,
  BookOpen
} from 'lucide-react';
import { getSharedStudies, SharedStudy } from '../services/firebase';

const Community: React.FC = () => {
  const [studies, setStudies] = useState<SharedStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const data = await getSharedStudies();
        setStudies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudies();
  }, []);

  const handleShareWhatsApp = (study: SharedStudy) => {
    const text = `*Estudo Exegético:* ${study.reference}\n\n${study.content.substring(0, 100)}...\n\nLeia mais no App Exegese Pura & Simples`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-paper">
        <Loader2 className="animate-spin text-gold-500 mb-2" />
        <p className="text-xs font-body text-ink-tertiary">Sincronizando o Mural da Comunidade...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-paper flex flex-col pt-16">

      {/* Header */}
      <div className="px-6 py-4 border-b border-paper-tertiary bg-paper/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 mb-1">
          <Users size={20} className="text-gold-600" />
          <h1 className="font-heading text-xl font-bold text-ink">Comunidade</h1>
        </div>
        <p className="text-[10px] font-body text-ink-tertiary uppercase tracking-widest">Estudos Compartilhados</p>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 scroll-y">
        {studies.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
            <MessageCircle size={48} className="mb-4" />
            <p className="text-sm font-body">Nenhum estudo compartilhado ainda.<br />Seja o primeiro!</p>
          </div>
        ) : (
          studies.map((study) => (
            <div key={study.id} className="bg-white rounded-2xl border border-paper-tertiary shadow-sm overflow-hidden flex flex-col">

              {/* User Header */}
              <div className="p-4 flex items-center justify-between border-b border-paper-tertiary/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-paper-tertiary overflow-hidden">
                    <img src={study.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink">{study.userName}</div>
                    <div className="text-[9px] text-ink-tertiary uppercase tracking-wider">{study.theology}</div>
                  </div>
                </div>
                <div className="text-[9px] text-ink-tertiary">
                  {study.timestamp?.toDate ? study.timestamp.toDate().toLocaleDateString() : 'Agora'}
                </div>
              </div>

              {/* Content Preview */}
              <div className="p-4 bg-paper-secondary/30">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} className="text-gold-600" />
                  <span className="font-heading font-bold text-ink-secondary text-sm">{study.reference}</span>
                </div>
                <div className="font-serif text-sm leading-relaxed text-ink-secondary line-clamp-4">
                  {study.content.replace(/[#*]/g, '')}
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-3 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-ink-tertiary hover:text-red-500 transition-colors">
                    <Heart size={16} />
                    <span className="text-[10px] font-bold">{study.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-ink-tertiary">
                    <MessageCircle size={16} />
                    <span className="text-[10px] font-bold">Comentar</span>
                  </button>
                </div>
                <button
                  onClick={() => handleShareWhatsApp(study)}
                  className="w-8 h-8 rounded-full bg-paper-tertiary/50 flex items-center justify-center text-ink-tertiary hover:text-gold-600 transition-colors"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Community;