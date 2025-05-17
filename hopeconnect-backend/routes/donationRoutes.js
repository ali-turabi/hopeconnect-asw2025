const express = require('express');
const router = express.Router();

// Import all controller functions at once
const donationController = require('../controllers/donationController');
const { authorizeDonor } = require('../middleware/auth');
const verifyAdminStaff = require('../middleware/verifyAdminStaff');

// Existing routes
router.post('/', authorizeDonor, donationController.createDonation);
router.get('/categories', donationController.getDonationCategories);
router.patch('/:id/payment-status', verifyAdminStaff, donationController.updatePaymentStatus);

// New routes
router.get('/', verifyAdminStaff, donationController.getAllDonations);
router.delete('/:id', verifyAdminStaff, donationController.deleteDonation);
router.get('/summary', verifyAdminStaff, donationController.getDonationSummary);
//router.get('/stats/monthly', verifyAdminStaff, donationController.getMonthlyStats);
//router.get('/top-donors', verifyAdminStaff, donationController.getTopDonors);
// In donationRoutes.js TEMPORARY CHANGE
router.get(
  '/donor/:donorId',
  // authorizeDonor, // Comment out this middleware temporarily
  donationController.getDonationsByDonor
);router.get('/orphans/:id/donations', verifyAdminStaff, donationController.getOrphanDonations);
router.get(
  '/orphanages/:id/summary',
  verifyAdminStaff, // Or appropriate middleware
  donationController.getOrphanageDonationsSummary
);

module.exports = router;