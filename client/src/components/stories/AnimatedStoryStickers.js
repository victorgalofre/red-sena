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
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    FilterList as FilterListIcon,
} from '@mui/icons-material';

const AnimatedStoryStickers = ({ story, onStickerAdd, onStickerRemove }) => {
    const [open, setOpen] = useState(false);
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStickers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stickers/animated/story');
            setStickers(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar stickers animados para historias');
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
            await axios.post(`/api/stories/${story._id}/stickers`, {
                stickerId: sticker._id,
            });
            onStickerAdd(sticker);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar sticker a la historia');
        } finally {
            setLoading(false);
        }
    };

    const handleStickerRemove = async (stickerId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/stories/${story._id}/stickers/${stickerId}`);
            onStickerRemove(stickerId);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar sticker de la historia');
        } finally {
            setLoading(false);
        }
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
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Stickers Animados para Historia</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
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

export default AnimatedStoryStickers;
