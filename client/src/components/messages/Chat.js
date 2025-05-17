import React, { useState, useRef, useEffect } from 'react';
import { useMessages } from '../../context/MessageContext';
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
    Menu,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachFileIcon,
    MoreVert as MoreVertIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Reply as ReplyIcon,
} from '@mui/icons-material';
import EmojiPicker from './EmojiPicker';
import StickerPicker from './StickerPicker';
import VoiceRecorder from './VoiceRecorder';
import MessageReactions from './MessageReactions';
import FileShare from './FileShare';
import MessageEncryption from './MessageEncryption';
import TemporaryMessages from './TemporaryMessages';
import AnimatedStickerPicker from './AnimatedStickerPicker';
import axios from 'axios';
import MessageEditor from './MessageEditor';
import VoiceMessagePlaylist from './VoiceMessagePlaylist';
import ThreadedReplies from './ThreadedReplies';
import VoiceNote from './VoiceNote';
import CustomStickerPicker from './CustomStickerPicker';
import GifPicker from './GifPicker';
import MessageFilters from './MessageFilters';
import AnimatedCustomStickerPicker from './AnimatedCustomStickerPicker';
import QuickReplies from './QuickReplies';
import CustomReactions from './CustomReactions';
import { CustomThemes } from '../themes/CustomThemes';
import GroupQuickReplies from './GroupQuickReplies';
import PrivateQuickReplies from './PrivateQuickReplies';
import AnimatedMessageStickers from './AnimatedMessageStickers';
import UserCustomThemes from '../themes/UserCustomThemes';
import AdvancedGroupQuickReplies from './AdvancedGroupQuickReplies';
import AnimatedMessageStickersWithEffects from './AnimatedMessageStickersWithEffects';
import DeviceCustomThemes from '../themes/DeviceCustomThemes';
import EmojiGifQuickReplies from './EmojiGifQuickReplies';
import AnimatedStickersWithCustomAnimations from './AnimatedStickersWithCustomAnimations';
import GradientPatternThemes from '../themes/GradientPatternThemes';
import SoundVibrationQuickReplies from './SoundVibrationQuickReplies';
import InteractiveStickers from './InteractiveStickers';
import TransitionThemes from '../themes/TransitionThemes';
import AnimatedEmojiQuickReplies from './AnimatedEmojiQuickReplies';
import ThreeDAnimatedEmojiQuickReplies from './3DAnimatedEmojiQuickReplies';
import PhysicsStickers from './PhysicsStickers';
import ParticleThemes from '../themes/ParticleThemes';
import ARStickers from './ARStickers';
import ThreeDTheme from '../themes/3DThemes';

