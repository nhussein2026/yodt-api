const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, isConfirmed, isAdminOrSuperAdmin } = require('../middleware/auth');
const User = require('../models/User');


// login for user
router.post('/login', userController.loginUser);

// Get all users
router.get('/', userController.getAllUsers);

router.get('/profile', authenticateJWT, userController.fetchUserProfile);
router.get('/role', authenticateJWT, userController.fetchUserProfile);

// Get a single user by ID
router.get('/:userId', authenticateJWT, userController.getUserById);

// Update volunteering hours
router.put('/update-volunteering-hours', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, userController.updateVolunteeringHours);
router.put('/change-user-role/:id', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, userController.changeUserRole);


// Register a new user
router.post('/register', userController.registerUser);

// Approve user
router.post('/approve-user/:userId', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, userController.approveUser);

// Track application
router.get('/track-application/:trackingCode', userController.trackApplication);


// Fetch notifications for admin
router.get('/notifications', authenticateJWT, isAdminOrSuperAdmin, userController.fetchNotificationsForAdmin);

// Update notification status
router.put('/notifications/:notificationId', authenticateJWT, isAdminOrSuperAdmin, userController.updateNotificationStatus);

// Delete a user by ID
router.delete('/:userId', authenticateJWT, userController.deleteUser);

// Update a user by ID
router.put('/:userId', authenticateJWT, userController.updateUser);

module.exports = router;
