import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  error: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm p-8 space-y-8 bg-card rounded-2xl shadow-xl animate-fade-in-up">
        <div className="text-center flex flex-col items-center">
            <LogoIcon className="h-16 mb-4" />
            <h1 className="text-2xl font-bold text-primary">Oliveira & Rondelli</h1>
            <p className="text-sm tracking-widest text-gray-400 font-light mt-1">ADVOGADOS ASSOCIADOS</p>
            <p className="text-xs text-text-secondary mt-4">Gestão de Estoque</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">Usuário</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-border rounded-lg text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
              placeholder="Ex: admin"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-text-secondary mb-1">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-border rounded-lg text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-center text-danger font-semibold">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-105"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;