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
    CircularProgress,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    FormatQuote as FormatQuoteIcon,
    FilterBAndW as FilterBAndWIcon,
    FilterNone as FilterNoneIcon,
} from '@mui/icons-material';

const effectsOptions = [
    { value: 'none', label: 'Sin efecto' },
    { value: 'blur', label: 'Desenfoque' },
    { value: 'grayscale', label: 'Escala de grises' },
    { value: 'brightness', label: 'Brillo' },
    { value: 'contrast', label: 'Contraste' },
];

const AnimatedMessageStickersWithEffects = ({ message, onStickerAdd, onStickerRemove }) => {
    const [open, setOpen] = useState(false);
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedEffect, setSelectedEffect] = useState('none');
    const [effectValue, setEffectValue] = useState(0);

    const fetchStickers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stickers/animated/message/effects');
            setStickers(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar stickers animados con efectos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStickers();
    }, []);

    const handleStickerAdd = async (sticker) => {
        try {
            setLoading(true);
            const stickerData = {
                stickerId: sticker._id,
                efecto: selectedEffect,
                valorEfecto: effectValue,
            };
            await axios.post(`/api/messages/${message._id}/stickers`, stickerData);
            onStickerAdd({
                ...sticker,
                efecto: selectedEffect,
                valorEfecto: effectValue,
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar sticker al mensaje');
        } finally {
            setLoading(false);
        }
    };

    const handleStickerRemove = async (stickerId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/messages/${message._id}/stickers/${stickerId}`);
            onStickerRemove(stickerId);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar sticker del mensaje');
        } finally {
            setLoading(false);
        }
    };

    const getEffectStyle = (effect, value) => {
        if (effect === 'blur') {
            return `blur(${value}px)`;
        }
        if (effect === 'grayscale') {
            return `grayscale(${value}%)`;
        }
        if (effect === 'brightness') {
            return `brightness(${value}%)`;
        }
        if (effect === 'contrast') {
            return `contrast(${value}%)`;
        }
        return '';
    };

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <FormatQuoteIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Stickers Animados con Efectos</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Efecto</InputLabel>
                            <Select
                                value={selectedEffect}
                                onChange={(e) => {
                                    setSelectedEffect(e.target.value);
                                    setEffectValue(0);
                                }}
                            >
                                {effectsOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {selectedEffect !== 'none' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Slider
                                    value={effectValue}
                                    onChange={(e, newValue) => setEffectValue(newValue)}
                                    min={0}
                                    max={selectedEffect === 'blur' ? 10 : 100}
                                    step={selectedEffect === 'blur' ? 1 : 1}
                                    valueLabelDisplay="auto"
                                />
                                <Chip
                                    label={`${effectValue}${selectedEffect === 'blur' ? 'px' : '%'}`}
                                    sx={{ ml: 2 }}
                                />
                            </Box>
                        )}

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <List>
                                {stickers.map((sticker) => (
                                    <ListItem
                                        key={sticker._id}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                color="error"
                                                onClick={() => handleStickerRemove(sticker._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <video
                                            src={sticker.url}
                                            autoPlay
                                            loop
                                            muted
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'contain',
                                                marginRight: '8px',
                                                filter: getEffectStyle(selectedEffect, effectValue),
                                            }}
                                        />
                                        <ListItemText
                                            primary={sticker.nombre}
                                            secondary={sticker.descripcion}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleStickerAdd(sticker)}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AnimatedMessageStickersWithEffects;
