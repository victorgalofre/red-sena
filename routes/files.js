const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const fileController = require('../controllers/fileController');

// Rutas públicas
router.get('/uploads/:filename', fileController.getFile);

// Rutas privadas (requieren autenticación)
router.use(auth);

// Subida de archivos
router.post('/profile-picture', upload.single('file'), fileController.uploadProfilePicture);
router.post('/post-image', upload.single('file'), fileController.uploadPostImage);
router.delete('/uploads/:filename', fileController.deleteFile);

module.exports = router;
