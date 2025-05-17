const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// Rutas públicas
router.get('/search', userController.searchUsers);

// Rutas privadas (requieren autenticación)
router.use(auth);

router.get('/profile/:userId', userController.getProfile);
router.get('/', userController.getUsers);
router.get('/:userId/following', userController.getFollowing);
router.get('/:userId/followers', userController.getFollowers);
router.post('/:userId/follow', userController.followUser);
router.delete('/:userId/follow', userController.unfollowUser);

module.exports = router;
