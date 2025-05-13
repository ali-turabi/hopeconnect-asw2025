const express = require('express');
const router = express.Router();
const OrphanController = require('../controllers/orphanController');
const { authenticate, authorizeAdmin, authorizeStaff } = require('../middleware/auth');

// Staff-only routes
router.post('/', authenticate, authorizeStaff, OrphanController.create);
router.get('/', authenticate, OrphanController.getAll);
router.get('/:id', authenticate, OrphanController.getById);
router.put('/:id', authenticate, authorizeStaff, OrphanController.update);

// Admin-only routes
router.put('/:id/sponsor', authenticate, authorizeAdmin, OrphanController.setSponsoredStatus);
router.put('/:id/status', authenticate, authorizeAdmin, OrphanController.setActiveStatus);
router.delete('/:id', authenticate, authorizeAdmin, OrphanController.delete);

module.exports = router;