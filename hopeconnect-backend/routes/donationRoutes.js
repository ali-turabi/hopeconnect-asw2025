const express = require('express');
const router = express.Router();

const { createDonation, getDonationCategories, updatePaymentStatus } = require('../controllers/donationController');
const { authorizeDonor } = require('../middleware/auth');
const verifyAdminStaff = require('../middleware/verifyAdminStaff'); // ✅ CORRECT

console.log('updatePaymentStatus:', updatePaymentStatus); // Debug line
console.log('verifyAdminStaff:', verifyAdminStaff);

router.post('/', authorizeDonor, createDonation);
router.get('/categories', getDonationCategories);
router.patch('/:id/payment-status', verifyAdminStaff, updatePaymentStatus);

module.exports = router;
