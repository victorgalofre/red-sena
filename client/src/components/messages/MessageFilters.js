import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    IconButton,
    Divider,
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
];

const MessageFilters = ({ message, onFilterApply }) => {
    const [open, setOpen] = useState(false);
    const [currentFilters, setCurrentFilters] = useState({
        blur: 0,
        brightness: 1,
        contrast: 1,
        grayscale: 0,
        'hue-rotate': 0,
        invert: 0,
        opacity: 1,
        saturate: 1,
    });

    const handleFilterChange = (filterId, value) => {
        setCurrentFilters(prev => ({
            ...prev,
            [filterId]: value,
        }));
    };

    const applyFilters = (text) => {
        const style = {
            filter: filters.map(filter => {
                if (filter.id === 'grayscale' || filter.id === 'invert') {
                    return `${filter.id}(${currentFilters[filter.id] * 100}%)`;
                }
                return `${filter.id}(${currentFilters[filter.id]})`;
            }).join(' '),
        };
        return {
            text,
            style,
        };
    };

    const handleApply = () => {
        const filteredMessage = applyFilters(message.contenido);
        onFilterApply(filteredMessage);
        setOpen(false);
    };

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <FilterListIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Filtros del mensaje</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {filters.map((filter) => (
                            <Box key={filter.id} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    {filter.label}
                                </Typography>
                                <Slider
                                    value={currentFilters[filter.id]}
                                    onChange={(e, newValue) => handleFilterChange(filter.id, newValue)}
                                    min={filter.id === 'grayscale' || filter.id === 'invert' ? 0 : filter.min || 0}
                                    max={filter.id === 'grayscale' || filter.id === 'invert' ? 1 : filter.max || 100}
                                    step={filter.id === 'grayscale' || filter.id === 'invert' ? 0.01 : 1}
                                    valueLabelDisplay="auto"
                                />
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApply}
                    >
                        Aplicar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MessageFilters;
