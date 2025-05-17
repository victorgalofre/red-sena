const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { nombre, apellido, email, password, programa, fechaNacimiento } = req.body;

        // Verificar si el email ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'El email ya está registrado' });
        }

        // Crear nuevo usuario
        const user = new User({
            nombre,
            apellido,
            email,
            password,
            programa,
            fechaNacimiento
        });

        await user.save();

        // Generar token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(201).send({
            user: {
                _id: user._id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                programa: user.programa,
                rol: user.rol
            },
            token
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isMatch = await user.compararPassword(password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.send({
            user: {
                _id: user._id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                programa: user.programa,
                rol: user.rol
            },
            token
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Actualizar perfil
router.patch('/profile', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['nombre', 'apellido', 'biografia', 'fotoPerfil'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Actualizaciones inválidas' });
        }

        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();

        res.send(req.user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
