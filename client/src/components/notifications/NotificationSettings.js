import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Switch,
    FormControlLabel,
    FormGroup,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Alert,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        likes: true,
        comments: true,
        follows: true,
        mentions: true,
        email: true,
        push: true,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/notifications/settings');
                setSettings(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Error al cargar configuraciones');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleToggle = async (type) => {
        try {
            setSettings(prev => ({
                ...prev,
                [type]: !prev[type]
            }));
            
            await axios.patch('/api/notifications/settings', {
                [type]: !settings[type]
            });
            
            setSuccess('Configuración actualizada');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar configuración');
        }
    };

    const getNotificationTypeIcon = (type) => {
        switch (type) {
            case 'likes':
                return '❤️';
            case 'comments':
                return '💬';
            case 'follows':
                return '👥';
            case 'mentions':
                return '@';
            case 'email':
                return '📧';
            case 'push':
                return '🔔';
            default:
                return '🔔';
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Configuración de Notificaciones
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    {/* Notificaciones de la App */}
                    <Card sx={{ mb: 3 }}>
                        <CardHeader title="Notificaciones de la App" />
                        <Divider />
                        <CardContent>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.likes}
                                            onChange={() => handleToggle('likes')}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getNotificationTypeIcon('likes')}
                                            <Typography>Me gusta</Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.comments}
                                            onChange={() => handleToggle('comments')}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getNotificationTypeIcon('comments')}
                                            <Typography>Comentarios</Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.follows}
                                            onChange={() => handleToggle('follows')}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getNotificationTypeIcon('follows')}
                                            <Typography>Nuevos seguidores</Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.mentions}
                                            onChange={() => handleToggle('mentions')}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getNotificationTypeIcon('mentions')}
                                            <Typography>Menciones</Typography>
                                        </Box>
                                    }
                                />
                            </FormGroup>
                        </CardContent>
                    </Card>

                    {/* Notificaciones por Email */}
                    <Card>
                        <CardHeader title="Notificaciones por Email" />
                        <Divider />
                        <CardContent>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.email}
                                            onChange={() => handleToggle('email')}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getNotificationTypeIcon('email')}
                                            <Typography>Recibir notificaciones por email</Typography>
                                        </Box>
                                    }
                                />
                            </FormGroup>
                        </CardContent>
                    </Card>

                    {/* Notificaciones Push */}
                    <Card sx={{ mt: 3 }}>
                        <CardHeader title="Notificaciones Push" />
                        <Divider />
                        <CardContent>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.push}
                                            onChange={() => handleToggle('push')}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getNotificationTypeIcon('push')}
                                            <Typography>Recibir notificaciones push</Typography>
                                        </Box>
                                    }
                                />
                            </FormGroup>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Container>
    );
};

export default NotificationSettings;
