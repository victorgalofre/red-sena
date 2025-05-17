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
    CameraEnhance as CameraEnhanceIcon,
    Face as FaceIcon,
    LocationOn as LocationOnIcon,
} from '@mui/icons-material';

const AREffects = [
    { value: 'faceTracking', label: 'Seguimiento facial' },
    { value: 'objectTracking', label: 'Seguimiento de objetos' },
    { value: 'environment', label: 'Entorno' },
    { value: 'motion', label: 'Movimiento' },
    { value: 'lighting', label: 'Iluminación' },
];

const ARStickers = ({ message, onStickerAdd, onStickerRemove }) => {
    const [open, setOpen] = useState(false);
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedEffect, setSelectedEffect] = useState('faceTracking');
    const [effectValue, setEffectValue] = useState(1);
    const [effectSpeed, setEffectSpeed] = useState(1);
    const [cameraPosition, setCameraPosition] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const containerRef = useRef(null);

    const fetchStickers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stickers/ar');
            setStickers(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar stickers de realidad aumentada');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStickers();
    }, []);

    const handleCameraPosition = useCallback((e) => {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setCameraPosition(prev => ({
            ...prev,
            x,
            y,
        }));
    }, []);

    const handleStickerAdd = async (sticker) => {
        try {
            setLoading(true);
            const stickerData = {
                stickerId: sticker._id,
                efecto: selectedEffect,
                valorEfecto: effectValue,
                velocidadEfecto: effectSpeed,
                posicionCamara: cameraPosition,
            };
            await axios.post(`/api/messages/${message._id}/stickers/ar`, stickerData);
            onStickerAdd({
                ...sticker,
                efecto: selectedEffect,
                valorEfecto: effectValue,
                velocidadEfecto: effectSpeed,
                posicionCamara: cameraPosition,
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar sticker de realidad aumentada');
        } finally {
            setLoading(false);
        }
    };

    const handleStickerRemove = async (stickerId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/messages/${message._id}/stickers/ar/${stickerId}`);
            onStickerRemove(stickerId);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar sticker de realidad aumentada');
        } finally {
            setLoading(false);
        }
    };

    const getAREffectStyle = (effect, value, speed) => {
        const baseStyle = {
            transition: `all ${speed}s ease-in-out`,
            transform: `translate3d(${cameraPosition.x}px, ${cameraPosition.y}px, ${cameraPosition.z}px)`,
        };

        if (effect === 'faceTracking') {
            return {
                ...baseStyle,
                transform: `translate3d(${cameraPosition.x}px, ${cameraPosition.y}px, ${cameraPosition.z}px) scale(${value})`,
            };
        }

        if (effect === 'objectTracking') {
            return {
                ...baseStyle,
                transform: `translate3d(${cameraPosition.x}px, ${cameraPosition.y}px, ${cameraPosition.z}px) rotate3d(1, 1, 1, ${value * 360}deg)`,
            };
        }

        if (effect === 'environment') {
            return {
                ...baseStyle,
                filter: `blur(${value}px)`,
            };
        }

        if (effect === 'motion') {
            return {
                ...baseStyle,
                animation: `bounce ${speed}s infinite`,
            };
        }

        if (effect === 'lighting') {
            return {
                ...baseStyle,
                boxShadow: `0 0 ${value * 10}px rgba(255, 255, 255, ${value})`,
            };
        }

        return baseStyle;
    };

    const renderCameraPosition = () => {
        return (
            <Box
                ref={containerRef}
                sx={{
                    width: '100%',
                    height: 300,
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: 1,
                    position: 'relative',
                    mb: 2,
                    cursor: 'crosshair',
                }}
                onMouseMove={handleCameraPosition}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        left: cameraPosition.x,
                        top: cameraPosition.y,
                        width: 10,
                        height: 10,
                        backgroundColor: 'primary.main',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                    }}
                />
            </Box>
        );
    };

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <CameraEnhanceIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Stickers de Realidad Aumentada</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Efecto de AR</InputLabel>
                            <Select
                                value={selectedEffect}
                                onChange={(e) => {
                                    setSelectedEffect(e.target.value);
                                    setEffectValue(1);
                                    setEffectSpeed(1);
                                }}
                            >
                                {AREffects.map((effect) => (
                                    <MenuItem key={effect.value} value={effect.value}>
                                        {effect.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Valor del efecto
                                </Typography>
                                <Slider
                                    value={effectValue}
                                    onChange={(e, newValue) => setEffectValue(newValue)}
                                    min={0}
                                    max={selectedEffect === 'faceTracking' ? 2 : 10}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Velocidad del efecto
                                </Typography>
                                <Slider
                                    value={effectSpeed}
                                    onChange={(e, newValue) => setEffectSpeed(newValue)}
                                    min={0.1}
                                    max={3}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                        </Grid>

                        {renderCameraPosition()}

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
                                                ...getAREffectStyle(
                                                    selectedEffect,
                                                    effectValue,
                                                    effectSpeed
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

export default ARStickers;
