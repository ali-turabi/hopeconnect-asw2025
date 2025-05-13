const Review = require('../models/Review');
const { validationResult } = require('express-validator');

exports.createReview = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orphanage_id, rating, comment } = req.body;
        const donor_id = req.user.user_id;

        const reviewId = await Review.create({
            orphanage_id,
            donor_id,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            data: { reviewId }
        });
    } catch (err) {
        next(err);
    }
};

exports.getOrphanageReviews = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reviews = await Review.findByOrphanage(id);
        const averageRating = await Review.getAverageRating(id);

        res.status(200).json({
            success: true,
            data: {
                reviews,
                averageRating: parseFloat(averageRating).toFixed(1)
            }
        });
    } catch (err) {
        next(err);
    }
};