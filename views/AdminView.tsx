import React, { useState } from 'react';
import { AdminConfig, AppView, ExegesisModule } from '../types';
import { ArrowLeft, Save, Layout, Lock, Unlock, Image as ImageIcon } from 'lucide-react';

interface AdminViewProps {
  config: AdminConfig;
  onUpdateConfig: (newConfig: AdminConfig) => void;
  onExit: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ config, onUpdateConfig, onExit }) => {
  const [localConfig, setLocalConfig] = useState<AdminConfig>(config);

  const handleSave = () => {
    onUpdateConfig(localConfig);
    alert('Configurações salvas!');
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="p-2 hover:bg-gray-800 rounded-lg">
             <ArrowLeft size={20} />
          </button>
          <span className="font-bold text-lg text-red-500">ADMINISTRADOR</span>
        </div>
        <button onClick={handleSave} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
          <Save size={16} /> Salvar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Cover Settings */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
           <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="text-blue-400" />
              <h3 className="font-bold text-lg">Capa da Home</h3>
           </div>
           
           <div className="space-y-4">
             <div>
               <label className="block text-xs text-gray-400 mb-1">Título da Capa</label>
               <input 
                 type="text" 
                 value={localConfig.coverTitle}
                 onChange={(e) => setLocalConfig({...localConfig, coverTitle: e.target.value})}
                 className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-red-500 outline-none"
               />
             </div>
             <div>
               <label className="block text-xs text-gray-400 mb-1">URL da Imagem</label>
               <input 
                 type="text" 
                 value={localConfig.coverImageUrl}
                 onChange={(e) => setLocalConfig({...localConfig, coverImageUrl: e.target.value})}
                 className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-red-500 outline-none"
               />
             </div>
             <div className="h-32 w-full rounded-lg overflow-hidden border border-gray-600">
                <img src={localConfig.coverImageUrl} className="w-full h-full object-cover opacity-50" />
             </div>
           </div>
        </div>

        {/* Access Control */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
           <div className="flex items-center gap-3 mb-4">
              <Lock className="text-yellow-400" />
              <h3 className="font-bold text-lg">Controle de Acesso</h3>
           </div>
           
           <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
              <div>
                <p className="font-medium">Modo Manutenção</p>
                <p className="text-xs text-gray-500">Bloqueia acesso de usuários</p>
              </div>
              <button 
                onClick={() => setLocalConfig({...localConfig, maintenanceMode: !localConfig.maintenanceMode})}
                className={`p-2 rounded-lg transition-colors ${localConfig.maintenanceMode ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                {localConfig.maintenanceMode ? <Lock size={20} /> : <Unlock size={20} />}
              </button>
           </div>
        </div>

        {/* Modules Config */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
           <div className="flex items-center gap-3 mb-4">
              <Layout className="text-green-400" />
              <h3 className="font-bold text-lg">Módulos Ativos</h3>
           </div>
           
           <div className="grid grid-cols-1 gap-2">
             {Object.values(ExegesisModule).map(m => (
               <label key={m} className="flex items-center p-3 bg-gray-900 rounded-lg cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={localConfig.activeModules.includes(m)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setLocalConfig(prev => ({...prev, activeModules: [...prev.activeModules, m]}));
                      } else {
                        setLocalConfig(prev => ({...prev, activeModules: prev.activeModules.filter(mod => mod !== m)}));
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-600 text-red-600 focus:ring-red-500 bg-gray-800"
                  />
                  <span className="ml-3 text-sm text-gray-300">{m}</span>
               </label>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminView;