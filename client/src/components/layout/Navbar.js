import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Box,
    Container,
} from '@mui/material';
import {
    Person as PersonIcon,
    Home as HomeIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import NotificationIcon from '../notifications/NotificationIcon';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/login');
    };

    const handleProfile = () => {
        navigate(`/profile/${user?._id}`);
        handleClose();
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar>
                    <HomeIcon sx={{ mr: 2 }} />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        Red Sena
                    </Typography>

                    {user ? (
                        <Box>
                            <IconButton color="inherit">
                                <Badge badgeContent={0} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Avatar
                                    alt={user.nombre}
                                    src={user.fotoPerfil}
                                />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleProfile}>
                                    <PersonIcon sx={{ mr: 1 }} />
                                    Mi Perfil
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <LogoutIcon sx={{ mr: 1 }} />
                                    Cerrar Sesión
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box>
                            <Button color="inherit" onClick={() => navigate('/login')}>
                                Iniciar Sesión
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/register')}
                            >
                                Registrarse
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
