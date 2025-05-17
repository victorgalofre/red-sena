import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
    TextField,
    Slider,
} from '@mui/material';
import {
    Timer as TimerIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const TemporaryMessages = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [duration, setDuration] = useState(5);
    const [error, setError] = useState('');

    const handleSendTemporaryMessage = async () => {
        if (!message.trim()) {
            setError('Por favor, ingresa un mensaje');
            return;
        }

        try {
            await axios.post('/api/messages/temporary', {
                contenido: message,
                duracion: duration,
            });
            setOpen(false);
            setMessage('');
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al enviar mensaje temporal');
        }
    };

    const handleDeleteTemporaryMessage = async (messageId) => {
        try {
            await axios.delete(`/api/messages/temporary/${messageId}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar mensaje temporal');
        }
    };

    return (
        <>
            <IconButton
                color="primary"
                onClick={() => setOpen(true)}
                title="Mensaje temporal"
            >
                <TimerIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Mensaje temporal</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Mensaje"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            helperText={error}
                            error={!!error}
                        />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Typography id="duration-label" gutterBottom>
                            Duración (segundos)
                        </Typography>
                        <Slider
                            value={duration}
                            onChange={(e, newValue) => setDuration(newValue)}
                            valueLabelDisplay="auto"
                            min={5}
                            max={300}
                            step={5}
                            marks
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendTemporaryMessage}
                    >
                        Enviar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TemporaryMessages;
