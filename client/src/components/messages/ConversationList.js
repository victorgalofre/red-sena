import React from 'react';
import { useMessages } from '../../context/MessageContext';
import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    CircularProgress,
    Alert,
    Badge,
    Divider,
} from '@mui/material';
import {
    ChatBubble as ChatBubbleIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import ConversationSearch from './ConversationSearch';

const ConversationList = () => {
    const { conversations, selectedConversation, setSelectedConversation, loading, error } = useMessages();

    const getLastMessage = (conversation) => {
        if (!conversation.mensajes || conversation.mensajes.length === 0) return '';
        const lastMessage = conversation.mensajes[0];
        return lastMessage.contenido.length > 30 
            ? `${lastMessage.contenido.substring(0, 30)}...` 
            : lastMessage.contenido;
    };

    return (
        <Box sx={{ width: 280, height: '100vh', borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Conversaciones
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <List>
                    {conversations.map((conversation) => (
                        <ListItem
                            key={conversation._id}
                            button
                            selected={selectedConversation?._id === conversation._id}
                            onClick={() => setSelectedConversation(conversation)}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'action.selected',
                                },
                                '&.Mui-selected:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <ListItemAvatar>
                                <Badge
                                    badgeContent={conversation.nuevosMensajes}
                                    color="error"
                                    max={99}
                                >
                                    <Avatar
                                        src={conversation.usuario.fotoPerfil}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="subtitle1">
                                            {conversation.usuario.nombre} {conversation.usuario.apellido}
                                        </Typography>
                                        <ChatBubbleIcon color="primary" fontSize="small" />
                                    </Box>
                                }
                                secondary={
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {getLastMessage(conversation)}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default ConversationList;
