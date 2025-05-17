import { Router } from 'express';
import {
  fetchAllDonations,
  createMappingDonation,
  fetchAllMappingDonations,
  updateMappingDonation,
  removeMappingDonation,
  removeDonationById,
  getTrackingInfo
} from '../controllers/logisticsController.js';

const router = Router();

router.get('/donations', fetchAllDonations);
router.get('/mappingDonations/:id', getTrackingInfo);
router.delete('/donations/:id', removeDonationById);
router.post('/mappingDonations', createMappingDonation);
router.get('/mappingDonations', fetchAllMappingDonations);
router.put('/updateMappingDonations', updateMappingDonation);
router.delete('/mappingDonations/:id', removeMappingDonation);


export default router;
