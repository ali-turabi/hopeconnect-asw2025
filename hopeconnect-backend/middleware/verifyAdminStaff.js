// verifyAdminStaff.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = async (req, res, next) => {
    // Set timeout handler (10 seconds)
    const timeout = setTimeout(() => {
        if (!res.headersSent) {
            console.error('🕒 Middleware timeout - no response sent');
            res.status(504).json({ error: 'Request timeout' });
        }
    }, 10000);

    try {
        console.log('🔵 [Middleware] Starting verification');
        
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            clearTimeout(timeout);
            return res.status(401).json({ error: 'Authorization token missing' });
        }

        console.log('🟢 [Middleware] Token found, verifying...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🟢 [Middleware] Token decoded:', { userId: decoded.user_id });

        const [users] = await db.query(`
            SELECT u.user_id, u.user_type, s.staff_id, s.position, s.orphanage_id
            FROM users u
            LEFT JOIN staff s ON u.user_id = s.user_id
            WHERE u.user_id = ?
        `, [decoded.user_id]);

        console.log('🟢 [Middleware] DB query complete, results:', users.length);

        if (users.length === 0) {
            clearTimeout(timeout);
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];
        console.log('🟢 [Middleware] User found:', {
            userId: user.user_id,
            staffId: user.staff_id,
            position: user.position
        });

        if (!user.staff_id || user.position !== 'admin') {
            clearTimeout(timeout);
            return res.status(403).json({ error: 'Admin access required' });
        }

        req.user = {
            id: user.user_id,
            orphanage_id: user.orphanage_id
        };

        console.log('✅ [Middleware] Verification successful');
        clearTimeout(timeout);
        next();
    } catch (err) {
        console.error('🔴 [Middleware] Error:', err);
        clearTimeout(timeout);
        
        if (!res.headersSent) {
            if (err.name === 'JsonWebTokenError') {
                res.status(401).json({ error: 'Invalid token' });
            } else if (err.name === 'TokenExpiredError') {
                res.status(401).json({ error: 'Token expired' });
            } else {
                res.status(500).json({ error: 'Authentication failed' });
            }
        }
    }
};