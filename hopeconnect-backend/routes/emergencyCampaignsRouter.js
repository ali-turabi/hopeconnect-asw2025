import { Router } from 'express';
import {
  fetchAllCampaigns,
  fetchCampaignByTitle,
  createCampaign,
  removeCampaignByTitle,
  joinCampaign,
  donateToCampaign,
  listUsersWithCampaigns,fetchActiveCampaigns,updateCampaign
} from '../controllers/emergencyCampingsController.js';

const router = Router();

router.get('/emergancyCampings',fetchAllCampaigns);
router.get('/emergancyCampings/:title', fetchCampaignByTitle);
router.post('/emergencyCampaigns', createCampaign);
router.delete('/emergencyCampaigns/:title', removeCampaignByTitle);
router.post('/joinEmergencyCampaigns', joinCampaign);
router.post('/emergencyCampaigns/donate', donateToCampaign);
router.get('/usersEmergencyCampaigns', listUsersWithCampaigns);
router.get('/emergencyCampaigns/active', fetchActiveCampaigns);
router.patch('/updateEmergencyCampaigns/:id', updateCampaign);

export default router;
