import React from 'react';
import { CoreStorage } from '../core/storage';
import { User, Calendar, Church, UserCheck, Phone } from 'lucide-react';

const Profile: React.FC = () => {
  const user = CoreStorage.loadUser();

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 flex flex-col items-center pt-24 px-6 overflow-y-auto">
      
      {/* Avatar Section */}
      <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden mb-6">
        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
      </div>

      <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-1">{user.name}</h1>
      <p className="text-sm text-indigo-600 font-bold uppercase tracking-wide mb-8">{user.role}</p>

      {/* Info Cards */}
      <div className="w-full max-w-sm space-y-4">
        
        <ProfileItem icon={<User size={18} />} label="Nome" value={user.name} />
        <ProfileItem icon={<Calendar size={18} />} label="Idade" value={`${user.age} anos`} />
        <ProfileItem icon={<Church size={18} />} label="Igreja" value={user.church} />
        <ProfileItem icon={<UserCheck size={18} />} label="Função" value={user.role} />
        <ProfileItem icon={<Phone size={18} />} label="WhatsApp" value={user.whatsapp} />

      </div>

      <p className="mt-8 text-xs text-gray-400 text-center px-8">
        Para alterar estes dados, entre em contato com a administração da sua igreja.
      </p>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }: any) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-gray-800 dark:text-gray-200 font-medium">{value}</p>
    </div>
  </div>
);

export default Profile;