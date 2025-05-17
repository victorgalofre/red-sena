const fs = require('fs');
const path = require('path');

// Subir imagen de perfil
const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'No se subió ningún archivo' });
        }

        // Actualizar foto de perfil del usuario
        await User.findByIdAndUpdate(req.user._id, {
            fotoPerfil: `/uploads/${req.file.filename}`
        });

        res.send({
            message: 'Foto de perfil actualizada exitosamente',
            url: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Subir imagen de post
const uploadPostImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'No se subió ningún archivo' });
        }

        res.send({
            message: 'Imagen subida exitosamente',
            url: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Eliminar archivo
const deleteFile = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);

        // Verificar si el archivo existe
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.send({ message: 'Archivo eliminado exitosamente' });
        } else {
            res.status(404).send({ error: 'Archivo no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Obtener archivo
const getFile = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);

        // Verificar si el archivo existe
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send({ error: 'Archivo no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    uploadProfilePicture,
    uploadPostImage,
    deleteFile,
    getFile
};
