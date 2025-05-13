// models/staffModel.js
const db = require('../config/db');

const StaffModel = {
    async createStaff(userData, staffData) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();
    
            // 1. Create user with all available fields
            const [userResult] = await connection.execute(
                `INSERT INTO users 
                (name, email, password, phone, address, user_type) 
                VALUES (?, ?, ?, ?, ?, 'staff')`,
                [
                    userData.name,
                    userData.email,
                    userData.password,
                    userData.phone || null,  // Make optional
                    userData.address || null, // Make optional
                ]
            );
            
            const userId = userResult.insertId;
    
            // 2. Create staff record
            const [staffResult] = await connection.execute(
                `INSERT INTO staff 
                (user_id, position, salary, hire_date) 
                VALUES (?, ?, ?, ?)`,
                [
                    userId,
                    staffData.position,
                    staffData.salary,
                    staffData.hire_date || new Date().toISOString().split('T')[0] // Default to today
                ]
            );
    
            await connection.commit();
            return {
                user_id: userId,
                staff_id: staffResult.insertId,
                ...userData,
                ...staffData
            };
        } catch (err) {
            if (connection) await connection.rollback();
            throw err;
        } finally {
            if (connection) connection.release();
        }
    },

    async getStaffById(staffId) {
        const [rows] = await db.execute(
            `SELECT s.*, u.name, u.email, u.phone, u.address, u.is_active as user_active
             FROM staff s
             JOIN users u ON s.user_id = u.user_id
             WHERE s.staff_id = ?`, 
            [staffId]
        );
        return rows[0];
    },

   // In StaffModel.js
  // models/staffModel.js
async getAllStaff() {
    try {
        const [rows] = await db.execute(
            `SELECT 
                s.staff_id,
                s.user_id,
                s.position,
                s.salary,
                s.hire_date,
                u.name,
                u.email,
                u.phone,
                u.address,
                u.user_type,
                u.is_active as user_active
             FROM staff s
             JOIN users u ON s.user_id = u.user_id`
        );
        
        return rows || [];
    } catch (err) {
        console.error('Database error:', {
            error: err,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage,
            sql: err.sql
        });
        throw new Error('Failed to fetch staff data: ' + err.message);
    }
},

   // In StaffModel.js
   async updateStaff(staffId, userData, staffData) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Get user_id first
        const [staff] = await connection.execute(
            `SELECT user_id FROM staff WHERE staff_id = ?`, 
            [staffId]
        );
        if (!staff.length) throw new Error('Staff not found');

        // 2. Filter out undefined values and build update queries
        const filteredUserData = Object.fromEntries(
            Object.entries(userData).filter(([_, v]) => v !== undefined)
        );
        const filteredStaffData = Object.fromEntries(
            Object.entries(staffData).filter(([_, v]) => v !== undefined)
        );

        // 3. Update user table if there's data to update
        if (Object.keys(filteredUserData).length > 0) {
            const userSet = Object.keys(filteredUserData).map(k => `${k} = ?`).join(', ');
            await connection.execute(
                `UPDATE users SET ${userSet} WHERE user_id = ?`,
                [...Object.values(filteredUserData), staff[0].user_id]
            );
        }

        // 4. Update staff table if there's data to update
        if (Object.keys(filteredStaffData).length > 0) {
            const staffSet = Object.keys(filteredStaffData).map(k => `${k} = ?`).join(', ');
            await connection.execute(
                `UPDATE staff SET ${staffSet} WHERE staff_id = ?`,
                [...Object.values(filteredStaffData), staffId]
            );
        }

        await connection.commit();
        return true;
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
},

    async deleteStaff(staffId) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Delete staff (user will be deleted automatically due to ON DELETE CASCADE)
            const [result] = await connection.execute(
                `DELETE FROM staff WHERE staff_id = ?`,
                [staffId]
            );
            
            if (result.affectedRows === 0) {
                throw new Error('Staff not found');
            }

            await connection.commit();
            return true;
        } catch (err) {
            if (connection) await connection.rollback();
            throw err;
        } finally {
            if (connection) connection.release();
        }
    }
};

module.exports = StaffModel;