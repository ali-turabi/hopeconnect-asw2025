const express = require('express');
const router = express.Router();

const orphanController = require('../controllers/orphanController');
const verifyAdminStaff = require('../middleware/verifyAdminStaff');
const verifyAnyStaff = require('../middleware/verifyAnyStaff');

// POST /api/orphans/add - Requires admin privileges
router.post('/add', verifyAdminStaff, orphanController.addOrphan);

// GET /api/orphans/all - Requires any staff privileges
router.get('/all', verifyAnyStaff, orphanController.getAllOrphans);

module.exports = router;