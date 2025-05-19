const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequestCreation } = require('../utils/validators');

router.post('/', authenticate, authorize('orphanage', 'admin'), validateRequestCreation, requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequest);

module.exports = router;
