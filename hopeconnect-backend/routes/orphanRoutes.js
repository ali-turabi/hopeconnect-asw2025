const express = require('express');
const router = express.Router();
const orphanController = require('../controllers/orphanController');
const verifyAdminStaff = require('../middleware/verifyAdminStaff');

// Properly connect the controller function to the route
router.post('/add', verifyAdminStaff, orphanController.addOrphan);

module.exports = router;