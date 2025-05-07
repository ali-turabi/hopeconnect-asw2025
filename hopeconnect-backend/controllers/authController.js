const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const userId = await User.create(req.body);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isMatch = await User.comparePassword(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = User.generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};