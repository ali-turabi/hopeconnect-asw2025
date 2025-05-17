const db = require('../config/db');

class Report {
  static async create(reportData) {
    try {
      const { sender_user_id, receiver_user_id, content, image_url } = reportData;
      
      const [result] = await db.execute(
        `INSERT INTO reports 
         (sender_user_id, receiver_user_id, content, image_url)
         VALUES (?, ?, ?, ?)`,
        [sender_user_id, receiver_user_id, content, image_url || null]
      );

      return result.insertId;
    } catch (error) {
      console.error('Database error in Report.create:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT 
           r.*,
           s.name as sender_name,
           rv.name as receiver_name
         FROM reports r
         JOIN users s ON r.sender_user_id = s.user_id
         JOIN users rv ON r.receiver_user_id = rv.user_id
         WHERE r.id = ?`,
        [id]
      );
      
      if (rows.length === 0) {
        throw new Error('Report not found');
      }
      
      return rows[0];
    } catch (error) {
      console.error('Database error in Report.getById:', error);
      throw error;
    }
  }
 static async getAll() {
    try {
      const [rows] = await db.execute(
        `SELECT 
           r.*,
           s.name as sender_name,
           rv.name as receiver_name
         FROM reports r
         JOIN users s ON r.sender_user_id = s.user_id
         JOIN users rv ON r.receiver_user_id = rv.user_id
         ORDER BY r.report_date DESC`
      );
      return rows;
    } catch (error) {
      console.error('Database error in Report.getAll:', error);
      throw error;
    }
  }

  static async getByReceiver(receiverId) {
    try {
      const [rows] = await db.execute(
        `SELECT 
           r.*,
           s.name as sender_name
         FROM reports r
         JOIN users s ON r.sender_user_id = s.user_id
         WHERE r.receiver_user_id = ?
         ORDER BY r.report_date DESC`,
        [receiverId]
      );
      return rows;
    } catch (error) {
      console.error('Database error in Report.getByReceiver:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const { content, image_url } = updateData;
      const [result] = await db.execute(
        `UPDATE reports 
         SET content = ?, image_url = ?
         WHERE id = ?`,
        [content, image_url || null, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in Report.update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM reports WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in Report.delete:', error);
      throw error;
    }
  }


}

module.exports = Report;