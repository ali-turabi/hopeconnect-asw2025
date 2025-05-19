const Verification = require('../models/Verification');
const { validationResult } = require('express-validator');

exports.verifyOrphanage = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orphanage_id, verification_date, expiry_date, documents_urls, notes } = req.body;
        const verified_by = req.user.user_id; // Admin who is verifying

        const verificationId = await Verification.create({
            orphanage_id,
            verified_by,
            verification_date,
            expiry_date,
            documents_urls,
            status: 'verified',
            notes
        });

        res.status(201).json({
            success: true,
            data: { verificationId }
        });
    } catch (err) {
        next(err);
    }
};


exports.getOrphanageVerification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const verifications = await Verification.findByOrphanage(id);

        res.status(200).json({
            success: true,
            data: verifications
        });
    } catch (err) {
        next(err);
    }
};