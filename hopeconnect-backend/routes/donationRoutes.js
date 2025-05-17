const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

const { authenticate, authorizeDonor } = require('../middleware/auth');

// ✅ Protected endpoint: Only donor can access
router.post('/', authenticate, authorizeDonor, donationController.createDonation);

router.get('/categories', donationController.getDonationCategories);

module.exports = router;
