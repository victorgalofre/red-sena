const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    fotoPerfil: {
        type: String,
        default: ''
    },
    biografia: {
        type: String,
        default: ''
    },
    programa: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['estudiante', 'instructor', 'administrador'],
        default: 'estudiante'
    },
    fechaNacimiento: {
        type: Date,
        required: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    seguidores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    siguiendo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// Hash password antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 8);
    next();
});

// Método para verificar contraseña
userSchema.methods.compararPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
