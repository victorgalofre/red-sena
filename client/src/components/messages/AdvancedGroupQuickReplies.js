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
    Autocomplete,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Group as GroupIcon,
    Category as CategoryIcon,
} from '@mui/icons-material';
import axios from 'axios';

const AdvancedGroupQuickReplies = ({ groupId, onReply }) => {
    const [open, setOpen] = useState(false);
    const [quickReplies, setQuickReplies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [editingReply, setEditingReply] = useState(null);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchQuickReplies = async () => {
        try {
            const response = await axios.get(`/api/groups/${groupId}/replies/quick`);
            setQuickReplies(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar respuestas rápidas del grupo');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`/api/groups/${groupId}/categories`);
            setCategories(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar categorías del grupo');
        }
    };

    const handleAddReply = async () => {
        if (!newReply.trim()) {
            setError('La respuesta no puede estar vacía');
            return;
        }
        if (!selectedCategory) {
            setError('Debe seleccionar una categoría');
            return;
        }

        try {
            await axios.post(`/api/groups/${groupId}/replies/quick`, {
                contenido: newReply,
                categoria: selectedCategory,
            });
            setNewReply('');
            setSelectedCategory(null);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar respuesta rápida al grupo');
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            setError('El nombre de la categoría no puede estar vacío');
            return;
        }

        try {
            await axios.post(`/api/groups/${groupId}/categories`, {
                nombre: newCategory,
            });
            setNewCategory('');
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar categoría al grupo');
        }
    };

    const handleEditReply = async (replyId, newText) => {
        try {
            await axios.patch(`/api/groups/${groupId}/replies/quick/${replyId}`, {
                contenido: newText,
            });
            setEditingReply(null);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar respuesta rápida del grupo');
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            await axios.delete(`/api/groups/${groupId}/replies/quick/${replyId}`);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar respuesta rápida del grupo');
        }
    };

    useEffect(() => {
        fetchQuickReplies();
        fetchCategories();
    }, [groupId]);

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <GroupIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Respuestas Rápidas del Grupo</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Autocomplete
                            options={categories}
                            getOptionLabel={(option) => option.nombre}
                            value={selectedCategory}
                            onChange={(event, newValue) => {
                                setSelectedCategory(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Seleccionar categoría"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Nueva categoría"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CategoryIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddCategory}
                            >
                                Agregar
                            </Button>
                        </Box>

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
                            disabled={!selectedCategory}
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
                                        onReply(reply.contenido);
                                        setOpen(false);
                                    }}
                                >
                                    <ListItemText
                                        primary={reply.contenido}
                                        secondary={reply.categoria.nombre}
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

export default AdvancedGroupQuickReplies;
