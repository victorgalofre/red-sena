import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Reply as ReplyIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import axios from 'axios';

const ThreadedReplies = ({ message, onReply, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [replies, setReplies] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReplies();
    }, [message._id]);

    const fetchReplies = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/messages/${message._id}/replies`);
            setReplies(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar respuestas');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) {
            setError('El mensaje no puede estar vacío');
            return;
        }

        try {
            await axios.post(`/api/messages/${message._id}/reply`, {
                contenido: replyText,
            });
            setReplyText('');
            fetchReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al enviar respuesta');
        }
    };

    const handleEditReply = async (replyId, newText) => {
        try {
            await axios.patch(`/api/messages/replies/${replyId}`, {
                contenido: newText,
            });
            onEdit(replyId, newText);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar respuesta');
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            await axios.delete(`/api/messages/replies/${replyId}`);
            onDelete(replyId);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar respuesta');
        }
    };

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <ReplyIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Respuestas</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Escribe una respuesta..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReply}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : 'Enviar'}
                        </Button>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <List>
                            {replies.map((reply) => (
                                <ListItem
                                    key={reply._id}
                                    secondaryAction={
                                        <Box>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleEditReply(reply._id, reply.contenido)}
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
                                >
                                    <ListItemText
                                        primary={reply.contenido}
                                        secondary={new Date(reply.fecha).toLocaleString()}
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

export default ThreadedReplies;
