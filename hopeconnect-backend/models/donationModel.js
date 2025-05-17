const db = require('../config/db');

class Donation {
  static async create(donationData) {
    try {
      const { user_id, orphanage_id, donation_type, category_id, amount, description, payment_status } = donationData;

      const [result] = await db.execute(
        `INSERT INTO donations 
         (user_id, orphanage_id, donation_type, category_id, amount, description, payment_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          orphanage_id,
          donation_type,
          category_id,
          amount,
          description,
          payment_status
        ]
      );

      if (!result.insertId) {
        throw new Error('Failed to create donation');
      }

      return result.insertId;
    } catch (error) {
      console.error('Database error in Donation.create:', error);
      throw error;
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
      const [rows] = await db.execute('SELECT * FROM donation_categories');
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
// Add these methods to your Donation class

static async getAll() {
  try {
    const [rows] = await db.execute(
      `SELECT 
         d.*, 
         dc.name as category_name,
         u.name as donor_name
       FROM donations d
       JOIN donation_categories dc ON d.category_id = dc.id
       JOIN users u ON d.user_id = u.user_id
       ORDER BY d.donation_date DESC`
    );
    return rows;
  } catch (error) {
    console.error('Database error in Donation.getAll:', error);
    throw error;
  }
}

static async getByDonor(donorId) {
  try {
    const [rows] = await db.execute(
      `SELECT 
         d.id,
         d.donation_type,
         IFNULL(d.amount, 0) as amount,
         d.description,
         d.payment_status,
         DATE_FORMAT(d.donation_date, '%Y-%m-%d %H:%i:%s') as donation_date,
         dc.name as category_name,
         o.name as orphanage_name
       FROM donations d
       LEFT JOIN donation_categories dc ON d.category_id = dc.id
       LEFT JOIN orphanages o ON d.orphanage_id = o.orphanage_id
       WHERE d.user_id = ?
       ORDER BY d.donation_date DESC`,
      [donorId]
    );

    return rows.map(donation => ({
      ...donation,
      amount: parseFloat(donation.amount)
    }));

  } catch (error) {
    console.error('Model error:', error);
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

static async getMonthlyStats() {
  try {
    const [rows] = await db.execute(
      `SELECT 
         YEAR(created_at) as year,
         MONTH(created_at) as month,
         COUNT(*) as donation_count,
         COALESCE(SUM(amount), 0) as total_amount
       FROM donations
       GROUP BY YEAR(created_at), MONTH(created_at)
       ORDER BY year DESC, month DESC`
    );
    return rows;
  } catch (error) {
    console.error('Database error in Donation.getMonthlyStats:', error);
    throw error;
  }
}

static async getTopDonors(limit = 10) {
  try {
    const [rows] = await db.execute(
      `SELECT 
         u.id as user_id,
         u.name as donor_name,
         COUNT(d.id) as donation_count,
         COALESCE(SUM(d.amount), 0) as total_amount
       FROM users u
       JOIN donations d ON u.id = d.user_id
       GROUP BY u.id, u.name
       ORDER BY total_amount DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  } catch (error) {
    console.error('Database error in Donation.getTopDonors:', error);
    throw error;
  }
}

static async getByOrphan(orphanId) {
  try {
    const [rows] = await db.execute(
      `SELECT d.*, dc.name as category_name, u.name as donor_name
       FROM donations d
       JOIN donation_categories dc ON d.category_id = dc.id
       JOIN users u ON d.user_id = u.id
       WHERE d.orphanage_id = ?
       ORDER BY d.created_at DESC`,
      [orphanId]
    );
    return rows;
  } catch (error) {
    console.error('Database error in Donation.getByOrphan:', error);
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
static async getDonationsByOrphan(orphanId) {
  try {
    // First verify orphan exists
    const [orphan] = await db.execute(
      `SELECT o.orphan_id, o.name as orphan_name, og.name as orphanage_name
       FROM orphans o
       JOIN orphanages og ON o.orphanage_id = og.orphanage_id
       WHERE o.orphan_id = ?`,
      [orphanId]
    );

    if (orphan.length === 0) {
      throw new Error('Orphan not found');
    }

    // Then get donations
    const [rows] = await db.execute(
      `SELECT 
         d.id,
         d.donation_type,
         d.amount,
         d.description,
         d.payment_status,
         DATE_FORMAT(d.donation_date, '%Y-%m-%d %H:%i:%s') as donation_date,
         dc.name as category_name,
         us.name as donor_name
       FROM donations d
       JOIN donation_categories dc ON d.category_id = dc.id
       JOIN users us ON d.user_id = us.user_id
       JOIN orphans o ON d.orphanage_id = o.orphanage_id
       WHERE o.orphan_id = ?
       ORDER BY d.donation_date DESC`,
      [orphanId]
    );

    return {
      orphan_id: orphanId,
      orphan_name: orphan[0].orphan_name,
      orphanage_name: orphan[0].orphanage_name,
      donations: rows.map(d => ({
        ...d,
        amount: d.amount ? parseFloat(d.amount) : null
      }))
    };

  } catch (error) {
    console.error('Database error in getDonationsByOrphan:', {
      error: error.message,
      query: 'getDonationsByOrphan',
      orphanId,
      stack: error.stack
    });
    throw error;
  }
}
}

module.exports = Donation;