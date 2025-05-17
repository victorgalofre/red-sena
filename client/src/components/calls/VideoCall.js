import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Videocam as VideocamIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    VideocamOff as VideocamOffIcon,
    CallEnd as CallEndIcon,
} from '@mui/icons-material';

const VideoCall = ({ user, conversation }) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!localStream) {
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            })
            .then((stream) => {
                setLocalStream(stream);
            })
            .catch((err) => {
                setError('Error al acceder a la cámara y micrófono');
            });
        }
    }, [localStream]);

    const handleAudioToggle = () => {
        setIsAudioMuted(!isAudioMuted);
        localStream.getAudioTracks()[0].enabled = !isAudioMuted;
    };

    const handleVideoToggle = () => {
        setIsVideoMuted(!isVideoMuted);
        localStream.getVideoTracks()[0].enabled = !isVideoMuted;
    };

    const handleCall = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Aquí iría la lógica para establecer la llamada
            // por ejemplo, usando WebRTC
            
            setOpen(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEndCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
        }
        setOpen(false);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                startIcon={<VideocamIcon />}
                onClick={handleCall}
                disabled={loading}
            >
                Llamar
            </Button>

            <Dialog
                open={open}
                onClose={handleEndCall}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Llamada con {conversation.usuario.nombre} {conversation.usuario.apellido}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <video
                            autoPlay
                            playsInline
                            muted
                            ref={(el) => {
                                if (el && localStream) {
                                    el.srcObject = localStream;
                                }
                            }}
                            style={{
                                width: '400px',
                                height: '300px',
                                borderRadius: '8px',
                                border: '2px solid #ccc',
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <video
                            autoPlay
                            playsInline
                            ref={(el) => {
                                if (el && remoteStream) {
                                    el.srcObject = remoteStream;
                                }
                            }}
                            style={{
                                width: '400px',
                                height: '300px',
                                borderRadius: '8px',
                                border: '2px solid #ccc',
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton
                            color={isAudioMuted ? 'default' : 'primary'}
                            onClick={handleAudioToggle}
                        >
                            {isAudioMuted ? <MicOffIcon /> : <MicIcon />}
                        </IconButton>
                        <IconButton
                            color={isVideoMuted ? 'default' : 'primary'}
                            onClick={handleVideoToggle}
                        >
                            {isVideoMuted ? <VideocamOffIcon /> : <VideocamIcon />}
                        </IconButton>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<CallEndIcon />}
                        onClick={handleEndCall}
                    >
                        Finalizar llamada
                    </Button>
                </DialogActions>
            </Dialog>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </>
    );
};

export default VideoCall;
