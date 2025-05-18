const db = require('../config/db');

class PlatformReview {
  static async create(reviewData) {
    try {
      const { review, rating, suggestion } = reviewData;
      
      const [result] = await db.execute(
        'INSERT INTO platform_reviews (review, rating, suggestion) VALUES (?, ?, ?)',
        [review, rating, suggestion]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [reviews] = await db.execute('SELECT * FROM platform_reviews ORDER BY created_at DESC');
      return reviews;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PlatformReview;