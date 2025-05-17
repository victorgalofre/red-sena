import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageProvider } from '../context/MessageContext';
import ConversationList from '../components/messages/ConversationList';
import Chat from '../components/messages/Chat';
import {
    Container,
    Box,
    Typography,
    Paper,
} from '@mui/material';

const Messages = () => {
    const { user } = useAuth();

    return (
        <MessageProvider>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Mensajes
                </Typography>

                <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
                    <ConversationList />
                    <Box sx={{ flex: 1, ml: 2 }}>
                        <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
                            <Chat />
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </MessageProvider>
    );
};

export default Messages;
