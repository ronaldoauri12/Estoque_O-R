
import React, { useState } from 'react';
import { User } from '../types';

interface PasswordEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, newPassword: string) => void;
  user: User;
}

const PasswordEditModal: React.FC<PasswordEditModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setError('');
    onSave(user.id, password);
  };
  
  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-card rounded-2xl p-8 shadow-2xl w-full max-w-md animate-fade-in-up border border-border">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Alterar Senha de <span className="text-primary">{user.username}</span></h2>
        <form onSubmit={handleSave} className="space-y-5">
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">Nova Senha</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="w-full input-style" 
                    placeholder="••••••••"
                />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">Confirmar Nova Senha</label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    className="w-full input-style"
                    placeholder="••••••••"
                />
            </div>
            
            {error && <p className="text-sm text-center text-danger font-semibold">{error}</p>}
            
            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={handleClose} className="px-6 py-2.5 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 font-semibold transition-colors">Cancelar</button>
              <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors">Salvar Nova Senha</button>
            </div>
        </form>
      </div>
       <style>{`
        .input-style {
            padding: 0.5rem 0.75rem;
            background-color: white;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            width: 100%;
            color: #1e293b;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-style:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
            outline: none;
        }
      `}</style>
    </div>
  );
};

export default PasswordEditModal;
