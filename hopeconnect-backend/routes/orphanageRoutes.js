const express = require('express');
const router = express.Router();
const OrphanageController = require('../controllers/orphanageController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Public routes
router.post('/signup', OrphanageController.signup);

// Authenticated routes
router.get('/', authenticate, OrphanageController.getAll);
router.get('/:id', authenticate, OrphanageController.getById);
router.put('/:id', authenticate, OrphanageController.update);

// Admin-only routes
router.post('/:id/approve', authenticate, authorizeAdmin, OrphanageController.approve);
router.put('/:id/status', authenticate, authorizeAdmin, OrphanageController.setActiveStatus);
router.delete('/:id', authenticate, authorizeAdmin, OrphanageController.delete);

module.exports = router;