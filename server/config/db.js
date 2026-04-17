const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

const promisePool = pool.promise();

// --- ADD THIS TEST BLOCK ---
promisePool.getConnection()
  .then(connection => {
    console.log('✅ MySQL Database Connected! (ID: ' + connection.threadId + ')');
    connection.release(); // Important: Always release the connection back to the pool
  })
  .catch(err => {
    console.error('❌ Database Connection Failed!');
    console.error('Reason:', err.message);
  });
// Using promises allows us to use async/await later
module.exports = pool.promise();