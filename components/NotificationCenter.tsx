import React from 'react';
import { Bell, X, Check, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Notification } from '../types';
import { useNavigate } from 'react-router-dom';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllRead
}) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle size={16} className="text-amber-600" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <Info size={16} className="text-brand-primary" />;
    }
  };

  const handleViewAll = () => {
    navigate('/app/notifications');
    onClose();
  };

  return (
    <>
      {/* Backdrop for mobile/outside click */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown Panel */}
      <div className="absolute top-14 right-0 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-primary/10 rounded text-brand-primary">
               <Bell size={16} />
            </div>
            <h3 className="font-bold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {unreadCount} new
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center text-slate-400">
              <Bell size={32} className="mb-3 opacity-20" />
              <p className="text-sm font-medium">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id} 
                  onClick={() => onMarkAsRead(notification.id)}
                  className={`p-4 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer group ${
                    !notification.read ? 'bg-blue-50/40' : 'bg-white'
                  }`}
                >
                  <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                    notification.type === 'alert' ? 'bg-amber-50 border-amber-100' : 
                    notification.type === 'success' ? 'bg-green-50 border-green-100' : 
                    'bg-blue-50 border-blue-100'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm truncate pr-2 ${!notification.read ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{notification.date}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${!notification.read ? 'text-slate-600' : 'text-slate-400'}`}>
                      {notification.message}
                    </p>
                  </div>
                  
                  <div className="shrink-0 self-center pl-1 flex flex-col items-center justify-center gap-1">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-brand-accent rounded-full shadow-sm ring-2 ring-white"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
          <button 
            className="flex-1 text-xs font-bold text-brand-primary hover:bg-white hover:shadow-sm py-2 rounded-lg border border-transparent hover:border-slate-200 transition-all"
            onClick={handleViewAll}
          >
             View All Notifications
          </button>
          <button 
            className="text-xs font-semibold text-slate-500 hover:text-brand-primary hover:bg-white hover:shadow-sm px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50"
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            title="Mark all as read"
          >
            <Check size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;