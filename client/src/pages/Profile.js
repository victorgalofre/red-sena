import React, { useState, useEffect } from 'react';
import { useAuth, useNavigate } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    Avatar,
    CircularProgress,
    Alert,
    IconButton,
} from '@mui/material';
import {
    Person as PersonIcon,
    Edit as EditIcon,
    Follow as FollowIcon,
    Unfollow as UnfollowIcon,
} from '@mui/icons-material';
import PostCard from '../components/posts/PostCard';
import axios from 'axios';

const Profile = ({ match }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/users/profile/${match.params.userId}`);
                setProfile(response.data);
                setFollowing(response.data.seguidores.includes(user?._id));
            } catch (err) {
                setError(err.response?.data?.error || 'Error al cargar el perfil');
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/api/posts/user/${match.params.userId}`);
                setPosts(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Error al cargar los posts');
            }
        };

        fetchProfile();
        fetchPosts();
        setLoading(false);
    }, [match.params.userId]);

    const handleFollow = async () => {
        try {
            await axios.post(`/api/users/${match.params.userId}/follow`);
            setFollowing(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al seguir usuario');
        }
    };

    const handleUnfollow = async () => {
        try {
            await axios.delete(`/api/users/${match.params.userId}/follow`);
            setFollowing(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al dejar de seguir usuario');
        }
    };

    const handleEditProfile = () => {
        navigate(`/profile/edit/${match.params.userId}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                <Box>
                    <Grid container spacing={3}>
                        {/* Información del perfil */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Avatar
                                        src={profile?.fotoPerfil}
                                        sx={{ width: 120, height: 120, mb: 2 }}
                                    />
                                    <Typography variant="h5" component="h1" gutterBottom>
                                        {profile?.nombre} {profile?.apellido}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        {profile?.programa}
                                    </Typography>
                                    <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                                        {profile?.biografia}
                                    </Typography>

                                    {profile?._id.toString() === user?._id.toString() ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            onClick={handleEditProfile}
                                            fullWidth
                                            sx={{ mb: 2 }}
                                        >
                                            Editar Perfil
                                        </Button>
                                    ) : (
                                        <Button
                                            variant={following ? 'outlined' : 'contained'}
                                            color="primary"
                                            startIcon={following ? <UnfollowIcon /> : <FollowIcon />}
                                            onClick={following ? handleUnfollow : handleFollow}
                                            fullWidth
                                            sx={{ mb: 2 }}
                                        >
                                            {following ? 'Dejar de seguir' : 'Seguir'}
                                        </Button>
                                    )}

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Seguidores: {profile?.seguidores?.length || 0}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            Siguiendo: {profile?.siguiendo?.length || 0}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Posts */}
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Publicaciones
                            </Typography>

                            {posts.length === 0 ? (
                                <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                                    No hay publicaciones
                                </Typography>
                            ) : (
                                posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))
                            )}
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Container>
    );
};

export default Profile;
