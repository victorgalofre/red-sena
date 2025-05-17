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
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Chat as ChatIcon,
} from '@mui/icons-material';
import axios from 'axios';

const PrivateQuickReplies = ({ userId, onReply }) => {
    const [open, setOpen] = useState(false);
    const [quickReplies, setQuickReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [editingReply, setEditingReply] = useState(null);
    const [error, setError] = useState('');
    const [category, setCategory] = useState('general');

    const fetchQuickReplies = async () => {
        try {
            const response = await axios.get(`/api/users/${userId}/replies/quick`);
            setQuickReplies(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar respuestas rápidas privadas');
        }
    };

    const handleAddReply = async () => {
        if (!newReply.trim()) {
            setError('La respuesta no puede estar vacía');
            return;
        }

        try {
            await axios.post(`/api/users/${userId}/replies/quick`, {
                contenido: newReply,
                categoria: category,
            });
            setNewReply('');
            setCategory('general');
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar respuesta rápida privada');
        }
    };

    const handleEditReply = async (replyId, newText) => {
        try {
            await axios.patch(`/api/users/${userId}/replies/quick/${replyId}`, {
                contenido: newText,
            });
            setEditingReply(null);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar respuesta rápida privada');
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            await axios.delete(`/api/users/${userId}/replies/quick/${replyId}`);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar respuesta rápida privada');
        }
    };

    useEffect(() => {
        fetchQuickReplies();
    }, [userId]);

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <ChatIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Respuestas Rápidas Privadas</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <MenuItem value="general">General</MenuItem>
                                <MenuItem value="saludos">Saludos</MenuItem>
                                <MenuItem value="despedidas">Despedidas</MenuItem>
                                <MenuItem value="gracias">Gracias</MenuItem>
                            </Select>
                        </FormControl>

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
                                        secondary={reply.categoria}
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

export default PrivateQuickReplies;
