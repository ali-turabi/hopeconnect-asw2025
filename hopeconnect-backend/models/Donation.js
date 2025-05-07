const pool = require('../config/database');

class Donation {
  static async create(donationData) {
    const [result] = await pool.query(
      'INSERT INTO donations (donor_id, orphanage_id, category, type, amount, description) VALUES (?, ?, ?, ?, ?, ?)',
      [donationData.donor_id, donationData.orphanage_id, donationData.category, donationData.type, donationData.amount, donationData.description]
    );
    return result.insertId;
  }

  static async getByDonor(donorId) {
    const [rows] = await pool.query(`
      SELECT d.*, o.name as orphanage_name
      FROM donations d
      JOIN orphanages o ON d.orphanage_id = o.orphanage_id
      WHERE d.donor_id = ?
    `, [donorId]);
    return rows;
  }
}

module.exports = Donation;