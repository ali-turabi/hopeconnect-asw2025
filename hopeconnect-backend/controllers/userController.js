const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  const { name, email, password, phone, address, user_type } = req.body;

  if (!name || !email || !password || !user_type) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (name, email, password, phone, address, user_type) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [name, email, hashedPassword, phone, address, user_type], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Error creating user.' });
      }

      res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error hashing password.' });
  }
};
