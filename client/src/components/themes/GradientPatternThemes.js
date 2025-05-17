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
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    FormatPaint as FormatPaintIcon,
    Pattern as PatternIcon,
} from '@mui/icons-material';
import axios from 'axios';

const gradientTypes = [
    { value: 'linear', label: 'Lineal' },
    { value: 'radial', label: 'Radial' },
    { value: 'conic', label: 'Cónico' },
];

const patternTypes = [
    { value: 'dots', label: 'Puntos' },
    { value: 'lines', label: 'Líneas' },
    { value: 'waves', label: 'Olas' },
    { value: 'hexagons', label: 'Hexágonos' },
];

const GradientPatternThemes = ({ userId, onThemeChange }) => {
    const [open, setOpen] = useState(false);
    const [themes, setThemes] = useState([]);
    const [newTheme, setNewTheme] = useState({
        nombre: '',
        tipo: 'personalizado',
        gradiente: {
            tipo: 'linear',
            color1: '#1976d2',
            color2: '#dc004e',
            angulo: 45,
        },
        patron: {
            tipo: 'dots',
            tamano: 10,
            color: '#ffffff',
            espaciado: 20,
        },
        opacidad: 1,
        modoOscuro: false,
        personalizado: true,
    });
    const [editingTheme, setEditingTheme] = useState(null);
    const [error, setError] = useState('');

    const fetchThemes = async () => {
        try {
            const response = await axios.get(`/api/users/${userId}/themes/gradient-pattern`);
            setThemes(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar temas con gradientes y patrones');
        }
    };

    const handleAddTheme = async () => {
        if (!newTheme.nombre.trim()) {
            setError('El nombre del tema no puede estar vacío');
            return;
        }

        try {
            await axios.post(`/api/users/${userId}/themes/gradient-pattern`, newTheme);
            setNewTheme({
                nombre: '',
                tipo: 'personalizado',
                gradiente: {
                    tipo: 'linear',
                    color1: '#1976d2',
                    color2: '#dc004e',
                    angulo: 45,
                },
                patron: {
                    tipo: 'dots',
                    tamano: 10,
                    color: '#ffffff',
                    espaciado: 20,
                },
                opacidad: 1,
                modoOscuro: false,
                personalizado: true,
            });
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar tema con gradientes y patrones');
        }
    };

    const handleEditTheme = async (themeId, newTheme) => {
        try {
            await axios.patch(`/api/users/${userId}/themes/gradient-pattern/${themeId}`, newTheme);
            setEditingTheme(null);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar tema con gradientes y patrones');
        }
    };

    const handleDeleteTheme = async (themeId) => {
        try {
            await axios.delete(`/api/users/${userId}/themes/gradient-pattern/${themeId}`);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar tema con gradientes y patrones');
        }
    };

    useEffect(() => {
        fetchThemes();
    }, [userId]);

    const getGradientStyle = (gradient) => {
        if (gradient.tipo === 'linear') {
            return `linear-gradient(${gradient.angulo}deg, ${gradient.color1}, ${gradient.color2})`;
        }
        if (gradient.tipo === 'radial') {
            return `radial-gradient(circle, ${gradient.color1}, ${gradient.color2})`;
        }
        if (gradient.tipo === 'conic') {
            return `conic-gradient(from ${gradient.angulo}deg, ${gradient.color1}, ${gradient.color2})`;
        }
        return '';
    };

    const getPatternStyle = (pattern) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = pattern.espaciado;
        canvas.height = pattern.espaciado;

        ctx.fillStyle = pattern.color;
        if (pattern.tipo === 'dots') {
            ctx.beginPath();
            ctx.arc(pattern.espaciado / 2, pattern.espaciado / 2, pattern.tamano / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (pattern.tipo === 'lines') {
            ctx.fillRect(0, 0, pattern.tamano, pattern.espaciado);
        } else if (pattern.tipo === 'waves') {
            ctx.beginPath();
            ctx.moveTo(0, pattern.espaciado / 2);
            ctx.bezierCurveTo(
                pattern.espaciado / 2, pattern.espaciado / 4,
                pattern.espaciado / 2, 3 * pattern.espaciado / 4,
                pattern.espaciado, pattern.espaciado / 2
            );
            ctx.fill();
        } else if (pattern.tipo === 'hexagons') {
            const size = pattern.tamano;
            ctx.beginPath();
            ctx.moveTo(size, 0);
            ctx.lineTo(size * 1.5, size * 0.866);
            ctx.lineTo(size * 1.5, size * 2.598);
            ctx.lineTo(size, size * 3.464);
            ctx.lineTo(0, size * 2.598);
            ctx.lineTo(0, size * 0.866);
            ctx.closePath();
            ctx.fill();
        }

        return ctx.createPattern(canvas, 'repeat');
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<FormatPaintIcon />}
                onClick={() => setOpen(true)}
            >
                Temas con Gradientes y Patrones
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Temas Personalizados con Gradientes y Patrones</DialogTitle>
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

                        <Grid container spacing={3} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Gradiente
                                    </Typography>

                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel>Tipo de gradiente</InputLabel>
                                        <Select
                                            value={newTheme.gradiente.tipo}
                                            onChange={(e) => setNewTheme(prev => ({
                                                ...prev,
                                                gradiente: {
                                                    ...prev.gradiente,
                                                    tipo: e.target.value,
                                                },
                                            }))}
                                        >
                                            {gradientTypes.map((type) => (
                                                <MenuItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <TextField
                                            label="Color 1"
                                            type="color"
                                            value={newTheme.gradiente.color1}
                                            onChange={(e) => setNewTheme(prev => ({
                                                ...prev,
                                                gradiente: {
                                                    ...prev.gradiente,
                                                    color1: e.target.value,
                                                },
                                            }))}
                                            sx={{ flex: 1 }}
                                        />
                                        <TextField
                                            label="Color 2"
                                            type="color"
                                            value={newTheme.gradiente.color2}
                                            onChange={(e) => setNewTheme(prev => ({
                                                ...prev,
                                                gradiente: {
                                                    ...prev.gradiente,
                                                    color2: e.target.value,
                                                },
                                            }))}
                                            sx={{ flex: 1 }}
                                        />
                                    </Box>

                                    {newTheme.gradiente.tipo === 'linear' && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Typography sx={{ mr: 2 }}>Ángulo:</Typography>
                                            <Slider
                                                value={newTheme.gradiente.angulo}
                                                onChange={(e, newValue) => setNewTheme(prev => ({
                                                    ...prev,
                                                    gradiente: {
                                                        ...prev.gradiente,
                                                        angulo: newValue,
                                                    },
                                                }))}
                                                min={0}
                                                max={360}
                                                valueLabelDisplay="auto"
                                            />
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Patrón
                                    </Typography>

                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel>Tipo de patrón</InputLabel>
                                        <Select
                                            value={newTheme.patron.tipo}
                                            onChange={(e) => setNewTheme(prev => ({
                                                ...prev,
                                                patron: {
                                                    ...prev.patron,
                                                    tipo: e.target.value,
                                                },
                                            }))}
                                        >
                                            {patternTypes.map((type) => (
                                                <MenuItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <TextField
                                            label="Tamaño"
                                            type="number"
                                            value={newTheme.patron.tamano}
                                            onChange={(e) => setNewTheme(prev => ({
                                                ...prev,
                                                patron: {
                                                    ...prev.patron,
                                                    tamano: parseInt(e.target.value) || 0,
                                                },
                                            }))}
                                            sx={{ flex: 1 }}
                                        />
                                        <TextField
                                            label="Espaciado"
                                            type="number"
                                            value={newTheme.patron.espaciado}
                                            onChange={(e) => setNewTheme(prev => ({
                                                ...prev,
                                                patron: {
                                                    ...prev.patron,
                                                    espaciado: parseInt(e.target.value) || 0,
                                                },
                                            }))}
                                            sx={{ flex: 1 }}
                                        />
                                    </Box>

                                    <TextField
                                        label="Color del patrón"
                                        type="color"
                                        value={newTheme.patron.color}
                                        onChange={(e) => setNewTheme(prev => ({
                                            ...prev,
                                            patron: {
                                                ...prev.patron,
                                                color: e.target.value,
                                            },
                                        }))}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddTheme}
                        >
                            Agregar tema con gradiente y patrón
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
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        background: getGradientStyle(theme.gradiente),
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: 'cover',
                                                        opacity: theme.opacidad,
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        background: getPatternStyle(theme.patron),
                                                        opacity: theme.opacidad,
                                                    }}
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

export default GradientPatternThemes;
