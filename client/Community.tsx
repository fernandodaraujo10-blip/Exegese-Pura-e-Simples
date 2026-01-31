import React, { useState, useEffect } from 'react';
import { UserProfile } from '../core/types';
import { User, MessageCircle, Search } from 'lucide-react';
import { CoreStorage } from '../core/storage';

const Community: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(CoreStorage.loadUser());

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('admin_crm_users') || '[]');
    setUsers(allUsers);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 pt-20">
      
      {/* Header */}
      <div className="px-6 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Comunidade</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Conecte-se com {users.length} membros</p>
      </div>

      {/* Search (Visual Only) */}
      <div className="px-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2">
           <Search size={18} className="text-gray-400" />
           <input 
             type="text" 
             placeholder="Buscar membros..."
             className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200"
           />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pb-20 space-y-3">
         {users.map((user, idx) => (
           <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                   <img src={user.avatarUrl} className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <p className="font-bold text-gray-800 dark:text-gray-200">{user.name} {user.id === currentUser.id && '(Você)'}</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400">{user.role} • {user.church}</p>
                 </div>
              </div>
              
              {user.id !== currentUser.id && (
                <button 
                  onClick={() => alert(`Iniciando chat com ${user.name}...`)}
                  className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                >
                  <MessageCircle size={20} />
                </button>
              )}
           </div>
         ))}
      </div>
    </div>
  );
};

export default Community;