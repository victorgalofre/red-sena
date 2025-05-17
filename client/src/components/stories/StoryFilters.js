import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
} from '@mui/material';
import {
    FilterList as FilterListIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

const filters = [
    { id: 'blur', label: 'Desenfoque', value: 0 },
    { id: 'brightness', label: 'Brillo', value: 1 },
    { id: 'contrast', label: 'Contraste', value: 1 },
    { id: 'grayscale', label: 'Escala de grises', value: 0 },
    { id: 'hue-rotate', label: 'Rotación de tono', value: 0 },
    { id: 'invert', label: 'Invertir colores', value: 0 },
    { id: 'opacity', label: 'Opacidad', value: 1 },
    { id: 'saturate', label: 'Saturación', value: 1 },
    { id: 'sepia', label: 'Sepia', value: 0 },
];

const StoryFilters = ({ story }) => {
    const [open, setOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        // Inicializar filtros con valores por defecto
        const initialFilters = {};
        filters.forEach(filter => {
            initialFilters[filter.id] = filter.value;
        });
        setSelectedFilters(initialFilters);
    }, []);

    const handleFilterChange = (filterId, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterId]: value,
        }));
    };

    const applyFilters = (image) => {
        const filtersArray = [];
        
        filters.forEach(filter => {
            const value = selectedFilters[filter.id];
            if (value !== filter.value) {
                if (filter.id === 'blur') {
                    filtersArray.push(`blur(${value}px)`);
                } else if (filter.id === 'grayscale') {
                    filtersArray.push(`grayscale(${value * 100}%)`);
                } else if (filter.id === 'invert') {
                    filtersArray.push(`invert(${value * 100}%)`);
                } else if (filter.id === 'sepia') {
                    filtersArray.push(`sepia(${value * 100}%)`);
                } else {
                    filtersArray.push(`${filter.id}(${value})`);
                }
            }
        });

        return filtersArray.join(' ');
    };

    const handleApplyFilters = async () => {
        try {
            const response = await axios.post('/api/stories/filters', {
                storyId: story._id,
                filters: selectedFilters,
            });
            // Actualizar la historia con los filtros aplicados
            const updatedStory = { ...story, ...response.data };
            // Aquí iría la lógica para actualizar la UI
        } catch (err) {
            setError(err.response?.data?.error || 'Error al aplicar filtros');
        }
    };

    return (
        <>
            <IconButton
                color="primary"
                onClick={() => setOpen(true)}
                title="Filtros"
            >
                <FilterListIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Filtros para historia</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {filters.map(filter => (
                            <Box key={filter.id} sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    {filter.label}
                                </Typography>
                                <Slider
                                    value={selectedFilters[filter.id]}
                                    onChange={(e, newValue) => handleFilterChange(filter.id, newValue)}
                                    valueLabelDisplay="auto"
                                    min={filter.id === 'grayscale' || filter.id === 'invert' || filter.id === 'sepia' ? 0 : 0}
                                    max={filter.id === 'grayscale' || filter.id === 'invert' || filter.id === 'sepia' ? 1 : 100}
                                    step={filter.id === 'grayscale' || filter.id === 'invert' || filter.id === 'sepia' ? 0.1 : 1}
                                />
                            </Box>
                        ))}
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyFilters}
                    >
                        Aplicar filtros
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StoryFilters;
