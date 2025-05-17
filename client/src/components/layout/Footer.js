import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Link,
} from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Red Sena
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Red social para la comunidad SENA
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Links
                        </Typography>
                        <ul>
                            <li>
                                <Link href="/" color="inherit">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" color="inherit">
                                    Acerca de
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" color="inherit">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Redes Sociales
                        </Typography>
                        <ul>
                            <li>
                                <Link href="#" color="inherit">
                                    Facebook
                                </Link>
                            </li>
                            <li>
                                <Link href="#" color="inherit">
                                    Twitter
                                </Link>
                            </li>
                            <li>
                                <Link href="#" color="inherit">
                                    Instagram
                                </Link>
                            </li>
                        </ul>
                    </Grid>
                </Grid>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 5 }}
                >
                    {'Copyright © '}
                    <Link color="inherit" href="/">
                        Red Sena
                    </Link>{' '}
                    {new Date().getFullYear()}
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
