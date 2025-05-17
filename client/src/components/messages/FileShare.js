import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Typography,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    AttachFile as AttachFileIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import axios from 'axios';

const FileShare = ({ onFileSelected }) => {
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post('/api/files/upload', formData);
            onFileSelected(response.data);
            setOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al subir archivo');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileUrl) => {
        try {
            const response = await axios.get(fileUrl, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'archivo');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error('Error al descargar:', err);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                onClick={() => setOpen(true)}
            >
                Adjuntar archivo
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Adjuntar archivo</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <input
                            accept="*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={handleFileSelect}
                        />
                        <label htmlFor="raised-button-file">
                            <Button
                                variant="contained"
                                component="span"
                                fullWidth
                            >
                                Seleccionar archivo
                            </Button>
                        </label>
                    </Box>

                    {selectedFile && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper' }}>
                            <Typography variant="subtitle2">
                                {selectedFile.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {selectedFile.size.toLocaleString()} bytes
                            </Typography>
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button
                        onClick={handleUpload}
                        variant="contained"
                        color="primary"
                        disabled={!selectedFile || loading}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Enviar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Componente de visualización de archivos */}
            {selectedFile && (
                <Box sx={{ mt: 2 }}>
                    <Tooltip title="Descargar">
                        <IconButton onClick={() => handleDownload(selectedFile.url)}>
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton onClick={() => setSelectedFile(null)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="subtitle2">
                        {selectedFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {selectedFile.size.toLocaleString()} bytes
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default FileShare;
