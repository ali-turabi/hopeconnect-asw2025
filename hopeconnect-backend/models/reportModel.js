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
}

module.exports = Report;