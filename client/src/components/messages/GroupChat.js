import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    List,
    ListItem,
    ListItemText,
    Avatar,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
} from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachFileIcon,
    EmojiEmotions as EmojiEmotionsIcon,
    Add as AddIcon,
    PersonAdd as PersonAddIcon,
} from '@mui/icons-material';

const GroupChat = ({ group, messages, loading, error, sendMessage, markAsRead }) => {
    const [message, setMessage] = useState('');
    const [openInviteDialog, setOpenInviteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (group) {
            markAsRead(group._id);
        }
    }, [group]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            await sendMessage(group._id, { contenido: message });
            setMessage('');
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
        }
    };

    const handleInvite = async () => {
        if (!selectedUser) return;

        try {
            await axios.post(`/api/groups/${group._id}/invite`, { usuarioId: selectedUser._id });
            setOpenInviteDialog(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Error al invitar usuario:', err);
        }
    };

    const getLastMessage = (message) => {
        const now = new Date();
        const messageDate = new Date(message.fecha);
        
        if (now.getDate() === messageDate.getDate() &&
            now.getMonth() === messageDate.getMonth() &&
            now.getFullYear() === messageDate.getFullYear()) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return messageDate.toLocaleDateString();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                <>
                    {/* Información del grupo */}
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={group.foto}
                                sx={{ width: 48, height: 48 }}
                            >
                                {group.nombre.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="h6">
                                    {group.nombre}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {group.miembros.length} miembros
                                </Typography>
                            </Box>
                            <IconButton onClick={() => setOpenInviteDialog(true)}>
                                <PersonAddIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            {group.miembros.map((miembro) => (
                                <Chip
                                    key={miembro._id}
                                    avatar={
                                        <Avatar src={miembro.fotoPerfil}>
                                            {miembro.nombre.charAt(0)}
                                        </Avatar>
                                    }
                                    label={`${miembro.nombre} ${miembro.apellido}`}
                                    sx={{ mr: 1, mb: 1 }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Lista de mensajes */}
                    <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                        <List>
                            {messages.map((msg, index) => (
                                <React.Fragment key={msg._id}>
                                    <ListItem
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            mb: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                maxWidth: '80%',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <Avatar
                                                src={msg.emisor.fotoPerfil}
                                                sx={{ width: 32, height: 32, mr: 1 }}
                                            >
                                                {msg.emisor.nombre.charAt(0)}
                                            </Avatar>
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    backgroundColor: 'background.paper',
                                                    color: 'text.primary',
                                                }}
                                            >
                                                <Typography variant="caption" color="text.secondary">
                                                    {msg.emisor.nombre} {msg.emisor.apellido}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {msg.contenido}
                                                </Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        mt: 0.5,
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                    }}
                                                >
                                                    {getLastMessage(msg)}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    </ListItem>
                                    {index === messages.length - 1 && (
                                        <div ref={messagesEndRef} />
                                    )}
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>

                    {/* Formulario de mensaje */}
                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        <form onSubmit={handleSendMessage}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <IconButton>
                                    <EmojiEmotionsIcon />
                                </IconButton>
                                <IconButton>
                                    <AttachFileIcon />
                                </IconButton>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Escribe un mensaje..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    sx={{ mr: 1 }}
                                />
                                <IconButton 
                                    type="submit" 
                                    disabled={!message.trim()}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </form>
                    </Box>
                </>
            )}

            {/* Diálogo de invitación */}
            <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)}>
                <DialogTitle>Invitar a grupo</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Buscar usuario..."
                            onChange={(e) => setSelectedUser(e.target.value)}
                        />
                        {selectedUser && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={selectedUser.fotoPerfil} />
                                <Typography>
                                    {selectedUser.nombre} {selectedUser.apellido}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenInviteDialog(false)}>Cancelar</Button>
                    <Button onClick={handleInvite} variant="contained" color="primary">
                        Invitar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GroupChat;
