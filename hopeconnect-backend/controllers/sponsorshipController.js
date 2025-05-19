const Sponsorship = require('../models/Sponsorship');

// Create new sponsorship
// In controllers/sponsorshipController.js
exports.createSponsorship = async (req, res) => {
  try {
    const { orphan_id, donation_model, start_date, end_date, is_active } = req.body;
    const user_id = req.user.user_id; // Use authenticated user's ID
    
    console.log('Creating sponsorship for authenticated user:', user_id);

    // Validate required fields
    if (!orphan_id || !donation_model) {
      return res.status(400).json({ 
        success: false,
        message: 'orphan_id and donation_model are required' 
      });
    }

    // Check if orphanage is active
    try {
      await Sponsorship.validateOrphanageActive(orphan_id);
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    // Set default values
    const sponsorshipData = {
      user_id, // Now using the authenticated user's ID
      orphan_id,
      donation_model,
      start_date: start_date || new Date(),
      end_date: end_date || null,
      is_active: is_active !== undefined ? is_active : true
    };

    const sponsorshipId = await Sponsorship.create(sponsorshipData);
    const newSponsorship = await Sponsorship.findById(sponsorshipId);

    // Update the orphan's sponsorship status
    await Sponsorship.updateOrphanSponsorshipStatus(orphan_id, true);

    return res.status(201).json({
      success: true,
      data: newSponsorship,
      message: 'Sponsorship created successfully'
    });

  } catch (error) {
    console.error('Sponsorship creation failed:', {
      error: error.message,
      sqlError: error.sqlMessage,
      userId: req.user?.user_id,
      body: req.body
    });
    
    return res.status(500).json({ 
      success: false,
      message: 'Failed to create sponsorship',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        details: error.sqlMessage
      })
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
    // First get the sponsorship to know which orphan we're dealing with
    const sponsorship = await Sponsorship.findById(req.params.id);
    
    await Sponsorship.delete(req.params.id);
    
    // Check if there are any other active sponsorships for this orphan
    const [otherSponsorships] = await pool.execute(
      'SELECT id FROM sponsorships WHERE orphan_id = ? AND id != ?',
      [sponsorship.orphan_id, req.params.id]
    );
    
    // If no other sponsorships exist, set is_sponsored to false
    if (otherSponsorships.length === 0) {
      await Sponsorship.updateOrphanSponsorshipStatus(sponsorship.orphan_id, false);
    }
    
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