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
    TextField,
    InputAdornment,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    VideoLabel as VideoLabelIcon,
} from '@mui/icons-material';
import axios from 'axios';

const AnimatedCustomStickerPicker = ({ onStickerSelect }) => {
    const [open, setOpen] = useState(false);
    const [stickers, setStickers] = useState([]);
    const [newStickerUrl, setNewStickerUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStickers();
    }, []);

    const fetchStickers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stickers/animated/custom');
            setStickers(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar stickers');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSticker = async () => {
        if (!newStickerUrl.trim()) {
            setError('Por favor, ingresa una URL válida');
            return;
        }

        try {
            setLoading(true);
            await axios.post('/api/stickers/animated/custom', {
                url: newStickerUrl,
            });
            setNewStickerUrl('');
            fetchStickers();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar sticker');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSticker = async (stickerId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/stickers/animated/custom/${stickerId}`);
            fetchStickers();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar sticker');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<VideoLabelIcon />}
                onClick={() => setOpen(true)}
            >
                Stickers Animados Personalizados
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Stickers Animados Personalizados</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="URL del sticker animado"
                            value={newStickerUrl}
                            onChange={(e) => setNewStickerUrl(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VideoLabelIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddSticker}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : 'Agregar'}
                        </Button>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <List>
                            {stickers.map((sticker) => (
                                <ListItem
                                    key={sticker._id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            color="error"
                                            onClick={() => handleDeleteSticker(sticker._id)}
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
                                        }}
                                    />
                                    <ListItemText
                                        primary={`Sticker ${sticker._id}`}
                                        secondary={sticker.url}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => onStickerSelect(sticker)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
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

export default AnimatedCustomStickerPicker;
