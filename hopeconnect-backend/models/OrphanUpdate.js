const pool = require('../config/database');

class OrphanUpdate {
  static async create(updateData) {
    const { orphan_id, update_type, title, content, attachment_url, created_by } = updateData;
    
    const [result] = await pool.query(`
      INSERT INTO orphan_updates 
      (orphan_id, update_type, title, content, attachment_url, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [orphan_id, update_type, title, content, attachment_url, created_by]);
    
    return result.insertId;
  }

  static async getByOrphan(orphanId) {
    const [rows] = await pool.query(`
      SELECT ou.*, u.name as staff_name, s.position
      FROM orphan_updates ou
      JOIN staff s ON ou.created_by = s.staff_id
      JOIN users u ON s.user_id = u.user_id
      WHERE ou.orphan_id = ?
      ORDER BY ou.created_at DESC
    `, [orphanId]);
    return rows;
  }
}

module.exports = OrphanUpdate;