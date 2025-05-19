const db = require('../config/db');

const UserModel = {
    async createUser(user) {
        const [result] = await db.execute(
            `INSERT INTO users (name, email, password, phone, address, user_type)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user.name, user.email, user.password, user.phone, user.address, user.user_type]
        );
        return result.insertId;
    },

    async findUserByEmail(email) {
        const [rows] = await db.execute(
            `SELECT user_id, name, email, password, phone, address, user_type
             FROM users WHERE email = ?`, 
            [email]
        );
        return rows[0];
    },

    async updateUser(userId, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), userId];
        await db.execute(`UPDATE users SET ${fields} WHERE user_id = ?`, values);
    },

    async getUserById(userId) {
        const [rows] = await db.execute(`SELECT * FROM users WHERE user_id = ?`, [userId]);
        return rows[0];
    },
  
    async getAllUsers() {
        const [rows] = await db.execute(`SELECT * FROM users`);
        return rows;
    },
    // In models/userModel.js add this method to UserModel
async deleteUser(userId) {
    await db.execute(`DELETE FROM users WHERE user_id = ?`, [userId]);
    return true;
}
};

module.exports = UserModel;
