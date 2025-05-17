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
    Phone as PhoneIcon,
    DesktopWindows as DesktopWindowsIcon,
    Tablet as TabletIcon,
    MobileFriendly as MobileFriendlyIcon,
} from '@mui/icons-material';
import axios from 'axios';

const deviceTypes = [
    { value: 'desktop', label: 'Desktop', icon: <DesktopWindowsIcon /> },
    { value: 'tablet', label: 'Tablet', icon: <TabletIcon /> },
    { value: 'mobile', label: 'Móvil', icon: <MobileFriendlyIcon /> },
];

const DeviceCustomThemes = ({ userId, onThemeChange }) => {
    const [open, setOpen] = useState(false);
    const [themes, setThemes] = useState([]);
    const [newTheme, setNewTheme] = useState({
        nombre: '',
        tipo: 'personalizado',
        dispositivo: 'desktop',
        colores: {
            primary: '#1976d2',
            secondary: '#dc004e',
            background: '#ffffff',
            text: '#000000',
            contrastThreshold: 3,
            tonalOffset: 0.2,
        },
        opacidad: 1,
        modoOscuro: false,
        personalizado: true,
    });
    const [editingTheme, setEditingTheme] = useState(null);
    const [error, setError] = useState('');

    const fetchThemes = async () => {
        try {
            const response = await axios.get(`/api/users/${userId}/themes/device`);
            setThemes(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar temas por dispositivo');
        }
    };

    const handleAddTheme = async () => {
        if (!newTheme.nombre.trim()) {
            setError('El nombre del tema no puede estar vacío');
            return;
        }

        try {
            await axios.post(`/api/users/${userId}/themes/device`, newTheme);
            setNewTheme({
                nombre: '',
                tipo: 'personalizado',
                dispositivo: 'desktop',
                colores: {
                    primary: '#1976d2',
                    secondary: '#dc004e',
                    background: '#ffffff',
                    text: '#000000',
                    contrastThreshold: 3,
                    tonalOffset: 0.2,
                },
                opacidad: 1,
                modoOscuro: false,
                personalizado: true,
            });
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar tema por dispositivo');
        }
    };

    const handleEditTheme = async (themeId, newTheme) => {
        try {
            await axios.patch(`/api/users/${userId}/themes/device/${themeId}`, newTheme);
            setEditingTheme(null);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar tema por dispositivo');
        }
    };

    const handleDeleteTheme = async (themeId) => {
        try {
            await axios.delete(`/api/users/${userId}/themes/device/${themeId}`);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar tema por dispositivo');
        }
    };

    useEffect(() => {
        fetchThemes();
    }, [userId]);

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                onClick={() => setOpen(true)}
            >
                Temas por Dispositivo
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Temas Personalizados por Dispositivo</DialogTitle>
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
                            <InputLabel>Dispositivo</InputLabel>
                            <Select
                                value={newTheme.dispositivo}
                                onChange={(e) => setNewTheme(prev => ({
                                    ...prev,
                                    dispositivo: e.target.value,
                                }))}
                            >
                                {deviceTypes.map((device) => (
                                    <MenuItem key={device.value} value={device.value}>
                                        {device.icon}
                                        <Box sx={{ ml: 1 }}>{device.label}</Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Grid container spacing={3} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Colores
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                            label="Primario"
                                            type="color"
                                            value={newTheme.colores.primary}
                                            onChange={(e) => setNewTheme(prev => ({
                                                ...prev,
                                                colores: {
                                                    ...prev.colores,
                                                    primary: e.target.value,
                                                },
                                            }))}
                                            sx={{ flex: 1 }}
                                        />
                                        <TextField
                                            label="Secundario"
                                            type="color"
                                            value={newTheme.colores.secondary}
                                            onChange={(e) => setNewTheme(prev => ({
                                                ...prev,
                                                colores: {
                                                    ...prev.colores,
                                                    secondary: e.target.value,
                                                },
                                            }))}
                                            sx={{ flex: 1 }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                        <TextField
                                            label="Fondo"
                                            type="color"
                                            value={newTheme.colores.background}
                                            onChange={(e) => setNewTheme(prev => ({
                                                ...prev,
                                                colores: {
                                                    ...prev.colores,
                                                    background: e.target.value,
                                                },
                                            }))}
                                            sx={{ flex: 1 }}
                                        />
                                        <TextField
                                            label="Texto"
                                            type="color"
                                            value={newTheme.colores.text}
                                            onChange={(e) => setNewTheme(prev => ({
                                                ...prev,
                                                colores: {
                                                    ...prev.colores,
                                                    text: e.target.value,
                                                },
                                            }))}
                                            sx={{ flex: 1 }}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Opciones
                                    </Typography>

                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                        Opacidad
                                    </Typography>
                                    <Slider
                                        value={newTheme.opacidad}
                                        onChange={(e, newValue) => setNewTheme(prev => ({
                                            ...prev,
                                            opacidad: newValue,
                                        }))}
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        valueLabelDisplay="auto"
                                        sx={{ mb: 2 }}
                                    />

                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                        Modo
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Switch
                                            checked={newTheme.modoOscuro}
                                            onChange={(e) => setNewTheme(prev => ({
                                                ...prev,
                                                modoOscuro: e.target.checked,
                                            }))}
                                        />
                                        <Typography sx={{ ml: 1 }}>
                                            {newTheme.modoOscuro ? 'Oscuro' : 'Claro'}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddTheme}
                        >
                            Agregar tema por dispositivo
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
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {deviceTypes.find(d => d.value === theme.dispositivo)?.icon}
                                                <Box sx={{ ml: 1 }}>{theme.tipo}</Box>
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

export default DeviceCustomThemes;
