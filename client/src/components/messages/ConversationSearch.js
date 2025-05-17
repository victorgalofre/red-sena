import React, { useState } from 'react';
import {
    TextField,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useMessages } from '../../context/MessageContext';
import axios from 'axios';

const ConversationSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setSelectedConversation } = useMessages();

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`/api/messages/search?query=${searchTerm}`);
            setSearchResults(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al buscar conversaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <TextField
                fullWidth
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ mb: 2 }}
            />

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
                    {searchResults.map((user) => (
                        <ListItem
                            key={user._id}
                            button
                            onClick={() => {
                                setSelectedConversation({
                                    _id: user._id,
                                    usuario: user,
                                    mensajes: [],
                                    nuevosMensajes: 0,
                                });
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    src={user.fotoPerfil}
                                    sx={{ width: 40, height: 40 }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${user.nombre} ${user.apellido}`}
                                secondary={user.programa || 'Usuario de Red Sena'}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default ConversationSearch;
