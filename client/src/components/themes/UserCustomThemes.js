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
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';

const UserCustomThemes = ({ userId, onThemeChange }) => {
    const [open, setOpen] = useState(false);
    const [themes, setThemes] = useState([]);
    const [newTheme, setNewTheme] = useState({
        nombre: '',
        tipo: 'personalizado',
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
            const response = await axios.get(`/api/users/${userId}/themes`);
            setThemes(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar temas personalizados del usuario');
        }
    };

    const handleAddTheme = async () => {
        if (!newTheme.nombre.trim()) {
            setError('El nombre del tema no puede estar vacío');
            return;
        }

        try {
            await axios.post(`/api/users/${userId}/themes`, newTheme);
            setNewTheme({
                nombre: '',
                tipo: 'personalizado',
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
            setError(err.response?.data?.error || 'Error al agregar tema personalizado del usuario');
        }
    };

    const handleEditTheme = async (themeId, newTheme) => {
        try {
            await axios.patch(`/api/users/${userId}/themes/${themeId}`, newTheme);
            setEditingTheme(null);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar tema personalizado del usuario');
        }
    };

    const handleDeleteTheme = async (themeId) => {
        try {
            await axios.delete(`/api/users/${userId}/themes/${themeId}`);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar tema personalizado del usuario');
        }
    };

    useEffect(() => {
        fetchThemes();
    }, [userId]);

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={() => setOpen(true)}
            >
                Temas Personalizados
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Temas Personalizados del Usuario</DialogTitle>
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

                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Colores
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddTheme}
                        >
                            Agregar tema personalizado
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
                                        secondary={theme.tipo}
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

export default UserCustomThemes;
