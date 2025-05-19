const express = require('express');
const router = express.Router();
const sponsorshipController = require('../controllers/sponsorshipController');
const { authenticate, authorizeAdmin, authorizeSponsor } = require('../middleware/auth');

// Apply authentication to ALL routes
router.use(authenticate);

// 1. ADMIN-ONLY ENDPOINTS
router.get('/', authorizeAdmin, sponsorshipController.getAllSponsorships); // Get all sponsorships
router.get('/:id', authorizeAdmin, sponsorshipController.getSponsorship); // Get by ID
router.patch('/:id/toggle-active', authorizeAdmin, sponsorshipController.toggleActivation); // Toggle status
router.delete('/:id', authorizeAdmin, sponsorshipController.deleteSponsorship); // Delete

// 2. SPONSOR-ONLY ENDPOINTS
router.post('/', authorizeSponsor, sponsorshipController.createSponsorship); // Create
router.put('/:id', authorizeSponsor, sponsorshipController.updateSponsorship); // Update
router.get('/user/:userId', authorizeSponsor, sponsorshipController.getUserSponsorships); // Get user's sponsorships

module.exports = router;