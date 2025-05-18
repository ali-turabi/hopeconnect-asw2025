const db = require('../config/db');

class Donation {
 static async create(donationData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { user_id, orphanage_id, donation_type, category_id, amount, description, payment_status } = donationData;

      // Calculate platform fee (0.3%) and orphanage amount (99.7%)
      const platformFee = donation_type === 'money' ? amount * 0.03 : 0;
      const orphanageAmount = donation_type === 'money' ? amount - platformFee : null;

      // 1. Create the donation record
      const [result] = await connection.execute(
        `INSERT INTO donations 
         (user_id, orphanage_id, donation_type, category_id, amount, description, payment_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id || null,
          orphanage_id || null,
          donation_type,
          category_id,
          amount || null,
          description || null,
          payment_status || 'pending'
        ]
      );

      // 2. Update orphanage budget (only for monetary donations)
      if (donation_type === 'money' && orphanage_id) {
        await connection.execute(
          `UPDATE orphanages 
           SET current_budget = current_budget + ? 
           WHERE orphanage_id = ?`,
          [orphanageAmount, orphanage_id]
        );
      }

      // 3. Update platform budget (only for monetary donations)
      if (donation_type === 'money' && platformFee > 0) {
        await connection.execute(
          `UPDATE platform_settings 
           SET budget = budget + ? 
           WHERE id = 1`,
          [platformFee]
        );
      }

      await connection.commit();
      return result.insertId;

    } catch (error) {
      await connection.rollback();
      console.error('Database error in Donation.create:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
  static async getById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT d.*, dc.name as category_name 
         FROM donations d
         JOIN donation_categories dc ON d.category_id = dc.id
         WHERE d.id = ?`,
        [id]
      );
      if (rows.length === 0) {
        throw new Error('Donation not found');
      }
      return rows[0];
    } catch (error) {
      console.error('Database error in Donation.getById:', error);
      throw error;
    }
  }

  static async getCategories() {
    try {
      const [rows] = await db.execute(`SELECT * FROM donation_categories`);
      return rows;
    } catch (error) {
      console.error('Database error in Donation.getCategories:', error);
      throw error;
    }
  }
static async updatePaymentStatus(id, payment_status) {
  try {
    // First verify the donation exists
    const [donation] = await db.execute(
      'SELECT id FROM donations WHERE id = ?',
      [id]
    );
    
    if (donation.length === 0) {
      throw new Error('Donation not found');
    }

    const [result] = await db.execute(
      'UPDATE donations SET payment_status = ? WHERE id = ?',
      [payment_status, id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Failed to update payment status');
    }

    return this.getById(id);
  } catch (error) {
    console.error('Database error in Donation.updatePaymentStatus:', error);
    throw error;
  }
}
static async getCategories() {
  try {
    const [rows] = await db.execute(
      `SELECT 
        id,
        name
       FROM donation_categories`
    );
    return rows;
  } catch (error) {
    console.error('Database error in Donation.getCategories:', error);
    throw error;
  }
}
static async delete(id) {
  try {
    const [result] = await db.execute(
      'DELETE FROM donations WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Database error in Donation.delete:', error);
    throw error;
  }
}

static async getSummary() {
  try {
    // Total monetary amount
    const [amountResult] = await db.execute(
      'SELECT COALESCE(SUM(amount), 0) as total_amount FROM donations WHERE donation_type = "money"'
    );
    
    // Total unique donors
    const [donorsResult] = await db.execute(
      'SELECT COUNT(DISTINCT user_id) as total_donors FROM donations'
    );
    
    // Total donations count
    const [donationsResult] = await db.execute(
      'SELECT COUNT(*) as total_donations FROM donations'
    );
    
    return {
      total_amount: amountResult[0].total_amount,
      total_donors: donorsResult[0].total_donors,
      total_donations: donationsResult[0].total_donations
    };
  } catch (error) {
    console.error('Database error in Donation.getSummary:', error);
    throw error;
  }
}
static async getTotalDonationsByOrphanage(orphanageId) {
  try {
    // First verify orphanage exists
    const [orphanage] = await db.execute(
      'SELECT name FROM orphanages WHERE orphanage_id = ?', 
      [orphanageId]
    );

    if (orphanage.length === 0) {
      throw new Error('Orphanage not found');
    }

    // Then get donation stats
    const [result] = await db.execute(
      `SELECT 
         COUNT(*) as total_donations,
         COALESCE(SUM(amount), 0) as total_amount
       FROM donations
       WHERE orphanage_id = ?`,
      [orphanageId]
    );

    return {
      orphanage_id: orphanageId,
      orphanage_name: orphanage[0].name,
      total_donations: parseInt(result[0].total_donations),
      total_amount: parseFloat(result[0].total_amount)
    };

  } catch (error) {
    console.error('Database error in getTotalDonationsByOrphanage:', {
      error: error.message,
      query: 'getTotalDonationsByOrphanage',
      orphanageId
    });
    throw error;
  }
}










  
}

// ✅ Proper export
module.exports = Donation;