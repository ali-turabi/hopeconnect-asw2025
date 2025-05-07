const pool = require('../config/database');

class Orphan {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT o.*, orph.name as orphanage_name 
      FROM orphans o
      JOIN orphanages orph ON o.orphanage_id = orph.orphanage_id
      WHERE o.is_active = TRUE
    `);
    return rows;
  }

  static async getById(orphanId) {
    const [rows] = await pool.query(`
      SELECT o.*, orph.name as orphanage_name, orph.location as orphanage_location
      FROM orphans o
      JOIN orphanages orph ON o.orphanage_id = orph.orphanage_id
      WHERE o.orphan_id = ? AND o.is_active = TRUE
    `, [orphanId]);
    return rows[0];
  }

  static async getUpdates(orphanId) {
    const [rows] = await pool.query(`
      SELECT ou.*, s.position, u.name as staff_name
      FROM orphan_updates ou
      JOIN staff s ON ou.created_by = s.staff_id
      JOIN users u ON s.user_id = u.user_id
      WHERE ou.orphan_id = ?
      ORDER BY ou.created_at DESC
    `, [orphanId]);
    return rows;
  }

  static async getSponsorships(orphanId) {
    const [rows] = await pool.query(`
      SELECT s.*, u.name as sponsor_name, u.email as sponsor_email
      FROM sponsorships s
      JOIN users u ON s.sponsor_id = u.user_id
      WHERE s.orphan_id = ? AND s.is_active = TRUE
    `, [orphanId]);
    return rows;
  }

  static async calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
}

module.exports = Orphan;