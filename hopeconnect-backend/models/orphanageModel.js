const db = require('../config/db');

class Orphanage {
    static async create(orphanageData) {
        const [result] = await db.query(
            'INSERT INTO orphanages SET ?', 
            orphanageData
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.query('SELECT * FROM orphanages');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM orphanages WHERE orphanage_id = ?', [id]);
        return rows[0];
    }

    static async update(id, updates) {
        const [result] = await db.query('UPDATE orphanages SET ? WHERE orphanage_id = ?', [updates, id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM orphanages WHERE orphanage_id = ?', [id]);
        return result.affectedRows;
    }

    static async approve(id) {
        const [result] = await db.query(
            'UPDATE orphanages SET is_approved = TRUE, approved_by = 1, approval_date = CURRENT_TIMESTAMP WHERE orphanage_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = Orphanage;