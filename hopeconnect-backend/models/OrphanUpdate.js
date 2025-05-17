const db = require('../config/db');

class OrphanUpdate {
  static async orphanExists(orphan_id) {
    const [rows] = await db.execute(
      'SELECT 1 FROM orphans WHERE orphan_id = ? LIMIT 1',
      [orphan_id]
    );
    return rows.length > 0;
  }

  static async create({ orphan_id, title, description, photo_url, created_by }) {
    try {
      // Verify orphan exists
      const [orphanCheck] = await db.execute(
        'SELECT orphan_id FROM orphans WHERE orphan_id = ? LIMIT 1',
        [orphan_id]
      );

      if (orphanCheck.length === 0) {
        throw new Error(`Orphan with ID ${orphan_id} not found`);
      }

      const [result] = await db.execute(
        'INSERT INTO orphan_updates (orphan_id, title, description, photo_url, created_by) VALUES (?, ?, ?, ?, ?)',
        [orphan_id, title, description, photo_url, created_by]
      );
      return result.insertId;
    } catch (error) {
      console.error('Database error in OrphanUpdate.create:', error);
      throw error;
    }
  }

  static async findByOrphanId(orphanId) {
    const [rows] = await db.execute(
      'SELECT ou.*, u.username as created_by_username FROM orphan_updates ou JOIN users u ON ou.created_by = u.user_id WHERE ou.orphan_id = ? ORDER BY ou.created_at DESC',
      [orphanId]
    );
    return rows;
  }
}

module.exports = OrphanUpdate;