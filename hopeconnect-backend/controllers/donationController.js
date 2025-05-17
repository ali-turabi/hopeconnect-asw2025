const Donation = require('../models/donationModel');
const DonationCategory = require('../models/donationCategoryModel');

exports.createDonation = async (req, res) => {
  try {
    const { donation_type, category_id, amount, orphanage_id, description, payment_status } = req.body;

    // Input validation
    if (!donation_type || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Donation type and category are required',
        required_fields: ['donation_type', 'category_id']
      });
    }

    if (donation_type === 'money' && (amount === undefined || amount === null)) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required for monetary donations'
      });
    }

    // Check category exists
    const category = await DonationCategory.getById(category_id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: `Invalid category_id: ${category_id} does not exist`
      });
    }

    const userId = req.user.user_id; // Make sure this matches your JWT payload

    const donationData = {
      user_id: userId,
      orphanage_id: orphanage_id || null,
      donation_type,
      category_id,
      amount: donation_type === 'money' ? amount : null,
      description: description || null,
      payment_status: payment_status || 'pending'
    };

    const donationId = await Donation.create(donationData);
    const newDonation = await Donation.getById(donationId);

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      donation: newDonation
    });

  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating donation',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
// Add these exports to your existing controller

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.getAll();
    res.json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching donations',
      error: error.message
    });
  }
};

exports.getDonationsByDonor = async (req, res) => {
  try {
    // Temporary workaround for middleware issue
    if (!req.params.donorId) {
      return res.status(400).json({
        success: false,
        message: 'Donor ID is required'
      });
    }

    const donorId = req.params.donorId;
    
    // Validate donorId is a number
    if (isNaN(donorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid donor ID format'
      });
    }

    // Get donations from model
    const donations = await Donation.getByDonor(parseInt(donorId));

    // Format response
    res.json({
      success: true,
      count: donations.length,
      donor_id: donorId,
      donations
    });

  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

exports.getMonthlyStats = async (req, res) => {
  try {
    const stats = await Donation.getMonthlyStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching monthly stats',
      error: error.message
    });
  }
};

exports.getTopDonors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topDonors = await Donation.getTopDonors(limit);
    res.json({
      success: true,
      topDonors
    });
  } catch (error) {
    console.error('Error fetching top donors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top donors',
      error: error.message
    });
  }
};

exports.getOrphanDonations = async (req, res) => {
  try {
    const orphanId = req.params.id;
    const donations = await Donation.getByOrphan(orphanId);
    
    res.json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    console.error('Error fetching orphan donations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orphan donations',
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
exports.getOrphanDonations = async (req, res) => {
  const orphanId = req.params.id;

  // Validate input
  if (!orphanId || !Number.isInteger(Number(orphanId))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid orphan ID format'
    });
  }

  try {
    const result = await Donation.getDonationsByOrphan(Number(orphanId));

    return res.json({
      success: true,
      orphan_id: result.orphan_id,
      orphan_name: result.orphan_name,
      orphanage_name: result.orphanage_name,
      count: result.donations.length,
      donations: result.donations,
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in getOrphanDonations:', {
      error: error.message,
      orphanId,
      stack: error.stack
    });

    const statusCode = error.message.includes('not found') ? 404 : 500;
    const response = {
      success: false,
      message: error.message.includes('not found') 
        ? error.message 
        : 'Failed to fetch orphan donations'
    };

    if (process.env.NODE_ENV === 'development') {
      response.error = error.message;
      response.stack = error.stack;
    }

    return res.status(statusCode).json(response);
  }
};