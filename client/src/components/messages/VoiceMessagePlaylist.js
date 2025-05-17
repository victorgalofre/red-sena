import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    CircularProgress,
} from '@mui/material';
import {
    QueueMusic as QueueMusicIcon,
    PlayArrow as PlayArrowIcon,
    Pause as PauseIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';

const VoiceMessagePlaylist = ({ conversationId }) => {
    const [open, setOpen] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentMessage, setCurrentMessage] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        fetchPlaylist();
    }, [conversationId]);

    const fetchPlaylist = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/messages/voice/playlist/${conversationId}`);
            setPlaylist(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar la lista de reproducción');
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (message) => {
        if (currentMessage === message._id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentMessage(message._id);
            setIsPlaying(true);
        }
    };

    const handleDelete = async (messageId) => {
        try {
            await axios.delete(`/api/messages/voice/${messageId}`);
            setPlaylist(prev => prev.filter(msg => msg._id !== messageId));
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar mensaje de voz');
        }
    };

    const handleAddToPlaylist = async (messageId) => {
        try {
            await axios.post(`/api/messages/voice/playlist/${conversationId}`, {
                messageId,
            });
            fetchPlaylist();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar a la lista de reproducción');
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<QueueMusicIcon />}
                onClick={() => setOpen(true)}
            >
                Lista de reproducción
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Lista de reproducción de mensajes de voz</DialogTitle>
                <DialogContent>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List>
                            {playlist.map((msg) => (
                                <ListItem
                                    key={msg._id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDelete(msg._id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={msg.contenido}
                                        secondary={new Date(msg.fecha).toLocaleString()}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            onClick={() => handlePlay(msg)}
                                            color={currentMessage === msg._id ? 'primary' : 'default'}
                                        >
                                            {isPlaying && currentMessage === msg._id ? (
                                                <PauseIcon />
                                            ) : (
                                                <PlayArrowIcon />
                                            )}
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VoiceMessagePlaylist;
