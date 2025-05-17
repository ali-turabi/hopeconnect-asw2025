const db = require('../config/db');

class OrphanUpdate {
  // ... existing methods ...

  static async findById(updateId) {
    const [rows] = await db.execute(
      `SELECT ou.*, u.username as created_by_username 
       FROM orphan_updates ou 
       JOIN users u ON ou.created_by = u.user_id 
       WHERE ou.update_id = ?`,
      [updateId]
    );
    return rows[0] || null;
  }

 
 

 
  static async findByOrphanId(orphanId) {
    try {
      const [rows] = await db.execute(
        `SELECT ou.*, u.username as created_by_username 
         FROM orphan_updates ou 
         JOIN users u ON ou.created_by = u.user_id 
         WHERE ou.orphan_id = ? 
         ORDER BY ou.created_at DESC`,
        [orphanId]
      );
      return rows;
    } catch (error) {
      console.error('Error in findByOrphanId:', error);
      throw new Error('Database error while fetching orphan updates');
    }
  }


}

module.exports = OrphanUpdate;