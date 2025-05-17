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
    ThreeDRotation as ThreeDRotationIcon,
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

const ThreeDAnimatedEmojiQuickReplies = ({ onReply }) => {
    const [open, setOpen] = useState(false);
    const [quickReplies, setQuickReplies] = useState([]);
    const [newReply, setNewReply] = useState({
        texto: '',
        emoji: '',
        animacion: 'bounce',
        duracion: 1,
        iteraciones: 1,
        delay: 0,
        efecto3d: {
            perspectiva: 1000,
            anguloX: 0,
            anguloY: 0,
            escalaX: 1,
            escalaY: 1,
            escalaZ: 1,
            traduccionX: 0,
            traduccionY: 0,
            traduccionZ: 0,
        },
    });
    const [editingReply, setEditingReply] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchQuickReplies = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/replies/quick/3d-animated-emoji');
            setQuickReplies(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar respuestas rápidas con emojis animados en 3D');
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
            await axios.post('/api/replies/quick/3d-animated-emoji', newReply);
            setNewReply({
                texto: '',
                emoji: '',
                animacion: 'bounce',
                duracion: 1,
                iteraciones: 1,
                delay: 0,
                efecto3d: {
                    perspectiva: 1000,
                    anguloX: 0,
                    anguloY: 0,
                    escalaX: 1,
                    escalaY: 1,
                    escalaZ: 1,
                    traduccionX: 0,
                    traduccionY: 0,
                    traduccionZ: 0,
                },
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
            await axios.patch(`/api/replies/quick/3d-animated-emoji/${replyId}`, {
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
            await axios.delete(`/api/replies/quick/3d-animated-emoji/${replyId}`);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar respuesta rápida');
        } finally {
            setLoading(false);
        }
    };

    const get3DEffectStyle = (effect) => {
        const transform = [];

        if (effect.perspectiva) {
            transform.push(`perspective(${effect.perspectiva}px)`);
        }

        if (effect.anguloX || effect.anguloY) {
            transform.push(`rotateX(${effect.anguloX}deg) rotateY(${effect.anguloY}deg)`);
        }

        if (effect.escalaX !== 1 || effect.escalaY !== 1 || effect.escalaZ !== 1) {
            transform.push(`scale3d(${effect.escalaX}, ${effect.escalaY}, ${effect.escalaZ})`);
        }

        if (effect.traduccionX || effect.traduccionY || effect.traduccionZ) {
            transform.push(`translate3d(${effect.traduccionX}px, ${effect.traduccionY}px, ${effect.traduccionZ}px)`);
        }

        return {
            transform: transform.join(' '),
            transformStyle: 'preserve-3d',
            transition: 'all 0.3s ease',
        };
    };

    const render3DEmoji = (emoji, animation, duration, iterations, delay, effect) => {
        return (
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    ...get3DEffectStyle(effect),
                }}
            >
                <Box
                    sx={{
                        animation: `${animation} ${duration}s ${iterations} ease-in-out ${delay}s`,
                    }}
                >
                    {emoji}
                </Box>
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
                <DialogTitle>Respuestas Rápidas con Emojis Animados en 3D</DialogTitle>
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
                                                <ThreeDRotationIcon sx={{ mr: 1 }} />
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
                                    Perspectiva
                                </Typography>
                                <Slider
                                    value={newReply.efecto3d.perspectiva}
                                    onChange={(e, newValue) => setNewReply(prev => ({
                                        ...prev,
                                        efecto3d: {
                                            ...prev.efecto3d,
                                            perspectiva: newValue,
                                        },
                                    }))}
                                    min={0}
                                    max={2000}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Ángulo X
                                </Typography>
                                <Slider
                                    value={newReply.efecto3d.anguloX}
                                    onChange={(e, newValue) => setNewReply(prev => ({
                                        ...prev,
                                        efecto3d: {
                                            ...prev.efecto3d,
                                            anguloX: newValue,
                                        },
                                    }))}
                                    min={-180}
                                    max={180}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Ángulo Y
                                </Typography>
                                <Slider
                                    value={newReply.efecto3d.anguloY}
                                    onChange={(e, newValue) => setNewReply(prev => ({
                                        ...prev,
                                        efecto3d: {
                                            ...prev.efecto3d,
                                            anguloY: newValue,
                                        },
                                    }))}
                                    min={-180}
                                    max={180}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Escala X
                                </Typography>
                                <Slider
                                    value={newReply.efecto3d.escalaX}
                                    onChange={(e, newValue) => setNewReply(prev => ({
                                        ...prev,
                                        efecto3d: {
                                            ...prev.efecto3d,
                                            escalaX: newValue,
                                        },
                                    }))}
                                    min={0.1}
                                    max={2}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Escala Y
                                </Typography>
                                <Slider
                                    value={newReply.efecto3d.escalaY}
                                    onChange={(e, newValue) => setNewReply(prev => ({
                                        ...prev,
                                        efecto3d: {
                                            ...prev.efecto3d,
                                            escalaY: newValue,
                                        },
                                    }))}
                                    min={0.1}
                                    max={2}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Escala Z
                                </Typography>
                                <Slider
                                    value={newReply.efecto3d.escalaZ}
                                    onChange={(e, newValue) => setNewReply(prev => ({
                                        ...prev,
                                        efecto3d: {
                                            ...prev.efecto3d,
                                            escalaZ: newValue,
                                        },
                                    }))}
                                    min={0.1}
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
                                    label={render3DEmoji(
                                        emoji,
                                        newReply.animacion,
                                        newReply.duracion,
                                        newReply.iteraciones,
                                        newReply.delay,
                                        newReply.efecto3d
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
                                            efecto3d: reply.efecto3d,
                                        });
                                        setOpen(false);
                                    }}
                                >
                                    <ListItemText
                                        primary={reply.texto}
                                        secondary={
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {render3DEmoji(
                                                    reply.emoji,
                                                    reply.animacion,
                                                    reply.duracion,
                                                    reply.iteraciones,
                                                    reply.delay,
                                                    reply.efecto3d
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

export default ThreeDAnimatedEmojiQuickReplies;
