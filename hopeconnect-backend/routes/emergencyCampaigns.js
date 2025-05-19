const express = require('express');
const {
  getAllEmergencyCampaigns,
  getEmergencyCampaignById,
  createEmergencyCampaign,
  deleteEmergencyCampaignById,
  joinEmergencyCampaign,
  donateToCampaign,
  listUsersWithCampaigns,
  getActiveEmergencyCampaigns,
  updateEmergencyCampaign
} = require('../controllers/emergencyCampaignController');

const router = express.Router();

router.get('/emergencyCampaigns', getAllEmergencyCampaigns);
router.get('/emergencyCampaigns/:id', getEmergencyCampaignById);
router.post('/emergencyCampaigns', createEmergencyCampaign);
router.delete('/emergencyCampaigns/:id', deleteEmergencyCampaignById);
router.post('/emergencyCampaigns/:id/join', joinEmergencyCampaign);
router.post('/emergencyCampaigns/:id/donate', donateToCampaign);
router.get('/usersEmergencyCampaigns', listUsersWithCampaigns);
router.get('/emergencyCampaigns/active', getActiveEmergencyCampaigns);
router.patch('/emergencyCampaigns/:id', updateEmergencyCampaign);

module.exports = router;
