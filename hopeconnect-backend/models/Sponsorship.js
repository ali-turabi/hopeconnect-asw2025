const pool = require('../config/db');

class Sponsorship {
  // Create new sponsorship
  static async create({ user_id, orphan_id, start_date, end_date, donation_model, is_active = true }) {
    const [result] = await pool.execute(
      `INSERT INTO sponsorships 
       (user_id, orphan_id, start_date, end_date, donation_model, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, orphan_id, start_date || new Date(), end_date, donation_model, is_active]
    );
    return result.insertId;
  }

  // Get by ID
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM sponsorships WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Get all by user ID
  static async findByUserId(user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM sponsorships WHERE user_id = ?',
      [user_id]
    );
    return rows;
  }

  // Get all sponsorships (for admin)
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM sponsorships');
    return rows;
  }

  // Update sponsorship
  static async update(id, updates) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    
    values.push(id);
    
    await pool.execute(
      `UPDATE sponsorships SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  // Delete sponsorship
  static async delete(id) {
    await pool.execute(
      'DELETE FROM sponsorships WHERE id = ?',
      [id]
    );
  }

  // Toggle activation status
  static async toggleActivation(id) {
    await pool.execute(
      'UPDATE sponsorships SET is_active = NOT is_active WHERE id = ?',
      [id]
    );
  }
  // In models/Sponsorship.js
static async updateOrphanSponsorshipStatus(orphan_id, isSponsored) {
  await pool.execute(
    'UPDATE orphans SET is_sponsored = ? WHERE orphan_id = ?',
    [isSponsored, orphan_id]
  );
}

// Add these methods to your Sponsorship class:

static async getOrphanageStatus(orphan_id) {
  const [rows] = await pool.execute(
    `SELECT o.orphanage_id, og.is_active 
     FROM orphans o
     JOIN orphanages og ON o.orphanage_id = og.orphanage_id
     WHERE o.orphan_id = ?`,
    [orphan_id]
  );
  return rows[0]; // Returns { orphanage_id, is_active }
}

static async validateOrphanageActive(orphan_id) {
  const orphanage = await this.getOrphanageStatus(orphan_id);
  
  if (!orphanage) {
    throw new Error('Orphan not found');
  }
  
  if (orphanage.is_active !== 1) {
    throw new Error('Cannot sponsor orphan from inactive orphanage');
  }
  
  return true;
}

















}

module.exports = Sponsorship;