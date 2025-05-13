const Request = require('../models/Request');
const { validationResult } = require('express-validator');

exports.createRequest = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orphanageId, title, description, requiredSkillId, startDate, endDate } = req.body;
        const requestId = await Request.create({
            orphanageId,
            title,
            description,
            requiredSkillId,
            startDate,
            endDate
        });
        
        res.status(201).json({
            success: true,
            data: { requestId }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllRequests = async (req, res, next) => {
    try {
        const requests = await Request.findAll();
        
        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (err) {
        next(err);
    }
};

exports.getRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const request = await Request.findById(id);
        
        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Request not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: request
        });
    } catch (err) {
        next(err);
    }
};