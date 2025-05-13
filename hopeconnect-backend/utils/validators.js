const { check, validationResult } = require('express-validator');

exports.validateVolunteerRegistration = [
    check('userId').isInt().withMessage('User ID must be an integer'),
    check('availability').notEmpty().withMessage('Availability is required')
];

exports.validateVolunteerUpdate = [
    check('availability').optional().notEmpty().withMessage('Availability cannot be empty'),
    check('backgroundCheckStatus').optional().isIn(['pending', 'approved', 'rejected'])
        .withMessage('Invalid background check status')
];

exports.validateAddSkill = [
    check('skillId').isInt().withMessage('Skill ID must be an integer'),
    check('proficiencyLevel').isIn(['beginner', 'intermediate', 'expert'])
        .withMessage('Invalid proficiency level')
];

exports.validateRequestCreation = [
    check('orphanageId').isInt().withMessage('Orphanage ID must be an integer'),
    check('title').notEmpty().withMessage('Title is required'),
    check('description').notEmpty().withMessage('Description is required'),
    check('requiredSkillId').isInt().withMessage('Required skill ID must be an integer'),
    check('startDate').isISO8601().withMessage('Invalid start date format'),
    check('endDate').isISO8601().withMessage('Invalid end date format')
];

exports.validateAssignment = [
    check('requestId').isInt().withMessage('Request ID must be an integer'),
    check('volunteerId').isInt().withMessage('Volunteer ID must be an integer')
];

exports.validateCompletion = [
    check('feedback').optional().isString().withMessage('Feedback must be a string'),
    check('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

exports.validateExpenditure = [
    check('orphanage_id').isInt().withMessage('Orphanage ID must be an integer'),
    check('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    check('category').isIn(['food', 'education', 'healthcare', 'clothing', 'shelter', 'other']).withMessage('Invalid category'),
    check('description').notEmpty().withMessage('Description is required'),
    check('date_spent').isISO8601().withMessage('Invalid date format')
];

exports.validateImpactReport = [
    check('orphanage_id').isInt().withMessage('Orphanage ID must be an integer'),
    check('title').notEmpty().withMessage('Title is required'),
    check('content').notEmpty().withMessage('Content is required'),
    check('period_start').isISO8601().withMessage('Invalid start date format'),
    check('period_end').isISO8601().withMessage('Invalid end date format')
];

exports.validateVerification = [
    check('orphanage_id').isInt().withMessage('Orphanage ID must be an integer'),
    check('verification_date').isISO8601().withMessage('Invalid verification date format'),
    check('expiry_date').isISO8601().withMessage('Invalid expiry date format'),
    check('documents_urls').isArray().withMessage('Documents must be an array')
];

exports.validateReview = [
    check('orphanage_id').isInt().withMessage('Orphanage ID must be an integer'),
    check('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    check('comment').optional().isString().withMessage('Comment must be a string')
];