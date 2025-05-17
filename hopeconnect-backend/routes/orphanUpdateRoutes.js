const express = require('express');
const router = express.Router();
const orphanUpdateController = require('../controllers/orphanUpdateController');
const verifyAnyStaff = require('../middleware/verifyAnyStaff');

// Create new orphan update
router.post('/', verifyAnyStaff, orphanUpdateController.createUpdate);

// Get updates for specific orphan
router.get('/orphan/:orphanId', orphanUpdateController.getUpdatesByOrphanId);

// Get all updates with pagination
router.get('/', orphanUpdateController.getAllUpdates);

module.exports = router;