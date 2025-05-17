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
    Grid,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    FormatQuote as FormatQuoteIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Rotate90DegreesCcw as Rotate90DegreesCcwIcon,
} from '@mui/icons-material';

const animationTypes = [
    { value: 'scale', label: 'Escala', icon: <TrendingUpIcon /> },
    { value: 'rotate', label: 'Rotación', icon: <Rotate90DegreesCcwIcon /> },
    { value: 'bounce', label: 'Rebote', icon: <TrendingDownIcon /> },
];

const AnimatedStickersWithCustomAnimations = ({ message, onStickerAdd, onStickerRemove }) => {
    const [open, setOpen] = useState(false);
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedAnimation, setSelectedAnimation] = useState('scale');
    const [animationValue, setAnimationValue] = useState(1);
    const [animationSpeed, setAnimationSpeed] = useState(1);

    const fetchStickers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stickers/animated/custom-animations');
            setStickers(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar stickers animados con animaciones personalizadas');
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
                animacion: selectedAnimation,
                valorAnimacion: animationValue,
                velocidadAnimacion: animationSpeed,
            };
            await axios.post(`/api/messages/${message._id}/stickers`, stickerData);
            onStickerAdd({
                ...sticker,
                animacion: selectedAnimation,
                valorAnimacion: animationValue,
                velocidadAnimacion: animationSpeed,
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

    const getAnimationStyle = (animation, value, speed) => {
        if (animation === 'scale') {
            return {
                transform: `scale(${value})`,
                transition: `transform ${speed}s ease-in-out`,
            };
        }
        if (animation === 'rotate') {
            return {
                transform: `rotate(${value * 360}deg)`,
                transition: `transform ${speed}s ease-in-out`,
            };
        }
        if (animation === 'bounce') {
            return {
                animation: `bounce ${speed}s infinite`,
            };
        }
        return {};
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
                <DialogTitle>Stickers Animados con Animaciones Personalizadas</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Animación</InputLabel>
                            <Select
                                value={selectedAnimation}
                                onChange={(e) => {
                                    setSelectedAnimation(e.target.value);
                                    setAnimationValue(1);
                                    setAnimationSpeed(1);
                                }}
                            >
                                {animationTypes.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.icon}
                                        <Box sx={{ ml: 1 }}>{type.label}</Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Valor de la animación
                                </Typography>
                                <Slider
                                    value={animationValue}
                                    onChange={(e, newValue) => setAnimationValue(newValue)}
                                    min={0}
                                    max={selectedAnimation === 'scale' ? 3 : 10}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Velocidad de la animación
                                </Typography>
                                <Slider
                                    value={animationSpeed}
                                    onChange={(e, newValue) => setAnimationSpeed(newValue)}
                                    min={0.1}
                                    max={3}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                        </Grid>

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
                                                ...getAnimationStyle(
                                                    selectedAnimation,
                                                    animationValue,
                                                    animationSpeed
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

export default AnimatedStickersWithCustomAnimations;
