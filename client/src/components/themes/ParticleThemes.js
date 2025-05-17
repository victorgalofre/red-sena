import React, { useState, useEffect, useRef } from 'react';
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
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    FormatPaint as FormatPaintIcon,
    Particle as ParticleIcon,
    ColorLens as ColorLensIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Particles from 'react-particles-js';

const particleEffects = [
    { value: 'rain', label: 'Lluvia' },
    { value: 'snow', label: 'Nieve' },
    { value: 'fireworks', label: 'Fuegos artificiales' },
    { value: 'confetti', label: 'Confeti' },
    { value: 'bubble', label: 'Burbujas' },
    { value: 'stars', label: 'Estrellas' },
];

const ParticleTheme = ({ userId, onThemeChange }) => {
    const [open, setOpen] = useState(false);
    const [themes, setThemes] = useState([]);
    const [newTheme, setNewTheme] = useState({
        nombre: '',
        tipo: 'particles',
        efecto: 'rain',
        propiedades: {
            color: '#ffffff',
            cantidad: 100,
            tamano: 5,
            velocidad: 2,
            opacidad: 0.5,
            forma: 'circle',
            interaccion: true,
            atractivo: true,
            repulsion: true,
            lineas: true,
        },
        personalizado: true,
    });
    const [editingTheme, setEditingTheme] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const previewRef = useRef(null);

    const fetchThemes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/users/${userId}/themes/particles`);
            setThemes(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar temas con efectos de partículas');
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
            await axios.post(`/api/users/${userId}/themes/particles`, newTheme);
            setNewTheme({
                nombre: '',
                tipo: 'particles',
                efecto: 'rain',
                propiedades: {
                    color: '#ffffff',
                    cantidad: 100,
                    tamano: 5,
                    velocidad: 2,
                    opacidad: 0.5,
                    forma: 'circle',
                    interaccion: true,
                    atractivo: true,
                    repulsion: true,
                    lineas: true,
                },
                personalizado: true,
            });
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar tema con efectos de partículas');
        } finally {
            setLoading(false);
        }
    };

    const handleEditTheme = async (themeId, newTheme) => {
        try {
            setLoading(true);
            await axios.patch(`/api/users/${userId}/themes/particles/${themeId}`, newTheme);
            setEditingTheme(null);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar tema con efectos de partículas');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTheme = async (themeId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/users/${userId}/themes/particles/${themeId}`);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar tema con efectos de partículas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThemes();
    }, [userId]);

    const getParticleStyle = (properties) => {
        return {
            particles: {
                number: {
                    value: properties.cantidad,
                },
                size: {
                    value: properties.tamano,
                },
                color: {
                    value: properties.color,
                },
                opacity: {
                    value: properties.opacidad,
                },
                move: {
                    speed: properties.velocidad,
                    enable: true,
                },
                shape: {
                    type: properties.forma,
                },
                line_linked: {
                    enable: properties.lineas,
                },
                interactivity: {
                    events: {
                        onhover: {
                            enable: properties.interaccion,
                            mode: 'grab',
                        },
                        onclick: {
                            enable: true,
                            mode: properties.atractivo ? 'attract' : 'repulse',
                        },
                    },
                },
            },
        };
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<FormatPaintIcon />}
                onClick={() => setOpen(true)}
            >
                Temas con Efectos de Partículas
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Temas Personalizados con Efectos de Partículas</DialogTitle>
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

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Efecto de Partículas</InputLabel>
                            <Select
                                value={newTheme.efecto}
                                onChange={(e) => setNewTheme(prev => ({
                                    ...prev,
                                    efecto: e.target.value,
                                }))}
                            >
                                {particleEffects.map((effect) => (
                                    <MenuItem key={effect.value} value={effect.value}>
                                        <ParticleIcon sx={{ mr: 1 }} />
                                        {effect.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Color
                                </Typography>
                                <TextField
                                    type="color"
                                    value={newTheme.propiedades.color}
                                    onChange={(e) => setNewTheme(prev => ({
                                        ...prev,
                                        propiedades: {
                                            ...prev.propiedades,
                                            color: e.target.value,
                                        },
                                    }))}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Cantidad
                                </Typography>
                                <Slider
                                    value={newTheme.propiedades.cantidad}
                                    onChange={(e, newValue) => setNewTheme(prev => ({
                                        ...prev,
                                        propiedades: {
                                            ...prev.propiedades,
                                            cantidad: newValue,
                                        },
                                    }))}
                                    min={1}
                                    max={500}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Tamaño
                                </Typography>
                                <Slider
                                    value={newTheme.propiedades.tamano}
                                    onChange={(e, newValue) => setNewTheme(prev => ({
                                        ...prev,
                                        propiedades: {
                                            ...prev.propiedades,
                                            tamano: newValue,
                                        },
                                    }))}
                                    min={1}
                                    max={100}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Velocidad
                                </Typography>
                                <Slider
                                    value={newTheme.propiedades.velocidad}
                                    onChange={(e, newValue) => setNewTheme(prev => ({
                                        ...prev,
                                        propiedades: {
                                            ...prev.propiedades,
                                            velocidad: newValue,
                                        },
                                    }))}
                                    min={0.1}
                                    max={5}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Opacidad
                                </Typography>
                                <Slider
                                    value={newTheme.propiedades.opacidad}
                                    onChange={(e, newValue) => setNewTheme(prev => ({
                                        ...prev,
                                        propiedades: {
                                            ...prev.propiedades,
                                            opacidad: newValue,
                                        },
                                    }))}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Forma</InputLabel>
                                    <Select
                                        value={newTheme.propiedades.forma}
                                        onChange={(e) => setNewTheme(prev => ({
                                            ...prev,
                                            propiedades: {
                                                ...prev.propiedades,
                                                forma: e.target.value,
                                            },
                                        }))}
                                    >
                                        <MenuItem value="circle">Círculo</MenuItem>
                                        <MenuItem value="square">Cuadrado</MenuItem>
                                        <MenuItem value="triangle">Triángulo</MenuItem>
                                        <MenuItem value="star">Estrella</MenuItem>
                                        <MenuItem value="polygon">Polígono</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Switch
                                checked={newTheme.propiedades.interaccion}
                                onChange={(e) => setNewTheme(prev => ({
                                    ...prev,
                                    propiedades: {
                                        ...prev.propiedades,
                                        interaccion: e.target.checked,
                                    },
                                }))}
                            />
                            <Typography>Interacción</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Switch
                                checked={newTheme.propiedades.atractivo}
                                onChange={(e) => setNewTheme(prev => ({
                                    ...prev,
                                    propiedades: {
                                        ...prev.propiedades,
                                        atractivo: e.target.checked,
                                    },
                                }))}
                            />
                            <Typography>Atracción</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Switch
                                checked={newTheme.propiedades.repulsion}
                                onChange={(e) => setNewTheme(prev => ({
                                    ...prev,
                                    propiedades: {
                                        ...prev.propiedades,
                                        repulsion: e.target.checked,
                                    },
                                }))}
                            />
                            <Typography>Repulsión</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Switch
                                checked={newTheme.propiedades.lineas}
                                onChange={(e) => setNewTheme(prev => ({
                                    ...prev,
                                    propiedades: {
                                        ...prev.propiedades,
                                        lineas: e.target.checked,
                                    },
                                }))}
                            />
                            <Typography>Líneas entre partículas</Typography>
                        </Box>

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

                        <Box sx={{ mt: 2, position: 'relative', height: 200 }}>
                            <Particles
                                params={getParticleStyle(newTheme.propiedades)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </Box>

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
                                                        width: 50,
                                                        height: 50,
                                                        backgroundColor: theme.propiedades.color,
                                                        borderRadius: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <ParticleIcon sx={{ color: 'white' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2">
                                                        Efecto: {theme.efecto}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Cantidad: {theme.propiedades.cantidad}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Velocidad: {theme.propiedades.velocidad}
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

export default ParticleTheme;
