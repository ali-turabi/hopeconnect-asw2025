const ImpactReport = require('../models/ImpactReport');
const { validationResult } = require('express-validator');

exports.createReport = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orphanage_id, title, content, photos_urls, period_start, period_end } = req.body;

        const reportId = await ImpactReport.create({
            orphanage_id,
            title,
            content,
            photos_urls,
            period_start,
            period_end
        });

        res.status(201).json({
            success: true,
            data: { reportId }
        });
    } catch (err) {
        next(err);
    }
};

exports.getOrphanageReports = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reports = await ImpactReport.findByOrphanage(id);

        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (err) {
        next(err);
    }
};