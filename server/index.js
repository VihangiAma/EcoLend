const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const itemRoutes = require('./routes/itemRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes); // This creates the /api/ai/generate-description path
app.use('/api/items', itemRoutes);

// Test Route: Check if the server is healthy and connected to MySQL

app.get('/api/test', async (req, res) => {
  try {
    // Using .execute is generally safer/faster for MySQL2
    const [rows] = await db.execute('SELECT "Connected" as status, NOW() as serverTime'); 
    
    res.json({ 
      success: true,
      message: "EcoLend Backend is Live", 
      dbStatus: rows[0].status,
      time: rows[0].serverTime 
    });
  } catch (error) {
    console.error("❌ DB TEST FAILED:", error.message);
    res.status(500).json({ 
      success: false,
      error: "Database connection failed", 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 EcoLend Server running on http://localhost:${PORT}`);
});