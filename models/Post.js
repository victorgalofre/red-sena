const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contenido: {
        type: String,
        required: true,
        trim: true
    },
    imagen: {
        type: String,
        default: ''
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comentarios: [{
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        contenido: {
            type: String,
            required: true
        },
        fecha: {
            type: Date,
            default: Date.now
        }
    }],
    fechaPublicacion: {
        type: Date,
        default: Date.now
    },
    tipo: {
        type: String,
        enum: ['texto', 'imagen', 'video'],
        default: 'texto'
    },
    privacidad: {
        type: String,
        enum: ['publico', 'seguidores', 'privado'],
        default: 'publico'
    },
    etiquetas: [{
        type: String,
        default: []
    }]
});

// Método para verificar si un usuario ha dado like
postSchema.methods.hasLiked = function(userId) {
    return this.likes.includes(userId);
};

// Método para agregar un comentario
postSchema.methods.agregarComentario = function(usuarioId, contenido) {
    this.comentarios.push({
        usuario: usuarioId,
        contenido,
        fecha: new Date()
    });
};

module.exports = mongoose.model('Post', postSchema);
