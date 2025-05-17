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
