// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // Add this line

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root', // default MySQL username
    password: process.env.DB_PASSWORD || '', // default MySQL password
    database: process.env.DB_NAME || 'your_database_name',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
async function testConnection() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('✅ Successfully connected to the database');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    } finally {
        if (connection) connection.release();
    }
}

testConnection();

module.exports = pool;