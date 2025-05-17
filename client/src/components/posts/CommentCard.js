import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Typography,
    IconButton,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';

const CommentCard = ({ comment, postId }) => {
    const { user } = useAuth();
    const [openEdit, setOpenEdit] = useState(false);
    const [editContent, setEditContent] = useState(comment.contenido);
    const [error, setError] = useState('');

    const handleEdit = async () => {
        try {
            await axios.put(`/api/posts/${postId}/comment/${comment._id}`, {
                contenido: editContent
            });
            setOpenEdit(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar el comentario');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/posts/${postId}/comment/${comment._id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar el comentario');
        }
    };

    return (
        <Box
            sx={{
                p: 2,
                mb: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle2">
                    {comment.usuario.nombre} {comment.usuario.apellido}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {new Date(comment.fecha).toLocaleDateString()}
                </Typography>
            </Box>

            <Typography variant="body1">
                {comment.contenido}
            </Typography>

            {comment.usuario._id.toString() === user._id.toString() && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <IconButton onClick={() => setOpenEdit(true)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleDelete} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}

            <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                <DialogTitle>Editar Comentario</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Comentario"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
                    <Button onClick={handleEdit} variant="contained" color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommentCard;
