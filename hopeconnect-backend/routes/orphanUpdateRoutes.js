const express = require('express');
const router = express.Router();
const orphanUpdateController = require('../controllers/orphanUpdateController');
const verifyAnyStaff = require('../middleware/verifyAnyStaff');

// Create new orphan update
router.post('/', verifyAnyStaff, orphanUpdateController.createUpdate);

// Get updates for specific orphan
router.get('/orphan/:orphanId', orphanUpdateController.getUpdatesByOrphanId);

// Get all updates
router.get('/', orphanUpdateController.getAllUpdates);

// Get specific update by ID
router.get('/:updateId', orphanUpdateController.getUpdateById);
module.exports = router;