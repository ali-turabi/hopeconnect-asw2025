const express = require('express');
const router = express.Router();
const { createReport } = require('../controllers/reportController');
const verifyAnyStaff = require('../middleware/verifyAnyStaff');
const { authenticate } = require('../middleware/auth');
const reportController = require('../controllers/reportController');


router.post('/', authenticate, reportController.createReport);
router.get('/', authenticate, reportController.getAllReports);
router.get('/receiver/:receiverId', reportController.getReportsByReceiver);
router.put('/:id', reportController.updateReport);
router.delete('/:id', reportController.deleteReport);
module.exports = router;