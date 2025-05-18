const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { authenticate, authorize} = require('../middleware/auth');
const { 
    validateVolunteerRegistration, 
    validateVolunteerUpdate, 
    validateAddSkill 
} = require('../utils/validators');

router.post('/', authenticate, authorize('volunteer'), validateVolunteerRegistration, volunteerController.registerVolunteer);
router.put('/:id', authenticate, authorize('volunteer', 'admin'), validateVolunteerUpdate, volunteerController.updateVolunteer);
router.post('/:id/skills', authenticate, authorize('volunteer', 'admin'), validateAddSkill, volunteerController.addVolunteerSkill);
router.get('/:id', authenticate, volunteerController.getVolunteerProfile);

module.exports = router;
