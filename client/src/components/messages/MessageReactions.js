import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Chip,
    Tooltip,
} from '@mui/material';
import axios from 'axios';

const reactions = [
    { emoji: '👍', label: 'Me gusta' },
    { emoji: '❤️', label: 'Amor' },
    { emoji: '😂', label: 'Risas' },
    { emoji: '😢', label: 'Triste' },
    { emoji: '😍', label: 'Impresionado' },
    { emoji: '🤔', label: 'Pensativo' },
];

const MessageReactions = ({ message }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [reactionsCount, setReactionsCount] = useState({
        '👍': 0,
        '❤️': 0,
        '😂': 0,
        '😢': 0,
        '😍': 0,
        '🤔': 0,
    });

    useEffect(() => {
        const fetchReactions = async () => {
            try {
                const response = await axios.get(`/api/messages/${message._id}/reactions`);
                setReactionsCount(response.data);
            } catch (err) {
                console.error('Error al cargar reacciones:', err);
            }
        };

        fetchReactions();
    }, [message._id]);

    const handleReaction = async (emoji) => {
        try {
            await axios.post(`/api/messages/${message._id}/react`, { emoji });
            setReactionsCount(prev => ({
                ...prev,
                [emoji]: prev[emoji] + 1,
            }));
        } catch (err) {
            console.error('Error al reaccionar:', err);
        }
    };

    const handleRemoveReaction = async (emoji) => {
        try {
            await axios.delete(`/api/messages/${message._id}/react/${emoji}`);
            setReactionsCount(prev => ({
                ...prev,
                [emoji]: prev[emoji] - 1,
            }));
        } catch (err) {
            console.error('Error al eliminar reacción:', err);
        }
    };

    return (
        <Box>
            <IconButton
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <Typography variant="caption">{Object.values(reactionsCount).reduce((a, b) => a + b, 0)}</Typography>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                {reactions.map((reaction) => (
                    <MenuItem
                        key={reaction.emoji}
                        onClick={() => {
                            const count = reactionsCount[reaction.emoji];
                            if (count > 0) {
                                handleRemoveReaction(reaction.emoji);
                            } else {
                                handleReaction(reaction.emoji);
                            }
                            setAnchorEl(null);
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h4">{reaction.emoji}</Typography>
                            <Typography>{reaction.label}</Typography>
                            {reactionsCount[reaction.emoji] > 0 && (
                                <Chip
                                    label={reactionsCount[reaction.emoji]}
                                    size="small"
                                    color="primary"
                                />
                            )}
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default MessageReactions;
