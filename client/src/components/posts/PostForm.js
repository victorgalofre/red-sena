import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Button,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Alert,
} from '@mui/material';
import {
    AddPhotoAlternate as AddPhotoIcon,
    Videocam as VideoIcon,
    Send as SendIcon,
} from '@mui/icons-material';
import axios from 'axios';

const PostForm = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setContent('');
        setImage(null);
        setError('');
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setError('El archivo no puede superar los 5MB');
                return;
            }
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let imageUrl = '';
            if (image) {
                const formData = new FormData();
                formData.append('file', image);
                const response = await axios.post('/api/files/post-image', formData);
                imageUrl = response.data.url;
            }

            await axios.post('/api/posts', {
                contenido: content,
                imagen: imageUrl,
                tipo: imageUrl ? 'imagen' : 'texto',
                privacidad: 'publico'
            });

            handleClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear el post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Button
                variant="outlined"
                startIcon={<SendIcon />}
                onClick={handleOpen}
                fullWidth
                sx={{ mb: 2 }}
            >
                Crear Publicación
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Crear Publicación</DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            multiline
                            rows={4}
                            fullWidth
                            label="¿Qué estás pensando?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<AddPhotoIcon />}
                            >
                                Foto
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<VideoIcon />}
                                disabled
                            >
                                Video
                            </Button>
                        </Box>

                        {image && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption">
                                    Imagen seleccionada:
                                </Typography>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Previsualización"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                        )}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || !content}
                    >
                        Publicar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PostForm;
