const db = require('../config/db');

async function findMatchingVolunteers(requestId) {
    // Get the request details including required skill
    const [requests] = await db.execute(
        `SELECT required_skill_id FROM service_requests WHERE request_id = ?`,
        [requestId]
    );
    
    if (requests.length === 0) return [];
    
    const requiredSkillId = requests[0].required_skill_id;
    
    
    // Find volunteers with matching skills
    const [volunteers] = await db.execute(
        `SELECT v.volunteer_id, u.name, u.email, vs.proficiency_level 
         FROM volunteers v
         JOIN users u ON v.user_id = u.user_id
         JOIN volunteer_skills vs ON v.volunteer_id = vs.volunteer_id
         WHERE vs.skill_id = ? AND v.background_check_status = 'approved'
         ORDER BY vs.proficiency_level DESC`,
        [requiredSkillId]
    );
    
    return volunteers;
}

module.exports = { findMatchingVolunteers };