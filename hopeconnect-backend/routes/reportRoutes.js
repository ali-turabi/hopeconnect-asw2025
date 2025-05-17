const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Create report (staff/admin only)
router.post('/',  reportController.createReport);

// Get all reports (admin only)
router.get('/', reportController.getAllReports);

// Get reports for specific receiver (staff/admin or the receiver themselves)
router.get('/receiver/:receiverId', reportController.getReportsByReceiver);

// Update report (staff/admin only)
router.put('/:id', reportController.updateReport);

// Delete report (admin only)
router.delete('/:id', reportController.deleteReport);

module.exports = router;