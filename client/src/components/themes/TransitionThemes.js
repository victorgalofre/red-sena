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
    Slider,
    Switch,
    Grid,
    Paper,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    FormatPaint as FormatPaintIcon,
    Animation as AnimationIcon,
    Timeline as TimelineIcon,
} from '@mui/icons-material';
import axios from 'axios';

const transitionTypes = [
    { value: 'fade', label: 'Fade' },
    { value: 'slide', label: 'Slide' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'rotate', label: 'Rotate' },
    { value: 'custom', label: 'Personalizado' },
];

const TransitionThemes = ({ userId, onThemeChange }) => {
    const [open, setOpen] = useState(false);
    const [themes, setThemes] = useState([]);
    const [newTheme, setNewTheme] = useState({
        nombre: '',
        tipo: 'transition',
        transicion: {
            tipo: 'fade',
            duracion: 0.5,
            direccion: 'horizontal',
            delay: 0,
            easing: 'ease-in-out',
        },
        efectos: {
            blur: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
        },
        personalizado: true,
    });
    const [editingTheme, setEditingTheme] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchThemes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/users/${userId}/themes/transition`);
            setThemes(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar temas con transiciones');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTheme = async () => {
        if (!newTheme.nombre.trim()) {
            setError('El nombre del tema no puede estar vacío');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`/api/users/${userId}/themes/transition`, newTheme);
            setNewTheme({
                nombre: '',
                tipo: 'transition',
                transicion: {
                    tipo: 'fade',
                    duracion: 0.5,
                    direccion: 'horizontal',
                    delay: 0,
                    easing: 'ease-in-out',
                },
                efectos: {
                    blur: 0,
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                },
                personalizado: true,
            });
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar tema con transiciones');
        } finally {
            setLoading(false);
        }
    };

    const handleEditTheme = async (themeId, newTheme) => {
        try {
            setLoading(true);
            await axios.patch(`/api/users/${userId}/themes/transition/${themeId}`, newTheme);
            setEditingTheme(null);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar tema con transiciones');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTheme = async (themeId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/users/${userId}/themes/transition/${themeId}`);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar tema con transiciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThemes();
    }, [userId]);

    const getTransitionStyle = (transition) => {
        const style = {
            transition: `${transition.duracion}s ${transition.easing}`,
            transitionDelay: `${transition.delay}s`,
        };

        if (transition.tipo === 'fade') {
            style.opacity = 0;
        }

        if (transition.tipo === 'slide') {
            style.transform = transition.direccion === 'horizontal' 
                ? 'translateX(100%)' 
                : 'translateY(100%)';
        }

        if (transition.tipo === 'zoom') {
            style.transform = 'scale(0)';
        }

        if (transition.tipo === 'rotate') {
            style.transform = 'rotate(360deg)';
        }

        return style;
    };

    const getEffectStyle = (effects) => {
        return {
            filter: `blur(${effects.blur}px)`,
            opacity: effects.opacity,
            transform: `scale(${effects.scale}) rotate(${effects.rotation}deg)`,
            transition: 'all 0.3s ease',
        };
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<FormatPaintIcon />}
                onClick={() => setOpen(true)}
            >
                Temas con Transiciones
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Temas Personalizados con Animaciones de Transición</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Nombre del tema"
                            value={newTheme.nombre}
                            onChange={(e) => setNewTheme(prev => ({
                                ...prev,
                                nombre: e.target.value,
                            }))}
                            sx={{ mb: 2 }}
                        />

                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Transición
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Tipo de transición</InputLabel>
                                <Select
                                    value={newTheme.transicion.tipo}
                                    onChange={(e) => setNewTheme(prev => ({
                                        ...prev,
                                        transicion: {
                                            ...prev.transicion,
                                            tipo: e.target.value,
                                        },
                                    }))}
                                >
                                    {transitionTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            <AnimationIcon sx={{ mr: 1 }} />
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Duración
                                    </Typography>
                                    <Slider
                                        value={newTheme.transicion.duracion}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            transicion: {
                                                ...prev.transicion,
                                                duracion: newValue,
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
                                        Delay
                                    </Typography>
                                    <Slider
                                        value={newTheme.transicion.delay}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            transicion: {
                                                ...prev.transicion,
                                                delay: newValue,
                                            },
                                        }))}
                                        min={0}
                                        max={2}
                                        step={0.1}
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Efectos
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Blur
                                    </Typography>
                                    <Slider
                                        value={newTheme.efectos.blur}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            efectos: {
                                                ...prev.efectos,
                                                blur: newValue,
                                            },
                                        }))}
                                        min={0}
                                        max={20}
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Opacidad
                                    </Typography>
                                    <Slider
                                        value={newTheme.efectos.opacity}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            efectos: {
                                                ...prev.efectos,
                                                opacity: newValue,
                                            },
                                        }))}
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Escala
                                    </Typography>
                                    <Slider
                                        value={newTheme.efectos.scale}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            efectos: {
                                                ...prev.efectos,
                                                scale: newValue,
                                            },
                                        }))}
                                        min={0.5}
                                        max={2}
                                        step={0.1}
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Rotación
                                    </Typography>
                                    <Slider
                                        value={newTheme.efectos.rotation}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            efectos: {
                                                ...prev.efectos,
                                                rotation: newValue,
                                            },
                                        }))}
                                        min={0}
                                        max={360}
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddTheme}
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : 'Agregar tema'}
                        </Button>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <List>
                            {themes.map((theme) => (
                                <ListItem
                                    key={theme._id}
                                    secondaryAction={
                                        <Box>
                                            <IconButton
                                                edge="end"
                                                onClick={() => {
                                                    setEditingTheme(theme._id);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                color="error"
                                                onClick={() => handleDeleteTheme(theme._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                    onClick={() => {
                                        onThemeChange(theme);
                                        setOpen(false);
                                    }}
                                >
                                    <ListItemText
                                        primary={theme.nombre}
                                        secondary={
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Box
                                                    sx={{
                                                        ...getTransitionStyle(theme.transicion),
                                                        ...getEffectStyle(theme.efectos),
                                                        width: 50,
                                                        height: 50,
                                                        backgroundColor: 'primary.main',
                                                        color: 'white',
                                                        borderRadius: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {theme.transicion.tipo}
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2">
                                                        Duración: {theme.transicion.duracion}s
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Opacidad: {theme.efectos.opacity}
                                                    </Typography>
                                                </Box>
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

export default TransitionThemes;
