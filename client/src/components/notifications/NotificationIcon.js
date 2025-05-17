import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import {
    Badge,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    CheckCircle as CheckIcon,
    RadioButtonUnchecked as UnreadIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

const NotificationIcon = () => {
    const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } = useNotifications();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
        handleClose();
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                size="large"
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        width: 320,
                        maxHeight: 400,
                        overflow: 'auto',
                    },
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <>
                        {notifications.length === 0 ? (
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body1" align="center">
                                    No tienes notificaciones
                                </Typography>
                            </Box>
                        ) : (
                            <List>
                                {notifications.map((notification) => (
                                    <React.Fragment key={notification._id}>
                                        <ListItem
                                            alignItems="flex-start"
                                            onClick={() => markAsRead(notification._id)}
                                            sx={{
                                                cursor: 'pointer',
                                                backgroundColor: notification.leido
                                                    ? 'transparent'
                                                    : 'rgba(0, 0, 0, 0.03)',
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={notification.usuario.fotoPerfil}
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={notification.mensaje}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {notification.usuario.nombre} {notification.usuario.apellido}
                                                        </Typography>
                                                        {` — ${new Date(notification.fecha).toLocaleString()}`}
                                                    </React.Fragment>
                                                }
                                            />
                                            <Box sx={{ ml: 2 }}>
                                                {notification.leido ? (
                                                    <CheckIcon color="success" />
                                                ) : (
                                                    <UnreadIcon color="error" />
                                                )}
                                            </Box>
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                        <Box sx={{ p: 1 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleMarkAllAsRead}
                                disabled={unreadCount === 0}
                                sx={{ mb: 1 }}
                            >
                                Marcar todas como leídas
                            </Button>
                            <MenuItem
                                onClick={() => navigate('/notifications/settings')}
                            >
                                <SettingsIcon sx={{ mr: 1 }} />
                                Configuración de notificaciones
                            </MenuItem>
                        </Box>
                    </>
                )}
            </Menu>
        </>
    );
};

export default NotificationIcon;
