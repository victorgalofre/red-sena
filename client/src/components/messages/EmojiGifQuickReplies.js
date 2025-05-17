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
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Grid,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    EmojiEmotions as EmojiEmotionsIcon,
    Gif as GifIcon,
} from '@mui/icons-material';
import axios from 'axios';

const EmojiGifQuickReplies = ({ onReply }) => {
    const [open, setOpen] = useState(false);
    const [quickReplies, setQuickReplies] = useState([]);
    const [newReply, setNewReply] = useState({
        texto: '',
        emoji: '',
        gif: '',
        tipo: 'texto',
    });
    const [editingReply, setEditingReply] = useState(null);
    const [error, setError] = useState('');

    const fetchQuickReplies = async () => {
        try {
            const response = await axios.get('/api/replies/quick/emoji-gif');
            setQuickReplies(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar respuestas rápidas con emojis y GIFs');
        }
    };

    const handleAddReply = async () => {
        if (!newReply.texto.trim() && !newReply.emoji && !newReply.gif) {
            setError('Debe ingresar al menos un elemento');
            return;
        }

        try {
            await axios.post('/api/replies/quick/emoji-gif', newReply);
            setNewReply({
                texto: '',
                emoji: '',
                gif: '',
                tipo: 'texto',
            });
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar respuesta rápida');
        }
    };

    const handleEditReply = async (replyId, newText) => {
        try {
            await axios.patch(`/api/replies/quick/emoji-gif/${replyId}`, {
                texto: newText,
            });
            setEditingReply(null);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar respuesta rápida');
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            await axios.delete(`/api/replies/quick/emoji-gif/${replyId}`);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar respuesta rápida');
        }
    };

    useEffect(() => {
        fetchQuickReplies();
    }, []);

    const renderReplyContent = (reply) => {
        if (reply.tipo === 'emoji') {
            return reply.emoji;
        } else if (reply.tipo === 'gif') {
            return (
                <img
                    src={reply.gif}
                    alt="GIF"
                    style={{
                        maxWidth: '100px',
                        maxHeight: '100px',
                        objectFit: 'contain',
                    }}
                />
            );
        }
        return reply.texto;
    };

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <EmojiEmotionsIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Respuestas Rápidas con Emojis y GIFs</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Tipo de respuesta</InputLabel>
                            <Select
                                value={newReply.tipo}
                                onChange={(e) => setNewReply(prev => ({
                                    ...prev,
                                    tipo: e.target.value,
                                }))}
                            >
                                <MenuItem value="texto">Texto</MenuItem>
                                <MenuItem value="emoji">Emoji</MenuItem>
                                <MenuItem value="gif">GIF</MenuItem>
                            </Select>
                        </FormControl>

                        {newReply.tipo === 'texto' && (
                            <TextField
                                fullWidth
                                label="Texto"
                                value={newReply.texto}
                                onChange={(e) => setNewReply(prev => ({
                                    ...prev,
                                    texto: e.target.value,
                                }))}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AddIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />
                        )}

                        {newReply.tipo === 'emoji' && (
                            <Grid container spacing={1} sx={{ mb: 2 }}>
                                {['😊', '😂', '❤️', '👍', '🎉', '🤔', '😎', '😢'].map((emoji) => (
                                    <Grid item key={emoji}>
                                        <Chip
                                            label={emoji}
                                            onClick={() => setNewReply(prev => ({
                                                ...prev,
                                                emoji: emoji,
                                            }))}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                                },
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {newReply.tipo === 'gif' && (
                            <TextField
                                fullWidth
                                label="URL del GIF"
                                value={newReply.gif}
                                onChange={(e) => setNewReply(prev => ({
                                    ...prev,
                                    gif: e.target.value,
                                }))}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <GifIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddReply}
                        >
                            Agregar respuesta
                        </Button>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <List>
                            {quickReplies.map((reply) => (
                                <ListItem
                                    key={reply._id}
                                    secondaryAction={
                                        <Box>
                                            <IconButton
                                                edge="end"
                                                onClick={() => {
                                                    setEditingReply(reply._id);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                color="error"
                                                onClick={() => handleDeleteReply(reply._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                    onClick={() => {
                                        onReply({
                                            contenido: reply.texto,
                                            emoji: reply.emoji,
                                            gif: reply.gif,
                                        });
                                        setOpen(false);
                                    }}
                                >
                                    <ListItemText
                                        primary={renderReplyContent(reply)}
                                        secondary={reply.tipo}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EmojiGifQuickReplies;
