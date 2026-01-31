import React, { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, Edit3, MessageSquare, Grid, ChevronLeft, Search, Plus, Trash2, Save, Send, Heart, Book } from 'lucide-react';
import { AppView, PersonalNote, Feedback, AdminConfig, Devotional } from '../core/types';
import { CoreStorage } from '../core/storage';

interface MoreProps {
  navigate: (view: AppView) => void;
  config: AdminConfig;
  initialSection?: string;
}

const More: React.FC<MoreProps> = ({ navigate, config, initialSection }) => {
  const [activeSection, setActiveSection] = useState<string | null>(initialSection || null);

  useEffect(() => {
    if (initialSection) setActiveSection(initialSection);
  }, [initialSection]);

  const goBack = () => setActiveSection(null);

  // --- RENDER SECTIONS ---
  if (activeSection === 'COMMUNITY') return <CommunitySection onBack={goBack} />;
  if (activeSection === 'NOTES') return <NotesSection onBack={goBack} />;
  if (activeSection === 'FEEDBACK') return <FeedbackSection onBack={goBack} />;
  if (activeSection === 'DEVOTIONAL') return <DevotionalSection onBack={goBack} />;
  
  if (activeSection === 'LIBRARY' || activeSection === 'BOOKS') {
    // Shared Logic for Books/Library
    if (config.libraryDriveUrl) {
       window.open(config.libraryDriveUrl, '_blank');
       setActiveSection(null);
       return null;
    } else {
       return (
         <div className="h-full center-flex flex-col p-6 text-center bg-gray-50 dark:bg-gray-900">
            <BookOpen size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 font-bold">Biblioteca em manutenção</p>
            <p className="text-xs text-gray-400 mt-2">O administrador ainda não configurou o link da biblioteca.</p>
            <button onClick={goBack} className="mt-6 text-indigo-600 font-bold text-sm">Voltar</button>
         </div>
       );
    }
  }

  // --- MAIN MENU (8 Vertical Cards) ---
  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 pt-20 px-4 overflow-y-auto pb-24">
      <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 px-2">Mais</h2>
      
      <div className="flex flex-col gap-3">
        <MenuCard icon={<Users size={20} />} label="Comunidade" desc="Interaja com outros irmãos" onClick={() => setActiveSection('COMMUNITY')} color="text-blue-600" />
        <MenuCard icon={<Heart size={20} />} label="Devocional" desc="Alimento diário" onClick={() => setActiveSection('DEVOTIONAL')} color="text-red-500" />
        <MenuCard icon={<BookOpen size={20} />} label="Livros & Biblioteca" desc="Materiais gratuitos" onClick={() => setActiveSection('BOOKS')} color="text-emerald-600" />
        <MenuCard icon={<FileText size={20} />} label="Artigos" desc="Conteúdos teológicos" onClick={() => setActiveSection('BOOKS')} color="text-purple-600" />
        <MenuCard icon={<Edit3 size={20} />} label="Anotações" desc="Seus estudos pessoais" onClick={() => setActiveSection('NOTES')} color="text-yellow-600" />
        <MenuCard icon={<MessageSquare size={20} />} label="Feedback" desc="Fale conosco" onClick={() => setActiveSection('FEEDBACK')} color="text-pink-600" />
        <MenuCard icon={<Grid size={20} />} label="Aplicativos" desc="Conheça nossas ferramentas" onClick={() => navigate(AppView.TOOLS)} color="text-indigo-600" />
        
        {/* Placeholder */}
        <MenuCard icon={<Plus size={20} />} label="Em Breve" desc="Novas funcionalidades" onClick={() => {}} color="text-gray-400" disabled />
      </div>
    </div>
  );
};

// --- SUB-SECTIONS COMPONENTS ---

