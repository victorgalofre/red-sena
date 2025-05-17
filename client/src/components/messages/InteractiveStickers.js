import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    Grid,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    FormatQuote as FormatQuoteIcon,
    TouchApp as TouchAppIcon,
    Fingerprint as FingerprintIcon,
} from '@mui/icons-material';

const touchInteractions = [
    { value: 'tap', label: 'Toque' },
    { value: 'doubleTap', label: 'Doble toque' },
    { value: 'longPress', label: 'Pulso largo' },
    { value: 'swipe', label: 'Deslizar' },
    { value: 'pinch', label: 'Pellizco' },
];

const InteractiveStickers = ({ message, onStickerAdd, onStickerRemove }) => {
    const [open, setOpen] = useState(false);
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedInteraction, setSelectedInteraction] = useState('tap');
    const [interactionValue, setInteractionValue] = useState(1);
    const [interactionSpeed, setInteractionSpeed] = useState(1);
    const [touchArea, setTouchArea] = useState({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
    });
    const containerRef = useRef(null);

    const fetchStickers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stickers/interactive');
            setStickers(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar stickers interactivos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStickers();
    }, []);

    const handleTouchStart = useCallback((e) => {
        const touch = e.touches[0];
        setTouchArea({
            x: touch.clientX,
            y: touch.clientY,
            width: 100,
            height: 100,
        });
    }, []);

    const handleTouchMove = useCallback((e) => {
        const touch = e.touches[0];
        setTouchArea((prev) => ({
            ...prev,
            x: touch.clientX,
            y: touch.clientY,
        }));
    }, []);

    const handleTouchEnd = useCallback(() => {
        setTouchArea({
            x: 0,
            y: 0,
            width: 100,
            height: 100,
        });
    }, []);

    const handleStickerAdd = async (sticker) => {
        try {
            setLoading(true);
            const stickerData = {
                stickerId: sticker._id,
                interaccion: selectedInteraction,
                valorInteraccion: interactionValue,
                velocidadInteraccion: interactionSpeed,
                areaTactil: touchArea,
            };
            await axios.post(`/api/messages/${message._id}/stickers/interactive`, stickerData);
            onStickerAdd({
                ...sticker,
                interaccion: selectedInteraction,
                valorInteraccion: interactionValue,
                velocidadInteraccion: interactionSpeed,
                areaTactil: touchArea,
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar sticker interactivo');
        } finally {
            setLoading(false);
        }
    };

    const handleStickerRemove = async (stickerId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/messages/${message._id}/stickers/interactive/${stickerId}`);
            onStickerRemove(stickerId);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar sticker interactivo');
        } finally {
            setLoading(false);
        }
    };

    const getInteractionStyle = (interaction, value, speed) => {
        const baseStyle = {
            transition: `all ${speed}s ease-in-out`,
        };

        if (interaction === 'tap') {
            return {
                ...baseStyle,
                transform: `scale(${value})`,
            };
        }

        if (interaction === 'doubleTap') {
            return {
                ...baseStyle,
                animation: `bounce ${speed}s infinite`,
            };
        }

        if (interaction === 'longPress') {
            return {
                ...baseStyle,
                opacity: value,
            };
        }

        if (interaction === 'swipe') {
            return {
                ...baseStyle,
                transform: `translateX(${value * 100}px)`,
            };
        }

        if (interaction === 'pinch') {
            return {
                ...baseStyle,
                transform: `scale3d(${value}, ${value}, 1)`,
            };
        }

        return baseStyle;
    };

    const renderTouchArea = () => {
        const { x, y, width, height } = touchArea;
        return (
            <Box
                sx={{
                    position: 'absolute',
                    left: x - width / 2,
                    top: y - height / 2,
                    width,
                    height,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px dashed rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }}
            />
        );
    };

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <TouchAppIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Stickers Interactivos con Interacciones Táctiles</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Interacción táctil</InputLabel>
                            <Select
                                value={selectedInteraction}
                                onChange={(e) => {
                                    setSelectedInteraction(e.target.value);
                                    setInteractionValue(1);
                                    setInteractionSpeed(1);
                                }}
                            >
                                {touchInteractions.map((interaction) => (
                                    <MenuItem key={interaction.value} value={interaction.value}>
                                        {interaction.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Valor de la interacción
                                </Typography>
                                <Slider
                                    value={interactionValue}
                                    onChange={(e, newValue) => setInteractionValue(newValue)}
                                    min={0}
                                    max={selectedInteraction === 'tap' ? 2 : 10}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Velocidad de la interacción
                                </Typography>
                                <Slider
                                    value={interactionSpeed}
                                    onChange={(e, newValue) => setInteractionSpeed(newValue)}
                                    min={0.1}
                                    max={3}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                        </Grid>

                        <Box
                            ref={containerRef}
                            sx={{
                                width: '100%',
                                height: 300,
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                borderRadius: 1,
                                position: 'relative',
                                mb: 2,
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {renderTouchArea()}
                        </Box>

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
                                                ...getInteractionStyle(
                                                    selectedInteraction,
                                                    interactionValue,
                                                    interactionSpeed
                                                ),
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

export default InteractiveStickers;
