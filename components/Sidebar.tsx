import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { ProductIcon } from './icons/ProductIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { ActivityLogIcon } from './icons/ActivityLogIcon';
import { User } from '../types';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  currentUser: User | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, currentUser, isOpen, setIsOpen }) => {

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'products', label: 'Produtos', icon: ProductIcon },
    { id: 'reports', label: 'Relatórios', icon: ChartBarIcon },
    { id: 'activity', label: 'Log de Atividades', icon: ActivityLogIcon, adminOnly: true },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon, adminOnly: true },
  ];

  const handleItemClick = (page: string) => {
    setActivePage(page);
    if (window.innerWidth < 768) { // md breakpoint
      setIsOpen(false);
    }
  };

  return (
    <aside className={`fixed inset-y-0 left-0 bg-sidebar z-40 w-64 flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-20 flex items-center px-6">
         <LogoIcon className="h-9 w-11 text-primary" />
         <h1 className="ml-2 text-xl font-bold text-text-on-sidebar">O&R <span className="font-light opacity-80">Estoque</span></h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map(item => {
            if (item.adminOnly && currentUser?.role !== 'admin') {
                return null;
            }
            const isActive = activePage === item.id;
            return (
                <li key={item.id}>
                    <button
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center px-4 py-3 my-1 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                        isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-400 hover:bg-sidebar-hover hover:text-text-on-sidebar'
                        }`}
                    >
                        {isActive && <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"></div>}
                        <item.icon className="w-5 h-5 mr-4" />
                        <span>{item.label}</span>
                    </button>
                </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;