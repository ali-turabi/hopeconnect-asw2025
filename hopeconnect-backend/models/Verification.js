const db = require('../config/db');

class Verification {
    static async create({ orphanage_id, verified_by, verification_date, expiry_date, documents_urls, status, notes }) {
        const [result] = await db.execute(
            'INSERT INTO verifications (orphanage_id, verified_by, verification_date, expiry_date, documents_urls, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [orphanage_id, verified_by, verification_date, expiry_date, JSON.stringify(documents_urls), status, notes]
        );
        return result.insertId;
    }

    
    static async findByOrphanage(orphanageId) {
        const [rows] = await db.execute(
            'SELECT * FROM verifications WHERE orphanage_id = ? ORDER BY verification_date DESC',
            [orphanageId]
        );
        return rows.map(row => ({
            ...row,
            documents_urls: JSON.parse(row.documents_urls || '[]')
        }));
    }

    static async updateStatus(verificationId, status) {
        await db.execute(
            'UPDATE verifications SET status = ? WHERE verification_id = ?',
            [status, verificationId]
        );
    }
}

module.exports = Verification;