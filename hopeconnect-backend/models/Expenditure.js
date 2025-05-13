const db = require('../config/db');

class Expenditure {
    static async create({ orphanage_id, donation_id, amount, category, description, receipt_url, date_spent, verified_by }) {
        const [result] = await db.execute(
            'INSERT INTO expenditures (orphanage_id, donation_id, amount, category, description, receipt_url, date_spent, verified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [orphanage_id, donation_id, amount, category, description, receipt_url, date_spent, verified_by]
        );
        return result.insertId;
    }

    static async findByOrphanage(orphanageId) {
        const [rows] = await db.execute(
            'SELECT * FROM expenditures WHERE orphanage_id = ? ORDER BY date_spent DESC',
            [orphanageId]
        );
        return rows;
    }

    static async findByDonation(donationId) {
        const [rows] = await db.execute(
            'SELECT * FROM expenditures WHERE donation_id = ? ORDER BY date_spent DESC',
            [donationId]
        );
        return rows;
    }
}

module.exports = Expenditure;