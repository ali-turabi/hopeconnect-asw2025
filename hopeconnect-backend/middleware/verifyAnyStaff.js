// middleware/verifyAnyStaff.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = async (req, res, next) => {
    // Set timeout for database operations
    const timeout = setTimeout(() => {
        if (!res.headersSent) {
            console.error('Middleware timeout - verification took too long');
            res.status(504).json({ error: 'Request timeout' });
        }
    }, 10000); // 10 seconds timeout

    try {
        console.log('Starting staff verification');

        // 1. Check for Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            clearTimeout(timeout);
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        // 2. Extract token
        const token = authHeader.split(' ')[1];
        if (!token) {
            clearTimeout(timeout);
            return res.status(401).json({ error: 'Bearer token missing' });
        }

        // 3. Verify JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token verified for user:', decoded.user_id);
        } catch (jwtError) {
            clearTimeout(timeout);
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            }
            return res.status(401).json({ error: 'Invalid token' });
        }

        // 4. Check database for active staff user
        const [users] = await db.query(`
            SELECT u.user_id, u.user_type, s.staff_id, s.position, s.orphanage_id
            FROM users u
            LEFT JOIN staff s ON u.user_id = s.user_id
            WHERE u.user_id = ? AND u.is_active = 1
        `, [decoded.user_id]);

        if (users.length === 0 || !users[0].staff_id) {
            clearTimeout(timeout);
            console.warn('Unauthorized access attempt by user:', decoded.user_id);
            return res.status(403).json({ 
                error: 'Staff access required',
                message: 'Your account does not have staff privileges'
            });
        }

        const user = users[0];
        
        // 5. Attach user data to request
        req.user = {
            id: user.user_id,
            orphanage_id: user.orphanage_id,
            position: user.position,
            staff_id: user.staff_id
        };

        console.log(`Staff verification successful for user ${user.user_id} (${user.position})`);
        clearTimeout(timeout);
        next();
    } catch (err) {
        clearTimeout(timeout);
        console.error('Staff verification error:', {
            message: err.message,
            stack: err.stack,
            ...(err.sql && { sqlError: err.sqlMessage })
        });

        if (!res.headersSent) {
            if (err.code === 'ECONNREFUSED') {
                res.status(503).json({ error: 'Database unavailable' });
            } else {
                res.status(500).json({ 
                    error: 'Authentication failed',
                    ...(process.env.NODE_ENV === 'development' && { details: err.message })
                });
            }
        }
    }
};