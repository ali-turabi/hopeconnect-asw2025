const db = require('../config/db');

class OrphanUpdate {
  static async orphanExists(orphan_id) {
    const [rows] = await db.execute(
      'SELECT orphan_id FROM orphans WHERE orphan_id = ? LIMIT 1',
      [orphan_id]
    );
    return rows.length > 0;
  }

  static async userExists(user_id) {
    const [rows] = await db.execute(
      'SELECT user_id FROM users WHERE user_id = ? LIMIT 1',
      [user_id]
    );
    return rows.length > 0;
  }

  static async create({ orphan_id, title, description, photo_url, created_by }) {
    try {
      if (!(await this.orphanExists(orphan_id))) {
        throw new Error(`Orphan with ID ${orphan_id} not found`);
      }
      if (!(await this.userExists(created_by))) {
        throw new Error(`User with ID ${created_by} not found`);
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
    try {
      const [rows] = await db.execute(
        `SELECT ou.*, u.name as created_by_name 
         FROM orphan_updates ou
         JOIN users u ON ou.created_by = u.user_id
         WHERE ou.orphan_id = ? 
         ORDER BY ou.created_at DESC`,
        [orphanId]
      );
      return rows;
    } catch (error) {
      console.error('Error in findByOrphanId:', error);
      throw error;
    }
  }

  static async findById(updateId) {
    try {
      const [rows] = await db.execute(
        `SELECT ou.*, u.name as created_by_name 
         FROM orphan_updates ou
         JOIN users u ON ou.created_by = u.user_id
         WHERE ou.update_id = ? 
         LIMIT 1`,
        [updateId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  static async update(updateId, { title, description, photo_url }) {
    try {
      const [result] = await db.execute(
        `UPDATE orphan_updates 
         SET title = ?, 
             description = ?, 
             photo_url = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE update_id = ?`,
        [title || null, description || null, photo_url || null, updateId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  static async delete(updateId) {
    try {
      const [result] = await db.execute(
        'DELETE FROM orphan_updates WHERE update_id = ?',
        [updateId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

static async getAllUpdates() {
  try {
    const [updates] = await db.execute(
      `SELECT ou.*, u.name as created_by_name, o.name as orphan_name
       FROM orphan_updates ou
       JOIN users u ON ou.created_by = u.user_id
       JOIN orphans o ON ou.orphan_id = o.orphan_id
       ORDER BY ou.created_at DESC`
    );
    return updates;
  } catch (error) {
    console.error('Error in getAllUpdates:', error);
    throw error;
  }
}

static async findById(updateId) {
  let connection;
  try {
    connection = await db.getConnection();
    console.log(`Executing query for update ID: ${updateId}`);
    
    const [rows] = await connection.execute(
      `SELECT ou.*, 
       IFNULL(u.name, 'Deleted User') as created_by_name,
       IFNULL(o.name, 'Unknown Orphan') as orphan_name
       FROM orphan_updates ou
       LEFT JOIN users u ON ou.created_by = u.user_id
       LEFT JOIN orphans o ON ou.orphan_id = o.orphan_id
       WHERE ou.id = ?  /* Changed from update_id to id */
       LIMIT 1`,
      [updateId]
    );
    
    console.log('Query results:', rows);
    return rows[0] || null;
  } catch (error) {
    console.error('Database error details:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

}

module.exports = OrphanUpdate;