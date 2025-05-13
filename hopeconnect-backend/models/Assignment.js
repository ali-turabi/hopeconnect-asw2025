const db = require('../config/db');

class Assignment {
    static async create({ requestId, volunteerId }) {
        const [result] = await db.execute(
            'INSERT INTO assignments (request_id, volunteer_id) VALUES (?, ?)',
            [requestId, volunteerId]
        );
        
        // Update request status to 'assigned'
        await db.execute(
            'UPDATE service_requests SET status = "assigned" WHERE request_id = ?',
            [requestId]
        );
        
        return result.insertId;
    }

    static async complete(assignmentId, feedback, rating) {
        await db.execute(
            'UPDATE assignments SET completion_status = "completed", feedback = ?, rating = ? WHERE assignment_id = ?',
            [feedback, rating, assignmentId]
        );
        
        // Get request ID to update its status
        const [rows] = await db.execute(
            'SELECT request_id FROM assignments WHERE assignment_id = ?',
            [assignmentId]
        );
        
        if (rows.length > 0) {
            await db.execute(
                'UPDATE service_requests SET status = "completed" WHERE request_id = ?',
                [rows[0].request_id]
            );
        }
    }

    static async findByVolunteer(volunteerId) {
        const [rows] = await db.execute(
            'SELECT * FROM assignments WHERE volunteer_id = ?',
            [volunteerId]
        );
        return rows;
    }
}

module.exports = Assignment;