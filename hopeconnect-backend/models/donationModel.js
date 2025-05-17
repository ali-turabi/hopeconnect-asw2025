const db = require('../config/db');

class Donation {
  static async create(donationData) {
    try {
      const { user_id, orphanage_id, donation_type, category_id, amount, description, payment_status } = donationData;

      const [result] = await db.execute(
        `INSERT INTO donations 
         (user_id, orphanage_id, donation_type, category_id, amount, description, payment_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id || null,
          orphanage_id || null,
          donation_type,
          category_id,
          amount || null,
          description || null,
          payment_status || 'pending'
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error('Database error in Donation.create:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT d.*, dc.name as category_name 
         FROM donations d
         JOIN donation_categories dc ON d.category_id = dc.id
         WHERE d.id = ?`,
        [id]
      );
      if (rows.length === 0) {
        throw new Error('Donation not found');
      }
      return rows[0];
    } catch (error) {
      console.error('Database error in Donation.getById:', error);
      throw error;
    }
  }

  static async getCategories() {
    try {
      const [rows] = await db.execute(`SELECT * FROM donation_categories`);
      return rows;
    } catch (error) {
      console.error('Database error in Donation.getCategories:', error);
      throw error;
    }
  }













  
}

// ✅ Proper export
module.exports = Donation;
