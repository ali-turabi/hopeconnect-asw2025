const Donation = require('../models/donationModel');
const DonationCategory = require('../models/donationCategoryModel');

exports.createDonation = async (req, res) => {
  try {
    const { donation_type, category_id, amount } = req.body;

    if (!donation_type || !category_id) {
      return res.status(400).json({
        message: 'Donation type and category are required',
        required_fields: ['donation_type', 'category_id']
      });
    }

    if (donation_type === 'money' && !amount) {
      return res.status(400).json({
        message: 'Amount is required for monetary donations'
      });
    }

    // Check category exists
    const category = await DonationCategory.getById(category_id);
    if (!category) {
      return res.status(400).json({
        message: `Invalid category_id: ${category_id} does not exist`
      });
    }

    const userId = req.user.user_id;

    const donationData = {
      user_id: userId,
      orphanage_id: req.body.orphanage_id,
      donation_type,
      category_id,
      amount,
      description: req.body.description,
      payment_status: req.body.payment_status || 'pending'
    };

    const donationId = await Donation.create(donationData);
    const newDonation = await Donation.getById(donationId);

    res.status(201).json({
      message: 'Donation created successfully',
      donation: newDonation
    });

  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({
      message: 'Server error while creating donation',
      error: error.message
    });
  }
};

exports.getDonationCategories = async (req, res) => {
  try {
    const categories = await Donation.getCategories();
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
};
exports.updatePaymentStatus = async (req, res) => {
  try {
    const donationId = req.params.id;
    const { payment_status } = req.body;

    if (!payment_status) {
      return res.status(400).json({ 
        success: false,
        message: 'payment_status is required' 
      });
    }

    const updatedDonation = await Donation.updatePaymentStatus(donationId, payment_status);

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      donation: updatedDonation
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating payment status',
      error: error.message
    });
  }
};
exports.getDonationCategories = async (req, res) => {
  try {
    const categories = await Donation.getCategories();
    res.json({ 
      success: true, 
      categories 
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching categories',
      error: error.message
    });
  }
};
exports.deleteDonation = async (req, res) => {
  try {
    const donationId = req.params.id;
    const success = await Donation.delete(donationId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting donation',
      error: error.message
    });
  }
};
exports.getDonationSummary = async (req, res) => {
  try {
    const summary = await Donation.getSummary();
    res.json({
      success: true,
      ...summary
    });
  } catch (error) {
    console.error('Error fetching donation summary:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching donation summary',
      error: error.message
    });
  }
};
exports.getOrphanageDonationsSummary = async (req, res) => {
  const orphanageId = req.params.id;

  // Validate input
  if (!orphanageId || !Number.isInteger(Number(orphanageId))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid orphanage ID format'
    });
  }

  try {
    const summary = await Donation.getTotalDonationsByOrphanage(Number(orphanageId));

    return res.json({
      success: true,
      ...summary,
      // Add additional helpful fields
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in getOrphanageDonationsSummary:', {
      error: error.message,
      orphanageId,
      stack: error.stack
    });

    const statusCode = error.message.includes('not found') ? 404 : 500;
    const response = {
      success: false,
      message: error.message.includes('not found') 
        ? 'Orphanage not found' 
        : 'Failed to fetch donation summary'
    };

    if (process.env.NODE_ENV === 'development') {
      response.error = error.message;
      response.stack = error.stack;
    }

    return res.status(statusCode).json(response);
  }
};
exports.getPendingDonationsForOrphanage = async (req, res) => {
  try {
    // Get orphanage_id from the admin staff's token (set by verifyAdminStaff middleware)
    const orphanageId = req.user.orphanage_id;
    
    if (!orphanageId) {
      return res.status(403).json({
        success: false,
        message: 'Admin staff must be associated with an orphanage'
      });
    }

    const pendingDonations = await Donation.getPendingDonationsForOrphanage(orphanageId);
    
    res.json({
      success: true,
      orphanage_id: orphanageId,
      count: pendingDonations.length,
      donations: pendingDonations
    });

  } catch (error) {
    console.error('Error fetching pending donations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pending donations',
      error: error.message
    });
  }
};