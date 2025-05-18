const express = require('express');
const router = express.Router();
const reviewPlatformController = require('../controllers/reviewPlatformController'); // Updated filename

router.post('/reviews', reviewPlatformController.createReview);
router.get('/reviews', reviewPlatformController.getAllReviews);

module.exports = router;