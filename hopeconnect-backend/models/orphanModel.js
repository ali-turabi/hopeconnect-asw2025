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
exports.getOrphanById = async (orphanId, orphanageId = null) => {
    console.log(`🔍 Searching for orphan ID: ${orphanId} ${orphanageId ? `in orphanage ${orphanageId}` : ''}`);
    
    let query = 'SELECT * FROM orphans WHERE orphan_id = ? AND is_active = 1';
    const params = [orphanId];
    
    if (orphanageId !== null) {
        query += ' AND orphanage_id = ?';
        params.push(orphanageId);
    }
    
    console.log('Executing query:', query, params);
    const [orphans] = await db.query(query, params);
    
    console.log(`Found ${orphans.length} matching orphans`);
    return orphans[0] || null;
};
// Toggle active status
exports.toggleOrphanStatus = async (orphanId, isActive) => {
    const [result] = await db.query(
        'UPDATE orphans SET is_active = ? WHERE orphan_id = ?',
        [isActive, orphanId]
    );
    return result.affectedRows;
};

// Delete orphan (admin only)
exports.deleteOrphan = async (orphanId) => {
    const [result] = await db.query(
        'DELETE FROM orphans WHERE orphan_id = ?',
        [orphanId]
    );
    return result.affectedRows;
};
exports.updateOrphanAdmin = async (orphanId, updateData) => {
    const [result] = await db.query(
        'UPDATE orphans SET ? WHERE orphan_id = ?',
        [updateData, orphanId]
    );
    return {
        affectedRows: result.affectedRows,
        changedFields: Object.keys(updateData)
    };
};
// Add this new method to your model
exports.getNonSponsoredOrphans = async (orphanageId = null) => {
    let query = 'SELECT * FROM orphans WHERE is_sponsored = 0 AND is_active = 1';
    const params = [];
    
    if (orphanageId) {
        query += ' AND orphanage_id = ?';
        params.push(orphanageId);
    }
    
    const [orphans] = await db.query(query, params);
    return orphans;
};