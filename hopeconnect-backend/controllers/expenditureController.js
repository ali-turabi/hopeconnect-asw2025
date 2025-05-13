const Expenditure = require('../models/Expenditure');
const { validationResult } = require('express-validator');

exports.createExpenditure = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orphanage_id, donation_id, amount, category, description, receipt_url, date_spent } = req.body;
        const verified_by = req.user.user_id; // Admin who is verifying

        const expenditureId = await Expenditure.create({
            orphanage_id,
            donation_id,
            amount,
            category,
            description,
            receipt_url,
            date_spent,
            verified_by
        });

        res.status(201).json({
            success: true,
            data: { expenditureId }
        });
    } catch (err) {
        next(err);
    }
};

exports.getOrphanageExpenditures = async (req, res, next) => {
    try {
        const { id } = req.params;
        const expenditures = await Expenditure.findByOrphanage(id);

        res.status(200).json({
            success: true,
            data: expenditures
        });
    } catch (err) {
        next(err);
    }
};

exports.getDonationExpenditures = async (req, res, next) => {
    try {
        const { id } = req.params;
        const expenditures = await Expenditure.findByDonation(id);

        res.status(200).json({
            success: true,
            data: expenditures
        });
    } catch (err) {
        next(err);
    }
};