import { Router } from 'express';
import {
  fetchAllPartners,
  fetchPartnerByName,
  createPartner,
  editPartnerByName,
  removePartnerByName,
  fetchPartnersByStatus
} from '../controllers/partnershipsController.js';

const router = Router();

router.get('/partners', fetchAllPartners);
router.get('/partners/:name', fetchPartnerByName);
router.post('/partners', createPartner);
router.patch('/partner/:name', editPartnerByName);
router.delete('/partner/:name', removePartnerByName);
router.get('/partners/status/:status', fetchPartnersByStatus);

export default router;
