import React, { useState, useEffect, useRef } from 'react';
import { User, Notification } from '../types';
import { LogoutIcon } from './icons/LogoutIcon';
import { MenuIcon } from './icons/MenuIcon';
import { BellIcon } from './icons/BellIcon';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
    onAddProductClick: () => void;
    title: string;
    showAddProductButton: boolean;
    currentUser: User | null;
    onLogout: () => void;
    onMenuClick: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onAddProductClick, 
    title, 
    showAddProductButton, 
    currentUser, 
    onLogout, 
    onMenuClick,
    notifications,
    onMarkAsRead,
    onMarkAllAsRead
}) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsPanelOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notificationRef]);
    
    return (
        <header className="flex justify-between items-center h-20 px-6 md:px-10 bg-card/80 backdrop-blur-sm flex-shrink-0 border-b border-border">
             <div className="flex items-center">
                <button onClick={onMenuClick} className="md:hidden mr-4 p-2 rounded-full hover:bg-slate-100 text-text-primary focus:outline-none">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-text-primary">{title}</h1>
             </div>
             <div className="flex items-center space-x-4">
                {showAddProductButton && currentUser?.role === 'admin' && (
                    <button
                        onClick={onAddProductClick}
                        className="bg-primary text-white font-bold py-2.5 px-5 rounded-lg shadow-md hover:bg-primary-hover transition-all duration-300 flex items-center transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden sm:inline">Adicionar</span>
                    </button>
                )}
                
                <div ref={notificationRef} className="relative">
                    <button 
                        onClick={() => setIsPanelOpen(prev => !prev)} 
                        className="p-2 rounded-full text-text-secondary hover:bg-slate-100 hover:text-primary transition-colors"
                        aria-label="Notificações"
                    >
                        <BellIcon className="w-6 h-6"/>
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-danger text-white text-[10px] flex items-center justify-center ring-2 ring-card">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {isPanelOpen && (
                        <NotificationPanel
                            notifications={notifications}
                            onClose={() => setIsPanelOpen(false)}
                            onMarkAsRead={onMarkAsRead}
                            onMarkAllAsRead={onMarkAllAsRead}
                        />
                    )}
                </div>

                <div className="flex items-center">
                    <div className="text-right mr-3 hidden sm:block">
                        <p className="font-semibold text-sm text-text-primary">{currentUser?.username}</p>
                        <p className="text-xs text-text-secondary">{currentUser?.role === 'admin' ? 'Administrador' : 'Usuário Comum'}</p>
                    </div>
                    <button onClick={onLogout} className="p-2 rounded-full text-text-secondary hover:bg-slate-100 hover:text-danger transition-colors">
                        <LogoutIcon className="w-6 h-6"/>
                    </button>
                </div>
             </div>
        </header>
    );
};

export default Header;