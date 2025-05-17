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
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    EmojiEmotions as EmojiEmotionsIcon,
    Animation as AnimationIcon,
} from '@mui/icons-material';
import axios from 'axios';

const animationTypes = [
    { value: 'bounce', label: 'Rebote' },
    { value: 'spin', label: 'Rotación' },
    { value: 'pulse', label: 'Pulso' },
    { value: 'flip', label: 'Volteo' },
    { value: 'tada', label: 'Tada' },
    { value: 'wobble', label: 'Balanceo' },
];

const AnimatedEmojiQuickReplies = ({ onReply }) => {
    const [open, setOpen] = useState(false);
    const [quickReplies, setQuickReplies] = useState([]);
    const [newReply, setNewReply] = useState({
        texto: '',
        emoji: '',
        animacion: 'bounce',
        duracion: 1,
        iteraciones: 1,
        delay: 0,
    });
    const [editingReply, setEditingReply] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchQuickReplies = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/replies/quick/animated-emoji');
            setQuickReplies(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar respuestas rápidas con emojis animados');
        } finally {
            setLoading(false);
        }
    };

    const handleAddReply = async () => {
        if (!newReply.texto.trim() && !newReply.emoji) {
            setError('Debe ingresar al menos un elemento');
            return;
        }

        try {
            setLoading(true);
            await axios.post('/api/replies/quick/animated-emoji', newReply);
            setNewReply({
                texto: '',
                emoji: '',
                animacion: 'bounce',
                duracion: 1,
                iteraciones: 1,
                delay: 0,
            });
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar respuesta rápida');
        } finally {
            setLoading(false);
        }
    };

    const handleEditReply = async (replyId, newText) => {
        try {
            setLoading(true);
            await axios.patch(`/api/replies/quick/animated-emoji/${replyId}`, {
                texto: newText,
            });
            setEditingReply(null);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar respuesta rápida');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/replies/quick/animated-emoji/${replyId}`);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar respuesta rápida');
        } finally {
            setLoading(false);
        }
    };

    const getAnimationStyle = (animation, duration, iterations, delay) => {
        return {
            animation: `${animation} ${duration}s ${iterations} ease-in-out ${delay}s`,
        };
    };

    const renderAnimatedEmoji = (emoji, animation, duration, iterations, delay) => {
        return (
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    ...getAnimationStyle(animation, duration, iterations, delay),
                }}
            >
                {emoji}
            </Box>
        );
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
                <EmojiEmotionsIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Respuestas Rápidas con Emojis Animados</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
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

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Animación</InputLabel>
                                    <Select
                                        value={newReply.animacion}
                                        onChange={(e) => setNewReply(prev => ({
                                            ...prev,
                                            animacion: e.target.value,
                                        }))}
                                    >
                                        {animationTypes.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                <AnimationIcon sx={{ mr: 1 }} />
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Iteraciones</InputLabel>
                                    <Select
                                        value={newReply.iteraciones}
                                        onChange={(e) => setNewReply(prev => ({
                                            ...prev,
                                            iteraciones: parseInt(e.target.value),
                                        }))}
                                    >
                                        {[1, 2, 3, 4, 5, 'infinite'].map((value) => (
                                            <MenuItem key={value} value={value}>
                                                {value === 'infinite' ? 'Infinito' : value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Duración
                                </Typography>
                                <Slider
                                    value={newReply.duracion}
                                    onChange={(e, newValue) => setNewReply(prev => ({
                                        ...prev,
                                        duracion: newValue,
                                    }))}
                                    min={0.1}
                                    max={3}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Delay
                                </Typography>
                                <Slider
                                    value={newReply.delay}
                                    onChange={(e, newValue) => setNewReply(prev => ({
                                        ...prev,
                                        delay: newValue,
                                    }))}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            {['😊', '😂', '❤️', '👍', '🎉', '🤔', '😎', '😢'].map((emoji) => (
                                <Chip
                                    key={emoji}
                                    label={renderAnimatedEmoji(
                                        emoji,
                                        newReply.animacion,
                                        newReply.duracion,
                                        newReply.iteraciones,
                                        newReply.delay
                                    )}
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
                            ))}
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddReply}
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : 'Agregar respuesta'}
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
                                            animacion: reply.animacion,
                                            duracion: reply.duracion,
                                            iteraciones: reply.iteraciones,
                                            delay: reply.delay,
                                        });
                                        setOpen(false);
                                    }}
                                >
                                    <ListItemText
                                        primary={reply.texto}
                                        secondary={
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {renderAnimatedEmoji(
                                                    reply.emoji,
                                                    reply.animacion,
                                                    reply.duracion,
                                                    reply.iteraciones,
                                                    reply.delay
                                                )}
                                                <Chip
                                                    label={reply.animacion}
                                                    size="small"
                                                    color="primary"
                                                />
                                            </Box>
                                        }
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

export default AnimatedEmojiQuickReplies;