const MenuCard = ({ icon, label, desc, onClick, color, disabled }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
    style={{ height: '7vh', minHeight: '60px' }} // Approx 7% height
  >
    <div className={`w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div className="text-left flex-1">
      <h3 className="font-bold text-gray-800 dark:text-white text-sm leading-tight">{label}</h3>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{desc}</p>
    </div>
  </button>
);

const DevotionalSection = ({ onBack }: { onBack: () => void }) => {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);

  useEffect(() => {
    // Load from mock/storage
    setDevotionals(CoreStorage.loadDevotionals());
  }, []);

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 pt-20 flex flex-col">
      <div className="px-6 mb-4 flex items-center gap-2">
        <button onClick={onBack} className="p-1 -ml-2 text-gray-500"><ChevronLeft /></button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Devocional</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4">
        {devotionals.map(dev => (
          <div key={dev.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-start mb-2">
               <h3 className="font-bold text-lg text-gray-800 dark:text-white">{dev.title}</h3>
               <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-bold">{new Date(dev.date).toLocaleDateString()}</span>
             </div>
             <p className="text-xs font-bold text-indigo-500 mb-3 uppercase tracking-wide">{dev.verse}</p>
             <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{dev.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommunitySection = ({ onBack }: { onBack: () => void }) => {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem('admin_crm_users') || '[]'));
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="px-6 mb-4 flex items-center gap-2">
        <button onClick={onBack} className="p-1 -ml-2 text-gray-500"><ChevronLeft /></button>
        <div>
           <h2 className="text-xl font-bold text-gray-800 dark:text-white">Comunidade</h2>
           <p className="text-xs text-gray-500">Membros ativos</p>
        </div>
      </div>
      <div className="px-6 mb-4">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2">
           <Search size={18} className="text-gray-400" />
           <input type="text" placeholder="Buscar..." className="w-full bg-transparent outline-none text-sm dark:text-white" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-3">
         {users.map((u, i) => (
           <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <img src={u.avatarUrl} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
              <div>
                <p className="font-bold text-sm text-gray-800 dark:text-white">{u.name}</p>
                <p className="text-[10px] text-gray-500">{u.church}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

const NotesSection = ({ onBack }: { onBack: () => void }) => {
  const [notes, setNotes] = useState<PersonalNote[]>(CoreStorage.loadNotes());
  const [editor, setEditor] = useState<PersonalNote | null>(null);

  const save = () => {
    if (!editor?.title) return alert('Título obrigatório');
    CoreStorage.saveNote({...editor, updatedAt: new Date().toISOString()});
    setNotes(CoreStorage.loadNotes());
    setEditor(null);
  };
  
  const del = (id: string, e: any) => {
    e.stopPropagation();
    if(confirm('Apagar?')) { CoreStorage.deleteNote(id); setNotes(CoreStorage.loadNotes()); }
  }

  if (editor) return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col pt-20">
      <div className="px-4 py-2 border-b dark:border-gray-700 flex justify-between items-center">
        <button onClick={() => setEditor(null)}><ChevronLeft className="text-gray-500"/></button>
        <button onClick={save} className="text-indigo-600 font-bold flex gap-1 items-center"><Save size={18}/> Salvar</button>
      </div>
      <div className="p-4 flex flex-col gap-4 flex-1">
        <input value={editor.title} onChange={e=>setEditor({...editor, title: e.target.value})} placeholder="Título" className="text-xl font-bold bg-transparent outline-none dark:text-white"/>
        <textarea value={editor.content} onChange={e=>setEditor({...editor, content: e.target.value})} placeholder="Escreva..." className="flex-1 bg-transparent resize-none outline-none dark:text-gray-300"/>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 pt-20 flex flex-col">
       <div className="px-6 mb-4 flex items-center gap-2">
        <button onClick={onBack} className="p-1 -ml-2 text-gray-500"><ChevronLeft /></button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Anotações</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-24">
        {notes.map(n => (
          <div key={n.id} onClick={() => setEditor(n)} className="bg-white dark:bg-gray-800 p-4 rounded-xl border-l-4 border-yellow-400 shadow-sm flex justify-between">
            <h3 className="font-bold text-sm dark:text-white">{n.title}</h3>
            <button onClick={(e) => del(n.id, e)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
      <button onClick={() => setEditor({id: Date.now().toString(), title:'', content:'', updatedAt:''})} className="absolute bottom-24 right-6 w-12 h-12 bg-indigo-600 rounded-full text-white shadow-lg flex items-center justify-center"><Plus/></button>
    </div>
  );
};

const FeedbackSection = ({ onBack }: { onBack: () => void }) => {
  const [text, setText] = useState('');
  const send = () => {
    if(!text) return;
    const user = CoreStorage.loadUser();
    CoreStorage.saveFeedback({ id: Date.now().toString(), userId: user.id, userName: user.name, message: text, date: new Date().toISOString() });
    alert('Enviado!'); setText(''); onBack();
  };
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 pt-20 px-6 flex flex-col">
      <button onClick={onBack} className="flex items-center gap-1 text-gray-500 mb-4"><ChevronLeft size={18} /> Voltar</button>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Feedback</h2>
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-40 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm outline-none dark:text-white" placeholder="Sua mensagem..." />
      <button onClick={send} className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Send size={18}/> Enviar</button>
    </div>
  );
};

export default More;