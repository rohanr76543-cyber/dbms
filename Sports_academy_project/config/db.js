const mysql = require('mysql2/promise');

// MySQL connection pool for the Sports Academy database.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Manipal@123',
  database: process.env.DB_NAME || 'sports_academy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
