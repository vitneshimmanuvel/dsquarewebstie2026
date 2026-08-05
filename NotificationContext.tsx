import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Notification } from './types';
import { useAuth, API_BASE } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  unreadCount: number;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, token } = useAuth();

  const refreshNotifications = async () => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) {
      setNotifications([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        const mapped: Notification[] = data.data.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Just now',
          read: n.read || false,
          type: n.type === 'ALERT' ? 'alert' : n.type === 'SUCCESS' ? 'success' : 'info'
        }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, [user, token]);

  const markAsRead = async (id: string) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success) {
        await refreshNotifications();
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success) {
        await refreshNotifications();
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success) {
        await refreshNotifications();
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, markAllAsRead, unreadCount, deleteNotification, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};