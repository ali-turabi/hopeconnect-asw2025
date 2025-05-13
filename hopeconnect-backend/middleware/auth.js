const jwt = require('jsonwebtoken');
const config = require('../config/index.js');
const db = require('../config/db');
exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.'
        });
    }
    
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({
            success: false,
            error: 'Invalid token.'
        });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user. user_type)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. You are not authorized to perform this action.'
            });
        }
        next();
    };
};