const db = require('../config/db');

class Orphan {
    static async create(orphanData) {
        const [result] = await db.query(
            'INSERT INTO orphans SET ?', 
            orphanData
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.query('SELECT * FROM orphans');
        return rows;
    }

    static async findByOrphanage(orphanageId) {
        const [rows] = await db.query('SELECT * FROM orphans WHERE orphanage_id = ?', [orphanageId]);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM orphans WHERE orphan_id = ?', [id]);
        return rows[0];
    }

    static async update(id, updates) {
        const [result] = await db.query('UPDATE orphans SET ? WHERE orphan_id = ?', [updates, id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM orphans WHERE orphan_id = ?', [id]);
        return result.affectedRows;
    }

    static async setSponsoredStatus(id, isSponsored) {
        const [result] = await db.query(
            'UPDATE orphans SET is_sponsored = ? WHERE orphan_id = ?',
            [isSponsored, id]
        );
        return result.affectedRows;
    }

    static async setActiveStatus(id, isActive) {
        const [result] = await db.query(
            'UPDATE orphans SET is_active = ? WHERE orphan_id = ?',
            [isActive, id]
        );
        return result.affectedRows;
    }
}

module.exports = Orphan;