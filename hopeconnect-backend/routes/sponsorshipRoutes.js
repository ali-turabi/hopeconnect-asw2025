const express = require('express');
const router = express.Router();
const sponsorshipController = require('../controllers/sponsorshipController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes - require authentication
router.post('/', authMiddleware, sponsorshipController.createSponsorship);
router.get('/my-sponsorships', authMiddleware, sponsorshipController.getMySponsorships);

module.exports = router;