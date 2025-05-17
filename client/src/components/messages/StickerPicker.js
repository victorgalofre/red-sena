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

const stickers = [
    '😊', '😋', '😎', '😍', '😂', '😡', '😢', '😱', '🤔', '🥳',
    '🥰', '😘', '🤩', '🤗', '🤔', '🥱', '😴', '😌', '😔', '😢',
    '😭', '😤', '😠', '😡', '🤬', '🤯', '😤', '😢', '😭', '😢',
    '😢', '😭', '😢', '😭', '😢', '😭', '😢', '😭', '😢', '😭',
];

const StickerPicker = ({ onStickerSelect }) => {
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
                <DialogTitle>Seleccionar Sticker</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {stickers.map((sticker, index) => (
                            <Paper
                                key={index}
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
                                <Typography variant="h2">{sticker}</Typography>
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

export default StickerPicker;
