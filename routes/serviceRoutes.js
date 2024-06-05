const express = require('express');
const router = express.Router();
const { getAllServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const { authenticateJWT, isAdminOrSuperAdmin, isConfirmed } = require('../middleware/auth');

// Get all services
router.get('/', getAllServices);

// Get service by ID
router.get('/:id',  getServiceById);

// Create a new service
router.post('/', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, createService);

// Update a service
router.put('/:id', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, updateService);

// Delete a service
router.delete('/:id', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, deleteService);

module.exports = router;
