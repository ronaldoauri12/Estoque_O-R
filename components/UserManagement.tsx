

import React, { useState } from 'react';
import { ActivityLogAction, User } from '../types';
import { DeleteIcon } from './icons/DeleteIcon';
import { UsersIcon } from './icons/UsersIcon';
import { KeyIcon } from './icons/KeyIcon';
import PasswordEditModal from './PasswordEditModal';
import ConfirmationModal from './ConfirmationModal';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  // FIX: Update logActivity prop signature to match definition in App.tsx.
  logActivity: (action: ActivityLogAction, details: string, oldValue?: string | number, newValue?: string | number) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers, logActivity }) => {
  // Modal states
  const [userToEditPassword, setUserToEditPassword] = useState<User | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Add user form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'common' | 'admin'>('common');
  const [addUserError, setAddUserError] = useState('');
  
  const handleOpenPasswordModal = (user: User) => {
    setUserToEditPassword(user);
    setIsPasswordModalOpen(true);
  };

  const handleSavePassword = (userId: string, newPassword: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.map(u => u.id === userId ? { ...u, password: newPassword } : u));
    // FIX: Log password update activity.
    if (user) {
        logActivity('UPDATE_USER_PASSWORD', user.username);
    }
    setIsPasswordModalOpen(false);
    setUserToEditPassword(null);
  };
  
  const handleDeleteUser = (user: User) => {
    if (user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
      alert('Não é possível deletar o único administrador do sistema.');
      return;
    }
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (userToDelete) {
      // FIX: Log user deletion activity.
      logActivity('DELETE_USER', userToDelete.username);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError('');

    if (!newUsername.trim() || !newPassword.trim()) {
        setAddUserError('Nome de usuário e senha são obrigatórios.');
        return;
    }
    if (users.some(user => user.username.toLowerCase() === newUsername.trim().toLowerCase())) {
        setAddUserError('Este nome de usuário já existe.');
        return;
    }
    if (newPassword.length < 6) {
        setAddUserError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        username: newUsername.trim(),
        password: newPassword,
        role: newRole,
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    // FIX: Log user creation activity.
    logActivity('ADD_USER', newUser.username);

    // Reset form
    setNewUsername('');
    setNewPassword('');
    setNewRole('common');
  };


  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
      <div className="flex items-center mb-6">
        <UsersIcon className="w-6 h-6 mr-3 text-primary"/>
        <h2 className="text-xl font-bold text-text-primary">Gerenciamento de Usuários</h2>
      </div>

      <div className="border-b border-border pb-6 mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Adicionar Novo Usuário</h3>
        <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div>
                    <label htmlFor="newUsername" className="block text-sm font-medium text-text-secondary mb-1">Nome de Usuário</label>
                    <input type="text" id="newUsername" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
                 <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-text-secondary mb-1">Senha</label>
                    <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
                <div>
                    <label htmlFor="newRole" className="block text-sm font-medium text-text-secondary mb-1">Nível de Acesso</label>
                    <select id="newRole" value={newRole} onChange={(e) => setNewRole(e.target.value as 'common' | 'admin')} className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none">
                        <option value="common">Usuário Comum</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
            </div>
             {addUserError && <p className="text-sm text-danger font-medium mt-3">{addUserError}</p>}
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors">Adicionar Usuário</button>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Usuários Existentes</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Username</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{user.username}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{user.role === 'admin' ? 'Administrador' : 'Usuário Comum'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => handleOpenPasswordModal(user)} className="text-primary hover:text-primary-hover p-1.5 rounded-md hover:bg-primary/10 mr-2 transition-colors" title="Editar Senha">
                                    <KeyIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDeleteUser(user)} className="text-danger hover:text-danger-hover p-1.5 rounded-md hover:bg-danger/10 transition-colors" title="Deletar Usuário">
                                    <DeleteIcon className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      
      {isPasswordModalOpen && userToEditPassword && (
          <PasswordEditModal 
              isOpen={isPasswordModalOpen}
              onClose={() => setIsPasswordModalOpen(false)}
              onSave={handleSavePassword}
              user={userToEditPassword}
          />
      )}

      {userToDelete && (
          <ConfirmationModal 
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={confirmDelete}
              title="Confirmar Exclusão de Usuário"
              itemName={userToDelete.username}
          />
      )}
    </div>
  );
};

export default UserManagement;
