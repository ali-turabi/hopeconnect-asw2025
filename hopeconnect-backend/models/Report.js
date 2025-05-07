const pool = require('../config/database');

class Report {
  static async createOrphanReport(reportData) {
    const [result] = await pool.query(
      'INSERT INTO orphan_updates SET ?',
      [reportData]
    );
    return result.insertId;
  }

  static async getSponsorshipReports(sponsorId) {
    const [rows] = await pool.query(`
      SELECT * FROM donation_reports
      WHERE user_id = ? AND recipient_type = 'sponsor'
    `, [sponsorId]);
    return rows;
  }
}

module.exports = Report;