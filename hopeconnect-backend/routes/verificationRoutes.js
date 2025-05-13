const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateVerification } = require('../utils/validators');

router.post('/', authenticate, authorize('admin'), validateVerification, verificationController.verifyOrphanage);
router.get('/orphanage/:id', authenticate, verificationController.getOrphanageVerification);

module.exports = router;