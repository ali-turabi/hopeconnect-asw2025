const Sponsorship = require('../models/Sponsorship');

exports.createSponsorship = async (req, res) => {
  try {
    // In a real app, you'd want to validate the input data first
    const sponsorshipId = await Sponsorship.create(req.body);
    res.status(201).json({ 
      message: 'Sponsorship created successfully',
      sponsorshipId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating sponsorship' });
  }
};

exports.getMySponsorships = async (req, res) => {
  try {
    // Assuming user ID is in req.user from authentication middleware
    const sponsorships = await Sponsorship.getBySponsor(req.user.user_id);
    res.json(sponsorships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching sponsorships' });
  }
};