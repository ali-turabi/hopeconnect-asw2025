const db = require('../config/db');

class Review {
    static async create({ orphanage_id, donor_id, rating, comment }) {
        const [result] = await db.execute(
            'INSERT INTO reviews (orphanage_id, donor_id, rating, comment) VALUES (?, ?, ?, ?)',
            [orphanage_id, donor_id, rating, comment]
        );
        return result.insertId;
    }

    static async findByOrphanage(orphanageId) {
        const [rows] = await db.execute(
            'SELECT r.*, u.name as donor_name FROM reviews r JOIN users u ON r.donor_id = u.user_id WHERE r.orphanage_id = ? ORDER BY created_at DESC',
            [orphanageId]
        );
        return rows;
    }

    static async getAverageRating(orphanageId) {
        const [rows] = await db.execute(
            'SELECT AVG(rating) as average_rating FROM reviews WHERE orphanage_id = ?',
            [orphanageId]
        );
        return rows[0].average_rating || 0;
    }
}

module.exports = Review;
