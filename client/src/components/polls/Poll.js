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
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    IconButton,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Poll as PollIcon,
} from '@mui/icons-material';

const Poll = () => {
    const [open, setOpen] = useState(false);
    const [poll, setPoll] = useState({
        pregunta: '',
        opciones: [{ texto: '', votos: 0 }, { texto: '', votos: 0 }],
        duracion: 24,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddOption = () => {
        setPoll(prev => ({
            ...prev,
            opciones: [...prev.opciones, { texto: '', votos: 0 }],
        }));
    };

    const handleRemoveOption = (index) => {
        setPoll(prev => ({
            ...prev,
            opciones: prev.opciones.filter((_, i) => i !== index),
        }));
    };

    const handleOptionChange = (index, value) => {
        setPoll(prev => ({
            ...prev,
            opciones: prev.opciones.map((option, i) =>
                i === index ? { ...option, texto: value } : option
            ),
        }));
    };

    const handleCreatePoll = async () => {
        if (!poll.pregunta.trim() || poll.opciones.some(option => !option.texto.trim())) {
            setError('Por favor, completa todos los campos');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            await axios.post('/api/polls', poll);
            setOpen(false);
            setPoll({
                pregunta: '',
                opciones: [{ texto: '', votos: 0 }, { texto: '', votos: 0 }],
                duracion: 24,
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear encuesta');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (pollId, optionIndex) => {
        try {
            setLoading(true);
            await axios.post(`/api/polls/${pollId}/vote/${optionIndex}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al votar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<PollIcon />}
                onClick={() => setOpen(true)}
            >
                Crear encuesta
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Crear encuesta</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Pregunta"
                            value={poll.pregunta}
                            onChange={(e) => setPoll(prev => ({ ...prev, pregunta: e.target.value }))}
                            multiline
                            rows={2}
                            sx={{ mb: 2 }}
                        />

                        {poll.opciones.map((option, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label={`Opción ${index + 1}`}
                                    value={option.texto}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    sx={{ mb: 1 }}
                                />
                                <IconButton
                                    color="error"
                                    onClick={() => handleRemoveOption(index)}
                                    disabled={poll.opciones.length <= 2}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}

                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddOption}
                            sx={{ mb: 2 }}
                        >
                            Agregar opción
                        </Button>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Duración (horas)</InputLabel>
                            <Select
                                value={poll.duracion}
                                onChange={(e) => setPoll(prev => ({ ...prev, duracion: parseInt(e.target.value) }))}
                            >
                                {[1, 2, 4, 8, 12, 24, 48, 72].map(hours => (
                                    <MenuItem key={hours} value={hours}>
                                        {hours} horas
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreatePoll}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Poll;
