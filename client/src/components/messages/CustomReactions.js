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
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    EmojiEmotions as EmojiEmotionsIcon,
} from '@mui/icons-material';
import axios from 'axios';

const CustomReactions = ({ message, onReact }) => {
    const [open, setOpen] = useState(false);
    const [reactions, setReactions] = useState([]);
    const [newReaction, setNewReaction] = useState('');
    const [editingReaction, setEditingReaction] = useState(null);
    const [error, setError] = useState('');

    const fetchReactions = async () => {
        try {
            const response = await axios.get('/api/reactions/custom');
            setReactions(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar reacciones personalizadas');
        }
    };

    const handleAddReaction = async () => {
        if (!newReaction.trim()) {
            setError('La reacción no puede estar vacía');
            return;
        }

        try {
            await axios.post('/api/reactions/custom', {
                contenido: newReaction,
            });
            setNewReaction('');
            fetchReactions();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar reacción personalizada');
        }
    };

    const handleEditReaction = async (reactionId, newText) => {
        try {
            await axios.patch(`/api/reactions/custom/${reactionId}`, {
                contenido: newText,
            });
            setEditingReaction(null);
            fetchReactions();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar reacción personalizada');
        }
    };

    const handleDeleteReaction = async (reactionId) => {
        try {
            await axios.delete(`/api/reactions/custom/${reactionId}`);
            fetchReactions();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar reacción personalizada');
        }
    };

    useEffect(() => {
        fetchReactions();
    }, []);

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
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Reacciones Personalizadas</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Nueva reacción personalizada"
                            value={newReaction}
                            onChange={(e) => setNewReaction(e.target.value)}
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
                            onClick={handleAddReaction}
                        >
                            Agregar
                        </Button>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <List>
                            {reactions.map((reaction) => (
                                <ListItem
                                    key={reaction._id}
                                    secondaryAction={
                                        <Box>
                                            <IconButton
                                                edge="end"
                                                onClick={() => {
                                                    setEditingReaction(reaction._id);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                color="error"
                                                onClick={() => handleDeleteReaction(reaction._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                    onClick={() => {
                                        onReact(reaction.contenido);
                                        setOpen(false);
                                    }}
                                >
                                    <ListItemText
                                        primary={reaction.contenido}
                                        secondary={new Date(reaction.createdAt).toLocaleString()}
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

export default CustomReactions;
