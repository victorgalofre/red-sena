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
    ThreeDRotation as ThreeDRotationIcon,
    Layers as LayersIcon,
} from '@mui/icons-material';
import axios from 'axios';

const threeDEffects = [
    { value: 'perspective', label: 'Perspectiva' },
    { value: 'rotate3d', label: 'Rotación 3D' },
    { value: 'scale3d', label: 'Escala 3D' },
    { value: 'translate3d', label: 'Traducción 3D' },
    { value: 'skew3d', label: 'Inclinación 3D' },
];

const ThreeDTheme = ({ userId, onThemeChange }) => {
    const [open, setOpen] = useState(false);
    const [themes, setThemes] = useState([]);
    const [newTheme, setNewTheme] = useState({
        nombre: '',
        tipo: '3d',
        efecto3d: {
            tipo: 'perspective',
            perspectiva: 1000,
            anguloX: 0,
            anguloY: 0,
            escalaX: 1,
            escalaY: 1,
            escalaZ: 1,
            traduccionX: 0,
            traduccionY: 0,
            traduccionZ: 0,
            inclinacionX: 0,
            inclinacionY: 0,
        },
        sombras: {
            color: '#000000',
            desenfoque: 10,
            desplazamientoX: 0,
            desplazamientoY: 0,
            opacidad: 0.5,
        },
        iluminacion: {
            intensidad: 0.5,
            color: '#ffffff',
            angulo: 45,
        },
        personalizado: true,
    });
    const [editingTheme, setEditingTheme] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchThemes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/users/${userId}/themes/3d`);
            setThemes(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar temas 3D');
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
            await axios.post(`/api/users/${userId}/themes/3d`, newTheme);
            setNewTheme({
                nombre: '',
                tipo: '3d',
                efecto3d: {
                    tipo: 'perspective',
                    perspectiva: 1000,
                    anguloX: 0,
                    anguloY: 0,
                    escalaX: 1,
                    escalaY: 1,
                    escalaZ: 1,
                    traduccionX: 0,
                    traduccionY: 0,
                    traduccionZ: 0,
                    inclinacionX: 0,
                    inclinacionY: 0,
                },
                sombras: {
                    color: '#000000',
                    desenfoque: 10,
                    desplazamientoX: 0,
                    desplazamientoY: 0,
                    opacidad: 0.5,
                },
                iluminacion: {
                    intensidad: 0.5,
                    color: '#ffffff',
                    angulo: 45,
                },
                personalizado: true,
            });
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar tema 3D');
        } finally {
            setLoading(false);
        }
    };

    const handleEditTheme = async (themeId, newTheme) => {
        try {
            setLoading(true);
            await axios.patch(`/api/users/${userId}/themes/3d/${themeId}`, newTheme);
            setEditingTheme(null);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar tema 3D');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTheme = async (themeId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/users/${userId}/themes/3d/${themeId}`);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar tema 3D');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThemes();
    }, [userId]);

    const get3DEffectStyle = (effect) => {
        const transform = [];

        if (effect.tipo === 'perspective') {
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

        if (effect.inclinacionX || effect.inclinacionY) {
            transform.push(`skew3d(${effect.inclinacionX}deg, ${effect.inclinacionY}deg)`);
        }

        return {
            transform: transform.join(' '),
            transformStyle: 'preserve-3d',
            transition: 'all 0.3s ease',
        };
    };

    const getShadowStyle = (shadows) => {
        return {
            boxShadow: `${shadows.desplazamientoX}px ${shadows.desplazamientoY}px ${shadows.desenfoque}px ${shadows.opacidad} ${shadows.color}`,
        };
    };

    const getLightingStyle = (lighting) => {
        return {
            filter: `drop-shadow(${lighting.angulo}deg ${lighting.intensidad}px ${lighting.color})`,
        };
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<FormatPaintIcon />}
                onClick={() => setOpen(true)}
            >
                Temas 3D
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Temas Personalizados con Efectos 3D</DialogTitle>
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
                                Efecto 3D
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Tipo de efecto 3D</InputLabel>
                                <Select
                                    value={newTheme.efecto3d.tipo}
                                    onChange={(e) => setNewTheme(prev => ({
                                        ...prev,
                                        efecto3d: {
                                            ...prev.efecto3d,
                                            tipo: e.target.value,
                                        },
                                    }))}
                                >
                                    {threeDEffects.map((effect) => (
                                        <MenuItem key={effect.value} value={effect.value}>
                                            <ThreeDRotationIcon sx={{ mr: 1 }} />
                                            {effect.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Perspectiva
                                    </Typography>
                                    <Slider
                                        value={newTheme.efecto3d.perspectiva}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
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
                                        value={newTheme.efecto3d.anguloX}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
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
                                        value={newTheme.efecto3d.anguloY}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
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
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Sombras
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Color"
                                        type="color"
                                        value={newTheme.sombras.color}
                                        onChange={(e) => setNewTheme(prev => ({
                                            ...prev,
                                            sombras: {
                                                ...prev.sombras,
                                                color: e.target.value,
                                            },
                                        }))}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Desenfoque
                                    </Typography>
                                    <Slider
                                        value={newTheme.sombras.desenfoque}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            sombras: {
                                                ...prev.sombras,
                                                desenfoque: newValue,
                                            },
                                        }))}
                                        min={0}
                                        max={50}
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Desplazamiento X
                                    </Typography>
                                    <Slider
                                        value={newTheme.sombras.desplazamientoX}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            sombras: {
                                                ...prev.sombras,
                                                desplazamientoX: newValue,
                                            },
                                        }))}
                                        min={-50}
                                        max={50}
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Desplazamiento Y
                                    </Typography>
                                    <Slider
                                        value={newTheme.sombras.desplazamientoY}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            sombras: {
                                                ...prev.sombras,
                                                desplazamientoY: newValue,
                                            },
                                        }))}
                                        min={-50}
                                        max={50}
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Iluminación
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Color"
                                        type="color"
                                        value={newTheme.iluminacion.color}
                                        onChange={(e) => setNewTheme(prev => ({
                                            ...prev,
                                            iluminacion: {
                                                ...prev.iluminacion,
                                                color: e.target.value,
                                            },
                                        }))}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Intensidad
                                    </Typography>
                                    <Slider
                                        value={newTheme.iluminacion.intensidad}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            iluminacion: {
                                                ...prev.iluminacion,
                                                intensidad: newValue,
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
                                        Ángulo
                                    </Typography>
                                    <Slider
                                        value={newTheme.iluminacion.angulo}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            iluminacion: {
                                                ...prev.iluminacion,
                                                angulo: newValue,
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
                                                        ...get3DEffectStyle(theme.efecto3d),
                                                        ...getShadowStyle(theme.sombras),
                                                        ...getLightingStyle(theme.iluminacion),
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
                                                    3D
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2">
                                                        Perspectiva: {theme.efecto3d.perspectiva}px
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Intensidad: {theme.iluminacion.intensidad}
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

export default ThreeDTheme;
