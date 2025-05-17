const Sponsorship = require('../models/Sponsorship');

// Create new sponsorship
exports.createSponsorship = async (req, res) => {
  try {
    const { user_id, orphan_id, donation_model, start_date, end_date, is_active } = req.body;
    
    // Validate required fields
    if (!user_id || !orphan_id || !donation_model) {
      return res.status(400).json({ 
        success: false,
        message: 'user_id, orphan_id, and donation_model are required' 
      });
    }

    // Set default values
    const sponsorshipData = {
      user_id,
      orphan_id,
      donation_model,
      start_date: start_date || new Date(), // Default to current date
      end_date: end_date || null,           // Explicitly set to null if not provided
      is_active: is_active !== undefined ? is_active : true // Default to true
    };

    const sponsorshipId = await Sponsorship.create(sponsorshipData);
    const newSponsorship = await Sponsorship.findById(sponsorshipId);

    res.status(201).json({
      success: true,
      data: newSponsorship
    });

  } catch (error) {
    console.error('Error creating sponsorship:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get single sponsorship
exports.getSponsorship = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);
    
    if (!sponsorship) {
      return res.status(404).json({
        success: false,
        message: 'Sponsorship not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sponsorship
    });
  } catch (error) {
    console.error('Error fetching sponsorship:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all sponsorships for user
exports.getUserSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.findByUserId(req.params.userId);
    
    res.status(200).json({
      success: true,
      count: sponsorships.length,
      data: sponsorships
    });
  } catch (error) {
    console.error('Error fetching sponsorships:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all sponsorships (admin)
exports.getAllSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.findAll();
    
    res.status(200).json({
      success: true,
      count: sponsorships.length,
      data: sponsorships
    });
  } catch (error) {
    console.error('Error fetching sponsorships:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update sponsorship
exports.updateSponsorship = async (req, res) => {
  try {
    await Sponsorship.update(req.params.id, req.body);
    const updatedSponsorship = await Sponsorship.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: updatedSponsorship
    });
  } catch (error) {
    console.error('Error updating sponsorship:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete sponsorship
exports.deleteSponsorship = async (req, res) => {
  try {
    await Sponsorship.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: null,
      message: 'Sponsorship deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting sponsorship:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};

// Toggle activation status
exports.toggleActivation = async (req, res) => {
  try {
    await Sponsorship.toggleActivation(req.params.id);
    const updatedSponsorship = await Sponsorship.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: updatedSponsorship,
      message: `Sponsorship ${updatedSponsorship.is_active ? 'activated' : 'deactivated'}`
    });
  } catch (error) {
    console.error('Error toggling activation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};