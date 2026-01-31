import React, { useState, useRef } from 'react';
import { User, Church, Phone, UserCheck, Calendar, Camera, ChevronDown } from 'lucide-react';
import { CoreStorage } from '../core/storage';
import { UserProfile } from '../core/types';

interface RegistrationProps {
  onComplete: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    church: '',
    customChurch: '',
    role: '',
    whatsapp: '',
    avatarUrl: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CHURCH_OPTIONS = [
    "Assembleia de Deus",
    "Igreja Batista",
    "Igreja Presbiteriana",
    "Igreja Universal",
    "Igreja do Evangelho Quadrangular",
    "Deus é Amor",
    "Igreja Metodista",
    "Igreja Luterana",
    "Igreja Católica",
    "Igreja Adventista",
    "Nova Igreja" // Option 10 triggers custom input
  ];

  const ROLES = [
    'Membro',
    'Líder',
    'Pastor',
    'Auxiliar / Cooperador',
    'Não assíduo',
    'Outra função'
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const finalChurch = formData.church === 'Nova Igreja' ? formData.customChurch : formData.church;

    if (!formData.name || !formData.age || !finalChurch || !formData.role || !formData.whatsapp) {
      alert('Preencha todos os campos.');
      return;
    }
    
    if (!formData.avatarUrl) {
        alert('A foto é obrigatória.');
        return;
    }

    const newUser: UserProfile = {
      ...CoreStorage.loadUser(),
      ...formData,
      church: finalChurch,
      id: Date.now().toString(),
      isRegistered: true,
      registrationDate: new Date().toISOString()
    };

    CoreStorage.saveUser(newUser);
    
    const allUsers = JSON.parse(localStorage.getItem('admin_crm_users') || '[]');
    const filteredUsers = allUsers.filter((u: any) => u.id !== newUser.id);
    filteredUsers.push(newUser);
    localStorage.setItem('admin_crm_users', JSON.stringify(filteredUsers));

    onComplete();
  };

  return (
    <div className="h-full w-full bg-white flex flex-col px-6 py-6 overflow-hidden">
      
      <div className="text-center mb-4 shrink-0">
        <h1 className="text-xl font-black text-gray-900">Criar Perfil</h1>
      </div>

      {/* Photo (Compact) */}
      <div className="flex justify-center mb-4 shrink-0">
        <div className="relative group" onClick={() => fileInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-full bg-gray-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden cursor-pointer">
                {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <User size={32} className="text-gray-300" />
                )}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white border-2 border-white">
                <Camera size={14} />
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>
      </div>

      {/* Form Fields - Compact Grid/Flex */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        
        {/* Row 1: Name & Age */}
        <div className="flex gap-2">
            <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 flex items-center gap-2">
                <User size={16} className="text-gray-400 shrink-0" />
                <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => handleChange('name', e.target.value)} 
                    placeholder="Nome" 
                    className="w-full bg-transparent text-sm font-medium outline-none"
                />
            </div>
            <div className="w-20 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 flex items-center gap-2">
                <input 
                    type="number" 
                    value={formData.age} 
                    onChange={e => handleChange('age', e.target.value)} 
                    placeholder="Idade" 
                    className="w-full bg-transparent text-sm font-medium outline-none"
                />
            </div>
        </div>

        {/* Row 2: Church Dropdown */}
        <div className="relative bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 flex items-center gap-2">
            <Church size={16} className="text-gray-400 shrink-0" />
            <select 
                value={formData.church} 
                onChange={e => handleChange('church', e.target.value)} 
                className="w-full bg-transparent text-sm font-medium outline-none appearance-none z-10"
            >
                <option value="" disabled>Selecione sua Igreja</option>
                {CHURCH_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 text-gray-400" />
        </div>

        {/* Row 2.5: Custom Church (Conditional) */}
        {formData.church === 'Nova Igreja' && (
            <div className="bg-white rounded-xl px-3 py-2 border border-indigo-200 flex items-center gap-2 animate-fade-in">
                <input 
                    type="text" 
                    value={formData.customChurch} 
                    onChange={e => handleChange('customChurch', e.target.value)} 
                    placeholder="Digite o nome da sua igreja..." 
                    className="w-full bg-transparent text-sm font-medium outline-none text-indigo-700 placeholder-indigo-300"
                    autoFocus
                />
            </div>
        )}

        {/* Row 3: Role */}
        <div className="relative bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 flex items-center gap-2">
            <UserCheck size={16} className="text-gray-400 shrink-0" />
            <select 
                value={formData.role} 
                onChange={e => handleChange('role', e.target.value)} 
                className="w-full bg-transparent text-sm font-medium outline-none appearance-none z-10"
            >
                <option value="" disabled>Selecione sua Função</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
             <ChevronDown size={14} className="absolute right-3 text-gray-400" />
        </div>

        {/* Row 4: Whatsapp */}
        <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 flex items-center gap-2">
            <Phone size={16} className="text-gray-400 shrink-0" />
            <input 
                type="tel" 
                value={formData.whatsapp} 
                onChange={e => handleChange('whatsapp', e.target.value)} 
                placeholder="WhatsApp" 
                className="w-full bg-transparent text-sm font-medium outline-none"
            />
        </div>

      </div>

      <div className="shrink-0 pt-2">
        <button 
          onClick={handleSubmit}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Confirmar Cadastro
        </button>
      </div>

    </div>
  );
};

export default Registration;