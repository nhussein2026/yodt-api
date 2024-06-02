const express = require('express');
const router = express.Router();
const { getVolunteerings, getVolunteeringById, createVolunteering, updateVolunteering, deleteVolunteering } = require('../controllers/volunteeringController');
const { authenticateJWT, isAdminOrSuperAdmin, isConfirmed } = require('../middleware/auth');

// Get all volunteering opportunities
router.get('/', authenticateJWT, isConfirmed, getVolunteerings);

// Get volunteering opportunity by ID
router.get('/:id', authenticateJWT, isConfirmed, getVolunteeringById);

// Create a new volunteering opportunity
router.post('/', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, createVolunteering);

// Update a volunteering opportunity
router.put('/:id', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, updateVolunteering);

// Delete a volunteering opportunity
router.delete('/:id', authenticateJWT, isConfirmed, isAdminOrSuperAdmin, deleteVolunteering);

module.exports = router;
