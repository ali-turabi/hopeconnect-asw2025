const express = require('express');
const router = express.Router();
const impactReportController = require('../controllers/impactReportController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateImpactReport } = require('../utils/validators');

router.post('/', authenticate, authorize('admin'), validateImpactReport, impactReportController.createReport);
router.get('/orphanage/:id', authenticate, impactReportController.getOrphanageReports);

module.exports = router;