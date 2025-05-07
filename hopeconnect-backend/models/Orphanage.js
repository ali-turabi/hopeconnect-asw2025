const pool = require('../config/database');

class Orphanage {
  static async getById(orphanageId) {
    const [rows] = await pool.query(`
      SELECT * FROM orphanages 
      WHERE orphanage_id = ? AND is_active = TRUE
    `, [orphanageId]);
    return rows[0];
  }

  static async getOrphans(orphanageId) {
    const [rows] = await pool.query(`
      SELECT * FROM orphans 
      WHERE orphanage_id = ? AND is_active = TRUE
    `, [orphanageId]);
    return rows;
  }

  static async getStaff(orphanageId) {
    const [rows] = await pool.query(`
      SELECT s.*, u.name, u.email, u.phone
      FROM staff s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.is_active = TRUE
      /* You might need to add orphanage_id to staff table or join through another table */
    `);
    return rows;
  }
}

module.exports = Orphanage;