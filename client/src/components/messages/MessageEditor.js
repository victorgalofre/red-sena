import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Alert,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const MessageEditor = ({ message, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message.contenido);
    const [error, setError] = useState('');

    const handleEdit = async () => {
        if (!editedMessage.trim()) {
            setError('El mensaje no puede estar vacío');
            return;
        }

        try {
            await axios.patch(`/api/messages/${message._id}`, {
                contenido: editedMessage,
            });
            onEdit(message._id, editedMessage);
            setOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar mensaje');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/messages/${message._id}`);
            onDelete(message._id);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar mensaje');
        }
    };

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setOpen(true)}
            >
                <EditIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Editar mensaje</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={editedMessage}
                            onChange={(e) => setEditedMessage(e.target.value)}
                            autoFocus
                        />
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEdit}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <IconButton
                size="small"
                color="error"
                onClick={handleDelete}
            >
                <DeleteIcon />
            </IconButton>
        </>
    );
};

export default MessageEditor;
