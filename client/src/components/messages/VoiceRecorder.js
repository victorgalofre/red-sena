import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';
import {
    Mic as MicIcon,
    MicOff as MicOffIcon,
    PlayArrow as PlayArrowIcon,
    Stop as StopIcon,
} from '@mui/icons-material';
import axios from 'axios';

const VoiceRecorder = ({ onVoiceMessage }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [open, setOpen] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            
            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                const formData = new FormData();
                formData.append('audio', audioBlob, 'voice_message.wav');

                try {
                    const response = await axios.post('/api/messages/voice', formData);
                    onVoiceMessage(response.data.url);
                } catch (err) {
                    setError(err.response?.data?.error || 'Error al enviar mensaje de voz');
                }
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            setDuration(0);
            audioChunks.current = [];

            // Actualizar duración cada segundo
            const timer = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

            return () => clearInterval(timer);
        } catch (err) {
            setError(err.message);
        }
    };

    const stopRecording = () => {
        mediaRecorder.current?.stop();
        setIsRecording(false);
    };

    const handlePlay = () => {
        if (!audioUrl) return;
        
        const audio = new Audio(audioUrl);
        audio.play().catch((err) => {
            setError('Error al reproducir el audio');
        });
    };

    return (
        <>
            <IconButton
                color={isRecording ? 'error' : 'primary'}
                onClick={isRecording ? stopRecording : startRecording}
            >
                {isRecording ? <StopIcon /> : <MicIcon />}
            </IconButton>

            {isRecording && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                    Grabando... {duration}s
                </Typography>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Reproducir mensaje de voz</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            color={isPlaying ? 'primary' : 'default'}
                            onClick={handlePlay}
                        >
                            <PlayArrowIcon />
                        </IconButton>
                        <Typography>
                            {duration}s
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VoiceRecorder;
