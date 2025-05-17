import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    TextField,
    Button,
    Box,
    Alert,
} from '@mui/material';
import axios from 'axios';

const CommentForm = ({ postId }) => {
    const { user } = useAuth();
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!comment.trim()) {
            setError('El comentario no puede estar vacío');
            return;
        }

        try {
            await axios.post(`/api/posts/${postId}/comment`, { contenido: comment });
            setComment('');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear el comentario');
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Escribe un comentario..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!comment.trim()}
                >
                    Comentar
                </Button>
            </form>
        </Box>
    );
};

export default CommentForm;
