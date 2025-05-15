import {Router} from 'express'
import { getAllPartners,getPartnerByName,insertPartner,updatePartnerByName,deletePartnerByName} from '../models/partnershipsModel.js';
const router = Router();

router.get('/partners', async (req, res) => {
  try {
    const partners = await getAllPartners();
    res.json(partners);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});
router.get('/partners/:name', async (req, res) => {
  try {
    const partner = await getPartnerByName(req.params.name);
    res.json(partner);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post('/partners', async (req, res) => {
  try {
    const partner = await insertPartner(req.body);
    res.status(201).json({ message: 'Partner created', partner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/partner/:name', async (req, res) => {
  try {
    const partnerName = req.params.name;
    const updates = req.body;

    await updatePartnerByName(partnerName, updates);
    res.json({ message: 'Partner updated successfully' });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
});

router.delete('/partner/:name', async (req, res) => {
  try {
    const name = req.params.name;
    await deletePartnerByName(name);
    res.json({ message: 'Partner deleted successfully' });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
});

export default router;