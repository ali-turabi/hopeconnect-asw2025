const pool = require('../config/database');

module.exports = async (req, res, next) => {
  try {
    // Check if user is staff
    const [staff] = await pool.query('SELECT * FROM staff WHERE user_id = ?', [req.user.user_id]);
    
    if (!staff[0]) {
      return res.status(403).json({ message: 'Access denied. Staff only.' });
    }

    // Attach staff info to request
    req.staff = staff[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};