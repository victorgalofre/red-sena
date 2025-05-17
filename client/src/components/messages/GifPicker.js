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
    CircularProgress,
    Grid,
    IconButton,
    TextField,
} from '@mui/material';
import {
    Gif as GifIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const GifPicker = ({ onGifSelect }) => {
    const [open, setOpen] = useState(false);
    const [gifs, setGifs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchGifs = async (term = '') => {
        try {
            setLoading(true);
            const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
                params: {
                    api_key: process.env.REACT_APP_GIPHY_API_KEY,
                    q: term,
                    limit: 20,
                    offset: (page - 1) * 20,
                },
            });
            if (page === 1) {
                setGifs(response.data.data);
            } else {
                setGifs(prev => [...prev, ...response.data.data]);
            }
            setHasMore(response.data.pagination.total_count > (page * 20));
        } catch (err) {
            setError('Error al cargar GIFs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchGifs(searchTerm);
        }
    }, [open, searchTerm, page]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    const handleGifSelect = (gif) => {
        onGifSelect({
            id: gif.id,
            url: gif.images.original.url,
            width: gif.images.original.width,
            height: gif.images.original.height,
        });
        setOpen(false);
    };

    const formatSearchTerm = (term) => {
        return term.toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    return (
        <Box>
            <Button
                variant="outlined"
                startIcon={<GifIcon />}
                onClick={() => setOpen(true)}
            >
                GIF
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>Seleccionar GIF</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Buscar GIF"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    fetchGifs(e.target.value);
                                }
                            }}
                        />
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        {gifs.map((gif) => (
                            <Grid item xs={3} key={gif.id}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        '&:hover': {
                                            cursor: 'pointer',
                                        },
                                    }}
                                    onClick={() => handleGifSelect(gif)}
                                >
                                    <img
                                        src={gif.images.fixed_height.url}
                                        alt={gif.title}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Aquí iría la lógica para eliminar el GIF
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!loading && hasMore && (
                        <Button
                            variant="outlined"
                            onClick={handleLoadMore}
                            sx={{ mt: 2 }}
                        >
                            Cargar más
                        </Button>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GifPicker;
