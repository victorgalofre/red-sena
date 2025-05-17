import React, { useState } from 'react';
import {
    Box,
    Paper,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

const animatedStickers = [
    {
        id: 1,
        name: 'Feliz',
        url: 'https://media.tenor.com/videos/810609121290978304.mp4',
    },
    {
        id: 2,
        name: 'Sorprendido',
        url: 'https://media.tenor.com/videos/810609121290978305.mp4',
    },
    {
        id: 3,
        name: 'Triste',
        url: 'https://media.tenor.com/videos/810609121290978306.mp4',
    },
    {
        id: 4,
        name: 'Enojado',
        url: 'https://media.tenor.com/videos/810609121290978307.mp4',
    },
    {
        id: 5,
        name: 'Amor',
        url: 'https://media.tenor.com/videos/810609121290978308.mp4',
    },
];

const AnimatedStickerPicker = ({ onStickerSelect }) => {
    const [open, setOpen] = useState(false);

    const handleStickerClick = (sticker) => {
        onStickerSelect(sticker);
        setOpen(false);
    };

    return (
        <>
            <IconButton onClick={() => setOpen(true)}>
                <EmojiEmotionsOutlinedIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Seleccionar Sticker Animado</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {animatedStickers.map((sticker) => (
                            <Paper
                                key={sticker.id}
                                elevation={1}
                                sx={{
                                    p: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                                onClick={() => handleStickerClick(sticker)}
                            >
                                <video
                                    src={sticker.url}
                                    autoPlay
                                    loop
                                    muted
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'contain',
                                    }}
                                />
                                <Typography variant="caption" align="center">
                                    {sticker.name}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AnimatedStickerPicker;
