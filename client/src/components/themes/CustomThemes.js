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
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    FormatColorFill as FormatColorFillIcon,
} from '@mui/icons-material';
import axios from 'axios';

const themeOptions = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
    { value: 'custom', label: 'Personalizado' },
];

const CustomThemes = ({ onThemeChange }) => {
    const [open, setOpen] = useState(false);
    const [themes, setThemes] = useState([]);
    const [newTheme, setNewTheme] = useState({
        nombre: '',
        tipo: 'custom',
        colores: {
            primary: '#1976d2',
            secondary: '#dc004e',
            background: '#ffffff',
            text: '#000000',
            contrastThreshold: 3,
            tonalOffset: 0.2,
        },
        opacidad: 1,
    });
    const [editingTheme, setEditingTheme] = useState(null);
    const [error, setError] = useState('');

    const fetchThemes = async () => {
        try {
            const response = await axios.get('/api/themes/custom');
            setThemes(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar temas personalizados');
        }
    };

    const handleAddTheme = async () => {
        if (!newTheme.nombre.trim()) {
            setError('El nombre del tema no puede estar vacío');
            return;
        }

        try {
            await axios.post('/api/themes/custom', newTheme);
            setNewTheme({
                nombre: '',
                tipo: 'custom',
                colores: {
                    primary: '#1976d2',
                    secondary: '#dc004e',
                    background: '#ffffff',
                    text: '#000000',
                    contrastThreshold: 3,
                    tonalOffset: 0.2,
                },
                opacidad: 1,
            });
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar tema personalizado');
        }
    };

    const handleEditTheme = async (themeId, newTheme) => {
        try {
            await axios.patch(`/api/themes/custom/${themeId}`, newTheme);
            setEditingTheme(null);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar tema personalizado');
        }
    };

    const handleDeleteTheme = async (themeId) => {
        try {
            await axios.delete(`/api/themes/custom/${themeId}`);
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar tema personalizado');
        }
    };

    useEffect(() => {
        fetchThemes();
    }, []);

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<FormatColorFillIcon />}
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
                <DialogTitle>Temas Personalizados</DialogTitle>
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
                            <InputLabel>Tipo de tema</InputLabel>
                            <Select
                                value={newTheme.tipo}
                                onChange={(e) => setNewTheme(prev => ({
                                    ...prev,
                                    tipo: e.target.value,
                                }))}
                            >
                                {themeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

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

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddTheme}
                        >
                            Agregar tema
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

export default CustomThemes;
