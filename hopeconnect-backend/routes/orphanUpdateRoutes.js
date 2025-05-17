const express = require('express');
const router = express.Router();
const orphanUpdateController = require('../controllers/orphanUpdateController');
const verifyAnyStaff = require('../middleware/verifyAnyStaff');

// Create new orphan update (protected by staff middleware)
router.post('/', verifyAnyStaff, orphanUpdateController.createUpdate);

// Get updates for an orphan
router.get('/:orphanId', orphanUpdateController.getUpdatesByOrphanId);

module.exports = router;