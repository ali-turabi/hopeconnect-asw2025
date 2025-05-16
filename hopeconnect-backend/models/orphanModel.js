const db = require('../config/db');

// Add a new orphan to the database
exports.insertOrphan = async (orphanData) => {
    const [result] = await db.query(`INSERT INTO orphans SET ?`, [orphanData]);
    return result.insertId;
};
// Get all orphans (with optional orphanage_id filter for staff)
exports.getAllOrphans = async (orphanageId = null) => {
    let query = 'SELECT * FROM orphans WHERE is_active = 1';
    const params = [];
    
    if (orphanageId) {
        query += ' AND orphanage_id = ?';
        params.push(orphanageId);
    }
    
    const [orphans] = await db.query(query, params);
    return orphans;
};