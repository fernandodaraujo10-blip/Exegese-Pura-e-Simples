import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Loader2,
  BookOpen
} from 'lucide-react';
import { getSharedStudies, SharedStudy } from '../services/firebase';
import { motion } from 'framer-motion';

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
        <p className="text-[10px] font-body text-ink-tertiary uppercase tracking-widest">Sincronizando o Mural...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-paper flex flex-col pt-20">

      {/* Header */}
      <div className="px-6 py-5 border-b border-paper-tertiary bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10">
            <Users size={22} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-ink leading-none">Comunidade</h1>
            <p className="text-[10px] font-body text-ink-tertiary uppercase tracking-[0.2em] mt-1.5 font-bold">Mural de Edificação</p>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 scroll-y">
        {studies.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
            <MessageCircle size={48} className="mb-4 text-ink-tertiary" />
            <p className="text-sm font-body font-medium italic">Nenhum estudo compartilhado ainda.<br />Seja o primeiro a edificar a igreja!</p>
          </div>
        ) : (
          studies.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] border border-paper-tertiary shadow-soft overflow-hidden flex flex-col group hover:shadow-medium transition-shadow duration-500"
            >

              {/* User Header */}
              <div className="px-5 py-4 flex items-center justify-between border-b border-paper-tertiary/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl border-2 border-paper-tertiary overflow-hidden shadow-soft group-hover:rotate-6 transition-transform">
                    <img src={study.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-ink">{study.userName}</div>
                    <div className="text-[9px] text-gold-600 uppercase font-black tracking-widest">{study.theology}</div>
                  </div>
                </div>
                <div className="text-[9px] font-bold text-ink-tertiary uppercase bg-paper-secondary px-2.5 py-1 rounded-full">
                  {study.timestamp?.toDate ? study.timestamp.toDate().toLocaleDateString() : 'Agora'}
                </div>
              </div>

              {/* Content Preview */}
              <div className="p-6 bg-paper-secondary/20 relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BookOpen size={64} className="text-ink" />
                </div>
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span className="font-heading font-black text-ink-secondary text-base italic">{study.reference}</span>
                </div>
                <div className="font-serif text-[13px] leading-relaxed text-ink-secondary line-clamp-5 antialiased">
                  {study.content.replace(/[#*]/g, '')}
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-4 flex items-center justify-between bg-white border-t border-paper-tertiary/30">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-ink-tertiary hover:text-red-500 transition-all active:scale-90 group-likes">
                    <Heart size={18} className="group-likes-hover:fill-red-500" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{study.likes || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-ink-tertiary hover:text-primary transition-all active:scale-90">
                    <MessageCircle size={18} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Dialogar</span>
                  </button>
                </div>
                <button
                  onClick={() => handleShareWhatsApp(study)}
                  className="w-10 h-10 rounded-2xl bg-paper-secondary flex items-center justify-center text-ink-tertiary hover:bg-gold-500 hover:text-white transition-all shadow-soft active:scale-95"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
};

export default Community;