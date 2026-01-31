import React, { useState, useEffect } from 'react';
import { CoreStorage } from '../core/storage';
import { AdminConfig, AppView, ExegesisModule, UserProfile, Feedback } from '../core/types';
import { LogOut, ArrowUp, LifeBuoy, MessageSquare } from 'lucide-react';
import AdminNavigation from './AdminNavigation';

interface DashboardProps {
  onLogout: () => void;
}

// ... Re-implementing simplified versions for the XML to ensure file integrity

const AdminHome = ({ userCount }: { userCount: number }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h3 className="text-slate-400 text-xs font-bold uppercase">Total Usuários</h3>
        <p className="text-3xl font-black text-white mt-1">{userCount}</p>
        <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
          <ArrowUp size={12} /> +12% esse mês
        </span>
      </div>
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h3 className="text-slate-400 text-xs font-bold uppercase">Status App</h3>
        <p className="text-lg font-bold text-green-400 mt-2">Online</p>
        <span className="text-xs text-slate-500 mt-1">Versão 2.1.0</span>
      </div>
    </div>

    <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-white font-bold text-lg mb-1">Bem-vindo, Admin!</h3>
      <p className="text-red-100 text-sm">Você tem controle total sobre a plataforma.</p>
    </div>
  </div>
);

const AdminUsersCRM = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  useEffect(() => {
    const crmData = JSON.parse(localStorage.getItem('admin_crm_users') || '[]');
    setUsers(crmData);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Base de Usuários (CRM)</h2>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {users.length === 0 ? <div className="p-8 text-center text-slate-500">Vazio</div> :
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs"><tr><th className="p-4">Nome</th><th className="p-4">Função</th></tr></thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((u, i) => <tr key={i}><td className="p-4 font-bold">{u.name}</td><td className="p-4">{u.role}</td></tr>)}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
};

const AdminContentConfig = () => {
  const [config, setConfig] = useState<AdminConfig>(CoreStorage.loadConfig());
  const handleSave = () => { CoreStorage.saveConfig(config); alert('Salvo!'); };
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="font-bold text-lg mb-4 text-white">Configurações Gerais</h3>

        <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Título da Capa</label>
        <input value={config.coverTitle} onChange={e => setConfig({ ...config, coverTitle: e.target.value })} className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white mb-4" />

        <label className="text-xs text-slate-400 uppercase font-bold block mb-1">URL Imagem Capa</label>
        <input value={config.coverImageUrl} onChange={e => setConfig({ ...config, coverImageUrl: e.target.value })} className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white mb-4" />

        <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Mural de Avisos</label>
        <textarea value={config.announcement} onChange={e => setConfig({ ...config, announcement: e.target.value })} rows={3} className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white mb-4" />

        <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Link Pasta Biblioteca (Drive)</label>
        <input value={config.libraryDriveUrl} onChange={e => setConfig({ ...config, libraryDriveUrl: e.target.value })} placeholder="https://drive.google.com..." className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white" />
      </div>
      <button onClick={handleSave} className="w-full py-3 bg-red-600 rounded-lg font-bold text-white">Salvar Alterações</button>
    </div>
  );
};

const AdminSupport = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  useEffect(() => { setFeedbacks(CoreStorage.loadFeedbacks()); }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
        <LifeBuoy size={48} className="text-slate-600 mx-auto mb-4" />
        <h3 className="text-white font-bold">Suporte do Sistema</h3>
        <p className="text-slate-400 text-sm mt-2">Versão 2.1.0</p>
      </div>
      <h3 className="font-bold text-white flex items-center gap-2"><MessageSquare size={18} /> Feedbacks</h3>
      <div className="space-y-3">
        {feedbacks.length === 0 ? <p className="text-slate-500 text-sm">Nenhum feedback.</p> :
          feedbacks.map(fb => (
            <div key={fb.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white text-sm">{fb.userName}</span>
                <span className="text-[10px] text-slate-500">{new Date(fb.date).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-300 text-sm bg-slate-900/50 p-3 rounded-lg">{fb.message}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.ADMIN_HOME);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const crmData = JSON.parse(localStorage.getItem('admin_crm_users') || '[]');
    setUserCount(crmData.length);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case AppView.ADMIN_HOME: return <AdminHome userCount={userCount} />;
      case AppView.ADMIN_USERS: return <AdminUsersCRM />;
      case AppView.ADMIN_CONTENT: return <AdminContentConfig />;
      case AppView.ADMIN_SUPPORT: return <AdminSupport />;
      default: return <AdminHome userCount={userCount} />;
    }
  };

  return (
    <div className="h-full w-full bg-slate-900 text-white flex flex-col relative overflow-hidden">
      <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center p-4 pt-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-lg">ADM</div>
          <div><h1 className="font-bold text-sm leading-none text-white">PAINEL ADMIN</h1><span className="text-[10px] text-slate-400">FerTaise Tech</span></div>
        </div>
        <button onClick={onLogout} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"><LogOut size={16} /></button>
      </header>

      <main className="flex-1 overflow-y-auto pt-20 pb-4 px-4 scroll-y bg-slate-900">
        {renderContent()}
      </main>

      <div className="h-[10%] w-full z-50 shrink-0">
        <AdminNavigation currentView={currentView} onChangeView={setCurrentView} />
      </div>
    </div>
  );
};

export default Dashboard;