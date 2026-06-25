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

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Align cross-origin parameters explicitly
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes); 
app.use('/api/items', itemRoutes);
app.use('/uploads', express.static('uploads'));

// ========================================================
// 📡 1. REALTIME WEBSOCKET PIPELINE COMMUNICATIONS
// ========================================================
io.on("connection", (socket) => {
  console.log(`🔌 User established pipeline link node: ${socket.id}`);

  // Event: Active user focuses a chat dashboard window channel
  socket.on("join_room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`🏠 Socket bound room tracking channel: ${roomId}`);
  });

  // Event: Live chat frame message submission dispatched
  socket.on("send_message", (data) => {
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

// Endpoint A: Fetch active conversation list previews for the inbox sidebar pane
app.get('/api/messages/conversations', async (req, res) => {
  // Simulating active session user context tracking link. 
  // (Replace with your auth token middleware profile id when available)
  const loggedInUserId = 1; 

  const query = `
  SELECT c.conversation_id, 
         u.full_name AS peer_name, -- 🔑 Fixed: changed u.name to u.full_name
         m.text AS last_message, 
         m.timestamp AS last_message_time
  FROM conversations c
  
  JOIN users u ON (c.user_one_id = u.user_id OR c.user_two_id = u.user_id) AND u.user_id != ?
  LEFT JOIN messages m ON m.id = (
      SELECT id FROM messages 
      WHERE conversation_id = c.conversation_id 
      ORDER BY timestamp DESC LIMIT 1
  )
  WHERE c.user_one_id = ? OR c.user_two_id = ?
  ORDER BY c.updated_at DESC;
`;

  try {
    const [rows] = await db.execute(query, [loggedInUserId, loggedInUserId, loggedInUserId]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Failed to pull conversations overview index:", err);
    res.status(500).json({ error: "Failed to gather chat channels database items." });
  }
});

// Endpoint B: Pull historical chat stream logs when a focused window initializes
app.get('/api/messages/:conversationId', async (req, res) => {
  const { conversationId } = req.params;
  const query = `
    SELECT id AS message_id, sender_id, text AS message_text, timestamp AS created_at 
    FROM messages 
    WHERE conversation_id = ? 
    ORDER BY timestamp ASC
  `;

  try {
    const [rows] = await db.execute(query, [conversationId]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Failed to pull full room dataset timeline parameters:", err);
    res.status(500).json({ error: "Failed to process chat logs request." });
  }
});

// Endpoint C: Persist individual messages into the database background log ledger
app.post('/api/messages/send', async (req, res) => {
  const { conversationId, text } = req.body;
  const senderId = 1; // Align context parameters matching active identity

  const insertMessageQuery = `
    INSERT INTO messages (conversation_id, sender_id, text) 
    VALUES (?, ?, ?)
  `;

  const updateConversationTimeQuery = `
    UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE conversation_id = ?
  `;

  try {
    await db.execute(insertMessageQuery, [conversationId, senderId, text]);
    await db.execute(updateConversationTimeQuery, [conversationId]);
    res.json({ success: true, message: "Transaction logging entry saved successfully." });
  } catch (err) {
    console.error("❌ Failed backend message logging synchronization:", err);
    res.status(500).json({ error: "Failed database serialization execution node." });
  }
});

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