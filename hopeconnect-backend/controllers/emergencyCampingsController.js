import { getAllCampaigns,getCampaignByTitle,insertCampaign,checkOrphanageExists,assignUserToCampaign,deleteCampaignByTitle,donateToCampaignByName,getUsersWithEmergencyCampaigns} from '../models/emergencyCampaignModel.js';


export const fetchAllCampaigns = async (req, res) => {
  try {
    const campaigns = await getAllCampaigns();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const fetchCampaignByTitle = async (req, res) => {
  try {
    const campaign = await getCampaignByTitle(req.params.title);
    if (!campaign) {
      return res.status(404).json({ message: 'There are no Campaigns found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCampaignByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const result = await deleteCampaignByTitle(title);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Emergency Campaign not found' });
    }

    res.status(200).json({ message: 'Emergency Campaign deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete campaign', error: err.message });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const { orphanageId, title, description, type, goalAmount } = req.body;

    const missingFields = [];
    if (!orphanageId) missingFields.push('orphanageId');
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!goalAmount) missingFields.push('goalAmount');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    if (isNaN(goalAmount) || Number(goalAmount) <= 0) {
      return res.status(400).json({ message: 'goalAmount must be a positive number' });
    }

    if (!Number.isInteger(Number(orphanageId))) {
      return res.status(400).json({ message: 'orphanageId must be an integer' });
    }

    const orphanageExists = await checkOrphanageExists(orphanageId);
    if (!orphanageExists) {
      return res.status(404).json({ message: 'Orphanage not found' });
    }

    const result = await insertCampaign(orphanageId, title, description, type, goalAmount);

    const newCampaign = {
      id: result.insertId,
      orphanageId,
      title: title.trim(),
      description: description.trim(),
      type: type || null,
      goalAmount,
      collectedAmount: 0.00,
      isActive: true
    };

    res.status(201).json({
      message: 'Emergency campaign created successfully',
      campaign: newCampaign
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to create emergency campaign', error: err.message });
  }
};

export const joinCampaign = async (req, res) => {
  const { user_name, campaign_title } = req.body;
  try {
    const result = await assignUserToCampaign(user_name, campaign_title);
    res.status(200).json({ message: 'User successfully assigned to the emergency campaign', result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const donateToCampaign = async (req, res) => {
  const {
    user_name,
    campaign_title,
    type,
    amount,
    quantity,
    description,
    pickup_address,
    delivery_address
  } = req.body;

  if (!user_name || !campaign_title || !type || !['money', 'physical'].includes(type)) {
    return res.status(400).json({ message: 'Invalid donation: required fields are missing or invalid type' });
  }

  if (type === 'money' && (!amount || isNaN(amount) || amount <= 0)) {
    return res.status(400).json({ message: 'Money donation requires a valid amount' });
  }

  if (type === 'physical' && (!quantity || isNaN(quantity) || quantity <= 0)) {
    return res.status(400).json({ message: 'Physical donation requires a valid quantity' });
  }

  try {
    await donateToCampaignByName(user_name, campaign_title, type, amount, quantity, description, pickup_address, delivery_address);
    res.status(200).json({ message: 'Donation recorded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Donation failed', error: err.message });
  }
};

export const listUsersWithCampaigns = async (req, res) => {
  try {
    const data = await getUsersWithEmergencyCampaigns();

    const grouped = data.reduce((acc, row) => {
      if (!acc[row.user_id]) {
        acc[row.user_id] = {
          user_id: row.user_id,
          user_name: row.user_name,
          user_type: row.user_type,
          campaigns: []
        };
      }

      acc[row.user_id].campaigns.push({
        campaign_id: row.campaign_id,
        campaign_title: row.campaign_title
      });

      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users with emergency campaigns' });
  }
};
