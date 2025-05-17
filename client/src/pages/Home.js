import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Box,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import PostForm from '../components/posts/PostForm';
import PostCard from '../components/posts/PostCard';
import axios from 'axios';

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts/feed');
                setPosts(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Error al cargar los posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleNewPost = async (newPost) => {
        try {
            const response = await axios.post('/api/posts', newPost);
            setPosts([response.data, ...posts]);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear el post');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Feed
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mb: 4 }}>
                <PostForm onSubmit={handleNewPost} />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    {posts.length === 0 ? (
                        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                            No hay posts en tu feed
                        </Typography>
                    ) : (
                        posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    )}
                </Box>
            )}
        </Container>
    );
};

export default Home;
