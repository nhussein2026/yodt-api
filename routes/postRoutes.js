const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/postController');
const { authenticateJWT, isConfirmed, isAdminOrSuperAdmin } = require('../middleware/auth');

// Get all posts
router.get('/', getPosts);

// Get post by ID
router.get('/:id', getPostById);

// Create a new post
router.post('/add', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, createPost);

// Update a post
router.put('/:id', authenticateJWT, isAdminOrSuperAdmin, updatePost);

// Delete a post
router.delete('/:id', authenticateJWT, isAdminOrSuperAdmin, deletePost);

module.exports = router;
