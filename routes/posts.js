const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const postController = require('../controllers/postController');

// Rutas públicas
router.get('/search', postController.searchPosts);

// Rutas privadas (requieren autenticación)
router.use(auth);

// Posts
router.post('/', postController.createPost);
router.get('/user/:userId', postController.getUserPosts);
router.get('/feed', postController.getFeed);
router.delete('/:postId', postController.deletePost);

// Likes
router.post('/:postId/like', postController.likePost);
router.delete('/:postId/like', postController.unlikePost);

// Comentarios
router.post('/:postId/comment', postController.addComment);
router.delete('/:postId/comment/:commentId', postController.deleteComment);

module.exports = router;
