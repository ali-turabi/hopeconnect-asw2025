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