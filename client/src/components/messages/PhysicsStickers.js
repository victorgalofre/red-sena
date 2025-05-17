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
    Physics as PhysicsIcon,
    Gravity as GravityIcon,
    Air as AirIcon,
} from '@mui/icons-material';

const physicsEffects = [
    { value: 'gravity', label: 'Gravedad' },
    { value: 'airResistance', label: 'Resistencia del aire' },
    { value: 'bounce', label: 'Rebote' },
    { value: 'friction', label: 'Fricción' },
    { value: 'magnetic', label: 'Magnetismo' },
];

const PhysicsStickers = ({ message, onStickerAdd, onStickerRemove }) => {
    const [open, setOpen] = useState(false);
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedEffect, setSelectedEffect] = useState('gravity');
    const [effectValue, setEffectValue] = useState(1);
    const [effectSpeed, setEffectSpeed] = useState(1);
    const [physicsProperties, setPhysicsProperties] = useState({
        masa: 1,
        velocidadInicial: 0,
        angulo: 0,
        fuerza: 1,
    });
    const containerRef = useRef(null);

    const fetchStickers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stickers/physics');
            setStickers(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar stickers con efectos de física');
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
                efectoFisica: selectedEffect,
                valorEfecto: effectValue,
                velocidadEfecto: effectSpeed,
                propiedadesFisicas: physicsProperties,
            };
            await axios.post(`/api/messages/${message._id}/stickers/physics`, stickerData);
            onStickerAdd({
                ...sticker,
                efectoFisica: selectedEffect,
                valorEfecto: effectValue,
                velocidadEfecto: effectSpeed,
                propiedadesFisicas: physicsProperties,
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar sticker con efectos de física');
        } finally {
            setLoading(false);
        }
    };

    const handleStickerRemove = async (stickerId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/messages/${message._id}/stickers/physics/${stickerId}`);
            onStickerRemove(stickerId);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar sticker con efectos de física');
        } finally {
            setLoading(false);
        }
    };

    const getPhysicsStyle = (effect, value, speed, properties) => {
        const baseStyle = {
            transition: `all ${speed}s ease-in-out`,
        };

        if (effect === 'gravity') {
            return {
                ...baseStyle,
                transform: `translateY(${value * properties.masa}px)`,
            };
        }

        if (effect === 'airResistance') {
            return {
                ...baseStyle,
                opacity: 1 - (value * properties.velocidadInicial / 100),
            };
        }

        if (effect === 'bounce') {
            return {
                ...baseStyle,
                animation: `bounce ${speed}s infinite`,
                transform: `scale(${1 + value * properties.fuerza})`,
            };
        }

        if (effect === 'friction') {
            return {
                ...baseStyle,
                transform: `translateX(${value * properties.fuerza}px)`,
            };
        }

        if (effect === 'magnetic') {
            return {
                ...baseStyle,
                transform: `scale(${1 + value * properties.masa})`,
            };
        }

        return baseStyle;
    };

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <PhysicsIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Stickers Interactivos con Efectos de Física</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Efecto de Física</InputLabel>
                            <Select
                                value={selectedEffect}
                                onChange={(e) => {
                                    setSelectedEffect(e.target.value);
                                    setEffectValue(1);
                                    setEffectSpeed(1);
                                }}
                            >
                                {physicsEffects.map((effect) => (
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
                                    max={selectedEffect === 'bounce' ? 2 : 10}
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

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Masa
                                </Typography>
                                <Slider
                                    value={physicsProperties.masa}
                                    onChange={(e, newValue) => setPhysicsProperties(prev => ({
                                        ...prev,
                                        masa: newValue,
                                    }))}
                                    min={0.1}
                                    max={5}
                                    step={0.1}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Velocidad inicial
                                </Typography>
                                <Slider
                                    value={physicsProperties.velocidadInicial}
                                    onChange={(e, newValue) => setPhysicsProperties(prev => ({
                                        ...prev,
                                        velocidadInicial: newValue,
                                    }))}
                                    min={0}
                                    max={100}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Ángulo
                                </Typography>
                                <Slider
                                    value={physicsProperties.angulo}
                                    onChange={(e, newValue) => setPhysicsProperties(prev => ({
                                        ...prev,
                                        angulo: newValue,
                                    }))}
                                    min={0}
                                    max={360}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Fuerza
                                </Typography>
                                <Slider
                                    value={physicsProperties.fuerza}
                                    onChange={(e, newValue) => setPhysicsProperties(prev => ({
                                        ...prev,
                                        fuerza: newValue,
                                    }))}
                                    min={0}
                                    max={2}
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
                                                ...getPhysicsStyle(
                                                    selectedEffect,
                                                    effectValue,
                                                    effectSpeed,
                                                    physicsProperties
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

export default PhysicsStickers;
