import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CoreStorage } from '../core/storage';
import { StudyResult, AppView } from '../core/types';
import { useAppStore } from '../core/store';
import { Search, Clock, ArrowLeft, Trash2, BookOpen, ChevronRight } from 'lucide-react';

const History: React.FC = () => {
    const { setView } = useAppStore();
    const [studies, setStudies] = useState<StudyResult[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loaded = CoreStorage.loadStudies();
        setStudies(loaded);
    }, []);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Deseja excluir este estudo?')) {
            const current = CoreStorage.loadStudies();
            const updated = current.filter(s => s.id !== id);
            localStorage.setItem('app_studies', JSON.stringify(updated));
            setStudies(updated);
        }
    };

    const handleOpenStudy = (study: StudyResult) => {
        // Redireciona para EXEGESE com o resultado já preenchido
        // Como o store não tem um setResults direto, vamos usar o viewParams
        setView(AppView.EXEGESIS, { savedStudy: study });
    };

    const filteredStudies = studies.filter(s =>
        s.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.module.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full w-full bg-paper flex flex-col pt-20">
            {/* Header */}
            <div className="px-6 mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={() => setView(AppView.HOME)}
                        className="p-2 bg-paper-secondary rounded-full text-ink-tertiary"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-ink tracking-tight">Histórico</h1>
                        <p className="font-body text-[10px] text-ink-tertiary uppercase tracking-widest mt-1 font-bold">Seus estudos salvos</p>
                    </div>
                </div>

                {/* Search */}
                <div className="mt-6 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                    <input
                        type="text"
                        placeholder="Buscar por referência ou módulo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-paper-tertiary rounded-2xl py-3.5 pl-12 pr-4 font-body text-sm outline-none focus:border-gold-500 shadow-soft"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 pb-32 scroll-y">
                {filteredStudies.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 py-20">
                        <Clock size={48} className="mb-4" />
                        <p className="font-heading text-lg">Nenhum estudo encontrado</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredStudies.map((study, idx) => (
                            <motion.div
                                key={study.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => handleOpenStudy(study)}
                                className="bg-white border border-paper-tertiary rounded-3xl p-5 shadow-soft active:scale-[0.98] transition-all cursor-pointer relative group overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center text-gold-600">
                                            <BookOpen size={16} />
                                        </div>
                                        <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest">{study.module}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(study.id, e)}
                                        className="p-2 text-red-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <h3 className="font-heading text-xl font-bold text-ink mb-1">{study.reference}</h3>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-paper-tertiary rounded text-[8px] font-bold uppercase text-ink-tertiary tracking-tighter">
                                            {study.theology}
                                        </span>
                                        <span className="text-[9px] text-ink-tertiary font-medium">
                                            {new Date(study.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <ChevronRight size={18} className="text-gold-500" />
                                </div>

                                <div className="absolute right-0 bottom-0 w-24 h-24 bg-gold-500/5 rounded-tl-full -mr-12 -mb-12 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
