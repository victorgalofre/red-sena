import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimatedStoryStickers from './AnimatedStoryStickers';
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Grid,
    Paper,
} from '@mui/material';
import {
    Close as CloseIcon,
    Replay as ReplayIcon,
    Share as ShareIcon,
    Send as SendIcon,
} from '@mui/icons-material';

const StoryViewer = ({ story }) => {
    const [currentStory, setCurrentStory] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (story) {
            // Marcar como visto
            markAsSeen(story._id);
        }
    }, [story]);

    const markAsSeen = async (storyId) => {
        try {
            setLoading(true);
            await axios.post(`/api/stories/${storyId}/seen`);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al marcar como visto');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setCurrentStory(prev => (prev + 1) % story.length);
    };

    const handlePrevious = () => {
        setCurrentStory(prev => (prev - 1 + story.length) % story.length);
    };

    const handleShare = async () => {
        try {
            setLoading(true);
            await axios.post(`/api/stories/${story._id}/share`);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al compartir');
        } finally {
            setLoading(false);
        }
    };

    const current = story[currentStory];

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {current.usuario.nombre} {current.usuario.apellido}
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ p: 0 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    position: 'relative',
                                    height: '600px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'background.default',
                                }}
                            >
                                {current.tipo === 'imagen' ? (
                                    <img
                                        src={current.contenido}
                                        alt="Historia"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                ) : (
                                    <video
                                        src={current.contenido}
                                        autoPlay
                                        playsInline
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                )}
                                <StoryFilters
                                    story={storyState}
                                    onFilterChange={(filters) => {
                                        setStory({
                                            ...storyState,
                                            filters,
                                        });
                                    }}
                                />
                                <AnimatedStoryStickers
                                    story={storyState}
                                    onStickerAdd={(sticker) => {
                                        setStory(prev => ({
                                            ...prev,
                                            stickers: [...(prev.stickers || []), sticker],
                                        }));
                                    }}
                                    onStickerRemove={(stickerId) => {
                                        setStory(prev => ({
                                            ...prev,
                                            stickers: prev.stickers?.filter(s => s._id !== stickerId) || [],
                                        }));
                                    }}
                                />

                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        p: 2,
                                        bgcolor: 'rgba(0,0,0,0.5)',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <IconButton onClick={handlePrevious}>
                                                <ReplayIcon />
                                            </IconButton>
                                            <IconButton onClick={handleNext}>
                                                <ReplayIcon sx={{ transform: 'rotate(180deg)' }} />
                                            </IconButton>
                                        </Box>
                                        <Box>
                                            <IconButton onClick={handleShare}>
                                                <ShareIcon />
                                            </IconButton>
                                            <IconButton>
                                                <SendIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Dialog>
    );
};

export default StoryViewer;
