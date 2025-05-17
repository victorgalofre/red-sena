import React, { useState } from 'react';
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
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import axios from 'axios';

const QuickReplies = ({ message, onReply }) => {
    const [open, setOpen] = useState(false);
    const [quickReplies, setQuickReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [editingReply, setEditingReply] = useState(null);
    const [error, setError] = useState('');

    const fetchQuickReplies = async () => {
        try {
            const response = await axios.get('/api/replies/quick');
            setQuickReplies(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar respuestas rápidas');
        }
    };

    const handleAddReply = async () => {
        if (!newReply.trim()) {
            setError('La respuesta no puede estar vacía');
            return;
        }

        try {
            await axios.post('/api/replies/quick', {
                contenido: newReply,
            });
            setNewReply('');
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar respuesta rápida');
        }
    };

    const handleEditReply = async (replyId, newText) => {
        try {
            await axios.patch(`/api/replies/quick/${replyId}`, {
                contenido: newText,
            });
            setEditingReply(null);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar respuesta rápida');
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            await axios.delete(`/api/replies/quick/${replyId}`);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar respuesta rápida');
        }
    };

    useEffect(() => {
        fetchQuickReplies();
    }, []);

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <AddIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Respuestas Rápidas</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Nueva respuesta rápida"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AddIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddReply}
                        >
                            Agregar
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
                                        onReply(reply.contenido);
                                        setOpen(false);
                                    }}
                                >
                                    <ListItemText
                                        primary={reply.contenido}
                                        secondary={new Date(reply.createdAt).toLocaleString()}
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

export default QuickReplies;
