import React from 'react';
import { useNotifications } from '../NotificationContext';
import { Check, Trash2, Bell, AlertTriangle, CheckCircle, Info, Clock } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={20} className="text-amber-600" />;
      case 'success': return <CheckCircle size={20} className="text-green-600" />;
      default: return <Info size={20} className="text-brand-primary" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'alert': return 'border-l-amber-500 bg-amber-50/50';
      case 'success': return 'border-l-green-500 bg-green-50/50';
      default: return 'border-l-brand-primary bg-blue-50/50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="text-brand-accent" /> Notifications
          </h2>
          <p className="text-slate-500">Stay updated with project alerts and system messages.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-brand-primary hover:border-brand-primary rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm"
        >
          <Check size={18} /> Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bell size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">All Caught Up!</h3>
            <p className="text-slate-500">You have no new notifications at this moment.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`relative bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-all flex gap-4 group ${
                !notification.read ? 'border-l-4 ' + getStyles(notification.type) : 'border-slate-200 border-l-4 border-l-slate-300 opacity-75 hover:opacity-100'
              }`}
            >
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100`}>
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-base ${!notification.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
                    <Clock size={12} /> {notification.date}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{notification.message}</p>
                
                <div className="mt-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
                    >
                      <Check size={12} /> Mark as read
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notification.id)}
                    className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
              
              {!notification.read && (
                 <div className="absolute top-5 right-5 w-2 h-2 bg-brand-accent rounded-full ring-4 ring-white"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;