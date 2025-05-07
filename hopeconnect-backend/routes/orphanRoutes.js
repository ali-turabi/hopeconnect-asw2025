const express = require('express');
const router = express.Router();
const orphanController = require('../controllers/orphanController');

// Public routes
router.get('/', orphanController.getAllOrphans);
router.get('/:id', orphanController.getOrphanById);

module.exports = router;