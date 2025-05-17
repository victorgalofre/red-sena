import React, { useState, useEffect } from 'react';
import { useAuth, useNavigate } from '../context/AuthContext';
import {
    Container,
    Box,
    Typography,
    Button,
    TextField,
    Avatar,
    IconButton,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    PhotoCamera as PhotoCameraIcon,
    Check as CheckIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import axios from 'axios';

const ProfileEdit = ({ match }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        biografia: '',
        fotoPerfil: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [openPreview, setOpenPreview] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/users/profile/${match.params.userId}`);
                setFormData({
                    nombre: response.data.nombre,
                    apellido: response.data.apellido,
                    biografia: response.data.biografia,
                    fotoPerfil: response.data.fotoPerfil,
                });
                setPreview(response.data.fotoPerfil);
            } catch (err) {
                setError(err.response?.data?.error || 'Error al cargar el perfil');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [match.params.userId]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setError('El archivo no puede superar los 5MB');
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setOpenPreview(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let imageUrl = formData.fotoPerfil;
            if (image) {
                const formDataImage = new FormData();
                formDataImage.append('file', image);
                const response = await axios.post('/api/files/profile-picture', formDataImage);
                imageUrl = response.data.url;
            }

            await axios.patch(`/api/users/profile/${match.params.userId}`, {
                nombre: formData.nombre,
                apellido: formData.apellido,
                biografia: formData.biografia,
                fotoPerfil: imageUrl,
            });

            navigate(`/profile/${match.params.userId}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar el perfil');
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePreviewClose = () => {
        setOpenPreview(false);
        if (!image) {
            setPreview(formData.fotoPerfil);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Typography variant="h4" component="h1" gutterBottom>
                Editar Perfil
            </Typography>

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Avatar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={preview}
                            sx={{ width: 120, height: 120 }}
                        />
                        <IconButton
                            component="label"
                            color="primary"
                        >
                            <PhotoCameraIcon />
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </IconButton>
                    </Box>

                    {/* Datos personales */}
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />

                    {/* Biografía */}
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Biografía"
                        name="biografia"
                        value={formData.biografia}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />

                    {/* Botones */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                        >
                            Guardar
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </form>

            {/* Vista previa de imagen */}
            <Dialog open={openPreview} onClose={handlePreviewClose}>
                <DialogTitle>Vista previa de la foto de perfil</DialogTitle>
                <DialogContent>
                    <img
                        src={preview}
                        alt="Vista previa"
                        style={{
                            width: '100%',
                            maxHeight: '500px',
                            objectFit: 'contain',
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setImage(null);
                            setPreview(formData.fotoPerfil);
                            setOpenPreview(false);
                        }}
                        startIcon={<CancelIcon />}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => setOpenPreview(false)}
                        startIcon={<CheckIcon />}
                        color="primary"
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfileEdit;
