const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ 
            success: false,
            message: 'Invalid or expired token' 
        });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.user_type !== 'admin') {
        return res.status(403).json({ 
            success: false,
            message: 'Admin access required' 
        });
    }
    next();
};
const authorizeSponsor = (req, res, next) => {
  // Check multiple possible role properties
  const userRole = req.user.role || req.user.user_type || req.user.userRole;
  
  if (!userRole) {
    console.error('User object missing role:', req.user);
    return res.status(403).json({
      success: false,
      message: 'Role information missing in token',
      yourUserObject: req.user  // For debugging
    });
  }
  
  if (userRole.toLowerCase() !== 'sponsor') {
    return res.status(403).json({
      success: false,
      message: `Sponsor access required. Your role: ${userRole}`
    });
  }
  next();
};

// ✅ NEW: Donor authorization
const authorizeDonor = (req, res, next) => {
  const userRole = req.user.role || req.user.user_type || req.user.userRole;
  
  if (!userRole) {
    console.error('User object missing role:', req.user);
    return res.status(403).json({
      success: false,
      message: 'Role information missing in token',
      yourUserObject: req.user
    });
  }

  if (userRole.toLowerCase() !== 'donor') {
    return res.status(403).json({
      success: false,
      message: `Donor access required. Your role: ${userRole}`
    });
  }

  next();
};

module.exports = { 
  authenticate, 
  authorizeAdmin, 
  authorizeSponsor,
  authorizeDonor  // ✅ Export it
};