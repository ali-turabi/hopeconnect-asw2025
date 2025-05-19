const db = require('../config/db');

class Request {
    static async create({ orphanageId, title, description, requiredSkillId, startDate, endDate }) {
        const [result] = await db.execute(
            'INSERT INTO service_requests (orphanage_id, title, description, required_skill_id, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
            [orphanageId, title, description, requiredSkillId, startDate, endDate]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(
            'SELECT * FROM service_requests WHERE status = "open"'
        );
        return rows;
    }

    static async findById(requestId) {
        const [rows] = await db.execute(
            'SELECT * FROM service_requests WHERE request_id = ?',
            [requestId]
        );
        return rows[0];
    }

    static async updateStatus(requestId, status) {
        await db.execute(
            'UPDATE service_requests SET status = ? WHERE request_id = ?',
            [status, requestId]
        );
    }
}

module.exports = Request;
