const express = require('express');
const router = express.Router();
const {
  fetchAllPartners,
  fetchPartnerByName,
  createPartner,
  editPartnerByName,
  removePartnerByName,
  fetchPartnersByStatus
} = require('../controllers/partnershipsController');

router.get('/partners', fetchAllPartners);
router.get('/partners/:name', fetchPartnerByName);
router.post('/partners', createPartner);
router.patch('/partner/:name', editPartnerByName);
router.delete('/partner/:name', removePartnerByName);
router.get('/partners/status/:status', fetchPartnersByStatus);

module.exports = router;
