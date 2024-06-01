const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/register', userController.registerUser);
// login for user
router.post('/login', userController.loginUser);

// Get all users
router.get('/', userController.getAllUsers);

module.exports = router;
