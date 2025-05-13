const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate, authorize } = require('../middleware/auth');
const { 
    validateAssignment, 
    validateCompletion 
} = require('../utils/validators');

router.get('/volunteers/match/:requestId', authenticate, assignmentController.findMatches);
router.post('/', authenticate, authorize('orphanage', 'admin'), validateAssignment, assignmentController.createAssignment);
router.put('/:id/complete', authenticate, authorize('volunteer', 'admin'), validateCompletion, assignmentController.completeAssignment);
router.get('/volunteer/:volunteerId', authenticate, assignmentController.getVolunteerAssignments);

module.exports = router;