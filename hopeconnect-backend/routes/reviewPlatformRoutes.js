const express = require('express');
const router = express.Router();
const reviewPlatformController = require('../controllers/reviewPlatformController'); // Updated filename
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.post('/reviewsPlatform', reviewPlatformController.createReview);
router.get('/reviewsPlatform',authenticate, authorizeAdmin, reviewPlatformController.getAllReviews);

module.exports = router;