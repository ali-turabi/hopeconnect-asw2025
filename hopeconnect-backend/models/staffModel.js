const db = require('../config/db');

const StaffModel = {
    async createStaff(data) {
        const [result] = await db.execute(
            `INSERT INTO staff (user_id, position, salary, hire_date)
             VALUES (?, ?, ?, ?)`,
            [data.user_id, data.position, data.salary, data.hire_date]
        );
        return result.insertId;
    }
};

module.exports = StaffModel;
