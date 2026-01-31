import React, { useState, useRef } from 'react';
import { User, Church, Phone, UserCheck, Camera, ChevronDown, Mail } from 'lucide-react';
import { useAppStore } from '../core/store';
import { UserProfile } from '../core/types';
import { signInWithGoogle, auth } from '../services/firebase';

interface RegistrationProps {
  onComplete: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete }) => {
  const { user, updateUser } = useAppStore();
  const [formData, setFormData] = useState({
    name: user.name || '',
    age: user.age || '',
    church: user.church || '',
    customChurch: '',
    role: user.role || '',
    whatsapp: user.whatsapp || '',
    avatarUrl: user.avatarUrl || ''
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
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
    "Nova Igreja"
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

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const result = await signInWithGoogle();
      const fbUser = result.user;
      setFormData(prev => ({
        ...prev,
        name: fbUser.displayName || prev.name,
        avatarUrl: fbUser.photoURL || prev.avatarUrl
      }));
    } catch (error) {
      console.error("Google Auth Error:", error);
      alert("Erro ao entrar com Google.");
    } finally {
      setIsLoggingIn(false);
    }
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

  const handleSubmit = async () => {
    const finalChurch = formData.church === 'Nova Igreja' ? formData.customChurch : formData.church;

    if (!formData.name || !formData.age || !finalChurch || !formData.role || !formData.whatsapp) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!formData.avatarUrl) {
      alert('A foto de perfil é obrigatória.');
      return;
    }

    try {
      await updateUser({
        ...formData,
        church: finalChurch,
        isRegistered: true,
        registrationDate: new Date().toISOString()
      });
      onComplete();
    } catch (error) {
      console.error("Save Error:", error);
      alert("Erro ao salvar perfil.");
    }
  };

  return (
    <div className="h-full w-full bg-paper flex flex-col px-6 py-6 overflow-hidden pt-10">

      <div className="text-center mb-6 shrink-0">
        <h1 className="font-heading text-2xl font-bold text-ink">Crie seu Perfil</h1>
        <p className="font-body text-xs text-ink-tertiary">Personalize sua experiência de estudo</p>
      </div>

      {user.id === 'guest' && (
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoggingIn}
          className="mb-8 w-full py-3 bg-white border border-paper-tertiary rounded-xl flex items-center justify-center gap-3 font-body font-semibold text-ink-secondary shadow-sm active:scale-95 transition-all"
        >
          {isLoggingIn ? <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent animate-spin rounded-full" /> : <Mail size={18} className="text-gold-600" />}
          Vincular com Google
        </button>
      )}

      {/* Photo Picker */}
      <div className="flex justify-center mb-6 shrink-0">
        <div className="relative group" onClick={() => fileInputRef.current?.click()}>
          <div className="w-24 h-24 rounded-full bg-paper-secondary border-4 border-white shadow-medium flex items-center justify-center overflow-hidden cursor-pointer">
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-ink-tertiary" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-soft">
            <Camera size={14} />
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto pr-1">

        {/* Row 1: Name */}
        <div className="bg-white rounded-xl px-3 py-3 border border-paper-tertiary flex items-center gap-3 shadow-soft">
          <User size={18} className="text-gold-500 shrink-0" />
          <input
            type="text"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="Nome Completo"
            className="w-full bg-transparent font-body text-sm font-medium outline-none text-ink placeholder:text-ink-tertiary/50"
          />
        </div>

        {/* Row 2: Age & Phone */}
        <div className="flex gap-3">
          <div className="w-24 bg-white rounded-xl px-3 py-3 border border-paper-tertiary flex items-center gap-2 shadow-soft">
            <input
              type="number"
              value={formData.age}
              onChange={e => handleChange('age', e.target.value)}
              placeholder="Idade"
              className="w-full bg-transparent font-body text-sm font-medium outline-none text-ink text-center"
            />
          </div>
          <div className="flex-1 bg-white rounded-xl px-3 py-3 border border-paper-tertiary flex items-center gap-2 shadow-soft">
            <Phone size={18} className="text-gold-500 shrink-0" />
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={e => handleChange('whatsapp', e.target.value)}
              placeholder="WhatsApp"
              className="w-full bg-transparent font-body text-sm font-medium outline-none text-ink"
            />
          </div>
        </div>

        {/* Row 3: Church Dropdown */}
        <div className="relative bg-white rounded-xl px-3 py-3 border border-paper-tertiary flex items-center gap-3 shadow-soft">
          <Church size={18} className="text-gold-500 shrink-0" />
          <select
            value={formData.church}
            onChange={e => handleChange('church', e.target.value)}
            className="w-full bg-transparent font-body text-sm font-medium outline-none appearance-none z-10 text-ink"
          >
            <option value="" disabled>Sua denominação</option>
            {CHURCH_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 text-ink-tertiary" />
        </div>

        {formData.church === 'Nova Igreja' && (
          <div className="bg-gold-50 rounded-xl px-3 py-3 border border-gold-200 flex items-center gap-2 animate-fade-in shadow-soft">
            <input
              type="text"
              value={formData.customChurch}
              onChange={e => handleChange('customChurch', e.target.value)}
              placeholder="Nome da sua igreja..."
              className="w-full bg-transparent font-body text-sm font-medium outline-none text-gold-700 placeholder:text-gold-300"
              autoFocus
            />
          </div>
        )}

        {/* Row 4: Role */}
        <div className="relative bg-white rounded-xl px-3 py-3 border border-paper-tertiary flex items-center gap-3 shadow-soft">
          <UserCheck size={18} className="text-gold-500 shrink-0" />
          <select
            value={formData.role}
            onChange={e => handleChange('role', e.target.value)}
            className="w-full bg-transparent font-body text-sm font-medium outline-none appearance-none z-10 text-ink"
          >
            <option value="" disabled>Qual sua função?</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 text-ink-tertiary" />
        </div>

      </div>

      <div className="shrink-0 pt-4">
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-primary text-white rounded-xl font-body font-bold text-base shadow-medium active:scale-95 transition-all"
        >
          Confirmar Cadastro
        </button>
        {user.id !== 'guest' ? (
          <p className="text-[10px] text-center mt-3 text-ink-tertiary uppercase tracking-widest font-bold">
            Conectado: {auth.currentUser?.email}
          </p>
        ) : (
          <p className="text-[10px] text-center mt-3 text-ink-tertiary font-medium">
            Você pode continuar como visitante, mas não salvará progresso.
          </p>
        )}
      </div>

    </div>
  );
};

export default Registration;