import React, { useState, useMemo } from 'react';
import { ActivityLog, User } from './types';
import { ClockIcon } from './components/icons/ClockIcon';
import { UsersIcon } from './components/icons/UsersIcon';
import { ChevronLeftIcon } from './components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from './components/icons/ChevronRightIcon';

interface ActivityLogPageProps {
  logs: ActivityLog[];
  currentUser: User | null;
}

const ActivityLogPage: React.FC<ActivityLogPageProps> = ({ logs, currentUser }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logs]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedLogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);

  const getActionText = (log: ActivityLog) => {
    switch (log.action) {
      case 'LOGIN': return `fez login no sistema.`;
      case 'LOGOUT': return `fez logout do sistema.`;
      case 'CREATE_PRODUCT': return `criou o produto: ${log.details}.`;
      case 'UPDATE_PRODUCT': return `atualizou o produto: ${log.details}.`;
      case 'DELETE_PRODUCT': return `deletou o produto: ${log.details} (tinha ${log.oldValue} em estoque).`;
      case 'UPDATE_PRODUCT_QUANTITY': return `alterou a quantidade de "${log.details}" de ${log.oldValue} para ${log.newValue}.`;
      case 'ADD_USER': return `adicionou o usuário: ${log.details}.`;
      case 'DELETE_USER': return `deletou o usuário: ${log.details}.`;
      case 'UPDATE_USER_PASSWORD': return `atualizou a senha do usuário: ${log.details}.`;
      case 'ADD_CATEGORY': return `adicionou a categoria: ${log.details}.`;
      case 'UPDATE_CATEGORY': return `atualizou a categoria: ${log.details}.`;
      case 'DELETE_CATEGORY': return `deletou a categoria: ${log.details}.`;
      case 'ADD_LOCATION': return `adicionou a localização: ${log.details}.`;
      case 'UPDATE_LOCATION': return `atualizou a localização: ${log.details}.`;
      case 'DELETE_LOCATION': return `deletou a localização: ${log.details}.`;
      case 'ADD_SUPPLIER': return `adicionou o fornecedor: ${log.details}.`;
      case 'UPDATE_SUPPLIER': return `atualizou o fornecedor: ${log.details}.`;
      case 'DELETE_SUPPLIER': return `deletou o fornecedor: ${log.details}.`;
      default: return 'realizou uma ação desconhecida.';
    }
  };
  
  if (currentUser?.role !== 'admin') {
      return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="text-xl font-bold text-text-primary mb-4">Acesso Restrito</h3>
            <p className="text-text-secondary">Você não tem permissão para acessar esta página.</p>
        </div>
      );
  }

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border animate-fade-in">
        <h2 className="text-xl font-bold text-text-primary mb-5">Log de Atividades do Sistema</h2>
        
        <div className="space-y-4">
            {paginatedLogs.map(log => (
                <div key={log.id} className="flex items-start p-3 rounded-lg hover:bg-slate-50">
                    <div className="p-2 bg-slate-100 rounded-full mr-4">
                        <UsersIcon className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                        <p className="text-sm text-text-primary">
                            <span className="font-bold">{log.user}</span> {getActionText(log)}
                        </p>
                        <div className="flex items-center text-xs text-text-secondary mt-1">
                            <ClockIcon className="w-3 h-3 mr-1.5" />
                            <span>{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-between items-center mt-6 text-sm text-text-secondary">
            <p>Mostrando {paginatedLogs.length} de {sortedLogs.length} registros</p>
            <div className="flex items-center">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeftIcon className="w-5 h-5"/>
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronRightIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    </div>
  );
};

export default ActivityLogPage;
