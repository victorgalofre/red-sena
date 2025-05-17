const User = require('../models/User');

// Obtener perfil de usuario
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('-password');

        if (!user) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        res.send(user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Obtener usuarios (con paginación)
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { fechaRegistro: -1 }
        };

        const users = await User.paginate({}, options);
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Seguir usuario
const followUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Verificar si ya sigue al usuario
        if (req.user.seguidores.includes(userId)) {
            return res.status(400).send({ error: 'Ya sigues a este usuario' });
        }

        // Actualizar seguidores del usuario actual
        await User.findByIdAndUpdate(req.user._id, {
            $push: { seguidores: userId }
        });

        // Actualizar seguidos del usuario a seguir
        await User.findByIdAndUpdate(userId, {
            $push: { siguiendo: req.user._id }
        });

        res.send({ message: 'Usuario seguido exitosamente' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Dejar de seguir usuario
const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar si no sigue al usuario
        if (!req.user.seguidores.includes(userId)) {
            return res.status(400).send({ error: 'No sigues a este usuario' });
        }

        // Actualizar seguidores del usuario actual
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { seguidores: userId }
        });

        // Actualizar seguidos del usuario a dejar de seguir
        await User.findByIdAndUpdate(userId, {
            $pull: { siguiendo: req.user._id }
        });

        res.send({ message: 'Usuario dejado de seguir exitosamente' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Obtener usuarios seguidos
const getFollowing = async (req, res) => {
    try {
        const following = await User.findById(req.params.userId)
            .select('siguiendo')
            .populate('siguiendo', 'nombre apellido fotoPerfil');

        if (!following) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        res.send(following.siguiendo);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Obtener seguidores
const getFollowers = async (req, res) => {
    try {
        const followers = await User.findById(req.params.userId)
            .select('seguidores')
            .populate('seguidores', 'nombre apellido fotoPerfil');

        if (!followers) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        res.send(followers.seguidores);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Buscar usuarios
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const users = await User.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } },
                { apellido: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('nombre apellido email fotoPerfil programa');

        res.send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getProfile,
    getUsers,
    followUser,
    unfollowUser,
    getFollowing,
    getFollowers,
    searchUsers
};
