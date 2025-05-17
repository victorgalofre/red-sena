import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get('/api/messages/conversations');
                setConversations(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Error al cargar conversaciones');
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();

        // Configurar polling cada 15 segundos
        const interval = setInterval(fetchConversations, 15000);

        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async (conversationId) => {
        try {
            const response = await axios.get(`/api/messages/conversation/${conversationId}`);
            setMessages(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar mensajes');
        }
    };

    const sendMessage = async (conversationId, message) => {
        try {
            await axios.post(`/api/messages/conversation/${conversationId}`, { message });
            // Actualizar la conversación activa
            if (selectedConversation?._id === conversationId) {
                setMessages(prev => [...prev, { ...message, leido: false }]);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error al enviar mensaje');
        }
    };

    const markAsRead = async (conversationId) => {
        try {
            await axios.post(`/api/messages/conversation/${conversationId}/read`);
            // Actualizar la conversación activa
            if (selectedConversation?._id === conversationId) {
                setMessages(prev => 
                    prev.map(msg => 
                        msg.leido || msg.emisor === selectedConversation.usuario._id ? msg : { ...msg, leido: true }
                    )
                );
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error al marcar como leído');
        }
    };

    return (
        <MessageContext.Provider 
            value={{
                conversations,
                selectedConversation,
                messages,
                loading,
                error,
                setSelectedConversation,
                fetchMessages,
                sendMessage,
                markAsRead
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

export const useMessages = () => {
    const context = React.useContext(MessageContext);
    if (!context) {
        throw new Error('useMessages debe ser usado dentro de un MessageProvider');
    }
    return context;
};
