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

            // 2. Create staff record with orphanage_id
            const [staffResult] = await connection.execute(
                `INSERT INTO staff 
                (user_id, position, salary, hire_date, orphanage_id) 
                VALUES (?, ?, ?, ?, ?)`,
                [
                    userId,
                    staffData.position,
                    staffData.salary,
                    staffData.hire_date || new Date().toISOString().split('T')[0], // Default to today
                    staffData.orphanage_id || null  // Include orphanage_id
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
            `SELECT s.*, u.name, u.email, u.phone, u.address, u.is_active as user_active, s.orphanage_id
             FROM staff s
             JOIN users u ON s.user_id = u.user_id
             WHERE s.staff_id = ?`, 
            [staffId]
        );
        return rows[0];
    },

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
                    u.is_active as user_active,
                    s.orphanage_id
                FROM staff s
                JOIN users u ON s.user_id = u.user_id`
            );

            return rows || [];
        } catch (err) {
            console.error('Database error:', err);
            throw new Error('Failed to fetch staff data: ' + err.message);
        }
    },

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

            // 3. Update user and staff records
            if (Object.keys(filteredUserData).length > 0) {
                await connection.execute(
                    `UPDATE users SET 
                    name = ?, email = ?, phone = ?, address = ?
                    WHERE user_id = ?`,
                    [
                        filteredUserData.name,
                        filteredUserData.email,
                        filteredUserData.phone,
                        filteredUserData.address,
                        staff[0].user_id
                    ]
                );
            }

            if (Object.keys(filteredStaffData).length > 0) {
                await connection.execute(
                    `UPDATE staff SET 
                    position = ?, salary = ?, hire_date = ?, orphanage_id = ?
                    WHERE staff_id = ?`,
                    [
                        filteredStaffData.position,
                        filteredStaffData.salary,
                        filteredStaffData.hire_date || new Date().toISOString().split('T')[0],
                        filteredStaffData.orphanage_id || null,
                        staffId
                    ]
                );
            }

            await connection.commit();
            return this.getStaffById(staffId);  // Return the updated staff record
        } catch (err) {
            if (connection) await connection.rollback();
            throw err;
        } finally {
            if (connection) connection.release();
        }
    },

    async deleteStaff(staffId) {
        const [staff] = await db.execute(
            `SELECT user_id FROM staff WHERE staff_id = ?`, 
            [staffId]
        );
        if (!staff.length) throw new Error('Staff not found');

        // Delete staff and user records
        await db.execute(`DELETE FROM staff WHERE staff_id = ?`, [staffId]);
        await db.execute(`DELETE FROM users WHERE user_id = ?`, [staff[0].user_id]);
    }
};

module.exports = StaffModel;
