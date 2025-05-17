import React, { useState, useRef, useEffect } from 'react';
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
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    VoiceOverOff as VoiceOverOffIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import axios from 'axios';

const VoiceNote = ({ note, onDelete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.addEventListener('ended', handleEnded);
            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
            return () => {
                audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, []);

    const handlePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(note.url, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'nota_voz.mp3');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            setError('Error al descargar la nota de voz');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 1,
                }}
            >
                <IconButton onClick={handlePlay}>
                    {isPlaying ? (
                        <VoiceOverOffIcon sx={{ transform: 'rotate(180deg)' }} />
                    ) : (
                        <VoiceOverOffIcon />
                    )}
                </IconButton>
                <Typography>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                    <audio
                        ref={audioRef}
                        src={note.url}
                        style={{ display: 'none' }}
                    />
                </Box>
                <Tooltip title="Descargar">
                    <IconButton onClick={handleDownload}>
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => onDelete(note._id)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default VoiceNote;
