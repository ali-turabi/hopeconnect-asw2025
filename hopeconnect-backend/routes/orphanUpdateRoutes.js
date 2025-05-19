const express = require('express');
const router = express.Router();
const orphanUpdateController = require('../controllers/orphanUpdateController');
const verifyAnyStaff = require('../middleware/verifyAnyStaff');

// Create new orphan update
router.post('/', orphanUpdateController.createUpdate);

// Get updates for specific orphan
router.get('/orphan/:orphanId', orphanUpdateController.getUpdatesByOrphanId);

// Get all updates
router.get('/', orphanUpdateController.getAllUpdates);

// Get specific update by ID
router.get('/:id', orphanUpdateController.getUpdateById);

// Update an orphan update
router.put('/:updateId',  orphanUpdateController.updateUpdate);

module.exports = router;