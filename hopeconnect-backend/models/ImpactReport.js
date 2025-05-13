const db = require('../config/db');

class ImpactReport {
    static async create({ orphanage_id, title, content, photos_urls, period_start, period_end }) {
        const [result] = await db.execute(
            'INSERT INTO impact_reports (orphanage_id, title, content, photos_urls, period_start, period_end) VALUES (?, ?, ?, ?, ?, ?)',
            [orphanage_id, title, content, JSON.stringify(photos_urls), period_start, period_end]
        );
        return result.insertId;
    }

    static async findByOrphanage(orphanageId) {
        const [rows] = await db.execute(
            'SELECT * FROM impact_reports WHERE orphanage_id = ? ORDER BY created_at DESC',
            [orphanageId]
        );
        return rows.map(row => ({
            ...row,
            photos_urls: JSON.parse(row.photos_urls || '[]')
        }));
    }
}

module.exports = ImpactReport;