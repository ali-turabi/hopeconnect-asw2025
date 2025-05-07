const pool = require('../config/database');

class Sponsorship {
  static async create(sponsorshipData) {
    const { orphan_id, sponsor_id, start_date, sponsorship_type, monthly_amount, payment_method } = sponsorshipData;
    
    const [result] = await pool.query(`
      INSERT INTO sponsorships 
      (orphan_id, sponsor_id, start_date, sponsorship_type, monthly_amount, payment_method, last_payment_date, next_payment_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orphan_id, 
      sponsor_id, 
      start_date, 
      sponsorship_type, 
      monthly_amount, 
      payment_method,
      start_date, // Assuming payment is made on start
      this.calculateNextPaymentDate(start_date)
    ]);

    // Update orphan's is_sponsored status if needed
    if (sponsorship_type === 'full_support') {
      await pool.query('UPDATE orphans SET is_sponsored = TRUE WHERE orphan_id = ?', [orphan_id]);
    }

    return result.insertId;
  }

  static calculateNextPaymentDate(lastPaymentDate) {
    const date = new Date(lastPaymentDate);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  }

  static async getBySponsor(sponsorId) {
    const [rows] = await pool.query(`
      SELECT s.*, o.name as orphan_name, o.photo_url as orphan_photo, 
             orph.name as orphanage_name, o.birth_date
      FROM sponsorships s
      JOIN orphans o ON s.orphan_id = o.orphan_id
      JOIN orphanages orph ON o.orphanage_id = orph.orphanage_id
      WHERE s.sponsor_id = ? AND s.is_active = TRUE
    `, [sponsorId]);
    return rows;
  }
}

module.exports = Sponsorship;