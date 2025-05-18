const PlatformReview = require('../models/PlatformReview'); // This should match your model filename

exports.createReview = async (req, res) => {
  try {
    const { review, rating, suggestion } = req.body;

    // Validate input
    if (!review || !rating) {
      return res.status(400).json({ error: 'Review and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const reviewData = {
      review,
      rating,
      suggestion: suggestion || null
    };

    const reviewId = await PlatformReview.create(reviewData);
    
    res.status(201).json({
      message: 'Review created successfully',
      reviewId
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await PlatformReview.getAll();
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};