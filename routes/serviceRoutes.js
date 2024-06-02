const express = require('express');
const router = express.Router();
const { getServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const { authenticateJWT, isAdminOrSuperAdmin, isConfirmed } = require('../middleware/auth');

// Get all services
router.get('/', authenticateJWT, isConfirmed, getServices);

// Get service by ID
router.get('/:id', authenticateJWT, isConfirmed, getServiceById);

// Create a new service
router.post('/', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, createService);

// Update a service
router.put('/:id', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, updateService);

// Delete a service
router.delete('/:id', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, deleteService);

module.exports = router;
