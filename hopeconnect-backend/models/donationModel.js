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
          user_id,
          orphanage_id,
          donation_type,
          category_id,
          amount,
          description,
          payment_status
        ]
      );

      if (!result.insertId) {
        throw new Error('Failed to create donation');
      }

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
      const [rows] = await db.execute('SELECT * FROM donation_categories');
      return rows;
    } catch (error) {
      console.error('Database error in Donation.getCategories:', error);
      throw error;
    }
  }

  static async updatePaymentStatus(id, payment_status) {
    try {
      // First verify the donation exists
      const [donation] = await db.execute(
        'SELECT id FROM donations WHERE id = ?',
        [id]
      );
      
      if (donation.length === 0) {
        throw new Error('Donation not found');
      }

      const [result] = await db.execute(
        'UPDATE donations SET payment_status = ? WHERE id = ?',
        [payment_status, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Failed to update payment status');
      }

      return this.getById(id);
    } catch (error) {
      console.error('Database error in Donation.updatePaymentStatus:', error);
      throw error;
    }
  }
}

module.exports = Donation;