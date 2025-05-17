import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
    TextField,
} from '@mui/material';
import {
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
} from '@mui/icons-material';
import crypto from 'crypto';

const MessageEncryption = () => {
    const [encryptionKey, setEncryptionKey] = useState('');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const encryptMessage = (message) => {
        try {
            const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
            let encrypted = cipher.update(message, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        } catch (err) {
            setError('Error al encriptar el mensaje');
            return null;
        }
    };

    const decryptMessage = (encryptedMessage) => {
        try {
            const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
            let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (err) {
            setError('Error al desencriptar el mensaje');
            return null;
        }
    };

    const handleEncrypt = (message) => {
        if (!encryptionKey) {
            setError('Por favor, ingresa una clave de encriptación');
            return;
        }

        const encrypted = encryptMessage(message);
        if (encrypted) {
            return encrypted;
        }
        return message;
    };

    const handleDecrypt = (encryptedMessage) => {
        if (!encryptionKey) {
            setError('Por favor, ingresa la clave de encriptación');
            return;
        }

        const decrypted = decryptMessage(encryptedMessage);
        if (decrypted) {
            return decrypted;
        }
        return encryptedMessage;
    };

    return (
        <>
            <IconButton
                onClick={() => setOpen(true)}
                color="primary"
                title="Encriptar mensaje"
            >
                <LockIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Clave de Encriptación</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Clave de encriptación"
                            type="password"
                            value={encryptionKey}
                            onChange={(e) => setEncryptionKey(e.target.value)}
                            helperText="La clave debe tener al menos 8 caracteres"
                        />
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpen(false)}
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MessageEncryption;
