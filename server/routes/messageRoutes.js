const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// 1. Get all conversations for the authenticated user
router.get('/conversations', verifyToken, async (req, res) => {
    try {
        const sql = `
            SELECT 
                c.conversation_id,
                m.message_text AS last_message,
                m.created_at AS last_message_time,
                u.user_id AS peer_id,
                u.full_name AS peer_name,
                u.profile_img_url AS peer_avatar
            FROM conversations c
            JOIN conversation_participants cp1 ON c.conversation_id = cp1.conversation_id AND cp1.user_id = ?
            JOIN conversation_participants cp2 ON c.conversation_id = cp2.conversation_id AND cp2.user_id != ?
            JOIN users u ON cp2.user_id = u.user_id
            LEFT JOIN messages m ON m.message_id = (
                SELECT message_id FROM messages 
                WHERE conversation_id = c.conversation_id 
                ORDER BY created_at DESC LIMIT 1
            )
            ORDER BY COALESCE(m.created_at, c.created_at) DESC
        `;
        const [conversations] = await db.execute(sql, [req.userId, req.userId]);
        res.json(conversations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch channels' });
    }
});

// 2. Get messages inside a single conversation channel
router.get('/:conversationId', verifyToken, async (req, res) => {
    try {
        const sql = `
            SELECT m.*, u.full_name AS sender_name 
            FROM messages m
            JOIN users u ON m.sender_id = u.user_id
            WHERE m.conversation_id = ?
            ORDER BY m.created_at ASC
        `;
        const [messages] = await db.execute(sql, [req.params.conversationId]);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch chat log' });
    }
});

// 3. Post a message to a channel
router.post('/send', verifyToken, async (req, res) => {
    const { conversationId, text } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO messages (conversation_id, sender_id, message_text) VALUES (?, ?, ?)',
            [conversationId, req.userId, text]
        );
        res.status(201).json({ success: true, messageId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to transmit message' });
    }
});

module.exports = router;