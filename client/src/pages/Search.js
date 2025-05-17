import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';
import axios from 'axios';

const Search = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tab, setTab] = useState(0);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`/api/users/search?query=${searchTerm}`);
            setResults(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al buscar');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Búsqueda
                </Typography>

                <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading || !searchTerm.trim()}
                    >
                        Buscar
                    </Button>
                </Box>

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
                    <Box sx={{ width: '100%' }}>
                        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
                            <Tab label="Usuarios" />
                            <Tab label="Posts" />
                        </Tabs>

                        {tab === 0 && (
                            <Grid container spacing={3}>
                                {results.map((user) => (
                                    <Grid item xs={12} sm={6} md={4} key={user._id}>
                                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                <Avatar
                                                    src={user.fotoPerfil}
                                                    sx={{ width: 80, height: 80, mb: 2 }}
                                                />
                                                <Typography variant="h6" gutterBottom>
                                                    {user.nombre} {user.apellido}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {user.programa}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 2 }}>
                                                    {user.biografia}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    onClick={() => navigate(`/profile/${user._id}`)}
                                                >
                                                    Ver Perfil
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default Search;
