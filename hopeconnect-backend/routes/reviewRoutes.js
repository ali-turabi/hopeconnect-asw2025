const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateReview } = require('../utils/validators');

router.post('/', authenticate, authorize('donor'), validateReview, reviewController.createReview);
router.get('/orphanage/:id', authenticate, reviewController.getOrphanageReviews);

module.exports = router;
