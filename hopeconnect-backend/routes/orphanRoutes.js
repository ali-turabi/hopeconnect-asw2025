const express = require('express');
const router = express.Router();

const orphanController = require('../controllers/orphanController');
const verifyAdminStaff = require('../middleware/verifyAdminStaff');
const verifyAnyStaff = require('../middleware/verifyAnyStaff');
router.get('/non-sponsored', verifyAnyStaff, orphanController.getNonSponsoredOrphans);

// POST /api/orphans/add
router.post('/add', verifyAdminStaff, orphanController.addOrphan);

// GET /api/orphans/all
router.get('/all', verifyAnyStaff, orphanController.getAllOrphans);

// NEW: GET /api/orphans/:id
router.get('/:id', verifyAnyStaff, orphanController.getOrphan);
router.patch('/:id/status', verifyAdminStaff, orphanController.toggleActiveStatus);
router.delete('/:id', verifyAdminStaff, orphanController.deleteOrphan);
router.put('/:id', verifyAdminStaff, orphanController.updateOrphanAdmin);
//router.get('/non-sponsored', verifyAnyStaff, orphanController.getNonSponsoredOrphans);

module.exports = router;