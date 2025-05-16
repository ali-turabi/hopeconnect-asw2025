const express = require('express');
const router = express.Router();
const verifyAdminStaff = require('../middleware/verifyAdminStaff');
const { addOrphan } = require('../controllers/orphanController');

// POST /api/orphans/add
router.post('/add', verifyAdminStaff, addOrphan);

module.exports = router;
