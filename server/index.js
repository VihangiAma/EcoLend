const express = require('express');
const cors = require('cors');
const http = require('http'); // ✅ Added HTTP module wrapper
const { Server } = require('socket.io'); // ✅ Added Socket.io library instance
const db = require('./config/db');
require('dotenv').config();

const app = express();

// Create native HTTP server instance routing around Express
const server = http.createServer(app); 

// Initialize Socket.io and open access pipeline gates
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Address of your React Vite frontend pool
    methods: ["GET", "POST"]
  }
});

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const itemRoutes = require('./routes/itemRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Align cross-origin parameters explicitly
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes); 
app.use('/api/items', itemRoutes);
app.use('/api/messages', messageRoutes);
app.use('/uploads', express.static('uploads'));

// ========================================================
// 📡 1. REALTIME WEBSOCKET PIPELINE COMMUNICATIONS
// ========================================================
io.on("connection", (socket) => {
  console.log(`🔌 User established pipeline link node: ${socket.id}`);

  // Event: Active user focuses a chat dashboard window channel
  socket.on("join_room", ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`🏠 Socket bound room tracking channel: ${roomId} (User: ${userId})`);
  });

  // Event: Live chat frame message submission dispatched
  socket.on("send_message", (data) => {
    console.log(`📨 Message from ${data.sender_id} in room ${data.room_id}: ${data.text}`);
    // Broadcast data directly to the opposing channel listener
    socket.to(data.room_id).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User dropped communication socket link.");
  });
});

// ========================================================
// 2. EXPLICIT MESSAGE DATABASE PATHS / ENDPOINTS
// ========================================================
// 2. MESSAGE ENDPOINTS - Now handled by messageRoutes middleware
// ========================================================

// ========================================================
// 🔍 3. HEALTH CHECK & INFRASTRUCTURE SYSTEM MONITORING
// ========================================================
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT "Connected" as status, NOW() as serverTime'); 
    res.json({ 
      success: true,
      message: "EcoLend Backend Engine is Live", 
      dbStatus: rows[0].status,
      time: rows[0].serverTime 
    });
  } catch (error) {
    console.error("❌ DB TEST FAILED:", error.message);
    res.status(500).json({ 
      success: false,
      error: "Database link checking evaluation broke down.", 
      details: error.message 
    });
  }
});

// ========================================================
// 🚀 4. SYSTEM LIFTOFF DEPLOYMENT ENDPOINT CONTROL
// ========================================================
const PORT = process.env.PORT || 5000;

// CRITICAL: We bind the process to server.listen instead of app.listen 
// to keep both standard HTTP routes and open socket instances alive together.
server.listen(PORT, () => {
  console.log(`🚀 EcoLend Server engine running on http://localhost:${PORT}`);
});