const express = require('express');
const router = express.Router();
const orphanUpdateController = require('../controllers/orphanUpdateController');
const authMiddleware = require('../middleware/authMiddleware');
const staffMiddleware = require('../middleware/staffMiddleware');

// Protected routes - require staff authentication
router.post('/', authMiddleware, staffMiddleware, orphanUpdateController.createUpdate);
router.get('/:orphanId', authMiddleware, orphanUpdateController.getOrphanUpdates);

module.exports = router;