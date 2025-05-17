import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Image as ImageIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Status = () => {
    const [statuses, setStatuses] = useState([]);
    const [newStatus, setNewStatus] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStatuses();

        // Actualizar cada 30 segundos
        const interval = setInterval(fetchStatuses, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStatuses = async () => {
        try {
            const response = await axios.get('/api/status');
            setStatuses(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar estados');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStatus = async () => {
        try {
            await axios.post('/api/status', { texto: newStatus });
            setNewStatus('');
            fetchStatuses();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear estado');
        }
    };

    const handleDeleteStatus = async (statusId) => {
        try {
            await axios.delete(`/api/status/${statusId}`);
            fetchStatuses();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar estado');
        }
    };

    const handleEditStatus = async () => {
        try {
            await axios.patch(`/api/status/${selectedStatus._id}`, { texto: newStatus });
            setOpenDialog(false);
            fetchStatuses();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar estado');
        }
    };

    const getStatusDate = (date) => {
        const now = new Date();
        const statusDate = new Date(date);
        
        if (now.getDate() === statusDate.getDate() &&
            now.getMonth() === statusDate.getMonth() &&
            now.getFullYear() === statusDate.getFullYear()) {
            return statusDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return statusDate.toLocaleDateString();
    };

    return (
        <Box sx={{ p: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Navegación */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenDialog(true)}
                        >
                            Nuevo estado
                        </Button>
                    </Box>

                    {/* Lista de estados */}
                    <List>
                        {statuses.map((status) => (
                            <ListItem
                                key={status._id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    mb: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Avatar
                                        src={status.usuario.fotoPerfil}
                                        sx={{ width: 40, height: 40 }}
                                    >
                                        {status.usuario.nombre.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1">
                                            {status.usuario.nombre} {status.usuario.apellido}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {getStatusDate(status.fecha)}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        maxWidth: '100%',
                                        bgcolor: 'background.paper',
                                        color: 'text.primary',
                                    }}
                                >
                                    {status.imagen && (
                                        <Box sx={{ mb: 1 }}>
                                            <img
                                                src={status.imagen}
                                                alt="Estado"
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        </Box>
                                    )}
                                    <Typography variant="body1">
                                        {status.texto}
                                    </Typography>
                                </Paper>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            {/* Diálogo para crear/editar estado */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    {selectedStatus ? 'Editar estado' : 'Nuevo estado'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Escribe tu estado..."
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<ImageIcon />}
                            >
                                Agregar imagen
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button
                        onClick={selectedStatus ? handleEditStatus : handleCreateStatus}
                        variant="contained"
                        color="primary"
                    >
                        {selectedStatus ? 'Guardar' : 'Publicar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Status;
