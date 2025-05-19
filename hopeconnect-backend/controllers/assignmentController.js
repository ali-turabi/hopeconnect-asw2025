const Assignment = require('../models/Assignment');
const Volunteer = require('../models/Volunteer');
const Request = require('../models/Request');
const { findMatchingVolunteers } = require('../utils/matching');
const { validationResult } = require('express-validator');

exports.findMatches = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findById(requestId);
        
        
        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Request not found'
            });
        }
        
        const matches = await findMatchingVolunteers(requestId);
        
        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (err) {
        next(err);
    }
};

exports.createAssignment = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { requestId, volunteerId } = req.body;
        
        // Check if volunteer exists
        const volunteer = await Volunteer.findById(volunteerId);
        if (!volunteer) {
            return res.status(404).json({
                success: false,
                error: 'Volunteer not found'
            });
        }
        
        // Check if request exists and is open
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Request not found'
            });
        }
        
        if (request.status !== 'open') {
            return res.status(400).json({
                success: false,
                error: 'Request is not open for assignment'
            });
        }
        
        const assignmentId = await Assignment.create({ requestId, volunteerId });
        
        res.status(201).json({
            success: true,
            data: { assignmentId }
        });
    } catch (err) {
        next(err);
    }
};
//update
exports.completeAssignment = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { feedback, rating } = req.body;
        
        await Assignment.complete(id, feedback ?? null, rating ?? null);
        
        res.status(200).json({
            success: true,
            data: null
        });
    } catch (err) {
        next(err);
    }
};

exports.getVolunteerAssignments = async (req, res, next) => {
    try {
        const { volunteerId } = req.params;
        const assignments = await Assignment.findByVolunteer(volunteerId);
        
        res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments
        });
    } catch (err) {
        next(err);
    }
};