const Chat = () => {
    const {
        selectedConversation,
        messages,
        loading,
        error,
        sendMessage,
        markAsRead,
    } = useMessages();
    const [message, setMessage] = useState('');
    const [quoteMessage, setQuoteMessage] = useState(null);
    const messagesEndRef = useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [selectedMessage, setSelectedMessage] = React.useState(null);

    useEffect(() => {
        if (selectedConversation) {
            markAsRead(selectedConversation._id);
        }
    }, [selectedConversation]);

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
            const msg = {
                contenido: message,
                ...(quoteMessage && { cita: {
                    mensaje: quoteMessage.contenido,
                    emisor: quoteMessage.emisor,
                    fecha: quoteMessage.fecha,
                }})
            };
            await sendMessage(selectedConversation._id, msg);
            setMessage('');
            setQuoteMessage(null);
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
        }
    };

    const handleQuote = (msg) => {
        setQuoteMessage(msg);
        setMessage(`> ${msg.contenido}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/messages/${selectedMessage._id}`);
            setMessages(prev => prev.filter(msg => msg._id !== selectedMessage._id));
            setOpenDeleteDialog(false);
        } catch (err) {
            console.error('Error al eliminar mensaje:', err);
        }
    };

    const getMessageDate = (date) => {
        const now = new Date();
        const messageDate = new Date(date);
        
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
                    {/* Lista de mensajes */}
                    <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                        <List>
                            {messages.map((msg, index) => (
                                <React.Fragment key={msg._id}>
                                    <ListItem
                                        sx={{
                                            display: 'flex',
                                            flexDirection: msg.emisor === selectedConversation.usuario._id ? 'row-reverse' : 'row',
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
                                            {msg.emisor !== selectedConversation.usuario._id && (
                                                <Avatar
                                                    src={selectedConversation.usuario.fotoPerfil}
                                                    sx={{ width: 32, height: 32, mr: 1 }}
                                                />
                                            )}
                                            <Box sx={{ position: 'relative' }}>
                                                <Paper
                                                    elevation={1}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 2,
                                                        backgroundColor: msg.emisor === selectedConversation.usuario._id 
                                                            ? 'primary.main' 
                                                            : 'background.paper',
                                                        color: msg.emisor === selectedConversation.usuario._id 
                                                            ? 'white' 
                                                            : 'text.primary',
                                                    }}
                                                >
                                                    {msg.cita && (
                                                        <Box sx={{ mb: 1, bgcolor: 'background.paper', p: 1 }}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {msg.cita.emisor.nombre} {msg.cita.emisor.apellido}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {msg.cita.mensaje}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {getMessageDate(msg.cita.fecha)}
                                                            </Typography>
                                                        </Box>
                                                    )}
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
                                                        {getMessageDate(msg.fecha)}
                                                    </Typography>
                                                    <MessageReactions message={msg} />
                                            <MessageEditor
                                                message={msg}
                                                onEdit={(id, newContent) => {
                                                    // Aquí iría la lógica para actualizar el mensaje en la UI
                                                    console.log('Mensaje editado:', id, newContent);
                                                }}
                                                onDelete={(id) => {
                                                    // Aquí iría la lógica para eliminar el mensaje de la UI
                                                    console.log('Mensaje eliminado:', id);
                                                }}
                                            />
                                                </Paper>
                                                {msg.emisor === selectedConversation.usuario._id && (
                                                    <IconButton
                                                        size="small"
                                                        sx={{ position: 'absolute', top: 8, right: 8 }}
                                                        onClick={(e) => {
                                                            setSelectedMessage(msg);
                                                            setAnchorEl(e.currentTarget);
                                                        }}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    {index === messages.length - 1 && (
                                        <div ref={messagesEndRef} />
                                    )}
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
                                        <MenuItem
                                            onClick={() => {
                                                handleQuote(selectedMessage);
                                                setAnchorEl(null);
                                            }}
                                            startIcon={<ReplyIcon />}
                                        >
                                            Responder
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setOpenDeleteDialog(true);
                                                setAnchorEl(null);
                                            }}
                                            startIcon={<DeleteIcon />}
                                        >
                                            Eliminar
                                        </MenuItem>
                                    </Menu>
                                    <Dialog
                                        open={openDeleteDialog}
                                        onClose={() => setOpenDeleteDialog(false)}
                                    >
                                        <DialogTitle>Eliminar mensaje</DialogTitle>
                                        <DialogContent>
                                            <Typography>
                                                ¿Estás seguro de que quieres eliminar este mensaje?
                                            </Typography>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                                            <Button onClick={handleDelete} variant="contained" color="error">
                                                Eliminar
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>

                    {/* Formulario de mensaje */}
                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        <form onSubmit={handleSendMessage}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <EmojiPicker onEmojiClick={(emoji) => setMessage(prev => prev + emoji)} />
                                <StickerPicker onStickerSelect={(sticker) => setMessage(prev => prev + sticker)} />
                                <VoiceRecorder onVoiceMessage={(url) => {
                                    const msg = {
                                        contenido: `[Audio]`,
                                        audio: url
                                    };
                                    sendMessage(selectedConversation._id, msg);
                                }} />
                                <FileShare onFileSelected={(file) => {
                                    const msg = {
                                        contenido: `[Archivo]`,
                                        archivo: file.url
                                    };
                                    sendMessage(selectedConversation._id, msg);
                                }} />
                                <MessageEncryption />
                                <TemporaryMessages />
                                <AnimatedStickerPicker onStickerSelect={(sticker) => {
                                    const msg = {
                                        contenido: `[Sticker]`,
                                        sticker: sticker.url
                                    };
                                    sendMessage(selectedConversation._id, msg);
                                }} />
                                <VoiceMessagePlaylist conversationId={selectedConversation._id} />
                                <ThreadedReplies
                                    message={msg}
                                    onReply={(reply) => {
                                        // Aquí iría la lógica para mostrar la respuesta en la UI
                                        console.log('Respuesta enviada:', reply);
                                    }}
                                    onEdit={(id, newContent) => {
                                        // Aquí iría la lógica para actualizar la respuesta en la UI
                                        console.log('Respuesta editada:', id, newContent);
                                    }}
                                    onDelete={(id) => {
                                        // Aquí iría la lógica para eliminar la respuesta de la UI
                                        console.log('Respuesta eliminada:', id);
                                    }}
                                />
                                {msg.tipo === 'nota_voz' && (
                                    <VoiceNote
                                        note={msg}
                                        onDelete={(id) => {
                                            // Aquí iría la lógica para eliminar la nota de voz
                                            console.log('Nota eliminada:', id);
                                        }}
                                    />
                                )}
                                <CustomStickerPicker
                                    onStickerSelect={(sticker) => {
                                        const msg = {
                                            contenido: `[Sticker Personalizado]`,
                                            sticker: sticker.url
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                />
                                <GifPicker
                                    onGifSelect={(gif) => {
                                        const msg = {
                                            contenido: `[GIF]`,
                                            gif: gif.url,
                                            width: gif.width,
                                            height: gif.height
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                />
                                <MessageFilters
                                    message={msg}
                                    onFilterApply={(filteredMessage) => {
                                        // Aquí iría la lógica para aplicar los filtros al mensaje
                                        console.log('Filtros aplicados:', filteredMessage);
                                    }}
                                />
                                <AnimatedCustomStickerPicker
                                    onStickerSelect={(sticker) => {
                                        const msg = {
                                            contenido: `[Sticker Animado Personalizado]`,
                                            sticker: sticker.url
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                />
                                <QuickReplies
                                    message={msg}
                                    onReply={(reply) => {
                                        const msg = {
                                            contenido: reply
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                />
                                <CustomReactions
                                    message={msg}
                                    onReact={(reaction) => {
                                        const msg = {
                                            contenido: `[Reacción] ${reaction}`
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                />
                                <CustomThemes
                                    onThemeChange={(theme) => {
                                        // Aquí iría la lógica para cambiar el tema
                                        console.log('Tema seleccionado:', theme);
                                    }}
                                />
                                {selectedConversation.tipo === 'grupo' && (
                                    <GroupQuickReplies
                                        groupId={selectedConversation._id}
                                        onReply={(reply) => {
                                            const msg = {
                                                contenido: reply
                                            };
                                            sendMessage(selectedConversation._id, msg);
                                        }}
                                    />
                                )}
                                {selectedConversation.tipo === 'privado' && (
                                    <PrivateQuickReplies
                                        userId={selectedConversation.usuario._id}
                                        onReply={(reply) => {
                                            const msg = {
                                                contenido: reply
                                            };
                                            sendMessage(selectedConversation._id, msg);
                                        }}
                                    />
                                )}
                                <AnimatedMessageStickers
                                    message={msg}
                                    onStickerAdd={(sticker) => {
                                        const msg = {
                                            contenido: `[Sticker Animado]`,
                                            sticker: sticker.url
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                    onStickerRemove={(stickerId) => {
                                        // Aquí iría la lógica para eliminar el sticker
                                        console.log('Sticker eliminado:', stickerId);
                                    }}
                                />
                                <UserCustomThemes
                                    userId={user._id}
                                    onThemeChange={(theme) => {
                                        // Aquí iría la lógica para cambiar el tema personalizado
                                        console.log('Tema personalizado seleccionado:', theme);
                                    }}
                                />
                                {selectedConversation.tipo === 'grupo' && (
                                    <AdvancedGroupQuickReplies
                                        groupId={selectedConversation._id}
                                        onReply={(reply) => {
                                            const msg = {
                                                contenido: reply
                                            };
                                            sendMessage(selectedConversation._id, msg);
                                        }}
                                    />
                                )}
                                <AnimatedMessageStickersWithEffects
                                    message={msg}
                                    onStickerAdd={(sticker) => {
                                        const msg = {
                                            contenido: `[Sticker Animado con Efectos]`,
                                            sticker: {
                                                ...sticker,
                                                efecto: sticker.efecto,
                                                valorEfecto: sticker.valorEfecto,
                                            }
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                    onStickerRemove={(stickerId) => {
                                        // Aquí iría la lógica para eliminar el sticker
                                        console.log('Sticker eliminado:', stickerId);
                                    }}
                                />
                                <DeviceCustomThemes
                                    userId={user._id}
                                    onThemeChange={(theme) => {
                                        // Aquí iría la lógica para cambiar el tema por dispositivo
                                        console.log('Tema por dispositivo seleccionado:', theme);
                                    }}
                                />
                                <EmojiGifQuickReplies
                                    onReply={(reply) => {
                                        const msg = {
                                            contenido: reply.texto,
                                            emoji: reply.emoji,
                                            gif: reply.gif
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                />
                                <AnimatedStickersWithCustomAnimations
                                    message={msg}
                                    onStickerAdd={(sticker) => {
                                        const msg = {
                                            contenido: `[Sticker Animado con Animaciones]`,
                                            sticker: {
                                                ...sticker,
                                                animacion: sticker.animacion,
                                                valorAnimacion: sticker.valorAnimacion,
                                                velocidadAnimacion: sticker.velocidadAnimacion,
                                            }
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                    onStickerRemove={(stickerId) => {
                                        // Aquí iría la lógica para eliminar el sticker
                                        console.log('Sticker eliminado:', stickerId);
                                    }}
                                />
                                <GradientPatternThemes
                                    userId={user._id}
                                    onThemeChange={(theme) => {
                                        // Aquí iría la lógica para cambiar el tema con gradientes y patrones
                                        console.log('Tema con gradientes y patrones seleccionado:', theme);
                                    }}
                                />
                                <SoundVibrationQuickReplies
                                    onReply={(reply) => {
                                        const msg = {
                                            contenido: reply.texto,
                                            sonido: reply.sonido,
                                            vibracion: reply.vibracion,
                                            volumen: reply.volumen,
                                            duracionVibracion: reply.duracionVibracion,
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                />
                                <InteractiveStickers
                                    message={msg}
                                    onStickerAdd={(sticker) => {
                                        const msg = {
                                            contenido: `[Sticker Interactivo]`,
                                            sticker: {
                                                ...sticker,
                                                interaccion: sticker.interaccion,
                                                valorInteraccion: sticker.valorInteraccion,
                                                velocidadInteraccion: sticker.velocidadInteraccion,
                                                areaTactil: sticker.areaTactil,
                                            }
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                    onStickerRemove={(stickerId) => {
                                        // Aquí iría la lógica para eliminar el sticker interactivo
                                        console.log('Sticker interactivo eliminado:', stickerId);
                                    }}
                                />
                                <TransitionThemes
                                    userId={user._id}
                                    onThemeChange={(theme) => {
                                        // Aquí iría la lógica para cambiar el tema con animaciones de transición
                                        console.log('Tema con animaciones de transición seleccionado:', theme);
                                    }}
                                />
                                <AnimatedEmojiQuickReplies
                                    onReply={(reply) => {
                                        const msg = {
                                            contenido: reply.texto,
                                            emoji: reply.emoji,
                                            animacion: reply.animacion,
                                            duracion: reply.duracion,
                                            iteraciones: reply.iteraciones,
                                            delay: reply.delay,
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                />
                                <ARStickers
                                    message={msg}
                                    onStickerAdd={(sticker) => {
                                        const msg = {
                                            contenido: `[Sticker de AR]`,
                                            sticker: {
                                                ...sticker,
                                                efecto: sticker.efecto,
                                                valorEfecto: sticker.valorEfecto,
                                                velocidadEfecto: sticker.velocidadEfecto,
                                                posicionCamara: sticker.posicionCamara,
                                            }
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                    onStickerRemove={(stickerId) => {
                                        // Aquí iría la lógica para eliminar el sticker de AR
                                        console.log('Sticker de AR eliminado:', stickerId);
                                    }}
                                />
                                <ThreeDTheme
                                    userId={user._id}
                                    onThemeChange={(theme) => {
                                        // Aquí iría la lógica para cambiar el tema 3D
                                        console.log('Tema 3D seleccionado:', theme);
                                    }}
                                />
                                <ParticleThemes
                                    userId={user._id}
                                    onThemeChange={(theme) => {
                                        // Aquí iría la lógica para cambiar el tema con efectos de partículas
                                        console.log('Tema con efectos de partículas seleccionado:', theme);
                                    }}
                                />
                                <ThreeDAnimatedEmojiQuickReplies
                                    onReply={(reply) => {
                                        const msg = {
                                            contenido: reply.texto,
                                            emoji: reply.emoji,
                                            animacion: reply.animacion,
                                            duracion: reply.duracion,
                                            iteraciones: reply.iteraciones,
                                            delay: reply.delay,
                                            efecto3d: reply.efecto3d,
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                />
                                <PhysicsStickers
                                    message={msg}
                                    onStickerAdd={(sticker) => {
                                        const msg = {
                                            contenido: `[Sticker con efectos de física]`,
                                            sticker: {
                                                ...sticker,
                                                efectoFisica: sticker.efectoFisica,
                                                valorEfecto: sticker.valorEfecto,
                                                velocidadEfecto: sticker.velocidadEfecto,
                                                propiedadesFisicas: sticker.propiedadesFisicas,
                                            }
                                        };
                                        sendMessage(selectedConversation._id, msg);
                                    }}
                                    onStickerRemove={(stickerId) => {
                                        // Aquí iría la lógica para eliminar el sticker con efectos de física
                                        console.log('Sticker con efectos de física eliminado:', stickerId);
                                    }}
                                />
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
        </Box>
    );
};

export default Chat;
