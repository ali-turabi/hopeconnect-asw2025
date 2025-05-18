const db = require('../config/db');

class Volunteer {
    static async create({ userId, availability, backgroundCheckStatus = 'pending' }) {
        const [result] = await db.execute(
            'INSERT INTO volunteers (user_id, availability, background_check_status) VALUES (?, ?, ?)',
            [userId, availability, backgroundCheckStatus]
        );
        return result.insertId;
    }

    static async findById(volunteerId) {
        const [rows] = await db.execute(
            'SELECT * FROM volunteers WHERE volunteer_id = ?',
            [volunteerId]
        );
        return rows[0];
    }

    static async findByUserId(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM volunteers WHERE user_id = ?',
            [userId]
        );
        return rows[0];
    }

    static async update(volunteerId, { availability, backgroundCheckStatus }) {
        await db.execute(
            'UPDATE volunteers SET availability = ?, background_check_status = ? WHERE volunteer_id = ?',
            [availability, backgroundCheckStatus, volunteerId]
        );
    }

    
    static async addSkill(volunteerId, skillId, proficiencyLevel) {
        await db.execute(
            'INSERT INTO volunteer_skills (volunteer_id, skill_id, proficiency_level) VALUES (?, ?, ?)',
            [volunteerId, skillId, proficiencyLevel]
        );
    }

    static async getSkills(volunteerId) {
        const [rows] = await db.execute(
            `SELECT s.skill_id, s.name, s.description, vs.proficiency_level 
             FROM volunteer_skills vs
             JOIN skills s ON vs.skill_id = s.skill_id
             WHERE vs.volunteer_id = ?`,
            [volunteerId]
        );
        return rows;
    }
}

module.exports = Volunteer;