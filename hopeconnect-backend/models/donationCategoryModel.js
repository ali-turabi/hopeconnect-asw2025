// models/donationCategoryModel.js
const pool = require('../config/db'); // Your mysql2 connection pool

const DonationCategory = {
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM donation_categories WHERE id = ?', [id]);
    return rows.length ? rows[0] : null;
  }
};

module.exports = DonationCategory;
