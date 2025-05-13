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
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false,
            message: 'Admin access required' 
        });
    }
    next();
};

const authorizeStaff = (req, res, next) => {
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Staff access required'
        });
    }
    next();
};

module.exports = {
    authenticate,
    authorizeAdmin,
    authorizeStaff
};