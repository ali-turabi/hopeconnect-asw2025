const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { authenticate, authorizeDonor } = require('../middleware/auth');
const verifyAdminStaff = require('../middleware/verifyAdminStaff');

// ✅ Protected endpoint: Only donor can access
router.post('/', authenticate, authorizeDonor, donationController.createDonation);
router.get('/categories', donationController.getDonationCategories);

// Updated endpoint for updating payment status - admin staff only
router.patch(
  '/:id/payment-status',
  authenticate,
  verifyAdminStaff,
  donationController.updatePaymentStatus
);

router.delete('/:id', donationController.deleteDonation);

// Updated summary endpoint - admin only
router.get('/summary', authenticate, verifyAdminStaff, donationController.getDonationSummary);

router.get(
  '/orphanages/:id/summary',
  donationController.getOrphanageDonationsSummary
);

// New endpoint for admin staff to get non-paid donations for their orphanage
router.get(
  '/orphanage/pending',
  authenticate,
  verifyAdminStaff,
  donationController.getPendingDonationsForOrphanage
);

module.exports = router;