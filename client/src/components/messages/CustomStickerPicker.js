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
    Image as ImageIcon,
} from '@mui/icons-material';
import axios from 'axios';

const CustomStickerPicker = ({ onStickerSelect }) => {
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
            const response = await axios.get('/api/stickers/custom');
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
            await axios.post('/api/stickers/custom', {
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
            await axios.delete(`/api/stickers/custom/${stickerId}`);
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
                startIcon={<ImageIcon />}
                onClick={() => setOpen(true)}
            >
                Stickers Personalizados
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Stickers Personalizados</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="URL del sticker"
                            value={newStickerUrl}
                            onChange={(e) => setNewStickerUrl(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ImageIcon />
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
                                    <img
                                        src={sticker.url}
                                        alt={sticker._id}
                                        style={{
                                            width: '50px',
                                            height: '50px',
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

export default CustomStickerPicker;
