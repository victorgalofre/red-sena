import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications');
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount);
            } catch (err) {
                setError(err.response?.data?.error || 'Error al cargar notificaciones');
            } finally {
                setLoading(false);
            }
        };

        // Obtener notificaciones iniciales
        fetchNotifications();

        // Configurar polling cada 30 segundos
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/api/notifications/${notificationId}/read`);
            setNotifications(prev => 
                prev.map(n => 
                    n._id === notificationId ? { ...n, leido: true } : n
                )
            );
            setUnreadCount(prev => prev - 1);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al marcar como leído');
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/api/notifications/read-all');
            setNotifications(prev => 
                prev.map(n => ({ ...n, leido: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al marcar todas como leídas');
        }
    };

    return (
        <NotificationContext.Provider 
            value={{
                notifications,
                unreadCount,
                loading,
                error,
                markAsRead,
                markAllAsRead
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = React.useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications debe ser usado dentro de un NotificationProvider');
    }
    return context;
};
