const express = require('express');
const router = express.Router();
const expenditureController = require('../controllers/expenditureController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateExpenditure } = require('../utils/validators');

router.post('/', authenticate, authorize('admin'), validateExpenditure, expenditureController.createExpenditure);
router.get('/orphanage/:id', authenticate, expenditureController.getOrphanageExpenditures);
router.get('/donation/:id', authenticate, expenditureController.getDonationExpenditures);

module.exports = router;
