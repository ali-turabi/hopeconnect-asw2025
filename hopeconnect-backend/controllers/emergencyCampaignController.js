const {
  getAllEmergencyCampaigns,
  getEmergencyCampaignById,
  createEmergencyCampaign,
  deleteEmergencyCampaignById,
  checkUserExistsByName,
  checkCampaignExistsById,
  joinEmergencyCampaign,
  donateToCampaign,
  getUsersWithCampaigns,
  getActiveEmergencyCampaigns,
  updateEmergencyCampaign,
} = require('../models/emergencyCampaignModel');

const { sendEmail } = require('../utils/emailService');

exports.getAllEmergencyCampaigns = async (req, res) => {
  try {
    const campaigns = await getAllEmergencyCampaigns();
    res.status(200).json({ campaigns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmergencyCampaignById = async (req, res) => {
  try {
    const campaign = await getEmergencyCampaignById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.status(200).json({ campaign });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEmergencyCampaign = async (req, res) => {
  try {
    const result = await createEmergencyCampaign(req.body);
    res.status(201).json({ message: 'Emergency campaign created', campaign_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEmergencyCampaignById = async (req, res) => {
  try {
    await deleteEmergencyCampaignById(req.params.id);
    res.status(200).json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.joinEmergencyCampaign = async (req, res) => {
  try {
    const { user_name } = req.body;
    const campaign_id = req.params.id;

    const user = await checkUserExistsByName(user_name);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const campaign = await checkCampaignExistsById(campaign_id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    await joinEmergencyCampaign(user.user_id, campaign_id);

    // Send notification email
    await sendEmail(user.email, 'Campaign Join Request', `You joined the campaign: ${campaign.title}`);

    res.status(200).json({ message: 'Joined campaign successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.donateToCampaign = async (req, res) => {
  try {
    const campaign_id = req.params.id;
    const donationData = req.body;
    await donateToCampaign(campaign_id, donationData);

    res.status(200).json({ message: 'Donation recorded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listUsersWithCampaigns = async (req, res) => {
  try {
    const data = await getUsersWithCampaigns();
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActiveEmergencyCampaigns = async (req, res) => {
  try {
    const campaigns = await getActiveEmergencyCampaigns();
    res.status(200).json({ campaigns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEmergencyCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    await updateEmergencyCampaign(id, updateData);
    res.status(200).json({ message: 'Campaign updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
