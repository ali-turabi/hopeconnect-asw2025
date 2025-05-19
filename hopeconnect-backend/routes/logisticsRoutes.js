const express = require('express');
const {
  fetchAllDonations,
  createMappingDonation,
  fetchAllMappingDonations,
  updateMappingDonation,
  removeMappingDonation,
  removeDonationById,
  getTrackingInfo
} = require('../controllers/logisticsController');

const router = express.Router();

router.get('/donations', fetchAllDonations);
router.get('/mappingDonations/:id', getTrackingInfo);
router.delete('/donations/:id', removeDonationById);
router.post('/mappingDonations', createMappingDonation);
router.get('/mappingDonations', fetchAllMappingDonations);
router.put('/updateMappingDonations', updateMappingDonation);
router.delete('/mappingDonations/:id', removeMappingDonation);

module.exports = router;
