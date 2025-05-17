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
    Grid,
} from '@mui/material';
import {
    Videocam as VideocamIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    VideocamOff as VideocamOffIcon,
    CallEnd as CallEndIcon,
    ScreenShare as ScreenShareIcon,
    StopScreenShare as StopScreenShareIcon,
} from '@mui/icons-material';

const ScreenShareCall = ({ group }) => {
    const [localStream, setLocalStream] = useState(null);
    const [screenStream, setScreenStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
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

    const handleScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'always',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
            });
            setScreenStream(stream);
            setIsSharingScreen(true);
        } catch (err) {
            setError('Error al compartir pantalla');
        }
    };

    const handleStopScreenShare = () => {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
        }
        setIsSharingScreen(false);
    };

    const handleCall = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Aquí iría la lógica para establecer la llamada grupal
            // usando WebRTC y un servidor signaling
            
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
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
        }
        remoteStreams.forEach(stream => {
            stream.getTracks().forEach(track => track.stop());
        });
        setRemoteStreams([]);
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
                Llamada con pantalla compartida
            </Button>

            <Dialog
                open={open}
                onClose={handleEndCall}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    Llamada grupal con {group.nombre}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/* Video local */}
                        <Grid item xs={12} md={3}>
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
                                        width: '100%',
                                        height: '200px',
                                        borderRadius: '8px',
                                        border: '2px solid #ccc',
                                    }}
                                />
                            </Box>
                            <Typography variant="caption" align="center">
                                Tú
                            </Typography>
                        </Grid>

                        {/* Pantalla compartida */}
                        {isSharingScreen && (
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <video
                                        autoPlay
                                        playsInline
                                        ref={(el) => {
                                            if (el && screenStream) {
                                                el.srcObject = screenStream;
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            height: '400px',
                                            borderRadius: '8px',
                                            border: '2px solid #ccc',
                                        }}
                                    />
                                </Box>
                                <Typography variant="caption" align="center">
                                    Pantalla compartida
                                </Typography>
                            </Grid>
                        )}

                        {/* Videos remotos */}
                        {remoteStreams.map((stream, index) => (
                            <Grid item xs={12} md={3} key={index}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <video
                                        autoPlay
                                        playsInline
                                        ref={(el) => {
                                            if (el) {
                                                el.srcObject = stream;
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            borderRadius: '8px',
                                            border: '2px solid #ccc',
                                        }}
                                    />
                                </Box>
                                <Typography variant="caption" align="center">
                                    Participante {index + 1}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
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
                        <IconButton
                            color={isSharingScreen ? 'secondary' : 'primary'}
                            onClick={isSharingScreen ? handleStopScreenShare : handleScreenShare}
                        >
                            {isSharingScreen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
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

export default ScreenShareCall;
