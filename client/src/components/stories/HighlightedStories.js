import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Grid,
    Paper,
    IconButton,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import StoryViewer from './StoryViewer';

const HighlightedStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);

    useEffect(() => {
        fetchHighlightedStories();

        // Actualizar cada 30 segundos
        const interval = setInterval(fetchHighlightedStories, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchHighlightedStories = async () => {
        try {
            const response = await axios.get('/api/stories/highlighted');
            setStories(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar historias destacadas');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStory = async (story) => {
        try {
            await axios.post('/api/stories/highlighted', story);
            fetchHighlightedStories();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear historia destacada');
        }
    };

    const handleEditStory = async (storyId, updates) => {
        try {
            await axios.patch(`/api/stories/highlighted/${storyId}`, updates);
            fetchHighlightedStories();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar historia destacada');
        }
    };

    const handleDeleteStory = async (storyId) => {
        try {
            await axios.delete(`/api/stories/highlighted/${storyId}`);
            fetchHighlightedStories();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar historia destacada');
        }
    };

    const handleStoryClick = (story) => {
        setSelectedStory(story);
        setOpenDialog(true);
    };

    return (
        <Box sx={{ p: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenDialog(true)}
                        >
                            Nueva historia destacada
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {stories.map((story) => (
                            <Grid item xs={12} sm={6} md={4} key={story._id}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <Typography variant="h6">
                                            {story.titulo}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                onClick={() => handleEditStory(story._id)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDeleteStory(story._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {story.descripcion}
                                    </Typography>

                                    <Box sx={{ flexGrow: 1, mb: 2 }}>
                                        <img
                                            src={story.imagen}
                                            alt={story.titulo}
                                            style={{
                                                width: '100%',
                                                height: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            {story.vistas} vistas
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleStoryClick(story)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}

            <StoryViewer
                story={selectedStory}
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            />
        </Box>
    );
};

export default HighlightedStories;
