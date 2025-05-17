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
    Slider,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    VolumeUp as VolumeUpIcon,
    Vibration as VibrationIcon,
} from '@mui/icons-material';
import axios from 'axios';

const soundOptions = [
    { value: 'default', label: 'Por defecto' },
    { value: 'ding', label: 'Ding' },
    { value: 'chime', label: 'Chime' },
    { value: 'beep', label: 'Beep' },
    { value: 'notification', label: 'Notificación' },
];

const vibrationOptions = [
    { value: 'short', label: 'Corta' },
    { value: 'medium', label: 'Media' },
    { value: 'long', label: 'Larga' },
    { value: 'pattern', label: 'Patrón personalizado' },
];

const SoundVibrationQuickReplies = ({ onReply }) => {
    const [open, setOpen] = useState(false);
    const [quickReplies, setQuickReplies] = useState([]);
    const [newReply, setNewReply] = useState({
        texto: '',
        sonido: 'default',
        vibracion: 'short',
        volumen: 1,
        duracionVibracion: 1000,
    });
    const [editingReply, setEditingReply] = useState(null);
    const [error, setError] = useState('');

    const fetchQuickReplies = async () => {
        try {
            const response = await axios.get('/api/replies/quick/sound-vibration');
            setQuickReplies(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar respuestas rápidas con sonidos y vibraciones');
        }
    };

    const handleAddReply = async () => {
        if (!newReply.texto.trim()) {
            setError('El texto no puede estar vacío');
            return;
        }

        try {
            await axios.post('/api/replies/quick/sound-vibration', newReply);
            setNewReply({
                texto: '',
                sonido: 'default',
                vibracion: 'short',
                volumen: 1,
                duracionVibracion: 1000,
            });
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar respuesta rápida');
        }
    };

    const handleEditReply = async (replyId, newText) => {
        try {
            await axios.patch(`/api/replies/quick/sound-vibration/${replyId}`, {
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
            await axios.delete(`/api/replies/quick/sound-vibration/${replyId}`);
            fetchQuickReplies();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar respuesta rápida');
        }
    };

    useEffect(() => {
        fetchQuickReplies();
    }, []);

    const renderReplyContent = (reply) => {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VolumeUpIcon sx={{ color: 'primary.main' }} />
                <VibrationIcon sx={{ color: 'secondary.main' }} />
                <Typography>{reply.texto}</Typography>
            </Box>
        );
    };

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <VolumeUpIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Respuestas Rápidas con Sonidos y Vibraciones</DialogTitle>
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
                                    <InputLabel>Sonido</InputLabel>
                                    <Select
                                        value={newReply.sonido}
                                        onChange={(e) => setNewReply(prev => ({
                                            ...prev,
                                            sonido: e.target.value,
                                        }))}
                                    >
                                        {soundOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <VolumeUpIcon sx={{ mr: 1 }} />
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Vibración</InputLabel>
                                    <Select
                                        value={newReply.vibracion}
                                        onChange={(e) => setNewReply(prev => ({
                                            ...prev,
                                            vibracion: e.target.value,
                                        }))}
                                    >
                                        {vibrationOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <VibrationIcon sx={{ mr: 1 }} />
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Volumen
                                </Typography>
                                <Slider
                                    value={newReply.volumen}
                                    onChange={(e, newValue) => setNewReply(prev => ({
                                        ...prev,
                                        volumen: newValue,
                                    }))}
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Duración de vibración
                                </Typography>
                                <Slider
                                    value={newReply.duracionVibracion}
                                    onChange={(e, newValue) => setNewReply(prev => ({
                                        ...prev,
                                        duracionVibracion: newValue,
                                    }))}
                                    min={100}
                                    max={3000}
                                    step={100}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                        </Grid>

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
                                            sonido: reply.sonido,
                                            vibracion: reply.vibracion,
                                            volumen: reply.volumen,
                                            duracionVibracion: reply.duracionVibracion,
                                        });
                                        setOpen(false);
                                    }}
                                >
                                    <ListItemText
                                        primary={renderReplyContent(reply)}
                                        secondary={
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Chip
                                                    label={reply.sonido}
                                                    size="small"
                                                    color="primary"
                                                />
                                                <Chip
                                                    label={reply.vibracion}
                                                    size="small"
                                                    color="secondary"
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

export default SoundVibrationQuickReplies;
