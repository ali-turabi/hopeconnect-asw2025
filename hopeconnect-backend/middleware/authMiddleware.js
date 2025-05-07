const jwt = require('jsonwebtoken');
const pool = require('../config/database');

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const [user] = await pool.query('SELECT * FROM users WHERE user_id = ?', [decoded.user_id]);
    
    if (!user[0]) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = user[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};