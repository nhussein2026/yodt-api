const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, isConfirmed, isAdminOrSuperAdmin } = require('../middleware/auth');

// Register a new user
router.post('/register', userController.registerUser);
// login for user
router.post('/login', userController.loginUser);

// Get all users
router.get('/', userController.getAllUsers);

// Update volunteering hours
router.put('/update-volunteering-hours', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, userController.updateVolunteeringHours);


module.exports = router;
