const Post = require('../models/Post');
const User = require('../models/User');

// Crear nuevo post
const createPost = async (req, res) => {
    try {
        const { contenido, imagen, tipo, privacidad, etiquetas } = req.body;

        const post = new Post({
            usuario: req.user._id,
            contenido,
            imagen,
            tipo,
            privacidad,
            etiquetas
        });

        await post.save();

        // Actualizar posts del usuario
        await User.findByIdAndUpdate(req.user._id, {
            $push: { posts: post._id }
        });

        res.status(201).send(post);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Obtener posts de usuario
const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ usuario: req.params.userId })
            .populate('usuario', 'nombre apellido fotoPerfil')
            .sort('-fechaPublicacion');

        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Obtener feed de posts
const getFeed = async (req, res) => {
    try {
        // Obtener usuarios seguidos
        const following = await User.findById(req.user._id)
            .select('siguiendo')
            .populate('siguiendo');

        // Obtener posts de usuarios seguidos
        const posts = await Post.find({
            usuario: { $in: following.siguiendo }
        })
        .populate('usuario', 'nombre apellido fotoPerfil')
        .sort('-fechaPublicacion');

        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Dar like a post
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        
        if (!post) {
            return res.status(404).send({ error: 'Post no encontrado' });
        }

        // Verificar si ya le dio like
        if (post.likes.includes(req.user._id)) {
            return res.status(400).send({ error: 'Ya le diste like a este post' });
        }

        // Agregar like
        post.likes.push(req.user._id);
        await post.save();

        res.send(post);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Quitar like de post
const unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        
        if (!post) {
            return res.status(404).send({ error: 'Post no encontrado' });
        }

        // Verificar si no le dio like
        if (!post.likes.includes(req.user._id)) {
            return res.status(400).send({ error: 'No le diste like a este post' });
        }

        // Quitar like
        post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
        await post.save();

        res.send(post);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Agregar comentario
const addComment = async (req, res) => {
    try {
        const { contenido } = req.body;
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({ error: 'Post no encontrado' });
        }

        // Agregar comentario
        post.comentarios.push({
            usuario: req.user._id,
            contenido,
            fecha: new Date()
        });

        await post.save();
        res.send(post);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Eliminar comentario
const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({ error: 'Post no encontrado' });
        }

        // Encontrar y eliminar el comentario
        post.comentarios = post.comentarios.filter(comment => 
            comment.usuario.toString() !== req.user._id.toString() || 
            comment._id.toString() !== req.params.commentId
        );

        await post.save();
        res.send(post);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Eliminar post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({ error: 'Post no encontrado' });
        }

        // Verificar si el usuario es el propietario
        if (post.usuario.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'No tienes permiso para eliminar este post' });
        }

        // Eliminar post
        await post.remove();

        // Actualizar posts del usuario
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { posts: req.params.postId }
        });

        res.send({ message: 'Post eliminado exitosamente' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Buscar posts
const searchPosts = async (req, res) => {
    try {
        const { query } = req.query;
        const posts = await Post.find({
            $or: [
                { contenido: { $regex: query, $options: 'i' } },
                { etiquetas: { $regex: query, $options: 'i' } }
            ]
        })
        .populate('usuario', 'nombre apellido fotoPerfil')
        .sort('-fechaPublicacion');

        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    createPost,
    getUserPosts,
    getFeed,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
    deletePost,
    searchPosts
};
