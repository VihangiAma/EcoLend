const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route: Check if the server is healthy and connected to MySQL
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT "Database Connected!" as status');
    res.json({ message: "EcoLend Server is running", dbStatus: rows[0].status });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 EcoLend Server running on http://localhost:${PORT}`);
});