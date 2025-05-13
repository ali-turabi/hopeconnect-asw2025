const Volunteer = require('../models/Volunteer');
const { validationResult } = require('express-validator');

exports.registerVolunteer = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, availability } = req.body;
        const volunteerId = await Volunteer.create({ userId, availability });
        
        res.status(201).json({
            success: true,
            data: { volunteerId }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateVolunteer = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { availability, backgroundCheckStatus } = req.body;
        
        await Volunteer.update(id, { availability, backgroundCheckStatus });
        
        res.status(200).json({
            success: true,
            data: null
        });
    } catch (err) {
        next(err);
    }
};

exports.addVolunteerSkill = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { skillId, proficiencyLevel } = req.body;
        
        await Volunteer.addSkill(id, skillId, proficiencyLevel);
        
        res.status(201).json({
            success: true,
            data: null
        });
    } catch (err) {
        next(err);
    }
};

exports.getVolunteerProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const volunteer = await Volunteer.findById(id);
        
        if (!volunteer) {
            return res.status(404).json({
                success: false,
                error: 'Volunteer not found'
            });
        }
        
        const skills = await Volunteer.getSkills(id);
        
        res.status(200).json({
            success: true,
            data: {
                ...volunteer,
                skills
            }
        });
    } catch (err) {
        next(err);
    }
};