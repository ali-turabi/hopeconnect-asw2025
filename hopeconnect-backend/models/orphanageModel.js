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
    static async updateBudget(id, amount, operation = 'add') {
    try {
        let query;
        if (operation === 'add') {
            query = 'UPDATE orphanages SET current_budget = current_budget + ? WHERE orphanage_id = ?';
        } else if (operation === 'subtract') {
            query = 'UPDATE orphanages SET current_budget = GREATEST(current_budget - ?, 0) WHERE orphanage_id = ?';
        } else {
            throw new Error('Invalid operation');
        }

        const [result] = await db.query(query, [amount, id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Database error in updateBudget:', error);
        throw error;
    }
}
}

module.exports = Orphanage;