const express = require('express');
const path = require('path');

// Servir archivos estáticos
const serveStatic = express.static(path.join(__dirname, '../client/build'));

// Servir archivos de uploads
const serveUploads = express.static(path.join(__dirname, '../uploads'));

module.exports = {
    serveStatic,
    serveUploads
};
