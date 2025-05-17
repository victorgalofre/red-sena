import React, { useState } from 'react';
import {
    Box,
    Paper,
    IconButton,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerComponent = ({ onEmojiClick }) => {
    const [open, setOpen] = useState(false);

    const handleEmojiClick = (emojiObject) => {
        onEmojiClick(emojiObject.emoji);
    };

    return (
        <>
            <IconButton onClick={() => setOpen(true)}>
                <Typography>😊</Typography>
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Seleccionar emoji</DialogTitle>
                <DialogContent>
                    <Box sx={{ height: 300, overflow: 'auto' }}>
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            disableSearchBar
                            disableSkinTonePicker
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EmojiPickerComponent;
