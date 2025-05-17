const express = require('express');
const router = express.Router();
const sponsorshipController = require('../controllers/sponsorshipController');

// Create
router.post('/', sponsorshipController.createSponsorship);

// Read
router.get('/', sponsorshipController.getAllSponsorships);
router.get('/:id', sponsorshipController.getSponsorship);
router.get('/user/:userId', sponsorshipController.getUserSponsorships);

// Update
router.put('/:id', sponsorshipController.updateSponsorship);
router.patch('/:id/toggle-active', sponsorshipController.toggleActivation);

// Delete
router.delete('/:id', sponsorshipController.deleteSponsorship);

module.exports = router;