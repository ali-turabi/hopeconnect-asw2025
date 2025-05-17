import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Abd123321',
  database: 'dbAdvSoftProj',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
