const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdminOrSuperAdmin, isSuperAdmin } = require('../middleware/auth');

// Confirm user registration
router.put('/confirm/:id', isAdminOrSuperAdmin, adminController.confirmUser);

// Change user role (only super admin)
router.put('/role/:id', isSuperAdmin, adminController.changeUserRole);

module.exports = router;
