import React, { useState, useEffect } from 'react';
import { useAppStore } from '../core/store';
import { AdminConfig, AppView, UserProfile, Feedback } from '../core/types';
import { LogOut, ArrowUp, LifeBuoy, MessageSquare, Loader2, User } from 'lucide-react';
import AdminNavigation from './AdminNavigation';
import { uploadLogo, getAllUsers } from '../services/firebase';
import { CoreStorage } from '../core/storage';

interface DashboardProps {
  onLogout: () => void;
}

const AdminHome = ({ userCount }: { userCount: number }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Usuários</h3>
        <p className="text-3xl font-black text-white mt-1">{userCount}</p>
        <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
          <ArrowUp size={12} /> Crescimento Real
        </span>
      </div>
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Status App</h3>
        <p className="text-lg font-bold text-green-400 mt-2">Online</p>
        <span className="text-xs text-slate-500 mt-1">Conectado ao Firestore</span>
      </div>
    </div>

    <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-xl shadow-lg border border-red-500/20">
      <h3 className="text-white font-bold text-lg mb-1">Bem-vindo ao Centro de Comando</h3>
      <p className="text-red-100 text-sm opacity-90">Gerencie conteúdos, usuários e configurações em tempo real.</p>
    </div>
  </div>
);

const AdminUsersCRM = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="center-flex p-12"><Loader2 className="animate-spin text-slate-600" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Base de Usuários (Firestore)</h2>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        {users.length === 0 ? <div className="p-12 text-center text-slate-500">Nenhum usuário registrado ainda.</div> :
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="p-4">Usuário</th>
                  <th className="p-4">Igreja / Função</th>
                  <th className="p-4">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((u, i) => (
                  <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-slate-600 overflow-hidden">
                        <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[10px] text-slate-500">{u.whatsapp}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-slate-300">{u.church}</div>
                      <div className="text-[10px] text-slate-500">{u.role}</div>
                    </td>
                    <td className="p-4 text-[10px] text-slate-500">
                      {new Date(u.registrationDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
};

const AdminContentConfig = () => {
  const { config, updateConfig } = useAppStore();
  const [localConfig, setLocalConfig] = useState<AdminConfig>(config);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateConfig(localConfig);
      alert('Configurações atualizadas no Firestore!');
    } catch (error) {
      alert('Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadLogo(file);
      setLocalConfig({ ...localConfig, coverImageUrl: url });
    } catch (error) {
      alert('Erro no upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
        <h3 className="font-bold text-lg mb-6 text-white border-b border-slate-700 pb-2">Configurações de Layout</h3>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Título da Capa</label>
            <input
              value={localConfig.coverTitle}
              onChange={e => setLocalConfig({ ...localConfig, coverTitle: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Mural de Avisos (Banner Home)</label>
            <textarea
              value={localConfig.announcement}
              onChange={e => setLocalConfig({ ...localConfig, announcement: e.target.value })}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase font-black block mb-2">Upload de Imagem de Capa</label>
            <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-dashed border-slate-600">
              <div className="w-16 h-16 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shrink-0">
                <img src={localConfig.coverImageUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1">
                <input type="file" onChange={handleLogoUpload} className="hidden" id="logo-upload" accept="image/*" />
                <label htmlFor="logo-upload" className="inline-block px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors">
                  {uploading ? 'Enviando...' : 'Trocar Imagem'}
                </label>
                <p className="text-[10px] text-slate-500 mt-2">SVG, PNG ou JPG (Máx. 2MB)</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">URL Pasta Biblioteca (Drive)</label>
            <input
              value={localConfig.libraryDriveUrl}
              onChange={e => setLocalConfig({ ...localConfig, libraryDriveUrl: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-all"
              placeholder="https://drive.google.com/..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="maintenance"
              checked={localConfig.maintenanceMode}
              onChange={e => setLocalConfig({ ...localConfig, maintenanceMode: e.target.checked })}
              className="w-5 h-5 accent-red-600"
            />
            <label htmlFor="maintenance" className="text-sm font-bold text-white italic">Ativar Modo Manutenção</label>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white rounded-xl font-black shadow-lg shadow-red-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
      >
        {isSaving ? <Loader2 className="animate-spin" size={18} /> : 'SALVAR NO CLOUD FIRESTORE'}
      </button>
    </div>
  );
};

const AdminSupport = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  useEffect(() => { setFeedbacks(CoreStorage.loadFeedbacks()); }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center shadow-xl">
        <LifeBuoy size={48} className="text-slate-600 mx-auto mb-4" />
        <h3 className="text-white font-bold">Suporte & Logs</h3>
        <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest font-black italic">Versão do Sistema: 3.0.0 Cloud</p>
      </div>
      <h3 className="font-bold text-white flex items-center gap-2 px-2"><MessageSquare size={18} className="text-red-500" /> Feedbacks Recentes</h3>
      <div className="space-y-3">
        {feedbacks.length === 0 ? <p className="text-slate-600 text-sm italic py-8 text-center">Nenhum feedback nas últimas 24h.</p> :
          feedbacks.map(fb => (
            <div key={fb.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-red-100 text-xs">{fb.userName}</span>
                <span className="text-[10px] text-slate-500">{new Date(fb.date).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-300 text-sm bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 leading-relaxed italic">"{fb.message}"</p>
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
    const fetchStats = async () => {
      const users = await getAllUsers();
      setUserCount(users.length);
    };
    fetchStats();
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
    <div className="h-full w-full bg-slate-900 text-white flex flex-col relative overflow-hidden font-sans">
      <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center p-4 pt-8 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl shadow-red-600/10 border-2 border-red-500 overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-black text-sm leading-none text-white tracking-tight">EXEGESE CLOUD</h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Dashboard</span>
          </div>
        </div>
        <button onClick={onLogout} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-90">
          <LogOut size={18} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pt-24 pb-4 px-4 scroll-y bg-slate-900">
        {renderContent()}
      </main>

      <div className="h-[10%] w-full z-50 shrink-0 border-t border-slate-800">
        <AdminNavigation currentView={currentView} onChangeView={setCurrentView} />
      </div>
    </div>
  );
};

export default Dashboard;