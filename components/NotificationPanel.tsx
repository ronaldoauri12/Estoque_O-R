
import React from 'react';
import { Notification } from '../types';
import { BellIcon } from './icons/BellIcon';
import { CheckIcon } from './icons/CheckIcon';

function timeAgo(isoDateString: string): string {
    const date = new Date(isoDateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s atrás`;
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-card rounded-xl shadow-2xl border border-border z-50 animate-fade-in-up origin-top-right">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="font-bold text-text-primary">Notificações</h3>
        {unreadCount > 0 && (
          <button onClick={onMarkAllAsRead} className="text-xs font-semibold text-primary hover:underline flex items-center">
            <CheckIcon className="w-4 h-4 mr-1"/>
            Marcar todas como lidas
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map(n => (
              <li
                key={n.id}
                onClick={() => !n.read && onMarkAsRead(n.id)}
                className={`p-4 border-b border-border last:border-b-0 flex items-start gap-3 transition-colors ${!n.read ? 'bg-primary/5 hover:bg-primary/10 cursor-pointer' : 'bg-white'}`}
                role="button"
                aria-label={`Notificação: ${n.message}`}
              >
                {!n.read && <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1.5 flex-shrink-0" aria-label="Não lida"></div>}
                <div className={n.read ? 'pl-[22px]' : ''}>
                  <p className="text-sm text-text-primary">{n.message}</p>
                  <p className="text-xs text-text-secondary mt-1">{timeAgo(n.timestamp)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-8 text-text-secondary">
            <BellIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-semibold">Nenhuma notificação</p>
            <p className="text-sm">Você está em dia!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
