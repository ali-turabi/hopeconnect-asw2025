const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

const { authenticate, authorizeDonor } = require('../middleware/auth');

// ✅ Protected endpoint: Only donor can access
router.post('/', authenticate, authorizeDonor, donationController.createDonation);
router.get('/categories', donationController.getDonationCategories);

// New endpoint for updating payment status - donor only
router.patch(
  '/:id/payment-status',
  authenticate,
  authorizeDonor,
  donationController.updatePaymentStatus
);
router.get('/categories', donationController.getDonationCategories);
router.delete('/:id', donationController.deleteDonation);
router.get('/summary',  donationController.getDonationSummary);
router.get(
  '/orphanages/:id/summary',
   // Or appropriate middleware
  donationController.getOrphanageDonationsSummary
);
module.exports = router;