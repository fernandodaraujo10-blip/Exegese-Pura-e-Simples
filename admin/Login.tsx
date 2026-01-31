import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  return (
    <div className="h-full w-full bg-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Login Admin</h2>
        
        <input 
          type="password" 
          placeholder="Senha" 
          className="w-full p-4 bg-gray-100 rounded-lg border border-gray-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all text-center text-lg"
        />
        
        <button 
          onClick={onLogin}
          className="w-full py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg active:scale-95 transition-transform"
        >
          Entrar
        </button>
        
        <button 
          onClick={onBack}
          className="text-gray-400 text-sm flex items-center justify-center gap-2 hover:text-gray-600"
        >
          <ArrowLeft size={14} /> Voltar
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;